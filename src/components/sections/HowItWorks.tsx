"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LiveIcon } from "@/components/motion/LiveIcon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { BAG_3D, BOX_CREATIVES } from "@/lib/brand-assets";

type StepItem = {
  title: string;
  description: string;
  icon?: string;
};

type HowItWorksProps = {
  label?: string;
  title: string;
  subtitle?: string;
  items: StepItem[];
};

export function HowItWorks({ label, title, subtitle, items }: HowItWorksProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="mx-auto grid w-full max-w-7xl items-start gap-8 px-4 md:gap-12 lg:grid-cols-[1fr_1.2fr] md:px-8">
      <div>
        <SectionIntro
          label={label}
          title={title}
          subtitle={subtitle}
          align="start"
          size="large"
        />
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="volumetric-card mx-auto inline-flex overflow-hidden rounded-2xl bg-brand-surface-elevated p-4 lg:mx-0"
        >
          <Image src={BAG_3D} alt="" width={100} height={100} className="h-24 w-24 object-contain" />
        </motion.div>
      </div>

      <ol className="relative space-y-10 ps-10 md:ps-12">
        <div
          className="absolute start-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-accent via-brand-accent/35 to-brand-border md:start-5"
          aria-hidden
        />

        {items.map((item, i) => (
          <motion.li
            key={item.title}
            initial={reducedMotion ? false : { opacity: 0, x: -12 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative"
          >
            <span
              className="absolute -start-[calc(1.5rem+2px)] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent text-sm font-black text-brand-primary shadow-[0_4px_16px_rgba(255,205,87,0.4)] md:-start-[calc(1.75rem+2px)]"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="volumetric-card rounded-2xl bg-white p-4 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-volumetric sm:p-5">
              <div className="flex items-start gap-4">
                {item.icon ? (
                  <LiveIcon src={item.icon} alt="" size={40} />
                ) : (
                  <Image
                    src={BOX_CREATIVES[i % BOX_CREATIVES.length]}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 object-contain"
                    aria-hidden
                  />
                )}
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-text">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
