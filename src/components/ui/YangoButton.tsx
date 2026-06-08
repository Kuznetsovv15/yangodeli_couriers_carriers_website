"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type YangoButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "accent" | "outline";
  onClick?: () => void;
};

export function YangoButton({
  children,
  className,
  variant = "primary",
  onClick,
}: YangoButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full px-6 py-3 text-sm font-bold transition-colors duration-300 sm:px-8 sm:py-3.5 sm:text-base",
        variant === "primary" && "bg-brand-primary text-white hover:bg-brand-text hover:shadow-lg",
        variant === "accent" &&
          "bg-brand-accent text-brand-primary hover:bg-brand-accent-dark hover:shadow-[0_8px_32px_rgba(255,205,87,0.4)]",
        variant === "outline" &&
          "border border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10",
        className
      )}
      whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.button>
  );
}
