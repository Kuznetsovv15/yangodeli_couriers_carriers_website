import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTheme = "hero" | "benefits" | "features" | "steps" | "form" | "cta";

type SectionShellProps = {
  id?: string;
  theme: SectionTheme;
  children: ReactNode;
  className?: string;
};

export function SectionShell({ id, theme, children, className }: SectionShellProps) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={cn(
        "theme-section bg-[var(--section-bg)] text-[var(--section-text)]",
        className
      )}
    >
      {children}
    </section>
  );
}
