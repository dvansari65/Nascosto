import { Card } from "./card";

export interface Offer {
  tokenId: number;
  encryptedForSeller: string;
  encryptedAmountHandle: string;
  buyer: string;
  seller?: string;
  status: string;
  card: Card;
}
