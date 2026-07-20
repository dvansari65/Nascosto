import { useEthersSigner } from "@/hooks/useEtherSigner";
import { useIsContractOwner } from "@/hooks/useIsContractOwner";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { useWallet } from "@/provider/WalletContext";
import { MarketplaceService } from "@/services/marketplace.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const deList = () => {
  const client = useQueryClient();
  const { address } = useWallet();
  const signer = useEthersSigner();
  const isOwner = useIsContractOwner(address, signer);
  return useMutation({
    mutationFn: async (tokenId: string | bigint) => {
      try {
        if (!isOwner) {
          throw new Error("Invalid user! You can't invoke this action!");
        }
        if (!tokenId) {
          throw new Error("Token ID missing!");
        }
        if (!signer) {
          throw new Error("Connect your wallet!");
        }
        console.log("token id :", tokenId);
        console.log("market place address:", CONTRACT_ADDRESSES.MARKETPLACE);
        await MarketplaceService.delistCard(
          signer,
          CONTRACT_ADDRESSES.SHADOW_CARD,
          tokenId,
        );
      } catch (error: any) {
        console.log("error:", error.message);

        throw error;
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Delisted successfully!");
    },
    onError: (e) => {
      toast.error(e.message || "Something went wrong!");
    },
  });
};
