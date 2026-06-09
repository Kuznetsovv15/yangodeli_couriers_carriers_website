"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { YangoButton } from "@/components/ui/YangoButton";
import { BAG_3D } from "@/lib/brand-assets";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

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
  const reducedMotion = useReducedMotion();

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
      className="cta-prompt fixed inset-x-0 bottom-0 z-[9999] md:inset-x-auto md:end-6 md:bottom-6 md:w-[min(100%,26rem)]"
    >
      <div className="cta-prompt__card volumetric-card relative overflow-hidden rounded-t-3xl bg-white shadow-volumetric-lg md:rounded-3xl">
        <div className="cta-prompt__header flex h-12 items-center justify-center px-4 md:h-14">
          <BrandLogo variant="wordmark" size="sm" className="brightness-0" />
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="group/cta-close absolute end-3 top-3 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/80 text-brand-muted shadow-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-brand-text md:end-4 md:top-4"
          aria-label="Close"
        >
          <X className="h-4 w-4 transition-transform duration-300 group-hover/cta-close:rotate-90" />
        </button>

        <div className="relative px-5 pb-6 pt-4 text-center md:px-8 md:pb-10 md:pt-6">
          <motion.div
            className="mx-auto mb-4 flex h-24 w-24 items-center justify-center md:mb-5 md:h-28 md:w-28"
            animate={
              reducedMotion
                ? undefined
                : { y: [0, -8, 0], rotateZ: [0, 2, 0, -2, 0] }
            }
            transition={
              reducedMotion
                ? undefined
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src={BAG_3D}
              alt=""
              width={112}
              height={112}
              className="h-full w-full object-contain drop-shadow-volumetric"
            />
          </motion.div>

          <h2
            id="delayed-cta-title"
            className="px-2 font-heading text-lg font-black text-brand-text sm:text-xl md:text-2xl"
          >
            {title}
          </h2>

          <div className="mt-5 md:mt-6">
            <YangoButton variant="accent" className="w-full" onClick={handleClick}>
              {button}
            </YangoButton>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
