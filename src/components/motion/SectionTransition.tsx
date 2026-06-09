"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getTransitionDecor } from "@/lib/brand-assets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

export type SectionTransitionVariant =
  | "hero-mission"
  | "mission-trust"
  | "trust-benefits"
  | "benefits-features"
  | "features-steps"
  | "steps-cta";

type SectionTransitionProps = {
  variant: SectionTransitionVariant;
  role: Role;
  className?: string;
};

const VARIANT_GRADIENT: Record<SectionTransitionVariant, string> = {
  "hero-mission": "section-transition--hero-mission",
  "mission-trust": "section-transition--mission-trust",
  "trust-benefits": "section-transition--trust-benefits",
  "benefits-features": "section-transition--benefits-features",
  "features-steps": "section-transition--features-steps",
  "steps-cta": "section-transition--steps-cta",
};

export function SectionTransition({ variant, role, className }: SectionTransitionProps) {
  const reducedMotion = useReducedMotion();
  const decor = getTransitionDecor(role, variant);

  return (
    <div
      className={cn("section-transition", VARIANT_GRADIENT[variant], className)}
      aria-hidden
    >
      <div className="section-transition__safe mx-auto max-w-7xl">
        {decor.map((item, i) => (
          <motion.div
            key={`${variant}-${item.src}-${i}`}
            className="section-transition__sticker"
            style={{
              left: item.left,
              right: item.right,
              top: item.top,
              width: item.size,
              height: item.size,
            }}
            animate={
              reducedMotion
                ? undefined
                : { y: [0, i % 2 === 0 ? -6 : 5, 0], rotate: [item.rotate, item.rotate + 3, item.rotate] }
            }
            transition={
              reducedMotion
                ? undefined
                : { duration: 4.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src={item.src}
              alt=""
              width={item.size}
              height={item.size}
              className="h-full w-full object-contain drop-shadow-volumetric"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
