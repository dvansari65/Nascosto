"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useListingsWithMetadata } from "@/hooks/useListingsWithMetadata";
import { TradingCardItem } from "@/components/cards/trading-card";
import { OfferModal } from "@/components/modal/submit-offer";
import { fetchAllCards } from "@/api/cards";
import { submitOffer } from "@/api/submitEncryptOffer";
import { deList } from "@/api/deList";
import { DotsLoader } from "@/components/loaders/dots-loader";

export default function MarketplacePage() {

  const [activeOfferTokenId, setActiveOfferTokenId] = useState<bigint | null>(null);
  const { data: listings, isPending, error, isError } = fetchAllCards()
  const { mutate, isPending: isSubmittingOffer, error: submitOfferError } = submitOffer()
  const cards = useListingsWithMetadata(listings || []);
 
  const { mutate: deListCard, isPending: deListing } = deList()

  const submitEncryptedOffer = async (amount: string) => {
    mutate({ amount, activeOfferTokenId }, {
      onSuccess: () => {
        toast.success("Offer submitted securely!");
        setActiveOfferTokenId(null);
      },
      onError: (e) => {
        toast.error(`Failed to submit offer: ${e.message}`);
      }
    })
  };

  return (
    <div className="mx-auto max-w-350 px-6 lg:px-10 py-12">
      {isPending ? (
        <div className="relative overflow-hidden w-full h-screen  flex justify-center">
          <DotsLoader className="absolute top-[40%] left-[45%]"/>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-12 text-center">
          <p className="text-red-600">{error.message}</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
          <p className="text-neutral-500 mb-4">No cards are currently listed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map(({ listing, metadata, metadataLoading, metadataError }) => (
            <TradingCardItem
              key={listing.tokenId.toString()}
              listing={listing}
              metadata={metadata}
              metadataLoading={metadataLoading}
              metadataError={metadataError}
              onMakeOffer={setActiveOfferTokenId}
              deList={() => deListCard(listing.tokenId)}
              isMakingOffer={isSubmittingOffer}
              isDelisting={deListing}
            />
          ))}
        </div>
      )}
      {activeOfferTokenId !== null && (
        <OfferModal
          tokenId={activeOfferTokenId.toString()}
          onClose={() => setActiveOfferTokenId(null)}
          onSubmit={submitEncryptedOffer}
          isSubmitting={isSubmittingOffer}
        />
      )}
    </div>
  );
}