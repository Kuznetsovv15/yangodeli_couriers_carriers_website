"use client";

import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function PromoBar() {
  const t = useTranslations("common");
  const reducedMotion = useReducedMotion();
  const text = t("applyNow");

  if (reducedMotion) {
    return (
      <div className="bg-brand-accent px-4 py-2 text-center text-xs font-semibold text-brand-primary sm:py-2.5 sm:text-sm">
        {text}
      </div>
    );
  }

  const items = [text, text, text, text];

  return (
    <div className="overflow-hidden bg-brand-accent px-4 py-2 text-xs font-semibold text-brand-primary sm:py-2.5 sm:text-sm">
      <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={`a-${i}`} className="inline-flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary/40" />
            {item}
          </span>
        ))}
        {items.map((item, i) => (
          <span key={`b-${i}`} aria-hidden className="inline-flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary/40" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
