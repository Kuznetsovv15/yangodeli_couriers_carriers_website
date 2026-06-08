"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ScrollTrigger } from "@/lib/gsap-config";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

type SectionNavProps = {
  sections: Array<{ id: string; label: string }>;
};

export function SectionNav({ sections }: SectionNavProps) {
  const locale = useLocale();
  const isRtl = locale === "he";
  const { scrollTo } = useSmoothScroll();
  const [activeIndex, setActiveIndex] = useState(0);

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
    return () => triggers.forEach((t) => t.kill());
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
              "block rounded-full transition-all duration-300",
              activeIndex === index
                ? "h-2.5 w-2.5 bg-brand-primary"
                : "h-2 w-2 bg-brand-border group-hover:bg-brand-muted/40"
            )}
          />
        </button>
      ))}
    </nav>
  );
}
