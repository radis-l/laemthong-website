import { createSupabaseClient } from "@/lib/supabase";

interface ContactInquiry {
  name: string;
  email: string;
  company: string;
  phone?: string;
  product_interest?: string;
  message: string;
}

export async function saveContactInquiry(inquiry: ContactInquiry): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("contact_inquiries")
    .insert(inquiry);
  if (error) throw error;
}
