"use client";

import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { YangoButton } from "@/components/ui/YangoButton";
import { ROLES, type Role } from "@/types/role";
import { cn } from "@/lib/utils";

type HeaderProps = {
  activeRole?: Role;
  onRoleChange?: (role: Role) => void;
  onApplyClick?: () => void;
};

export function Header({ activeRole = "pickers", onRoleChange, onApplyClick }: HeaderProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selectRole = (role: Role) => {
    onRoleChange?.(role);
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "bg-white/90 backdrop-blur-xl transition-shadow duration-300",
        scrolled && "shadow-[inset_0_-1px_0_rgba(14,14,14,0.06)]"
      )}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:h-16 md:px-6">
        <Link
          href="/"
          aria-label={t("brand")}
          className="flex shrink-0 items-center rounded-sm py-1 transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 focus-visible:ring-offset-2"
        >
          <BrandLogo variant="wordmark" size="header" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Roles">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => selectRole(role)}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-300",
                  activeRole === role
                    ? "bg-brand-accent text-brand-primary shadow-[0_4px_16px_rgba(255,205,87,0.45)]"
                    : "text-brand-muted hover:bg-brand-surface-elevated hover:text-brand-text"
                )}
              >
                {t(`roles.${role}`)}
              </button>
            ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          <YangoButton
            variant="accent"
            className="hidden px-5 py-2.5 text-sm md:inline-flex"
            onClick={onApplyClick}
          >
            {tCommon("apply")}
          </YangoButton>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-brand-border lg:hidden"
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-brand-text" />
            ) : (
              <Menu className="h-5 w-5 text-brand-text" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-border lg:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => selectRole(role)}
                  className={cn(
                    "cursor-pointer rounded-xl px-4 py-3 text-start text-sm font-semibold transition-colors",
                    activeRole === role
                      ? "bg-brand-accent text-brand-primary"
                      : "text-brand-muted hover:bg-brand-surface-elevated"
                  )}
                >
                  {t(`roles.${role}`)}
                </button>
              ))}
              <YangoButton variant="accent" className="mt-2 w-full" onClick={onApplyClick}>
                {tCommon("apply")}
              </YangoButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
