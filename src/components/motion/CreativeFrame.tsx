"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { isProductImage } from "@/lib/brand-assets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

type CreativeFrameProps = {
  src: string;
  alt: string;
  floats?: string[];
  className?: string;
  priority?: boolean;
  role?: Role;
  entrance?: "throw" | "none";
};

const throwTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
  mass: 0.95,
  delay: 0.12,
};

export function CreativeFrame({
  src,
  alt,
  floats = [],
  className,
  priority = false,
  role,
  entrance = "throw",
}: CreativeFrameProps) {
  const reducedMotion = useReducedMotion();
  const locale = useLocale();
  const isRtl = locale === "he";
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);
  const isProductShot = isProductImage(src);
  const isCourierHero = role === "couriers" && isProductShot;
  const useThrow = entrance === "throw" && !reducedMotion;

  const throwFrom = isRtl
    ? { opacity: 0, scale: 1.38, x: -130, y: -110, rotate: -16 }
    : { opacity: 0, scale: 1.38, x: 130, y: -110, rotate: 16 };

  const throwTo = { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 };

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <motion.div
        key={src}
        initial={useThrow ? throwFrom : false}
        animate={useThrow ? throwTo : undefined}
        transition={useThrow ? throwTransition : undefined}
        className="relative w-full"
      >
        <motion.div
          style={reducedMotion ? undefined : { y: parallaxY, rotate: parallaxRotate }}
          className={cn(
            "creative-frame volumetric-card relative w-full overflow-hidden",
            isCourierHero
              ? "aspect-square min-h-[min(72vw,320px)] bg-brand-surface-elevated sm:min-h-[min(80vw,420px)] md:min-h-[640px] lg:min-h-[720px]"
              : isProductShot
                ? "aspect-square min-h-[min(72vw,300px)] bg-brand-surface-elevated sm:min-h-[360px] md:aspect-[4/5] md:min-h-[480px]"
                : "aspect-[4/5] min-h-[min(72vw,340px)] sm:min-h-0 md:aspect-[5/6]"
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className={cn(
              isCourierHero
                ? "object-contain p-1 scale-[1.12] md:p-2 md:scale-[1.15]"
                : isProductShot
                  ? "object-contain p-3 md:p-5"
                  : "object-cover"
            )}
            priority={priority}
            sizes={
              isCourierHero
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 720px"
                : "(max-width: 1024px) 100vw, 560px"
            }
            quality={isCourierHero ? 100 : 92}
          />
          {!isProductShot && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-primary/20 via-transparent to-transparent" />
          )}
        </motion.div>
      </motion.div>

      {floats.map((floatSrc, i) => (
        <motion.div
          key={floatSrc}
          initial={useThrow ? { opacity: 0, scale: 0.6 } : false}
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: 1,
                  scale: 1,
                  y: [0, i % 2 === 0 ? -14 : 10, 0],
                  rotate: [0, i % 2 === 0 ? 6 : -5, 0],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  opacity: { delay: useThrow ? 0.5 + i * 0.07 : 0, duration: 0.35 },
                  scale: { delay: useThrow ? 0.5 + i * 0.07 : 0, duration: 0.45, ease: [0.22, 1.1, 0.36, 1] },
                  y: {
                    delay: useThrow ? 0.65 + i * 0.07 : 0,
                    duration: 4 + i * 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    delay: useThrow ? 0.65 + i * 0.07 : 0,
                    duration: 4 + i * 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
          className={cn(
            "pointer-events-none absolute z-10 drop-shadow-volumetric",
            i === 0 && "-end-3 -top-4 scale-75 sm:scale-90 md:-end-10 md:-top-12 md:scale-100",
            i === 1 && "hidden sm:block -start-4 bottom-12 md:-start-8 md:bottom-16",
            i === 2 && "hidden sm:block end-8 -bottom-6 md:end-12 md:-bottom-10"
          )}
          whileHover={reducedMotion ? undefined : { scale: 1.08 }}
        >
          <Image
            src={floatSrc}
            alt=""
            width={i === 0 ? 88 : 72}
            height={i === 0 ? 88 : 72}
            className="h-auto w-auto sm:w-[96px] md:w-auto"
            aria-hidden
          />
        </motion.div>
      ))}
    </div>
  );
}
