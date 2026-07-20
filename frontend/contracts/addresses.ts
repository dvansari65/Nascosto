export const CONTRACTS = {
  shadowCard: process.env.NEXT_PUBLIC_SHADOW_CARD_ADDRESS!,
  marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
  settlement: process.env.NEXT_PUBLIC_SETTLEMENT_ADDRESS!,
  nasToken: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS,
} as const;
