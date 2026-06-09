"use client";

import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { isMobile, prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

type ScrollSwapLinesProps = {
  lines: string[];
  triggerId: string;
  pinDuration?: string;
  accentIndex?: number;
  size?: "default" | "large";
  className?: string;
};

const headlineSize = {
  default: "text-section",
  large: "text-section-lg leading-[1.05]",
};

export function ScrollSwapLines({
  lines,
  triggerId,
  pinDuration = "+=120%",
  accentIndex = 1,
  size = "large",
  className,
}: ScrollSwapLinesProps) {
  const headlineClass = headlineSize[size];
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion() || isMobile() || lines.length < 2 || !ref.current) return;

      const trigger = document.getElementById(triggerId);
      if (!trigger) return;

      const els = gsap.utils.toArray<HTMLElement>("[data-swap-line]", ref.current);
      if (els.length < 2) return;

      gsap.set(els, { opacity: 0, y: 28, visibility: "hidden", pointerEvents: "none" });
      gsap.set(els[0], { opacity: 1, y: 0, visibility: "visible" });

      ScrollTrigger.create({
        trigger,
        start: "top top",
        end: pinDuration,
        scrub: 0.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(lines.length - 1, Math.floor(self.progress * lines.length));
          els.forEach((el, i) => {
            const isActive = i === idx;
            gsap.to(el, {
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : i < idx ? -24 : 24,
              visibility: isActive ? "visible" : "hidden",
              duration: 0.2,
              overwrite: true,
            });
          });
          setActiveIndex(idx);
        },
      });
    },
    { scope: ref, dependencies: [lines.join("|"), triggerId, pinDuration, locale] }
  );

  if (lines.length === 0) return null;

  if (prefersReducedMotion() || isMobile() || lines.length < 2) {
    return (
      <div className={cn("space-y-2 text-start md:space-y-1", className)}>
        {lines.map((line, i) => (
          <h2
            key={line}
            className={cn(
              "font-heading font-black leading-snug",
              headlineClass,
              i === accentIndex ? "text-brand-accent" : "text-brand-text"
            )}
          >
            {line}
          </h2>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full text-start",
        size === "large" ? "min-h-[2.8em] md:min-h-[3.2em]" : "min-h-[2.6em] md:min-h-[3em]",
        className
      )}
      aria-live="polite"
    >
      {lines.map((line, i) => (
        <h2
          key={line}
          data-swap-line
          aria-hidden={activeIndex !== i}
          className={cn(
            "absolute inset-x-0 top-0 text-start font-heading font-black leading-snug",
            headlineClass,
            i === accentIndex ? "text-brand-accent" : "text-brand-text/90",
            i === 0 ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          {line}
        </h2>
      ))}
    </div>
  );
}
