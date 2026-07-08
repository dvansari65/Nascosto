import Link from "next/link";
import { TickStrip } from "./tick-strip";

const FEATURES = [
  {
    value: "Confidential Listings",
    description:
      "List a card without exposing your reserve price or negotiation floor to the public order book.",
    href: "#marketplace",
    linkLabel: "Explore listings",
  },
  {
    value: "Encrypted Offers",
    description:
      "Buyers submit offers that only the seller can decrypt. No front-running, no copycat bids, no visible bid history.",
    href: "#how-it-works",
    linkLabel: "See how offers work",
  },
  {
    value: "Confidential Settlement",
    description:
      "Trades settle on-chain through eERC, so the final agreed price never touches a public ledger.",
    href: "#security",
    linkLabel: "Read the settlement flow",
  },
  {
    value: "On-chain Ownership",
    description:
      "Every card's provenance and transfer history stays verifiable on Avalanche, even when the terms stay private.",
    href: "#security",
    linkLabel: "Explore ownership proofs",
  },
];

export function Features() {
  return (
    <section className="border-y border-dashed border-neutral-300 bg-black px-6 py-20 lg:px-20 lg:py-28">
      <div className="mx-auto max-w-350">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Segreto keeps <span className="text-pink-300">what&apos;s private, private.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-400">
            Every listing is public. Every negotiation is not. Here&apos;s what
            stays sealed at each step of a trade.
          </p>
        </div>

        <div className="relative grid grid-cols-1 border-t border-l border-neutral-600 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.value}
              className="border-r border-b border-neutral-600 px-8 py-10 text-center"
            >
              <h3 className="font-display text-2xl font-semibold text-pink-300 sm:text-3xl">
                {feature.value}
              </h3>
              <p className="mx-auto mt-4 max-w-64 text-sm leading-relaxed text-neutral-400">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-5 inline-flex items-center gap-1 text-sm text-pink-300 underline decoration-pink-300/40 underline-offset-4"
              >
                {feature.linkLabel}
                <span aria-hidden="true">›</span>
              </Link>
            </div>
          ))}

          <div className="absolute inset-y-0 left-3/4 hidden w-px lg:block">
            <TickStrip
                className="text-neutral-600"
              align="left"
              orientation="vertical"
              cells={80}
              cellSize={6}
              width={32}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
