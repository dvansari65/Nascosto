"use client";

import { useRef } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TickStrip } from "./tick-strip";
// Replace these with your actual 5 card-art export names from "./card-art"
import { Card1Art, Card2Art, Card3Art, Card4Art, Card5Art,Card6Art } from "./card-art";
import { ButtonLink } from "./link";

type HeroCard = {
  Art: ComponentType<{ className?: string; title: string }>;
  title: string;
  className: string;
};

const HERO_CARDS: HeroCard[] = [
  {
    Art: Card1Art,
    title: "Card artwork 1",
    className:
      "left-[15%] top-[6%] z-10 w-[27%] rotate-[-8deg] aspect-[5/7] shadow-[0_20px_45px_-15px_rgba(244,114,182,0.35)]",
  },
  {
    Art: Card2Art,
    title: "Card artwork 2",
    className:
      "left-[36%] top-[2%] z-30 w-[28%]  aspect-[5/7] shadow-[0_25px_55px_-15px_rgba(244,114,182,0.5)]",
  },
  {
    Art: Card3Art,
    title: "Card artwork 3",
    className:
      "right-[15%] top-[6%] z-10 w-[27%] rotate-[9deg] aspect-[5/7] shadow-[0_20px_45px_-15px_rgba(244,114,182,0.35)]",
  },
  {
    Art: Card4Art,
    title: "Card artwork 4",
    className:
      "left-[18%] bottom-[4%] z-20 w-[27%] rotate-[-9deg] aspect-[5/7] shadow-[0_20px_45px_-15px_rgba(236,72,153,0.3)]",
  },
  {
    Art: Card5Art,
    title: "Card artwork 5",
    className:
      "left-[58%] bottom-[4%] z-20 w-[27%] rotate-[9deg] aspect-[5/7] shadow-[0_20px_45px_-15px_rgba(236,72,153,0.3)]",
  },
  {
    Art: Card6Art,
    title: "Card artwork 6",
    className:
      "right-[36%] bottom-[7%] z-20 w-[27%]  aspect-[5/7] shadow-[0_20px_45px_-15px_rgba(236,72,153,0.3)]",
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });

      tl.from(".hero-chip", { y: 16, opacity: 0, duration: 0.6 })
        .from(".hero-line", { y: "110%", opacity: 0, duration: 0.85, stagger: 0.1 }, "-=0.35")
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.45")
        .from(".hero-stat", { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.4")
        .from(".hero-panel", { opacity: 0, scale: 0.97, duration: 0.9, ease: "power2.out" }, "-=0.9")

    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className=" relative  overflow-hidden border-y border-dashed border-neutral-300 bg-white "
    >
      <TickStrip align="left" className="sample-color-4" cells={300} cellSize={5} />
      <TickStrip className="sample-color-4" align="right" cells={300} cellSize={5} />

      <div className="mx-auto grid max-w-350 grid-cols-1 lg:grid-cols-2 lg:px-12">
        {/* Left — reserved for illustration, built separately */}
        <div className="hero-panel bg-pink-glow  relative isolate order-2 min-h-105 overflow-hidden border-t border-dashed border-neutral-300 bg-white lg:order-1 lg:min-h-140 lg:border-t-0 lg:border-r lg:border-dashed lg:border-neutral-300">
          <div className="absolute inset-6 border border-dashed border-neutral-200" />
          <div className="absolute inset-x-10 top-1/2 h-px bg-neutral-200" />
          <div className="absolute inset-y-10 left-1/2 w-px bg-neutral-200" />

          {HERO_CARDS.map(({ Art, className, title }) => (
            <div
              key={title}
              className={`hero-card absolute overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-950 ${className}`}
            >
              <Art title={title} className="h-full w-full" />
            </div>
          ))}
        </div>

        {/* Right — content, full black panel */}
        <div className="order-1 flex flex-col justify-center bg-black px-6 py-16 text-white sm:px-10 lg:order-2 lg:px-16">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block overflow-hidden">
              <span className="hero-line block">Trade rare cards.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block text-white">
                Keep your position <span className="text-white">sealed.</span>
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-6 max-w-md text-lg leading-relaxed text-neutral-400">
            Nascosto is the privacy-first marketplace for digital trading cards.
            List openly, negotiate through encrypted offers, and settle on-chain
            without exposing your price, your position, or your next move.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink className="text-black text-xl" href="#market">Enter the MarketPlace</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}