"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FlowMarquee } from "@/components/motion/FlowMarquee";
import { BOX_CREATIVES } from "@/lib/brand-assets";
import { ROLES } from "@/types/role";

export function ServiceTicker() {
  const t = useTranslations("nav.roles");
  const items = ROLES.map((role, i) => ({
    role,
    label: t(role),
    image: BOX_CREATIVES[i % BOX_CREATIVES.length],
  }));

  return (
    <div className="border-y border-brand-border bg-white py-4" aria-hidden>
      <FlowMarquee
        items={items}
        getKey={(item) => item.role}
        gap="gap-12"
        renderItem={(item) => (
          <span className="inline-flex items-center gap-4">
            <span className="volumetric-card overflow-hidden rounded-xl bg-brand-surface-elevated p-2">
              <Image
                src={item.image}
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-muted">
              {item.label}
            </span>
          </span>
        )}
      />
    </div>
  );
}
