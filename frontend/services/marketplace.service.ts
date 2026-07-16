import { ethers } from "ethers";
import { getMarketplaceContract, CONTRACT_ADDRESSES } from "@/lib/contracts";
import { encryptAmount } from "@/encryption/eerc";

export interface Listing {
  tokenId: bigint;
  seller: string;
  status: number;
  encryptedPriceHandle: string;
}

export class MarketplaceService {
  /**
   * Encrypts the asking price on the client side and lists the token on the marketplace.
   */
  static async listCard(signer: ethers.Signer, tokenId: string | bigint, priceInWei: bigint) {
    // 1. Client-side encryption
    const encryptedPriceHandle = await encryptAmount(priceInWei, signer);

    // 2. Submit listing transaction
    const contract = getMarketplaceContract(signer);
    const tx = await contract.listCard(CONTRACT_ADDRESSES.SHADOW_CARD, tokenId, encryptedPriceHandle);
    return tx.wait();
  }

  /**
   * Encrypts the buyer's offer on the client side and submits it to the marketplace.
   */
  static async submitOffer(signer: ethers.Signer, tokenId: string | bigint, offerInWei: bigint) {
    // 1. Client-side encryption
    const encryptedOfferHandle = await encryptAmount(offerInWei, signer);

    // 2. Submit offer transaction
    const contract = getMarketplaceContract(signer);
    const tx = await contract.submitOffer(CONTRACT_ADDRESSES.SHADOW_CARD, tokenId, encryptedOfferHandle);
    return tx.wait();
  }

  /**
   * Fetches the first 10 active listings from the marketplace contract.
   */
  static async fetchActiveListings(providerOrSigner: ethers.Signer | ethers.Provider): Promise<Listing[]> {
    const contract = getMarketplaceContract(providerOrSigner);
    const activeListings: Listing[] = [];

    for (let i = 1; i <= 10; i++) {
      try {
        const listing = await contract.listings(CONTRACT_ADDRESSES.SHADOW_CARD, i);
        if (Number(listing.status) === 1) { // Status 1 = Listed
          activeListings.push({
            tokenId: BigInt(i),
            seller: listing.seller,
            status: Number(listing.status),
            encryptedPriceHandle: listing.encryptedPriceHandle
          });
        }
      } catch (e) {
        // Contract call failed (e.g. out of bounds)
        break;
      }
    }
    return activeListings;
  }

  /**
   * Accepts an offer for a listed card, triggering the atomic settlement.
   * Requires a zk-SNARK proof of the seller's decryption matching the buyer's offer.
   */
  static async acceptOffer(
    signer: ethers.Signer,
    tokenId: string | bigint,
    buyer: string,
    proof: string = "0x"
  ) {
    const contract = getMarketplaceContract(signer);
    // Passing "0x" as a dummy proof if client-side proof generation isn't hooked up yet
    const tx = await contract.acceptOffer(CONTRACT_ADDRESSES.SHADOW_CARD, tokenId, buyer, proof);
    return tx.wait();
  }

  static async delistCard(
    signer: ethers.Signer,
    nftContract: string,
    tokenId: string | bigint
  ): Promise<void> {
    const contract = getMarketplaceContract(signer);
    if (!contract) {
      throw new Error("Marketplace contract not configured");
    }

    try {
      const tx = await contract.delistCard(nftContract, tokenId);
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        throw new Error("Delist transaction failed or was reverted");
      }

      const delistedLog = receipt?.logs?.map((log: any) => {
        try {
          console.log("logs:", log)
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
        .find((parsed: any) => parsed?.name === "CardDelisted");

      if (!delistedLog) {
        throw new Error("Delist succeeded but CardDelisted event was not found");
      }
    } catch (error: any) {
      if (error.data) {
        console.log(contract.interface.parseError(error.data));
        throw new Error(contract.interface.parseError(error.data)?.name)
      }
      throw error
    }
  }
}
