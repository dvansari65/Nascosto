import { useEffect, useState } from "react";
import { ethers } from "ethers";
import type { Listing } from "@/services/marketplace.service";
import { ShadowCardService } from "@/services/shadowcard.service";
import { CardMetadata, fetchCardMetadata } from "@/helpers/cardMetaData";

export type ListingWithMetadata = {
  listing: Listing;
  metadata: CardMetadata | null;
  metadataLoading: boolean;
  metadataError: string | null;
};

export function useListingsWithMetadata(
  listings: Listing[],
  providerOrSigner: ethers.Signer | ethers.Provider | null
) {
  const [items, setItems] = useState<ListingWithMetadata[]>([]);

  useEffect(() => {
    if (!providerOrSigner || listings.length === 0) {
      setItems([]);
      return;
    }

    let cancelled = false;

    // Seed immediately so the grid renders per-card loading state right away,
    // instead of one big spinner for the whole page.
    setItems(
      listings.map((listing) => ({
        listing,
        metadata: null,
        metadataLoading: true,
        metadataError: null,
      }))
    );

    listings.forEach(async (listing, index) => {
      try {
        const tokenUri = await ShadowCardService.getTokenURI(providerOrSigner, listing.tokenId);
        const metadata = await fetchCardMetadata(tokenUri);
        if (cancelled) return;
        setItems((current) => {
          const next = [...current];
          next[index] = { listing, metadata, metadataLoading: false, metadataError: null };
          return next;
        });
      } catch (e: any) {
        if (cancelled) return;

        console.error(`Failed to load metadata for token ${listing.tokenId}:`, e);
        
        setItems((current) => {
          const next = [...current];
          next[index] = {
            listing,
            metadata: null,
            metadataLoading: false,
            metadataError: e?.message || "Failed to load card metadata",
          };
          return next;
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [listings, providerOrSigner]);

  return items;
}