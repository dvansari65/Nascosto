"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TickStrip } from "./tick-strip";

gsap.registerPlugin(ScrollTrigger);

const OUTCOMES = [
  {
    title: "Trade on real scarcity",
    description:
      "Not inflated floor prices skewed by wash trades and fake listings.",
  },
  {
    title: "Settle in seconds, not days",
    description:
      "Skip manual escrow and third-party custodians entirely. Confidential settlement finalizes on-chain, instantly.",
  },
  {
    title: "Keep your position off the tape",
    description:
      "Cost of every competitor watching your holdings, offers, and strategy before you trade.",
  },
];

export function Outcomes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".outcome-eyebrow, .outcome-heading", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".outcome-item", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".outcome-grid",
          start: "top 85%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative border-y border-dashed border-neutral-300 bg-white px-6 py-20 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-350">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <span className="outcome-eyebrow font-mono text-xs uppercase tracking-wide text-neutral-500">
            Why Segreto
          </span>
          <h2 className="outcome-heading mt-3 font-display text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Built for traders who don&apos;t want to be seen
          </h2>
        </div>

        <div className="outcome-grid relative border border-neutral-200 pt-12">
          <TickStrip align="top" className="w-full text-gray-300" cells={120} cellSize={8} width={48} />

          <dl className="grid grid-cols-1 divide-y divide-neutral-200 border-t border-neutral-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {OUTCOMES.map((item) => (
              <div
                key={item.title}
                className="outcome-item px-8 py-10 text-center sm:px-10"
              >
                <dt className="font-display text-xl font-semibold tracking-tight text-black sm:text-2xl">
                  {item.title}
                </dt>
                <dd className="mx-auto mt-3 max-w-72 text-sm leading-relaxed text-neutral-500">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
