"use client";

import { useGSAP } from "@gsap/react";
import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

type TextRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  when?: "mount" | "scroll";
};

export function TextReveal({
  children,
  className = "",
  delay = 0,
  when = "scroll",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const animation = {
        opacity: 0,
        y: 28,
        duration: 0.9,
        delay,
        ease: "power3.out",
        clearProps: "opacity,transform",
      };

      if (when === "mount") {
        gsap.from(ref.current, animation);
      } else {
        gsap.from(ref.current, {
          ...animation,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: ref, dependencies: [delay, when] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
