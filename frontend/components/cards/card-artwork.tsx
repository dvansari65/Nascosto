"use client";

import { MoreVertical, Lock, Sparkles } from "lucide-react";
import { CardMetadata } from "@/helpers/cardMetaData";
import { toPreviewSrc } from "@/helpers/preview";
import { getRarityStyle, getTrait } from "@/helpers/cardRarity";

type CardArtworkProps = {
    metadata: CardMetadata | null;
    metadataLoading: boolean;
    metadataError: string | null;
    onDetailsClick: (e: React.MouseEvent) => void;
};

export function CardArtwork({
    metadata,
    metadataLoading,
    metadataError,
    onDetailsClick,
}: CardArtworkProps) {
    const rarity = getRarityStyle(metadata);

    if (metadataLoading) {
        return (
            <div className="aspect-[5/7] w-full animate-pulse bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100" />
        );
    }

    if (metadataError) {
        return (
            <div className="flex aspect-[5/7] w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="h-8 w-8 rounded-full bg-red-50 ring-1 ring-red-100" />
                <p className="text-xs text-red-500">{metadataError}</p>
            </div>
        );
    }

    if (!metadata) {
        return (
            <div className="flex aspect-[5/7] w-full items-center justify-center bg-neutral-50">
                <Sparkles className="text-neutral-300" size={20} />
            </div>
        );
    }

    const sport = getTrait(metadata, "sport");

    return (
        <div className="relative aspect-[5/7] w-full overflow-hidden bg-neutral-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={toPreviewSrc(metadata.image, { fit: "cover" })}
                alt={metadata.name}
                className="h-full w-full object-cover "
                loading="lazy"
            />

            {/* Holo foil sweep — mimics a tilted foil card catching light */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100"
                style={{ mixBlendMode: "overlay" }}
            />

            <button
                onClick={onDetailsClick}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white opacity-0 shadow-sm ring-1 ring-inset ring-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 group-hover:opacity-100"
                aria-label="Card details"
            >
                <MoreVertical size={16} strokeWidth={2.5} />
            </button>
            {sport && (
                <span className="sr-only">{sport}</span>
            )}
        </div>
    );
}