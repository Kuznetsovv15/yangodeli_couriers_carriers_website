/** Resolved fixed chrome height in pixels (header shell + top padding). */
export function getChromeOffsetPx(): number {
  if (typeof document === "undefined") return 88;

  const root = document.documentElement;
  const styles = getComputedStyle(root);

  const effective = parseFloat(styles.getPropertyValue("--chrome-height-effective"));
  if (Number.isFinite(effective) && effective > 0) return effective;

  const fallback = parseFloat(styles.getPropertyValue("--chrome-height"));
  if (Number.isFinite(fallback) && fallback > 0) return fallback;

  return 88;
}
