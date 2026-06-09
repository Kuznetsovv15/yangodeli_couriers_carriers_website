"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

type SplitTextRevealProps = {
  children: string;
  type?: "words" | "chars";
  stagger?: number;
  className?: string;
  delay?: number;
  /** "mount" animates immediately — required for above-the-fold hero copy */
  when?: "mount" | "scroll";
};

export function SplitTextReveal({
  children,
  type = "words",
  stagger = 0.03,
  className = "",
  delay = 0,
  when = "scroll",
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !containerRef.current) return;

      const text = containerRef.current.textContent || "";
      const words = text.split(/\s+/).filter(Boolean);
      containerRef.current.innerHTML = "";
      containerRef.current.style.letterSpacing = "0.012em";
      const animTargets: HTMLSpanElement[] = [];

      words.forEach((word, wordIndex) => {
        const wordWrapper = document.createElement("span");
        wordWrapper.style.display = "inline-block";
        wordWrapper.style.maxWidth = "100%";
        wordWrapper.style.marginInlineEnd = "0.05em";

        if (type === "chars") {
          word.split("").forEach((char, charIndex) => {
            const charOuter = document.createElement("span");
            charOuter.style.display = "inline-block";
            charOuter.style.clipPath = "inset(-0.3em -0.05em)";
            charOuter.style.marginInlineEnd = charIndex < word.length - 1 ? "0.06em" : "0";
            const charInner = document.createElement("span");
            charInner.style.display = "inline-block";
            charInner.textContent = char;
            charOuter.appendChild(charInner);
            wordWrapper.appendChild(charOuter);
            animTargets.push(charInner);
          });
        } else {
          const outer = document.createElement("span");
          outer.style.display = "inline-block";
          outer.style.clipPath = "inset(-0.12em -0.04em)";
          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.letterSpacing = "0.01em";
          inner.textContent = word;
          outer.appendChild(inner);
          wordWrapper.appendChild(outer);
          animTargets.push(inner);
        }

        containerRef.current!.appendChild(wordWrapper);
        if (wordIndex < words.length - 1) {
          containerRef.current!.appendChild(document.createTextNode("\u00A0"));
        }
      });

      const animation = {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        stagger,
        delay,
        ease: "power3.out",
        clearProps: "opacity,transform",
      };

      if (when === "mount") {
        gsap.from(animTargets, animation);
      } else {
        gsap.from(animTargets, {
          ...animation,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: containerRef, dependencies: [children, type, stagger, delay, when] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
