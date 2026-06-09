import type { LeadFormData } from "@/lib/forms/schema";

export type SubmitLeadResult =
  | { success: true }
  | { success: false; error: string };

export async function submitLead(
  data: LeadFormData,
  locale?: string
): Promise<SubmitLeadResult> {
  const response = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, locale }),
  });

  if (!response.ok) {
    return { success: false, error: "submit_failed" };
  }

  return { success: true };
}
