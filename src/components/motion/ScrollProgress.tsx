"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current || prefersReducedMotion()) return;

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  });

  return (
    <div
      className="fixed inset-x-0 z-[100] h-0.5"
      style={{ top: "var(--chrome-height-effective, var(--chrome-height))" }}
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-brand-accent shadow-[0_0_8px_rgba(255,205,87,0.35)]"
        aria-hidden
      />
    </div>
  );
}
