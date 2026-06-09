"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LiveIcon } from "@/components/motion/LiveIcon";
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

export type TransitionCard = {
  title: string;
  description: string;
  icon?: string;
  sticker?: string;
};

type SectionTransitionProps = {
  variant: SectionTransitionVariant;
  role: Role;
  cards?: TransitionCard[];
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

export function SectionTransition({
  variant,
  role,
  cards = [],
  className,
}: SectionTransitionProps) {
  const reducedMotion = useReducedMotion();
  const decor = getTransitionDecor(role, variant);

  return (
    <div className={cn("section-transition", VARIANT_GRADIENT[variant], className)}>
      <div className="section-transition__safe relative mx-auto max-w-7xl px-4 md:px-6">
        {decor.map((item, i) => (
          <motion.div
            key={`${variant}-decor-${item.src}-${i}`}
            className="section-transition__sticker pointer-events-none"
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
            aria-hidden
          >
            <Image
              src={item.src}
              alt=""
              width={item.size}
              height={item.size}
              className="h-full w-full object-contain opacity-55 drop-shadow-volumetric"
            />
          </motion.div>
        ))}

        {cards.length > 0 && (
          <div className="relative z-[1] grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {cards.map((card, i) => (
              <article
                key={card.title}
                className="section-transition__card volumetric-card rounded-2xl border border-brand-border/50 bg-white/95 p-4 shadow-sm sm:p-5"
              >
                <div className="mb-3 flex items-start gap-3">
                  {card.icon ? (
                    <LiveIcon src={card.icon} alt="" size={36} />
                  ) : card.sticker ? (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-surface-warm p-1.5">
                      <Image
                        src={card.sticker}
                        alt=""
                        width={32}
                        height={32}
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                  ) : (
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent text-xs font-black text-brand-primary">
                      {i + 1}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-heading text-sm font-bold leading-tight text-brand-text sm:text-base">
                      {card.title}
                    </h3>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-brand-muted sm:text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
