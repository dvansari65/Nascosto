import { Card } from "./card";

export interface Offer {
    tokenId: number,
    encryptedAmountHandle: string,
    buyer: string,
    status: string,
    card: Card
  }