"use client";

import { X } from "lucide-react";
import { CardMetadata, CardMetadataUtil } from "@/helpers/cardMetaData";
import { CopyableField } from "@/components/market/copyable-field";
import { SimpleButton } from "@/components/simple-button";
import type { Listing } from "@/services/marketplace.service";

type CardDetailsModalProps = {
  listing: Listing;
  metadata: CardMetadata | null;
  onClose: () => void;
  onMakeOffer: (tokenId: bigint) => void;
  isMakingOffer: boolean,
  isDelisting: boolean
  deList: (tokenId: bigint | string) => void
};

export function CardDetailsModal({
  listing,
  metadata,
  onClose,
  onMakeOffer,
  deList,
  isDelisting,
  isMakingOffer
}: CardDetailsModalProps) {
  const rarity = metadata ? CardMetadataUtil.getAttribute(metadata, "Rarity") : undefined;
  const element = metadata ? CardMetadataUtil.getAttribute(metadata, "Element") : undefined;
  const cardClass = metadata ? CardMetadataUtil.getAttribute(metadata, "Class") : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-display truncate pr-4">
            {metadata?.name ?? `Token #${listing.tokenId.toString()}`}
          </h3>
          <button onClick={onClose} className="shrink-0 text-neutral-400 hover:text-black">
            <X size={18} />
          </button>
        </div>

        {(rarity || element || cardClass) && (
          <div className="flex flex-wrap gap-1 mb-4">
            {rarity && <span className="text-[10px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{rarity}</span>}
            {element && <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{element}</span>}
            {cardClass && <span className="text-[10px] font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{cardClass}</span>}
          </div>
        )}

        <div className="space-y-2 mb-5">
          <CopyableField label="Seller" value={listing.seller} />
          <CopyableField label="Price" value={listing.encryptedPriceHandle} />
        </div>

        <div className="flex flex-col gap-1 justify-center items-center">
          <SimpleButton
            disabled={isMakingOffer || isDelisting}
            isLoading={isMakingOffer}
            className="w-full justify-center text-sm text-white hover:cursor-pointer bg-slate-900"
            onClick={() => {
              onMakeOffer(listing.tokenId);
              onClose();
            }}
          >
            Make Offer
          </SimpleButton>
          <SimpleButton
            isLoading={isDelisting}
            disabled={isMakingOffer || isDelisting}
            className="w-full justify-center text-sm text-white hover:cursor-pointer bg-slate-900"
            onClick={() => {
              deList(listing.tokenId)
              onClose();
            }}
          >
            DeList the Card
          </SimpleButton>
        </div>
      </div>
    </div>
  );
}