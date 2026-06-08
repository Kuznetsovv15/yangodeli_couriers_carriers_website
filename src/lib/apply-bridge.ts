export const APPLY_REQUEST_EVENT = "yango:apply-request";
export const CTA_CONTENT_EVENT = "yango:cta-content";

export type CtaPromptContent = {
  title: string;
  button: string;
};

export function requestApply(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(APPLY_REQUEST_EVENT));
}

export function publishCtaPromptContent(content: CtaPromptContent): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CTA_CONTENT_EVENT, { detail: content }));
}
