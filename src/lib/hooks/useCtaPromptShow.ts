"use client";

import { useCallback, useEffect, useState } from "react";

const DISMISS_KEY = "yango-cta-prompt-v3";
const LEGACY_DISMISS_KEY = "yango-cta-prompt-dismissed";
const SHOW_EVENT = "yango:cta-show";

declare global {
  interface Window {
    __YANGO_CTA_READY?: boolean;
  }
}

function isDismissed(): boolean {
  try {
    return (
      sessionStorage.getItem(DISMISS_KEY) === "1" ||
      sessionStorage.getItem(LEGACY_DISMISS_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function useCtaPromptShow() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isDismissed()) return;

    const show = () => {
      if (!isDismissed()) setOpen(true);
    };

    if (window.__YANGO_CTA_READY) show();
    window.addEventListener(SHOW_EVENT, show);
    return () => window.removeEventListener(SHOW_EVENT, show);
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode */
    }
  }, []);

  return { open, dismiss };
}
