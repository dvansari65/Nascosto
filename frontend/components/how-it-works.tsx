import { ChevronRight } from "lucide-react";
import { Button } from "./button";
import { TickStrip } from "./tick-strip";

export const HOW_IT_WORKS = [
  {
    id: 1,
    title: "List Your Card",
    description:
      "Create a confidential listing for your trading card without revealing the asking price to the public.",
  },
  {
    id: 2,
    title: "Receive Encrypted Offers",
    description:
      "Interested buyers submit private offers that only you can decrypt and review.",
  },
  {
    id: 3,
    title: "Accept the Best Offer",
    description:
      "Compare all confidential bids and choose the buyer without exposing negotiations.",
  },
  {
    id: 4,
    title: "Private Settlement",
    description:
      "The buyer completes payment using Avalanche eERC, keeping the transaction amount encrypted.",
  },
  {
    id: 5,
    title: "Transfer Ownership",
    description:
      "Ownership of the trading card is securely transferred on-chain while trade details remain private.",
  },
];

export const HowItWorks = () => {
  return (
    <>
      <TickStrip
        className="relative w-full sample-color-4 text-gray-300 "
        cells={200}
        cellSize={6}
        height={80}
        orientation="horizontal"
      />

      <section className="relative w-full h-[80vh] overflow-hidden">
        {/* Don't touch */}

        <div className="absolute inset-0 bg-pink-100">
          <div className="pt-16">
            <div className="ml-28">
              <h2 className="text-4xl font-medium tracking-[-0.03em]">
                How It Works
              </h2>
            </div>

            {/* Horizontal Scroll */}
            <div
              className="
          mt-12
          overflow-x-auto
          overflow-y-hidden
          scrollbar-none
          scroll-smooth
        "
            >
              {/* Connected Table */}
              <div
                className="
            ml-28
            inline-flex
            border
            border-neutral-300
            bg-white
          "
              >
                {HOW_IT_WORKS.map((item, index) => (
                  <div
                    key={item.id}
                    className={`
                flex
                h-[250px]
                w-[300px]
                shrink-0
                flex-col
                justify-between
                items-start
                px-4 pb-3
                ${
                  index !== HOW_IT_WORKS.length - 1
                    ? "border-r sample-color-5"
                    : ""
                }
              `}
                  >
                    <div>
                      <h3
                        className="
                    mt-8
                    text-2xl
                    leading-tight
                    font-medium
                    
                    tracking-[-0.02em]
                    text-neutral-900
                    
                  "
                      >
                        {item.title}
                      </h3>

                      <p
                        className="
                    mt-2
                    text-[15px]
                    leading-9
                    text-neutral-500
                  "
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom */}
                    <Button
                      className="flex justify-center items-center"
                      width={36}
                      height={30}
                    >
                      <ChevronRight size={40} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
