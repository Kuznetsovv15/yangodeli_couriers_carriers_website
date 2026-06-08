"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion || !barRef.current) return;
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

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-brand-accent"
        aria-hidden
      />
    </div>
  );
}
