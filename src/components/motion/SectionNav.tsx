"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ScrollTrigger } from "@/lib/gsap-config";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

type SectionNavProps = {
  sectionIds: string[];
};

export function SectionNav({ sectionIds }: SectionNavProps) {
  const locale = useLocale();
  const isRtl = locale === "he";
  const t = useTranslations("landing.nav");
  const { scrollTo } = useSmoothScroll();
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = sectionIds.map((id) => ({
    id,
    label: t(
      id as
        | "hero"
        | "mission"
        | "trust"
        | "benefits"
        | "features"
        | "how-it-works"
        | "cta"
        | "footer"
    ),
  }));

  useEffect(() => {
    const triggers = sections.map((section, index) =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      })
    );
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [sections]);

  return (
    <nav
      className={cn(
        "fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 md:flex",
        isRtl ? "start-4" : "end-4"
      )}
      aria-label="Sections"
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollTo(section.id)}
          className="group flex items-center gap-2"
          aria-label={section.label}
          aria-current={activeIndex === index ? "step" : undefined}
        >
          <span
            className={cn(
              "block rounded-full transition-[width,height,background-color] duration-300",
              activeIndex === index
                ? "h-2.5 w-2.5 bg-brand-accent"
                : "h-2 w-2 bg-brand-border group-hover:bg-brand-muted/40"
            )}
          />
          <span
            className={cn(
              "max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium text-brand-muted opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-[8rem] group-hover:opacity-100",
              activeIndex === index && "max-w-[8rem] text-brand-text opacity-100"
            )}
          >
            {section.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
