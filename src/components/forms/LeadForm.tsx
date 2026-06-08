"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { leadFormSchema, type LeadFormData } from "@/lib/forms/schema";
import { submitLead } from "@/lib/forms/submitLead";
import type { Role } from "@/types/role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LeadFormProps = {
  role: Role;
};

export function LeadForm({ role }: LeadFormProps) {
  const t = useTranslations("form");
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      role,
      ageConsent: undefined,
      privacyConsent: undefined,
    },
  });

  const ageConsent = watch("ageConsent");
  const privacyConsent = watch("privacyConsent");

  const onSubmit = async (data: LeadFormData) => {
    setSubmitting(true);
    try {
      const result = await submitLead({ ...data, role });
      if (result.success) {
        setSuccessOpen(true);
        reset({ role, ageConsent: undefined, privacyConsent: undefined });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <input type="hidden" {...register("role")} value={role} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input id="firstName" {...register("firstName")} aria-invalid={!!errors.firstName} />
            {errors.firstName && (
              <p className="text-sm text-destructive">{t("validation.firstName")}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input id="lastName" {...register("lastName")} aria-invalid={!!errors.lastName} />
            {errors.lastName && (
              <p className="text-sm text-destructive">{t("validation.lastName")}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" type="tel" dir="ltr" {...register("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && (
            <p className="text-sm text-destructive">{t("validation.phone")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t("city")}</Label>
          <Input id="city" {...register("city")} aria-invalid={!!errors.city} />
          {errors.city && (
            <p className="text-sm text-destructive">{t("validation.city")}</p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="ageConsent"
            checked={ageConsent === true}
            onCheckedChange={(checked) =>
              setValue("ageConsent", checked === true ? true : (undefined as unknown as true), {
                shouldValidate: true,
              })
            }
          />
          <Label htmlFor="ageConsent" className="leading-relaxed font-normal">
            {t("ageConsent")}
          </Label>
        </div>
        {errors.ageConsent && (
          <p className="text-sm text-destructive">{t("validation.ageConsent")}</p>
        )}

        <div className="flex items-start gap-3">
          <Checkbox
            id="privacyConsent"
            checked={privacyConsent === true}
            onCheckedChange={(checked) =>
              setValue("privacyConsent", checked === true ? true : (undefined as unknown as true), {
                shouldValidate: true,
              })
            }
          />
          <Label htmlFor="privacyConsent" className="leading-relaxed font-normal">
            {t("privacyConsent")}
          </Label>
        </div>
        {errors.privacyConsent && (
          <p className="text-sm text-destructive">{t("validation.privacyConsent")}</p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-full bg-brand-primary py-6 text-base font-bold text-white transition-colors duration-200 hover:bg-brand-text"
        >
          {submitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="border-brand-border bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-brand-primary">{t("successTitle")}</DialogTitle>
            <DialogDescription>{t("successMessage")}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setSuccessOpen(false)} className="rounded-full">
            {t("close")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
