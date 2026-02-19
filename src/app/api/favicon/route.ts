import { NextResponse } from "next/server";
import { getPageImage } from "@/lib/db";

export const revalidate = 3600;

export async function GET(request: Request) {
  const faviconUrl = await getPageImage("site-favicon");

  if (faviconUrl) {
    try {
      const response = await fetch(faviconUrl, { cache: "no-store" });
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const contentType =
          response.headers.get("content-type") || "image/png";
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control":
              "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      }
    } catch {
      // Fall through to static favicon
    }
  }

  return NextResponse.redirect(new URL("/favicon.ico", request.url), 307);
}
