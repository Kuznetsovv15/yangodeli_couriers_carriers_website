import type { LeadFormData } from "./schema";

export async function submitLead(data: LeadFormData) {
  console.log(data);
  return { success: true as const };
}
