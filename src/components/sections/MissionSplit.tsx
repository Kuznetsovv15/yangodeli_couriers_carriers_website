"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollSwapLines } from "@/components/motion/ScrollSwapLines";
import { SectionMesh } from "@/components/motion/SectionMesh";
import { TextReveal } from "@/components/motion/TextReveal";
import { BAG_3D, BOX_CREATIVES } from "@/lib/brand-assets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type MissionSplitProps = {
  label?: string;
  line1: string;
  line2: string;
  body: string;
  highlights?: string[];
};

export function MissionSplit({ label, line1, line2, body, highlights }: MissionSplitProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-brand-border bg-brand-surface px-4 py-12 sm:py-16 md:px-8 md:py-28">
      <SectionMesh variant="warm" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 lg:grid-cols-[1fr_auto]">
        <div className="text-center lg:text-start">
          {label && (
            <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-brand-text/75">
              {label}
            </p>
          )}
          <ScrollSwapLines
            lines={[line1, line2]}
            triggerId="mission"
            accentIndex={1}
          />
          <TextReveal delay={0.12} className="mx-auto mt-8 max-w-2xl lg:mx-0">
            <p className="font-sans text-lead leading-relaxed text-brand-muted">{body}</p>
          </TextReveal>
          {highlights && highlights.length > 0 && (
            <ul className="mx-auto mt-6 flex max-w-2xl flex-col gap-2 text-start lg:mx-0">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-brand-text md:text-base"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative mx-auto h-36 w-36 sm:h-48 sm:w-48 lg:mx-0 lg:h-56 lg:w-56">
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -12, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="card-3d volumetric-card absolute inset-0 flex items-center justify-center rounded-3xl bg-brand-surface-elevated"
          >
            <Image src={BAG_3D} alt="" width={180} height={180} className="h-40 w-40 object-contain" />
          </motion.div>
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, 10, 0], x: [0, 6, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -end-4 -top-6 rounded-2xl bg-white p-2 shadow-volumetric"
          >
            <Image
              src={BOX_CREATIVES[0]}
              alt=""
              width={72}
              height={72}
              className="h-16 w-16 object-contain"
            />
          </motion.div>
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -8, 0], x: [0, -5, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 -start-6 rounded-2xl bg-white p-2 shadow-volumetric"
          >
            <Image
              src={BOX_CREATIVES[2]}
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
