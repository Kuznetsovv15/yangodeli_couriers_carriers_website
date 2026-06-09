"use client";

import { cn } from "@/lib/utils";

type SectionIntroSize = "default" | "large";

type SectionIntroProps = {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  labelClassName?: string;
  align?: "start" | "center";
  size?: SectionIntroSize;
};

const sizeStyles: Record<
  SectionIntroSize,
  { label: string; title: string; subtitle: string; titleSpacing: string }
> = {
  default: {
    label: "text-[length:var(--text-caption)] font-semibold uppercase tracking-[0.22em] text-brand-muted",
    title: "text-section",
    subtitle: "text-body-fluid max-w-2xl mt-3",
    titleSpacing: "mt-2",
  },
  large: {
    label:
      "text-eyebrow font-bold uppercase tracking-[0.14em] text-brand-text/75",
    title: "text-section-lg",
    subtitle: "text-lead max-w-3xl mt-4 md:mt-5",
    titleSpacing: "mt-3 md:mt-4",
  },
};

export function SectionIntro({
  label,
  title,
  subtitle,
  className,
  labelClassName,
  align = "center",
  size = "default",
}: SectionIntroProps) {
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" ? "text-center md:text-start" : "text-start",
        className
      )}
    >
      {label && (
        <p className={cn(styles.label, labelClassName)}>{label}</p>
      )}
      <h2
        className={cn(
          "max-w-full text-pretty font-heading font-black text-brand-text",
          styles.title,
          label && styles.titleSpacing
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "font-sans leading-relaxed text-brand-muted",
            styles.subtitle,
            align === "center" && "mx-auto md:mx-0"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
