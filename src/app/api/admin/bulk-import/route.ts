import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import { parseProductCSV } from "@/lib/bulk-upload/csv-parser";
import { extractImagesFromZip } from "@/lib/bulk-upload/zip-handler";
import { validateProductRows } from "@/lib/bulk-upload/validator";
import { importProducts } from "@/lib/bulk-upload/importer";
import type { ImportOptions } from "@/lib/bulk-upload/types";

export async function POST(request: Request) {
  // Auth check — proxy does not cover /api routes
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse FormData
  const formData = await request.formData();
  const csvFile = formData.get("csv") as File | null;
  const zipFile = formData.get("zip") as File | null;
  const optionsJson = formData.get("options") as string | null;

  if (!csvFile) {
    return Response.json({ error: "CSV file is required" }, { status: 400 });
  }

  let options: ImportOptions;
  try {
    options = optionsJson
      ? JSON.parse(optionsJson)
      : { overwriteExisting: false, skipErrors: true };
  } catch {
    return Response.json({ error: "Invalid options" }, { status: 400 });
  }

  // Parse CSV
  let csvText: string;
  try {
    csvText = await csvFile.text();
  } catch {
    return Response.json(
      { error: "Failed to read CSV file" },
      { status: 400 }
    );
  }

  const parsedRows = parseProductCSV(csvText);
  if (parsedRows.length === 0) {
    return Response.json(
      { error: "CSV is empty or invalid" },
      { status: 400 }
    );
  }

  // Extract images from ZIP and validate
  const imageMap = zipFile ? await extractImagesFromZip(zipFile) : {};
  const validated = await validateProductRows(parsedRows, imageMap);

  // Stream import events
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of importProducts(validated, options)) {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        }

        // Revalidate after all imports complete
        revalidatePath("/admin/products");
        revalidatePath("/", "layout");

        controller.close();
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Import failed";
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ type: "error", slug: "", error: msg }) + "\n"
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
