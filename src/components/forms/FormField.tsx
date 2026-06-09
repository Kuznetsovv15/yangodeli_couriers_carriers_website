"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FormField({
  id,
  label,
  error,
  children,
  className,
  delay = 0,
}: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("space-y-2", className)}
    >
      <Label htmlFor={id} className="text-sm font-semibold text-brand-text">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </motion.div>
  );
}
