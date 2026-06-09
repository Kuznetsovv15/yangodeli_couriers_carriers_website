"use client";

import { useGSAP } from "@gsap/react";
import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { isMobile, prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

export type SectionRevealVariant =
  | "fade-up"
  | "fade-scale"
  | "slide-in-start"
  | "slide-in-end"
  | "stagger-up"
  | "blur-rise";

type SectionScrollRevealProps = {
  children: ReactNode;
  variant?: SectionRevealVariant;
  className?: string;
  as?: "section" | "div";
  id?: string;
};

const REVEAL_FROM: Record<
  Exclude<SectionRevealVariant, "stagger-up">,
  gsap.TweenVars
> = {
  "fade-up": { y: 52, opacity: 0 },
  "fade-scale": { y: 28, opacity: 0, scale: 0.96 },
  "slide-in-start": { x: -64, opacity: 0 },
  "slide-in-end": { x: 64, opacity: 0 },
  "blur-rise": { y: 36, opacity: 0, filter: "blur(10px)" },
};

const REVEAL_TO: Record<
  Exclude<SectionRevealVariant, "stagger-up">,
  gsap.TweenVars
> = {
  "fade-up": { y: 0, opacity: 1 },
  "fade-scale": { y: 0, opacity: 1, scale: 1 },
  "slide-in-start": { x: 0, opacity: 1 },
  "slide-in-end": { x: 0, opacity: 1 },
  "blur-rise": { y: 0, opacity: 1, filter: "blur(0px)" },
};

export function SectionScrollReveal({
  children,
  variant = "fade-up",
  className,
  as = "div",
  id,
}: SectionScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion() || isMobile()) return;

      const trigger = {
        trigger: root,
        start: "top 82%",
        toggleActions: "play none none reverse",
      };

      if (variant === "stagger-up") {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]", root);
        if (!items.length) return;

        gsap.fromTo(
          items,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.14,
            ease: "power2.out",
            scrollTrigger: trigger,
          }
        );
        return;
      }

      const content = root.querySelector<HTMLElement>("[data-reveal-content]") ?? root;
      gsap.fromTo(content, REVEAL_FROM[variant], {
        ...REVEAL_TO[variant],
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [variant] }
  );

  const Tag = as;

  return (
    <Tag ref={ref as never} id={id} className={cn("section-scroll-reveal", className)}>
      {children}
    </Tag>
  );
}
