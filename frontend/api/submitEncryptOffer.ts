import { useEthersSigner } from "@/hooks/useEtherSigner";
import { useWallet } from "@/provider/WalletContext";
import { MarketplaceService } from "@/services/marketplace.service";
import { useMutation } from "@tanstack/react-query";
import { savePriceForSeller } from "./http";
import { toast } from "sonner";

export interface SubmitOfferInputs {
  amount: string;
  activeOfferTokenId: bigint | null;
  sellerKey: string;
}

export const submitOffer = () => {
  const { isConnected } = useWallet();
  const { address } = useWallet();
  const signer = useEthersSigner();
  return useMutation({
    mutationFn: async ({
      amount,
      activeOfferTokenId,
      sellerKey,
    }: SubmitOfferInputs) => {
      try {
        if (!signer || !isConnected) {
          throw new Error("Connect your wallet!");
        }
        if (!activeOfferTokenId) {
          throw new Error("Provide token ID!");
        }
        if (!amount) {
          throw new Error("Provide amount first!");
        }
        if (!sellerKey) {
          throw new Error("Please provide seller's key!");
        }
        if (!address) {
          throw new Error("Please connect your wallet!");
        }
        await MarketplaceService.submitOffer(
          signer,
          activeOfferTokenId,
          amount,
        );
        toast.success("Offer submitted!");
        await savePriceForSeller({
          encryptedPrice: amount.toString(),
          tokenId: Number(activeOfferTokenId),
          buyer: address,
        });
      } catch (error: any) {
        console.log("ERROR:", error.message);
        throw error;
      }
    },
  });
};
