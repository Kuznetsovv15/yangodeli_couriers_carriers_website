"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { TextReveal } from "@/components/motion/TextReveal";
import { LeadForm } from "@/components/forms/LeadForm";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";
import type { Role } from "@/types/role";

type ContactFormSectionProps = {
  title: string;
  role: Role;
};

export function ContactFormSection({ title, role }: ContactFormSectionProps) {
  const formRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !formRef.current) return;
      gsap.from(formRef.current, {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: formRef }
  );

  return (
    <section className="flex min-h-0 items-center px-4 py-12 sm:min-h-[70vh] sm:py-16 md:px-8 md:min-h-[80vh] md:py-28">
      <div className="mx-auto w-full max-w-lg">
        <TextReveal className="mb-10 text-center">
          <h2 className="font-heading text-section font-black text-brand-text">{title}</h2>
        </TextReveal>
        <div ref={formRef} className="volumetric-card rounded-2xl bg-white p-5 sm:rounded-3xl sm:p-8 md:p-10">
          <LeadForm role={role} />
        </div>
      </div>
    </section>
  );
}
