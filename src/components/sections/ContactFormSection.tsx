"use client";

import { LeadForm } from "@/components/forms/LeadForm";
import type { Role } from "@/types/role";

type ContactFormSectionProps = {
  title: string;
  subtitle?: string;
  role: Role;
};

export function ContactFormSection({ title, subtitle, role }: ContactFormSectionProps) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 md:px-8">
      <h2 className="text-center font-heading text-section font-black text-brand-text">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-md text-center font-sans text-body-fluid leading-relaxed text-brand-muted">
          {subtitle}
        </p>
      )}
      <div className="card-3d volumetric-card mt-8 rounded-2xl border border-brand-border/40 bg-brand-surface/90 p-5 backdrop-blur-md sm:rounded-3xl sm:p-8 md:p-10">
        <LeadForm role={role} />
      </div>
    </div>
  );
}
