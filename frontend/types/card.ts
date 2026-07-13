export const SPORTS = [
  "Football",
  "Cricket",
  "Basketball",
  "Tennis",
  "Baseball",
  "Formula 1",
  "MMA",
  "Hockey",
  "Rugby",
  "Other",
] as const;

export type Sport = (typeof SPORTS)[number];

export const RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Mythic",
  "One of One",
] as const;

export type Rarity = (typeof RARITIES)[number];

export type CardForm = {
  // Identity
  title: string;
  description: string;

  // Classification
  sport: Sport;
  series: string;
  edition: string;

  // Collectibility
  rarity: Rarity;
  totalCopies: number;

  // Asset
  imageUri: string;
};