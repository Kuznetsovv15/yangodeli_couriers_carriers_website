"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

function toLines(title: string): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let chunk: string[] = [];

  for (const word of words) {
    chunk.push(word);
    const line = chunk.join(" ");
    if (line.length >= 14 || chunk.length >= 3) {
      lines.push(line);
      chunk = [];
    }
  }
  if (chunk.length) lines.push(chunk.join(" "));
  return lines;
}

type ScrollScrubHeadlineProps = {
  children: string;
  className?: string;
  trigger?: React.RefObject<HTMLElement | null>;
  scrub?: number;
};

export function ScrollScrubHeadline({
  children,
  className,
  trigger,
  scrub = 0.8,
}: ScrollScrubHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lines = toLines(children);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      const lineEls = ref.current.querySelectorAll("[data-line]");
      if (!lineEls.length) return;

      gsap.set(lineEls, { yPercent: 110, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger?.current ?? ref.current,
          start: "top top",
          end: "+=90%",
          scrub,
        },
      });

      lineEls.forEach((line, i) => {
        tl.to(
          line,
          { yPercent: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          i * 0.12
        );
      });
    },
    { scope: ref, dependencies: [children, scrub] }
  );

  return (
    <h1
      ref={ref}
      className={cn("font-heading font-black tracking-tight text-[var(--section-text)]", className)}
    >
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} data-line className="block overflow-hidden">
          <span className="block">{line}</span>
        </span>
      ))}
    </h1>
  );
}
