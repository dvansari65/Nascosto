"use client";

import { useRef } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TickStrip } from "./tick-strip";
import { ArcaneCardArt, DroneCardArt, MorokhCardArt } from "./card-art";

type HeroCard = {
  Art: ComponentType<{ className?: string; title: string }>;
  title: string;
  className: string;
};

const HERO_CARDS: HeroCard[] = [
  {
    Art: MorokhCardArt,
    title: "Morokh card artwork",
    className:
      "left-[7%] top-[11%] z-20 w-[58%] rotate-[-10deg] aspect-[706/310]",
  },
  {
    Art: DroneCardArt,
    title: "Drone card artwork",
    className:
      "right-[7%] top-[19%] z-30 w-[46%] rotate-[8deg] aspect-[600/620]",
  },
  {
    Art: ArcaneCardArt,
    title: "Arcane card artwork",
    className:
      "bottom-[9%] left-[25%] z-10 w-[43%] rotate-[4deg] aspect-[402/600]",
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
      <TickStrip align="left" />
      <TickStrip align="right" />

      <div className="mx-auto grid max-w-350 grid-cols-1 lg:grid-cols-2 lg:px-12">
        {/* Left — reserved for illustration, built separately */}
        <div className="hero-panel relative isolate order-2 min-h-105 overflow-hidden border-t border-dashed border-neutral-300 bg-white lg:order-1 lg:min-h-140 lg:border-t-0 lg:border-r lg:border-dashed lg:border-neutral-300">
          <div className="absolute inset-6 border border-dashed border-neutral-200" />
          <div className="absolute inset-x-10 top-1/2 h-px bg-neutral-200" />
          <div className="absolute inset-y-10 left-1/2 w-px bg-neutral-200" />

          {HERO_CARDS.map(({ Art, className, title }) => (
            <div
              key={title}
              className={`hero-card group absolute overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-950 shadow-[0_25px_60px_-12px_rgba(10,10,10,0.25)] transition-all duration-500 hover:z-50 hover:scale-105 hover:shadow-[0_35px_80px_-15px_rgba(244,114,182,0.35)] hover:border-pink-300/60 hover:-translate-y-2 ${className}`}
            >
              <Art title={title} className="h-full w-full" />
            </div>
          ))}
        </div>

        {/* Right — content, full black panel */}
        <div className="order-1 flex flex-col justify-center bg-black px-6 py-16 text-white sm:px-10 lg:order-2 lg:px-16">
          <div className="hero-chip mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5">
            <span className="size-1.5 rounded-full bg-pink-300" />
            <span className="font-mono text-xs uppercase tracking-wide text-neutral-300">
              Confidential marketplace · Avalanche
            </span>
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block overflow-hidden">
              <span className="hero-line block">Trade rare cards.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block text-neutral-400">
                Keep your position <span className="text-pink-300">sealed.</span>
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-6 max-w-md text-lg leading-relaxed text-neutral-400">
            Segreto is the privacy-first marketplace for digital trading cards.
            List openly, negotiate through encrypted offers, and settle on-chain
            without exposing your price, your position, or your next move.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="#marketplace"
              className="hero-cta group inline-flex items-center gap-2 rounded-full bg-pink-200 px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-pink-300"
            >
              Enter the marketplace
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="hero-cta inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
