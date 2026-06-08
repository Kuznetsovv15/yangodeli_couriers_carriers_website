"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AlternatingLines } from "@/components/motion/AlternatingLines";
import { SectionMesh } from "@/components/motion/SectionMesh";
import { TextReveal } from "@/components/motion/TextReveal";
import { BAG_3D, BOX_CREATIVES } from "@/lib/brand-assets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type MissionSplitProps = {
  line1: string;
  line2: string;
  body: string;
};

export function MissionSplit({ line1, line2, body }: MissionSplitProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-brand-border bg-white px-4 py-12 sm:py-16 md:px-8 md:py-28">
      <SectionMesh variant="warm" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 lg:grid-cols-[1fr_auto]">
        <div className="text-center lg:text-start">
          <AlternatingLines lines={[line1, line2]} interval={2.8} accentIndex={1} />
          <TextReveal delay={0.12} className="mx-auto mt-10 max-w-2xl lg:mx-0">
            <p className="text-body-fluid leading-relaxed text-brand-muted">{body}</p>
          </TextReveal>
        </div>

        <div className="relative mx-auto h-36 w-36 sm:h-48 sm:w-48 lg:mx-0 lg:h-56 lg:w-56">
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, -12, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="volumetric-card absolute inset-0 flex items-center justify-center rounded-3xl bg-brand-surface-elevated"
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
