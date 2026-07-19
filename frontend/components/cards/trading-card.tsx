"use client";

import { useState } from "react";
import { CardMetadata } from "@/helpers/cardMetaData";
import type { Listing } from "@/services/marketplace.service";
import { getTrait, getRarityStyle } from "@/helpers/cardRarity";
import { getRarityGlow } from "@/helpers/rarityGlow";
import { CardDetailsModal } from "../modal/card-details-modal";
import { CardArtwork } from "./card-artwork";
import { TitleOfCard } from "./name";

type TradingCardItemProps = {
    listing: Listing;
    metadata: CardMetadata | null;
    metadataLoading: boolean;
    metadataError: string | null;
    onMakeOffer: (tokenId: bigint) => void;
    deList: (tokenId: bigint | string) => void,
    isMakingOffer: boolean,
    isDelisting: boolean
};

export function TradingCardItem({
    listing,
    metadata,
    metadataLoading,
    metadataError,
    onMakeOffer,
    deList,
    isMakingOffer,
    isDelisting
}: TradingCardItemProps) {
    const [detailsOpen, setDetailsOpen] = useState(false);

    const rarity = getRarityStyle(metadata);
    const glow = getRarityGlow(metadata);
    const sport = getTrait(metadata, "sport");
    const edition = getTrait(metadata, "edition");
    const subtitle = [sport, edition].filter(Boolean).join(" · ");

    const openDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDetailsOpen(true);
    };

    return (
        <>
            <div
                className="group relative flex flex-col overflow-hidden rounded-[5px] border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                role="button"
                tabIndex={0}
                onClick={() => setDetailsOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setDetailsOpen(true);
                }}
            >
                <div
                    className={`card-mat ${glow.isHolo ? "card-mat--holo" : ""} p-2.5`}
                    style={!glow.isHolo ? ({ "--glow-color": glow.color } as React.CSSProperties) : undefined}
                >
                    <div className="relative z-[1] overflow-hidden rounded-[4px]">
                        <CardArtwork
                            metadata={metadata}
                            metadataLoading={metadataLoading}
                            metadataError={metadataError}
                            onDetailsClick={openDetails}
                        />
                    </div>
                </div>

                <div className="flex justify-center items-center px-4 pb-3 pt-2">
                    <TitleOfCard name={metadata?.name}/>
                </div>
            </div>

            {detailsOpen && (
                <CardDetailsModal
                    isDelisting={isDelisting}
                    isMakingOffer={isMakingOffer}
                    deList={deList}
                    listing={listing}
                    metadata={metadata}
                    onClose={() => setDetailsOpen(false)}
                    onMakeOffer={onMakeOffer}
                />
            )}
        </>
    );
}