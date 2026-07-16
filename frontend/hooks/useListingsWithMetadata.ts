import { useEffect, useState } from "react";
import { ethers } from "ethers";
import type { Listing } from "@/services/marketplace.service";
import { ShadowCardService } from "@/services/shadowcard.service";
import { CardMetadata, fetchCardMetadata } from "@/helpers/cardMetaData";
import { getPublicProvider } from "@/lib/contracts";

export type ListingWithMetadata = {
  listing: Listing;
  metadata: CardMetadata | null;
  metadataLoading: boolean;
  metadataError: string | null;
};

export function useListingsWithMetadata(
  listings: Listing[]
) {
  const [items, setItems] = useState<ListingWithMetadata[]>([]);

  // Stable string to prevent infinite loops if the parent passes new array references (like listings || [])
  const listingsKey = listings.map(l => l.tokenId.toString()).join(",");

  useEffect(() => {
    if (listings.length === 0) {
      setItems((prev) => prev.length === 0 ? prev : []);
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
        const provider = getPublicProvider();
        const tokenUri = await ShadowCardService.getTokenURI(provider, listing.tokenId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingsKey]);

  return items;
}