"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CardMetadata, CardMetadataUtil } from "@/helpers/cardMetaData";
import { CopyableField } from "@/components/market/copyable-field";
import { SimpleButton } from "@/components/simple-button";
import type { Listing } from "@/services/marketplace.service";

type CardDetailsModalProps = {
  listing: Listing;
  metadata: CardMetadata | null;
  onClose: () => void;
  onMakeOffer: (tokenId: bigint) => void;
  isMakingOffer: boolean;
  isDelisting: boolean;
  deList: (tokenId: bigint | string) => void;
};

export function CardDetailsModal({
  listing,
  metadata,
  onClose,
  onMakeOffer,
  deList,
  isDelisting,
  isMakingOffer,
}: CardDetailsModalProps) {
  const rarity = metadata
    ? CardMetadataUtil.getAttribute(metadata, "Rarity")
    : undefined;
  const element = metadata
    ? CardMetadataUtil.getAttribute(metadata, "Element")
    : undefined;
  const cardClass = metadata
    ? CardMetadataUtil.getAttribute(metadata, "Class")
    : undefined;

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Backdrop fade in
    gsap.from(overlayRef.current, {
      backgroundColor: "rgba(0,0,0,0)",
      backdropFilter: "blur(0px)",
      duration: 0.4,
      ease: "power2.out",
    });

    // Modal slide and scale in
    gsap.from(modalRef.current, {
      y: 40,
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.2)",
      delay: 0.05,
    });
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm rounded-[16px] border border-neutral-200/60 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold font-display tracking-tight text-neutral-900 truncate pr-4">
            {metadata?.name ?? `Token #${listing.tokenId.toString()}`}
          </h3>
          <button
            onClick={onClose}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {(rarity || element || cardClass) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {rarity && (
              <span className="text-[11px] font-medium tracking-wide uppercase bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md border border-neutral-200">
                {rarity}
              </span>
            )}
            {element && (
              <span className="text-[11px] font-medium tracking-wide uppercase bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md border border-neutral-200">
                {element}
              </span>
            )}
            {cardClass && (
              <span className="text-[11px] font-medium tracking-wide uppercase bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md border border-neutral-200">
                {cardClass}
              </span>
            )}
          </div>
        )}

        <div className="space-y-3 mb-8 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
          <CopyableField label="Seller" value={listing.seller} />
          <CopyableField label="Price" value={listing.encryptedPriceHandle} />
        </div>

        <div className="flex flex-col gap-2">
          <SimpleButton
            disabled={isMakingOffer || isDelisting}
            isLoading={isMakingOffer}
            className="w-full justify-center text-[15px] py-2.5 font-medium text-white shadow-sm transition-all hover:bg-neutral-800 bg-neutral-900"
            onClick={() => {
              onMakeOffer(listing.tokenId);
              onClose();
            }}
          >
            Make Encrypted Offer
          </SimpleButton>
          <button
            disabled={isMakingOffer || isDelisting}
            className="w-full justify-center rounded-md py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
            onClick={() => {
              deList(listing.tokenId);
              onClose();
            }}
          >
            {isDelisting ? "Delisting..." : "Delist Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
