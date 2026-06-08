import { z } from "zod";
import { ROLES } from "@/types/role";

export const leadFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(9),
  city: z.string().min(1),
  ageConsent: z.literal(true),
  privacyConsent: z.literal(true),
  role: z.enum(ROLES),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
