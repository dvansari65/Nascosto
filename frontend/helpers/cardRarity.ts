import type { CardMetadata } from "@/helpers/cardMetaData";

export type RarityKey = "common" | "rare" | "epic" | "legendary";

export type RarityStyle = {
    label: string;
    edge: string;
    badge: string;
    dot: string;
};

export const RARITY_STYLES: Record<RarityKey, RarityStyle> = {
    common: {
        label: "Common",
        edge: "from-neutral-300 via-neutral-400 to-neutral-300",
        badge: "bg-neutral-100 text-neutral-600 ring-neutral-200",
        dot: "bg-neutral-400",
    },
    rare: {
        label: "Rare",
        edge: "from-sky-300 via-sky-500 to-sky-300",
        badge: "bg-sky-50 text-sky-700 ring-sky-200",
        dot: "bg-sky-500",
    },
    epic: {
        label: "Epic",
        edge: "from-violet-300 via-violet-500 to-violet-300",
        badge: "bg-violet-50 text-violet-700 ring-violet-200",
        dot: "bg-violet-500",
    },
    legendary: {
        label: "Legendary",
        edge: "from-amber-300 via-amber-500 to-amber-300",
        badge: "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
    },
};

/**
 * Reads a trait off either an OpenSea-style `attributes` array
 * or a flat field on the metadata object.
 * Adjust the accessor here if your metadata shape differs —
 * everything downstream only depends on this function.
 */
export function getTrait(metadata: CardMetadata | null, key: string): string | undefined {
    if (!metadata) return undefined;

    const flat = (metadata as Record<string, unknown>)
}


export function getRarityStyle(metadata: CardMetadata | null): RarityStyle {
    const value = getTrait(metadata, "rarity")?.toLowerCase();
    const key: RarityKey =
        value === "rare" || value === "epic" || value === "legendary" ? value : "common";
    return RARITY_STYLES[key];
}
