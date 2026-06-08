"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CreativeFrame } from "@/components/motion/CreativeFrame";
import { SectionMesh } from "@/components/motion/SectionMesh";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { YangoButton } from "@/components/ui/YangoButton";
import { getRoleFloats } from "@/lib/brand-assets";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

type HeroProps = {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  role: Role;
  onCtaClick?: () => void;
  onLearnMore?: () => void;
};

export function Hero({
  title,
  subtitle,
  cta,
  image,
  role,
  onCtaClick,
  onLearnMore,
}: HeroProps) {
  const tCommon = useTranslations("common");

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-4 sm:pb-14 sm:pt-6 md:px-6 md:pb-20 md:pt-8">
      <SectionMesh variant="hero" />

      <div
        className={cn(
          "relative mx-auto grid max-w-7xl items-center gap-5 sm:gap-8 lg:gap-10",
          "lg:grid-cols-2"
        )}
      >
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-accent/40 bg-brand-accent/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-text sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.18em]"
          >
            <span className="live-dot h-2 w-2 rounded-full bg-brand-accent" />
            Yango Deli Careers 2026
          </motion.div>

          <SplitTextReveal
            when="mount"
            type="words"
            stagger={0.04}
            className="hero-title font-heading text-hero font-black text-brand-text"
          >
            {title}
          </SplitTextReveal>

          <TextReveal when="mount" delay={0.1}>
            <p className="max-w-md text-body-fluid leading-relaxed text-brand-muted sm:leading-relaxed">
              {subtitle}
            </p>
          </TextReveal>

          <TextReveal when="mount" delay={0.2}>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <YangoButton variant="accent" className="w-full sm:w-auto" onClick={onCtaClick}>
                {cta}
              </YangoButton>
              <YangoButton variant="primary" className="w-full sm:w-auto" onClick={onLearnMore}>
                {tCommon("learnMore")}
              </YangoButton>
            </div>
          </TextReveal>
        </div>

        <div className="order-first sm:order-none">
          <CreativeFrame
            key={role}
            src={image}
            alt={title}
            floats={getRoleFloats(role)}
            role={role}
            priority
            entrance="throw"
          />
        </div>
      </div>
    </section>
  );
}
