"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  he: "עב",
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="group/lang flex items-center gap-0.5 rounded-full border border-brand-border bg-white/90 p-0.5 shadow-sm transition-all duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/10 hover:shadow-volumetric sm:gap-1 sm:p-1"
      role="group"
      aria-label="Language switcher"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={cn(
            "cursor-pointer rounded-full px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider transition-all duration-300 sm:px-3 sm:py-1 sm:text-xs",
            locale === loc
              ? "bg-brand-accent text-brand-primary shadow-[0_4px_14px_rgba(255,205,87,0.35)]"
              : "text-brand-muted hover:scale-105 hover:bg-white hover:text-brand-text hover:shadow-sm active:scale-95"
          )}
          aria-current={locale === loc ? "true" : undefined}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
