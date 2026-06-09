"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BAG_3D } from "@/lib/brand-assets";
import type { Role } from "@/types/role";

type ApplyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
};

export function ApplyModal({ open, onOpenChange, role }: ApplyModalProps) {
  const t = useTranslations("roles");
  const roleData = t.raw(role) as {
    cta: { title: string; subtitle?: string };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[90vh] max-w-lg overflow-y-auto rounded-3xl border-brand-border p-0 sm:max-w-lg"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-accent via-brand-accent to-brand-accent-dark px-6 py-8 text-brand-primary">
          <div className="pointer-events-none absolute -end-6 -top-4 opacity-90">
            <Image src={BAG_3D} alt="" width={120} height={120} className="drop-shadow-volumetric" />
          </div>
          <DialogHeader className="relative text-start">
            <DialogTitle className="font-heading text-2xl font-black">
              {roleData.cta.title}
            </DialogTitle>
            {roleData.cta.subtitle && (
              <DialogDescription className="text-brand-primary/80">
                {roleData.cta.subtitle}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>
        <div className="bg-white p-6 md:p-8">
          <LeadForm role={role} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
