"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getAmbientDecor } from "@/lib/brand-assets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

type SectionAmbientProps = {
  role: Role;
  variant: "mission" | "benefits" | "cta";
  className?: string;
};

export function SectionAmbient({ role, variant, className }: SectionAmbientProps) {
  const reducedMotion = useReducedMotion();
  const decor = getAmbientDecor(role, variant);

  return (
    <div className={cn("section-ambient", `section-ambient--${variant}`, className)} aria-hidden>
      {decor.map((item, i) => (
        <motion.div
          key={`${variant}-${item.src}-${i}`}
          className="section-ambient__sticker"
          style={{
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            width: item.size,
            height: item.size,
          }}
          animate={
            reducedMotion
              ? undefined
              : { y: [0, i % 2 === 0 ? -8 : 6, 0], rotate: [item.rotate, item.rotate + 4, item.rotate] }
          }
          transition={
            reducedMotion
              ? undefined
              : { duration: 5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Image
            src={item.src}
            alt=""
            width={item.size}
            height={item.size}
            className="h-full w-full object-contain opacity-70 drop-shadow-volumetric"
          />
        </motion.div>
      ))}
    </div>
  );
}
