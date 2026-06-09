"use client";

import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

export function ScrollProgress() {
  const locale = useLocale();
  const isRtl = locale === "he";
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
      className="scroll-progress-3d"
      style={{ top: "var(--chrome-height-effective, var(--chrome-height))" }}
      aria-hidden
    >
      <div className="scroll-progress-3d__track">
        <div
          ref={barRef}
          className="scroll-progress-3d__fill"
          style={{ transformOrigin: isRtl ? "right center" : "left center" }}
        />
      </div>
    </div>
  );
}
