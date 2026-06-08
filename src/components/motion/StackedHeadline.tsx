"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

function toLines(title: string): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let chunk: string[] = [];

  for (const word of words) {
    chunk.push(word);
    const line = chunk.join(" ");
    if (line.length >= 14 || chunk.length >= 3) {
      lines.push(line);
      chunk = [];
    }
  }
  if (chunk.length) lines.push(chunk.join(" "));
  return lines;
}

type StackedHeadlineProps = {
  children: string;
  className?: string;
};

export function StackedHeadline({ children, className }: StackedHeadlineProps) {
  const reducedMotion = useReducedMotion();
  const lines = toLines(children);

  return (
    <h1 className={cn("font-heading font-black tracking-tight text-[var(--section-text)]", className)}>
      {lines.map((line, i) => (
        <motion.span
          key={`${line}-${i}`}
          className="block"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.span>
      ))}
    </h1>
  );
}
