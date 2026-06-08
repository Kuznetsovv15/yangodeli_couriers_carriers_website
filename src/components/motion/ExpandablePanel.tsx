"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type ExpandableItem = {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  accent?: ReactNode;
};

type ExpandablePanelProps = {
  items: ExpandableItem[];
  className?: string;
  defaultOpen?: number;
};

export function ExpandablePanel({
  items,
  className,
  defaultOpen = 0,
}: ExpandablePanelProps) {
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.div
            key={item.id}
            layout={!reducedMotion}
            className={cn(
              "volumetric-card overflow-hidden bg-white transition-shadow duration-300",
              isOpen && "shadow-volumetric-lg ring-1 ring-brand-accent/30"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full cursor-pointer items-center gap-4 p-5 text-start md:p-6"
              aria-expanded={isOpen}
            >
              {item.icon}
              <span className="flex-1 font-heading text-lg font-bold text-brand-text md:text-xl">
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-surface-elevated"
              >
                <ChevronDown className="h-5 w-5 text-brand-text" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-brand-border px-5 pb-5 pt-4 md:px-6 md:pb-6">
                    {item.accent}
                    <p className="text-sm leading-relaxed text-brand-muted md:text-base">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
