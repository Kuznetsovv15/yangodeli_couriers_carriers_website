"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type LiveIconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function LiveIcon({ src, alt = "", size = 52, className }: LiveIconProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "icon-well flex shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 ring-1 ring-brand-accent/20",
        className
      )}
      style={{ width: size + 20, height: size + 20 }}
      animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
      transition={reducedMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reducedMotion ? undefined : { scale: 1.1, rotate: 4, backgroundColor: "rgba(255,205,87,0.22)" }}
    >
      <Image src={src} alt={alt} width={size} height={size} className="h-auto w-auto max-h-[52px] max-w-[52px]" />
    </motion.div>
  );
}
