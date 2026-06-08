"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

type AlternatingLinesProps = {
  lines: string[];
  interval?: number;
  className?: string;
  accentIndex?: number;
};

export function AlternatingLines({
  lines,
  interval = 3,
  className,
  accentIndex = 1,
}: AlternatingLinesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current || lines.length < 2) return;

      const els = ref.current.querySelectorAll("[data-alt-line]");
      gsap.set(els, { opacity: 0, y: 20 });
      gsap.set(els[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({ repeat: -1 });
      lines.forEach((_, i) => {
        const next = (i + 1) % lines.length;
        tl.to(els[i], { opacity: 0, y: -16, duration: 0.55, ease: "power2.inOut" })
          .to(els[next], { opacity: 1, y: 0, duration: 0.55, ease: "power2.inOut" }, "<")
          .to({}, { duration: interval });
      });
    },
    { scope: ref, dependencies: [lines.join("|"), interval] }
  );

  if (prefersReducedMotion()) {
    return (
      <h2 className={cn("font-heading text-section font-black leading-snug", className)}>
        {lines.map((line, i) => (
          <span
            key={line}
            className={cn("block", i === accentIndex && "text-brand-accent")}
          >
            {line}
          </span>
        ))}
      </h2>
    );
  }

  return (
    <div ref={ref} className={cn("relative min-h-[1.3em] text-section md:min-h-[2.6em]", className)}>
      {lines.map((line, i) => (
        <h2
          key={line}
          data-alt-line
          className={cn(
            "absolute inset-x-0 top-0 font-heading font-black leading-snug",
            i === accentIndex ? "text-brand-accent" : "text-brand-text"
          )}
        >
          {line}
        </h2>
      ))}
    </div>
  );
}
