import { useState } from "react";
import { ethers } from "ethers";
import { ShadowCardService } from "@/services/shadowcard.service";
import { MarketplaceService } from "@/services/marketplace.service";

type ListDeps = {
  getEthersSigner: () => Promise<ethers.Signer | null>;
  address: string | null | undefined;
};

export function useListCard({ getEthersSigner, address }: ListDeps) {
  const [status, setStatus] = useState("");
  const [isListing, setIsListing] = useState(false);

  const listCard = async (tokenId: string | null): Promise<boolean> => {
    if (!address || !tokenId) return false;
    try {
      setIsListing(true);
      setStatus("Listing...");
      const signer = await getEthersSigner();
      if (!signer) {
        setStatus("Wallet signer unavailable.");
        return false;
      }

      await ShadowCardService.approveSettlement(signer, tokenId);

      // TODO: replace with a real eERC-encrypted amount once the SDK is wired in.
      // Plaintext placeholder for the demo only — see earlier note on this gap.
      const amountInWei = ethers.parseEther("10");
      await MarketplaceService.listCard(signer, tokenId, amountInWei);

      setStatus("Card listed securely!");
      return true;
    } catch (e) {
      console.error(e);
      setStatus("Listing failed.");
      return false;
    } finally {
      setIsListing(false);
    }
  };

  return { status, isListing, listCard };
}