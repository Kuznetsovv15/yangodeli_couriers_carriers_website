"use client";

import Image from "next/image";
import { LeadForm } from "@/components/forms/LeadForm";
import { TextReveal } from "@/components/motion/TextReveal";
import { BrandLogo } from "@/components/brand/BrandLogo";
import type { Role } from "@/types/role";

type JourneyCtaProps = {
  title: string;
  subtitle?: string;
  role: Role;
};

export function JourneyCta({ title, subtitle, role }: JourneyCtaProps) {
  return (
    <section className="relative flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-14 md:px-8 md:py-20">
      <div className="absolute inset-0 bg-[var(--theme-cta-bg)]" />

      <div className="relative mx-auto w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <BrandLogo variant="wordmark" theme="dark" size="md" />
        </div>
        <TextReveal when="mount">
          <h2 className="font-heading text-section font-black text-brand-text">{title}</h2>
        </TextReveal>
        {subtitle && (
          <TextReveal when="mount" delay={0.08}>
            <p className="mx-auto mt-3 max-w-md font-sans text-body-fluid leading-relaxed text-brand-muted">
              {subtitle}
            </p>
          </TextReveal>
        )}
        <TextReveal when="mount" delay={0.15} className="mt-8">
          <div className="card-3d volumetric-card rounded-2xl border border-brand-border/40 bg-brand-surface/90 p-5 text-start backdrop-blur-md sm:rounded-3xl sm:p-8 md:p-10">
            <LeadForm role={role} />
          </div>
        </TextReveal>
      </div>

      <Image
        src="/images/brand/bag-3d.png"
        alt=""
        width={120}
        height={120}
        className="pointer-events-none absolute -bottom-4 end-4 hidden h-24 w-24 object-contain opacity-40 sm:block md:end-12 md:h-32 md:w-32"
        aria-hidden
      />
    </section>
  );
}
