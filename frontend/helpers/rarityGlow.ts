import { CardMetadata } from "@/helpers/cardMetaData";
import { getTrait } from "@/helpers/cardRarity";

const RARITY_GLOW: Record<string, string> = {
  common: "#9ca3af",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f97316",
  mythic: "#ec4899",
};

export function getRarityGlow(metadata: CardMetadata | null): { color: string; isHolo: boolean } {
  const rarity = (getTrait(metadata, "rarity") || "").toLowerCase();
  if (rarity === "one of one") return { color: "", isHolo: true };
  return { color: RARITY_GLOW[rarity] ?? RARITY_GLOW.common, isHolo: false };
}