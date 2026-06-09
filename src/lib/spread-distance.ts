/** Max converge distance (px) so cards stay fully inside [data-spread-bound] while animating. */
export function measureSpreadDistance(
  root: HTMLElement,
  targets: HTMLElement[],
  spreadSign: number
): number {
  const bound = root.querySelector<HTMLElement>("[data-spread-bound]");
  const cssMax =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spread-distance")) ||
    72;

  if (!bound || targets.length < 2) return Math.min(cssMax, 48);

  const boundRect = bound.getBoundingClientRect();
  const edgePadding = 16;
  let limit = cssMax;

  targets.forEach((el, i) => {
    const spreadIndex = (i - (targets.length - 1) / 2) * spreadSign;
    if (Math.abs(spreadIndex) < 0.01) return;

    const rect = el.getBoundingClientRect();
    // from-state offset pulls cards toward center: x = -spreadIndex * distance
    const offsetDir = -spreadIndex;

    if (offsetDir > 0) {
      const room = boundRect.right - edgePadding - rect.right;
      limit = Math.min(limit, room / offsetDir);
    } else {
      const room = rect.left - boundRect.left - edgePadding;
      limit = Math.min(limit, room / -offsetDir);
    }
  });

  // Safety margin for 3D rotation / scale
  return Math.max(0, Math.floor(limit * 0.82));
}
