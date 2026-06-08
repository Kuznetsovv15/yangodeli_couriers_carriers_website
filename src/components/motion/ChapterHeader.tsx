"use client";

import { cn } from "@/lib/utils";

type ChapterHeaderProps = {
  title: string;
  className?: string;
};

export function ChapterHeader({ title, className }: ChapterHeaderProps) {
  return (
    <header className={cn("mb-12 md:mb-16", className)}>
      <h2 className="max-w-3xl font-heading text-section font-black tracking-tight text-[var(--section-text)]">
        {title}
      </h2>
    </header>
  );
}
