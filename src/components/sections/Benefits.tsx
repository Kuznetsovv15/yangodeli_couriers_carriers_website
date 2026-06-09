"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LiveIcon } from "@/components/motion/LiveIcon";
import { MiniCta } from "@/components/ui/MiniCta";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { BOX_CREATIVES } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type BenefitItem = {
  title: string;
  description: string;
  icon?: string;
};

type BenefitsProps = {
  label?: string;
  title: string;
  subtitle?: string;
  items: BenefitItem[];
  applyLabel?: string;
  onApply?: () => void;
};

export function Benefits({ label, title, subtitle, items, applyLabel, onApply }: BenefitsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <SectionIntro label={label} title={title} subtitle={subtitle} size="large" />

      <div
        data-spread-bound
        className={cn(
          "grid gap-4 md:gap-5",
          items.length >= 6
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "md:grid-cols-3 md:grid-rows-2"
        )}
      >
        {items.map((item, i) => {
          const featured = items.length < 6 && i === 0;
          return (
            <motion.article
              key={item.title}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              className={cn(
                "spread-child volumetric-card group relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6",
                "transition-[box-shadow] duration-300 hover:shadow-volumetric-lg",
                featured && "md:row-span-2 md:flex md:flex-col md:justify-between md:max-h-[min(52vh,420px)]"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  "bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,205,87,0.14),transparent_55%)]"
                )}
              />

              <div className="relative">
                <div className="mb-4 flex items-start gap-4">
                  {item.icon ? (
                    <LiveIcon src={item.icon} alt="" size={featured ? 48 : 40} />
                  ) : (
                    <div className="overflow-hidden rounded-xl bg-brand-surface-elevated p-2">
                      <Image
                        src={BOX_CREATIVES[i % BOX_CREATIVES.length]}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                        aria-hidden
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        "font-heading font-bold text-brand-text",
                        featured ? "text-xl sm:text-2xl" : "text-lg"
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 leading-relaxed text-brand-muted",
                        featured ? "text-base sm:text-lg" : "text-sm md:text-base"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {featured && (
                <div className="relative mt-4 hidden md:block">
                  <div className="grid grid-cols-2 gap-2">
                    {BOX_CREATIVES.slice(0, 2).map((src) => (
                      <div
                        key={src}
                        className="overflow-hidden rounded-xl bg-brand-surface-elevated p-3"
                      >
                        <Image
                          src={src}
                          alt=""
                          width={80}
                          height={80}
                          className="mx-auto h-16 w-16 object-contain"
                          aria-hidden
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>
          );
        })}
      </div>

      {applyLabel && onApply && <MiniCta label={applyLabel} onClick={onApply} />}
    </div>
  );
}
