"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DelayedCTAPrompt } from "@/components/modals/DelayedCTAPrompt";
import {
  CTA_CONTENT_EVENT,
  requestApply,
  type CtaPromptContent,
} from "@/lib/apply-bridge";
import { useCtaPromptShow } from "@/lib/hooks/useCtaPromptShow";

export function CtaPromptRoot() {
  const t = useTranslations("roles");
  const defaultCta = (t.raw("pickers") as { cta: CtaPromptContent }).cta;
  const [cta, setCta] = useState(defaultCta);
  const { open, dismiss } = useCtaPromptShow();

  useEffect(() => {
    const onContent = (event: Event) => {
      const detail = (event as CustomEvent<CtaPromptContent>).detail;
      if (detail?.title && detail?.button) setCta(detail);
    };

    window.addEventListener(CTA_CONTENT_EVENT, onContent);
    return () => window.removeEventListener(CTA_CONTENT_EVENT, onContent);
  }, []);

  return (
    <DelayedCTAPrompt
      open={open}
      title={cta.title}
      button={cta.button}
      onDismiss={dismiss}
      onClick={requestApply}
    />
  );
}
