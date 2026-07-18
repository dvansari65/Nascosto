"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { TickStrip } from "./tick-strip";

const ACCORDION_ITEMS = [
    {
        id: 1,
        title: "Confidential Listings",
        points: [
            "Hide asking prices from the public order book.",
            "Prevent competitors from tracking your pricing strategy.",
            "Only authorized participants can view listing details.",
        ],
    },
    {
        id: 2,
        title: "Encrypted Offers",
        points: [
            "Buyers submit offers only the seller can decrypt.",
            "Sellers privately compare bids — no public bidding wars.",
            "Offer history stays off the public ledger.",
        ],
    },
    {
        id: 3,
        title: "Confidential Settlement",
        points: [
            "Payments settled using Avalanche's eERC standard.",
            "Final sale price never appears on the public ledger.",
            "Settlement is final, verifiable, and private.",
        ],
    },
    {
        id: 4,
        title: "Secure Ownership",
        points: [
            "Ownership transfers on-chain after confidential settlement.",
            "Financial information stays private throughout.",
            "Provenance is verifiable without exposing trade terms.",
        ],
    },
];

// Source artwork is a portrait-oriented illustration with a native
// viewBox of 892 x 1174 (aspect ratio ≈ 0.76). Rather than cropping it
// into a mismatched landscape box, the card is sized to that exact
// ratio (440 wide -> 579 tall) so the full artwork is visible edge to
// edge with zero cropping and zero distortion.
const PORTRAIT_SRC = "/card-4.svg";
const PORTRAIT_WIDTH = 440;
const PORTRAIT_HEIGHT = 460; // 440 * (1174 / 892), rounded

export const ForWho = () => {
    const [activeId, setActiveId] = useState(4);

    return (
        <section className="relative w-full bg-white px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-20 lg:py-28">
            <div className="lg:ml-15">

                {/* Heading — left-aligned, two lines */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.5rem]">
                        Nascosto is built for collectors
                    </h2>
                    <h2 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-pink-300 sm:text-5xl lg:text-[3.5rem]">
                        who can&apos;t afford to have their strategy exposed.
                    </h2>
                </div>

                {/* Main card */}
                <div className="w-full flex justify-start">
                    <div className="flex w-full flex-col items-start border-t border-gray-300 lg:flex-row lg:justify-center">
                        {/* ① Tick strip rail — pairs with the portrait art, so it only makes sense from lg up */}
                        <div className="hidden border border-gray-300 lg:flex">
                            <div className=" relative  " style={{ width: 50 }}>
                                <TickStrip
                                    className="border-neutral-300 h-full "
                                    orientation="horizontal"
                                    align="left"
                                    cells={140} cellSize={6} width={48}
                                />
                            </div>

                            {/* ② Portrait card — sized to the artwork's own aspect ratio, so nothing is ever cropped */}
                            <div
                                className="relative hidden shrink-0 overflow-hidden bg-neutral-950 lg:block"
                                style={{ width: PORTRAIT_WIDTH, height: PORTRAIT_HEIGHT }}
                            >
                                <img
                                    src={PORTRAIT_SRC}
                                    alt="Portrait illustration representing a Nascosto collector"
                                    className="absolute inset-0 h-full w-full object-contain object-center"
                                    draggable={false}
                                />
                            </div>
                        </div>
                        <div className="w-full overflow-hidden border-x border-b border-gray-300 lg:w-[70vh] lg:border lg:border-t-transparent lg:border-l-transparent lg:border-b-transparent">
                            {ACCORDION_ITEMS.map((item) => {
                                const isActive = activeId === item.id;

                                return (
                                    <div key={item.id} className="border-b border-gray-300">
                                        <button
                                            onClick={() =>
                                                setActiveId((prev) => (prev === item.id ? 4 : item.id))
                                            }
                                            className="flex w-full items-center gap-3 px-6 py-5 text-left transition-colors "
                                        >
                                            <ChevronRight
                                                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isActive ? "rotate-90" : ""
                                                    }`}
                                            />

                                            <span className="text-xl font-medium">{item.title}</span>
                                        </button>

                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <ul className=" px-6 pt-2 pb-6 sm:px-10 lg:px-14 sample-color-4 border-t border-gray-300 ">
                                                    {item.points.map((point) => (
                                                        <li
                                                            key={point}
                                                            className={`flex items-start gap-2.5 text-[15px] leading-7 font-normal text-neutral-500 `}
                                                        >
                                                            <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* ③ Accordion */}

                    </div>
                </div>
            </div>
        </section>
    );
};