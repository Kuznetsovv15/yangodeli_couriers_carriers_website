"use client";

import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap-config";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  getJourneyCenter,
  getJourneyEnterFrom,
  getJourneyExitTransform,
  JOURNEY_EXIT_DIRECTIONS,
  type JourneyDirection,
} from "@/lib/scroll-journey-directions";
import { cn } from "@/lib/utils";

const TRANSITION_MS = 650;
const WHEEL_COOLDOWN_MS = 450;
const ANIMATION_WATCHDOG_MS = 1200;
const SCROLL_EDGE_TOLERANCE = 8;

type PanelProps = {
  id: string;
  exit?: JourneyDirection;
  className?: string;
  scrollable?: boolean;
  children: ReactNode;
};

type ScrollJourneyContextValue = {
  activeIndex: number;
  total: number;
  goToId: (id: string) => void;
  goToIndex: (index: number, force?: boolean) => void;
};

const ScrollJourneyContext = createContext<ScrollJourneyContextValue | null>(null);

export function useScrollJourney() {
  const ctx = useContext(ScrollJourneyContext);
  if (!ctx) throw new Error("useScrollJourney must be used within ScrollJourney");
  return ctx;
}

function JourneyPanel(_props: PanelProps) {
  return null;
}

type ScrollJourneyProps = {
  children: ReactNode;
  className?: string;
};

function isPanelElement(child: ReactNode): child is ReactElement<PanelProps> {
  return isValidElement(child) && child.type === JourneyPanel;
}

function toGsapTransform(t: ReturnType<typeof getJourneyCenter>) {
  return {
    x: t.x,
    y: t.y,
    rotateY: t.rotateY,
    rotateX: t.rotateX,
    scale: t.scale,
    autoAlpha: t.opacity,
  };
}

function panelCanRelease(panel: HTMLElement | null, forward: boolean): boolean {
  if (!panel) return true;
  const { scrollTop, scrollHeight, clientHeight } = panel;
  if (scrollHeight <= clientHeight + 1) return true;
  if (forward) {
    return scrollTop + clientHeight >= scrollHeight - SCROLL_EDGE_TOLERANCE;
  }
  return scrollTop <= SCROLL_EDGE_TOLERANCE;
}

export function ScrollJourney({ children, className }: ScrollJourneyProps) {
  const locale = useLocale();
  const isRtl = locale === "he";
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const motionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animStartedAtRef = useRef(0);
  const lastNavAtRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const touchStartYRef = useRef(0);
  const goToIndexRef = useRef<(index: number, force?: boolean) => void>(() => {});
  const [activeIndex, setActiveIndex] = useState(0);

  const childArray = useMemo(() => Children.toArray(children), [children]);

  const sections = useMemo(
    () =>
      childArray
        .filter(isPanelElement)
        .map((child) => ({
          id: child.props.id,
          exit: child.props.exit,
          className: child.props.className,
          scrollable: child.props.scrollable,
          children: child.props.children,
        })),
    [childArray]
  );

  const extras = useMemo(
    () => childArray.filter((child) => !isPanelElement(child)),
    [childArray]
  );

  const snapPanelsToIndex = useCallback((index: number) => {
    const center = toGsapTransform(getJourneyCenter());
    motionRefs.current.forEach((motion, i) => {
      const panel = panelRefs.current[i];
      if (!motion || !panel) return;
      const isActive = i === index;
      gsap.set(motion, { ...center, autoAlpha: isActive ? 1 : 0 });
      gsap.set(panel, {
        visibility: isActive ? "visible" : "hidden",
        pointerEvents: isActive ? "auto" : "none",
        zIndex: isActive ? 10 : 0,
      });
      if (isActive) panel.scrollTop = 0;
    });
  }, []);

  const releaseAnimationLock = useCallback(
    (targetIndex: number) => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      isAnimatingRef.current = false;
      snapPanelsToIndex(targetIndex);
      activeIndexRef.current = targetIndex;
      setActiveIndex(targetIndex);
    },
    [snapPanelsToIndex]
  );

  const goToIndex = useCallback(
    (nextIndex: number, force = false) => {
      const total = sections.length;
      if (total === 0) return;

      const now = Date.now();
      if (!force && now - lastNavAtRef.current < WHEEL_COOLDOWN_MS) return;

      const clamped = Math.max(0, Math.min(total - 1, nextIndex));
      const current = activeIndexRef.current;
      if (clamped === current && !isAnimatingRef.current) return;

      const outPanel = panelRefs.current[current];
      const inPanel = panelRefs.current[clamped];
      const outMotion = motionRefs.current[current];
      const inMotion = motionRefs.current[clamped];
      if (!outPanel || !inPanel || !outMotion || !inMotion) return;

      if (isAnimatingRef.current) {
        if (!force) return;
        timelineRef.current?.kill();
        timelineRef.current = null;
        isAnimatingRef.current = false;
        snapPanelsToIndex(current);
      }

      if (clamped === current) return;

      const goingForward = clamped > current;
      const axisDir =
        sections[goingForward ? current : clamped]?.exit ??
        JOURNEY_EXIT_DIRECTIONS[
          (goingForward ? current : clamped) % JOURNEY_EXIT_DIRECTIONS.length
        ];

      isAnimatingRef.current = true;
      animStartedAtRef.current = now;
      lastNavAtRef.current = now;

      if (reducedMotion) {
        releaseAnimationLock(clamped);
        return;
      }

      const center = toGsapTransform(getJourneyCenter());
      const exitTo = toGsapTransform(getJourneyExitTransform(axisDir, isRtl));
      const enterFrom = toGsapTransform(getJourneyEnterFrom(axisDir, isRtl));
      const outTarget = goingForward ? exitTo : enterFrom;
      const inStart = goingForward ? enterFrom : exitTo;

      gsap.set(inPanel, { visibility: "visible", pointerEvents: "none", zIndex: 20 });
      gsap.set(outPanel, { visibility: "visible", pointerEvents: "none", zIndex: 10 });
      gsap.set(inMotion, { ...inStart });
      gsap.set(outMotion, { ...center });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: TRANSITION_MS / 1000 },
        onComplete: () => {
          if (timelineRef.current !== tl) return;
          releaseAnimationLock(clamped);
        },
      });
      timelineRef.current = tl;
      tl.to(outMotion, outTarget, 0).to(inMotion, center, 0);
    },
    [isRtl, reducedMotion, releaseAnimationLock, sections, snapPanelsToIndex]
  );

  useEffect(() => {
    goToIndexRef.current = goToIndex;
  }, [goToIndex]);

  const goToId = useCallback(
    (id: string) => {
      const index = sections.findIndex((s) => s.id === id);
      if (index >= 0) goToIndex(index, true);
    },
    [goToIndex, sections]
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion) return;

      snapPanelsToIndex(0);
      activeIndexRef.current = 0;

      const onWheel = (e: WheelEvent) => {
        if ((e.target as Element).closest("[data-carousel-root]")) return;
        if (isAnimatingRef.current) return;
        if (Math.abs(e.deltaY) < 6) return;

        const forward = e.deltaY > 0;
        const panel = panelRefs.current[activeIndexRef.current];
        if (!panelCanRelease(panel, forward)) return;

        e.preventDefault();
        if (forward) goToIndexRef.current(activeIndexRef.current + 1);
        else goToIndexRef.current(activeIndexRef.current - 1);
      };

      const onTouchStart = (e: TouchEvent) => {
        if ((e.target as Element).closest("[data-carousel-root]")) return;
        touchStartYRef.current = e.touches[0]?.clientY ?? 0;
      };

      const onTouchEnd = (e: TouchEvent) => {
        if ((e.target as Element).closest("[data-carousel-root]")) return;
        if (isAnimatingRef.current) return;
        const endY = e.changedTouches[0]?.clientY ?? 0;
        const delta = touchStartYRef.current - endY;
        if (Math.abs(delta) < 40) return;

        const forward = delta > 0;
        const panel = panelRefs.current[activeIndexRef.current];
        if (!panelCanRelease(panel, forward)) return;

        if (forward) goToIndexRef.current(activeIndexRef.current + 1);
        else goToIndexRef.current(activeIndexRef.current - 1);
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          goToIndexRef.current(activeIndexRef.current + 1);
        }
        if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          goToIndexRef.current(activeIndexRef.current - 1);
        }
      };

      root.addEventListener("wheel", onWheel, { passive: false });
      root.addEventListener("touchstart", onTouchStart, { passive: true });
      root.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("keydown", onKey);

      return () => {
        root.removeEventListener("wheel", onWheel);
        root.removeEventListener("touchstart", onTouchStart);
        root.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("keydown", onKey);
        timelineRef.current?.kill();
        timelineRef.current = null;
        isAnimatingRef.current = false;
      };
    },
    { scope: rootRef, dependencies: [reducedMotion, sections.length, snapPanelsToIndex] }
  );

  useEffect(() => {
    const watchdog = window.setInterval(() => {
      if (!isAnimatingRef.current) return;
      if (Date.now() - animStartedAtRef.current > ANIMATION_WATCHDOG_MS) {
        releaseAnimationLock(activeIndexRef.current);
      }
    }, 250);
    return () => window.clearInterval(watchdog);
  }, [releaseAnimationLock]);

  useLayoutEffect(() => {
    document.documentElement.classList.add("scroll-journey-active");
    window.dispatchEvent(new CustomEvent("yango:scroll-lock", { detail: { locked: true } }));
    return () => {
      document.documentElement.classList.remove("scroll-journey-active");
      window.dispatchEvent(new CustomEvent("yango:scroll-lock", { detail: { locked: false } }));
    };
  }, []);

  useEffect(() => {
    const onGoto = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (id) goToId(id);
    };
    window.addEventListener("yango:journey-goto", onGoto);
    return () => window.removeEventListener("yango:journey-goto", onGoto);
  }, [goToId]);

  const contextValue: ScrollJourneyContextValue = {
    activeIndex,
    total: sections.length,
    goToId,
    goToIndex,
  };

  if (reducedMotion) {
    return (
      <ScrollJourneyContext.Provider value={contextValue}>
        {extras}
        <div className={cn("scroll-journey-fallback", className)}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={section.className}>
              {section.children}
            </section>
          ))}
        </div>
      </ScrollJourneyContext.Provider>
    );
  }

  return (
    <ScrollJourneyContext.Provider value={contextValue}>
      {extras}
      <div
        ref={rootRef}
        className={cn("scroll-journey", className)}
        style={{
          top: "var(--chrome-height-effective, var(--chrome-height))",
          height: "calc(100dvh - var(--chrome-height-effective, var(--chrome-height)))",
        }}
      >
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            ref={(el) => {
              panelRefs.current[index] = el;
            }}
            className={cn(
              "scroll-journey-panel",
              section.className,
              index === activeIndex && "scroll-journey-panel--active"
            )}
            aria-hidden={index !== activeIndex}
          >
            <div
              ref={(el) => {
                motionRefs.current[index] = el;
              }}
              className="scroll-journey-panel__motion"
            >
              <div
                className={cn(
                  "scroll-journey-panel__inner",
                  section.scrollable && "scroll-journey-panel__inner--scrollable"
                )}
              >
                {section.children}
              </div>
            </div>
          </div>
        ))}

        <div className="scroll-journey-dots" aria-hidden>
          {sections.map((section, i) => (
            <button
              key={section.id}
              type="button"
              aria-label={`Section ${i + 1}`}
              className={cn(
                "scroll-journey-dot",
                i === activeIndex && "scroll-journey-dot--active"
              )}
              onClick={() => goToIndex(i, true)}
            />
          ))}
        </div>
      </div>
    </ScrollJourneyContext.Provider>
  );
}

ScrollJourney.Panel = JourneyPanel;
