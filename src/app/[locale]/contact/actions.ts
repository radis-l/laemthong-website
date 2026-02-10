"use server";

import { z } from "zod";
import { saveContactInquiry } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  phone: z.string().optional(),
  productInterest: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot check — bots fill this hidden field, humans don't
  const honeypot = formData.get("website");
  if (honeypot) {
    return { success: true };
  }

  const validated = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    productInterest: formData.get("productInterest"),
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await saveContactInquiry({
      name: validated.data.name,
      email: validated.data.email,
      company: validated.data.company,
      phone: validated.data.phone || undefined,
      product_interest: validated.data.productInterest || undefined,
      message: validated.data.message,
    });
  } catch {
    return { message: "Failed to save inquiry. Please try again." };
  }

  return { success: true };
}
