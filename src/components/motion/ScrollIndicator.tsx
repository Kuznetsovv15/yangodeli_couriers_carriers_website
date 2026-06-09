"use client";

import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

export function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("landing");

  useGSAP(() => {
    if (prefersReducedMotion() || !ref.current) return;

    gsap.to(ref.current, {
      y: 10,
      opacity: 0.45,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    gsap.to(ref.current, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 95%",
        end: "top 75%",
        scrub: true,
      },
    });
  });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-brand-text/40 sm:bottom-6"
      aria-hidden
    >
      <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em]">
        {t("scrollHint")}
      </span>
      <ChevronDown className="h-5 w-5" />
      <span className="sr-only">{t("scrollHint")}</span>
    </div>
  );
}
