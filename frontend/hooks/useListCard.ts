import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { ShadowCardService } from "@/services/shadowcard.service";
import { MarketplaceService } from "@/services/marketplace.service";

type ListDeps = {
  getEthersSigner: () => Promise<ethers.Signer | null>;
  address: string | null | undefined;
};

type ListArgs = {
  tokenId: string | null;
  price: string;
};

export function useListCard({ getEthersSigner, address }: ListDeps) {
  return useMutation({
    mutationFn: async ({ tokenId, price }: ListArgs) => {
      if (!address) {
        throw new Error("Wallet not connected.");
      }
      if (!tokenId || !price || Number(price) <= 0) {
        throw new Error("Invalid Token ID or Price.");
      }

      const signer = await getEthersSigner();
      if (!signer) {
        throw new Error("Wallet signer unavailable.");
      }

      // Approve the Marketplace to handle the specific Token ID
      await ShadowCardService.approveSettlement(signer, tokenId);

      // Convert the plaintext string to Wei, then list and encrypt
      const amountInWei = ethers.parseEther(price);
      await MarketplaceService.listCard(signer, tokenId, amountInWei);

      return true;
    },
  });
}
