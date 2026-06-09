"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FlowMarquee } from "@/components/motion/FlowMarquee";
import { BOX_CREATIVES } from "@/lib/brand-assets";
import { ROLES, type Role } from "@/types/role";
import { cn } from "@/lib/utils";

type ServiceTickerProps = {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  className?: string;
};

export function ServiceTicker({ activeRole, onRoleChange, className }: ServiceTickerProps) {
  const t = useTranslations("nav.roles");
  const items = ROLES.map((role, i) => ({
    role,
    label: t(role),
    image: BOX_CREATIVES[i % BOX_CREATIVES.length],
  }));

  return (
    <div
      className={cn(
        "service-ticker-chrome overflow-hidden border-b border-brand-border/40 bg-white/95",
        className
      )}
      role="tablist"
      aria-label="Roles"
    >
      <FlowMarquee
        items={items}
        getKey={(item) => item.role}
        gap="gap-8 sm:gap-12"
        slideMs={3200}
        pauseOnHover
        className="py-1.5 sm:py-2"
        renderItem={(item) => {
          const isActive = item.role === activeRole;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onRoleChange(item.role)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 transition-[border-color,background-color,box-shadow] duration-200 sm:gap-2.5 sm:px-3.5 sm:py-1.5",
                isActive
                  ? "border-brand-accent bg-brand-accent/20 shadow-[0_2px_12px_rgba(255,205,87,0.35)]"
                  : "border-transparent bg-transparent hover:border-brand-border hover:bg-brand-surface-elevated"
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-surface-elevated p-1 sm:h-8 sm:w-8">
                <Image
                  src={item.image}
                  alt=""
                  width={24}
                  height={24}
                  className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                />
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[0.625rem] font-semibold uppercase tracking-[0.14em] sm:text-[0.6875rem]",
                  isActive ? "text-brand-text" : "text-brand-muted"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        }}
      />
    </div>
  );
}
