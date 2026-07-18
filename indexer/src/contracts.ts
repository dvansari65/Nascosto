import { ethers } from "ethers";
import ShadowCardArtifact from "./abis/ShadowCard.json";
import MarketplaceArtifact from "./abis/ShadowCardsMarketplace.json";
import SettlementArtifact from "./abis/ConfidentialSettlement.json";
import NasToken from "./abis/NasToken.json"
import dotenv from "dotenv"

dotenv.config()

export const CONTRACT_ADDRESSES = {
  SHADOW_CARD: process.env.SHADOW_CARD_ADDRESS || "",
  MARKETPLACE: process.env.MARKETPLACE_ADDRESS || "",
  SETTLEMENT: process.env.SETTLEMENT_ADDRESS || "",
  MINT_TOKEN:process.env.PAYMENT_TOKEN_ADDRESS || ""
};

export function getPublicProvider() {
  const rpcUrl = "wss://api.avax-test.network/ext/bc/C/ws";
  return new ethers.WebSocketProvider(rpcUrl);
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
