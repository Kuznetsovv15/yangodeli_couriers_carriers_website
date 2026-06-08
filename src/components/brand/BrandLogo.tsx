import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "wordmark" | "mark";
  /** dark = black wordmark on light backgrounds, light = white on dark backgrounds */
  theme?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "header";
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { wordmark: { w: 100, h: 28, class: "h-6 w-auto" }, mark: { w: 36, h: 36, class: "h-8 w-8" } },
  md: { wordmark: { w: 140, h: 40, class: "h-8 w-auto md:h-9" }, mark: { w: 48, h: 48, class: "h-10 w-10" } },
  lg: { wordmark: { w: 180, h: 52, class: "h-10 w-auto md:h-12" }, mark: { w: 64, h: 64, class: "h-14 w-14" } },
  header: {
    wordmark: { w: 152, h: 42, class: "h-8 w-auto sm:h-9 md:h-10" },
    mark: { w: 40, h: 40, class: "h-9 w-9 md:h-10 md:w-10" },
  },
};

export function BrandLogo({
  variant = "wordmark",
  theme = "dark",
  size = "md",
  className,
  priority = false,
}: BrandLogoProps) {
  const s = sizes[size][variant];

  if (variant === "mark") {
    return (
      <Image
        src="/logos/official/logo-yellow-button.png"
        alt="Yango Deli"
        width={s.w}
        height={s.h}
        className={cn(s.class, className)}
        priority={priority}
      />
    );
  }

  const src =
    theme === "light"
      ? "/logos/official/logotype-white.svg"
      : "/logos/official/logotype-black.svg";

  return (
    <Image
      src={src}
      alt="Yango Deli"
      width={s.w}
      height={s.h}
      className={cn(s.class, className)}
      priority={priority}
    />
  );
}
