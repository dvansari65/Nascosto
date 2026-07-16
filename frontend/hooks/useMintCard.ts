import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { toast } from "sonner";
import { uploadFileToIPFS, unpinFromIPFS, extractCidFromUri } from "@/pinata/uploadToIpfs";
import { ShadowCardService } from "@/services/shadowcard.service";
import type { CardForm } from "@/types/card";
import { buildCardMetadata } from "@/helpers/buildCardMetaData";
import {BN} from "bn.js"
type MintDeps = {
  getEthersSigner: () => Promise<ethers.Signer | null>;
  address: string | null | undefined;
};

type MintResult = {
  success: boolean;
  imageRolledBack: boolean;
  tokenId:bigint | null
};

export function useMintCard({ getEthersSigner, address }: MintDeps) {
  const mutation = useMutation({
    mutationKey: ["mintCard", address],
    mutationFn: async (cardForm: CardForm): Promise<MintResult> => {
      if (!address) {
        toast.error("Connect your wallet first.");
        return { success: false, imageRolledBack: false ,tokenId:null};
      }
      if (!cardForm.title.trim() || !cardForm.description.trim() || !cardForm.imageUri.trim()) {
        toast.error("Name, description, and an uploaded image are required.");
        return { success: false, imageRolledBack: false , tokenId:null};
      }

      let metadataCid: string | null = null;
      const toastId = toast.loading("Preparing metadata...");

      try {
        const signer = await getEthersSigner();
        if (!signer) {
          toast.error("Wallet signer unavailable. Try reconnecting.", { id: toastId });
          return { success: false, imageRolledBack: false,tokenId:null };
        }

        const metadata = buildCardMetadata(cardForm);
        const metadataJson = JSON.stringify(metadata);
        const metadataFile = new File(
          [metadataJson],
          `${cardForm.title.trim().replace(/\s+/g, "-").toLowerCase()}-metadata.json`,
          { type: "application/json" }
        );

        const metadataUpload = await uploadFileToIPFS(metadataFile);
        metadataCid = metadataUpload.cid;
        const hash = ethers.keccak256(ethers.toUtf8Bytes(metadataJson));

        const tokenId = await ShadowCardService.mintCard(signer, address, metadataUpload.ipfsUri, hash);
        
        if(!tokenId){
          throw new Error("Token= id not found!")
        }
       
        return { success: true, imageRolledBack: false, tokenId };
      } catch (e: any) {
        console.error("Mint failed:", e);

        if (metadataCid) {
          await unpinFromIPFS(metadataCid);
        }
        const imageCid = extractCidFromUri(cardForm.imageUri);
        if (imageCid) {
          await unpinFromIPFS(imageCid);
        }

        const message =
          e?.code === "ACTION_REJECTED"
            ? "Transaction rejected in wallet."
            : e?.message || "Mint failed. Please try again.";
        toast.error(message, { id: toastId });

        return { success: false, imageRolledBack: Boolean(imageCid) , tokenId:null};
      }
    },
  });

  return {
    isMinting: mutation.isPending,
    mintCard: mutation.mutateAsync,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}