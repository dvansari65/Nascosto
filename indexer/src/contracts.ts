import { ethers } from "ethers";
import ShadowCardArtifact from "./abis/ShadowCard.json";
import MarketplaceArtifact from "./abis/ShadowCardsMarketplace.json";
import SettlementArtifact from "./abis/ConfidentialSettlement.json";
import NasToken from "./abis/NasToken.json"

export const CONTRACT_ADDRESSES = {
  SHADOW_CARD: process.env.NEXT_PUBLIC_SHADOW_CARD_ADDRESS || "",
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
  SETTLEMENT: process.env.NEXT_PUBLIC_SETTLEMENT_ADDRESS || "",
  MINT_TOKEN:process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || ""
};

export function getPublicProvider() {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
  return new ethers.JsonRpcProvider(rpcUrl);
}

export function getShadowCardContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  if(!CONTRACT_ADDRESSES.SHADOW_CARD){
    return
  }
  return new ethers.Contract(CONTRACT_ADDRESSES.SHADOW_CARD, ShadowCardArtifact.abi, providerOrSigner);
}

export function getMarketplaceContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESSES.MARKETPLACE, MarketplaceArtifact.abi, providerOrSigner);
}

export function getSettlementContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESSES.SETTLEMENT, SettlementArtifact.abi, providerOrSigner);
}

export const getMintToken = (providerOrSigner: ethers.Provider | ethers.Signer)=>{
  return new ethers.Contract(CONTRACT_ADDRESSES.MINT_TOKEN,NasToken.abi,providerOrSigner)
}
