"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { YangoButton } from "@/components/ui/YangoButton";
import { BAG_3D, BOX_CREATIVES } from "@/lib/brand-assets";

type DelayedCTAPromptProps = {
  open: boolean;
  title: string;
  button: string;
  onDismiss: () => void;
  onClick?: () => void;
};

export function DelayedCTAPrompt({
  open,
  title,
  button,
  onDismiss,
  onClick,
}: DelayedCTAPromptProps) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const handleClick = useCallback(() => {
    onClick?.();
    onDismiss();
  }, [onClick, onDismiss]);

  if (!portalTarget || !open) return null;

  return createPortal(
    <div
      id="yango-cta-prompt"
      role="dialog"
      aria-labelledby="delayed-cta-title"
      aria-modal="true"
      className="cta-prompt fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9999] md:inset-x-auto md:end-6 md:bottom-6 md:w-[min(100%,26rem)]"
    >
      <div className="volumetric-card relative overflow-hidden rounded-2xl bg-white px-5 py-6 text-center shadow-volumetric-lg sm:rounded-3xl md:px-8 md:py-10">
        <button
          type="button"
          onClick={onDismiss}
          className="group/cta-close absolute end-3 top-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-surface-elevated text-brand-muted transition-all duration-300 hover:scale-110 hover:bg-brand-border hover:text-brand-text hover:shadow-md"
          aria-label="Close"
        >
          <X className="h-4 w-4 transition-transform duration-300 group-hover/cta-close:rotate-90" />
        </button>

        <div className="pointer-events-none absolute -end-4 -top-4 opacity-70 md:-end-6 md:-top-6 md:opacity-80">
          <Image
            src={BAG_3D}
            alt=""
            width={72}
            height={72}
            className="h-14 w-14 drop-shadow-volumetric md:h-[100px] md:w-[100px]"
          />
        </div>
        <div className="pointer-events-none absolute -bottom-3 -start-3 hidden opacity-60 sm:block md:-bottom-4 md:-start-4 md:opacity-70">
          <Image src={BOX_CREATIVES[1]} alt="" width={56} height={56} className="md:h-[72px] md:w-[72px]" />
        </div>

        <BrandLogo variant="wordmark" size="sm" className="relative mx-auto mb-4 md:mb-5" />
        <h2
          id="delayed-cta-title"
          className="relative px-2 font-heading text-lg font-black text-brand-text sm:text-xl md:text-2xl"
        >
          {title}
        </h2>
        <div className="relative mt-6">
          <YangoButton variant="accent" className="w-full md:w-auto" onClick={handleClick}>
            {button}
          </YangoButton>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
