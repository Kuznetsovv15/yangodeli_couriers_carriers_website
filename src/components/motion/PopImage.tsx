"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

type PopImageProps = {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
  delay?: number;
  float?: boolean;
  trigger?: string | Element | null;
};

export function PopImage({
  src,
  alt = "",
  className,
  size = 120,
  delay = 0,
  float = true,
  trigger,
}: PopImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger ?? el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(el, {
        scale: 0,
        rotation: -18,
        opacity: 0,
        duration: 0.9,
        delay,
        ease: "back.out(2.2)",
      });

      if (float) {
        gsap.to(el, {
          y: -12,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: delay + 0.9,
        });
      }
    },
    { dependencies: [src, delay, float, trigger] }
  );

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none will-change-transform", className)}
      aria-hidden={!alt}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="h-auto w-full drop-shadow-volumetric"
      />
    </div>
  );
}
