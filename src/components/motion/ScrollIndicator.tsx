"use client";

import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

export function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-brand-text/40">
      <ChevronDown className="h-6 w-6" aria-hidden />
      <span className="sr-only">Scroll</span>
    </div>
  );
}
