import { useEthersSigner } from "@/hooks/useEtherSigner";
import { useWallet } from "@/provider/WalletContext";
import { MarketplaceService } from "@/services/marketplace.service";
import { useMutation } from "@tanstack/react-query"
import { ethers } from "ethers";

interface SubmitOfferInputs {
    amount:string,
    activeOfferTokenId:bigint | null
}


export const submitOffer = () => {
    const { isConnected } = useWallet();
    const signer = useEthersSigner()
    return useMutation({
        mutationFn: async ({amount,activeOfferTokenId}:SubmitOfferInputs) => {
            try {
                if(!signer || !isConnected){
                    throw new Error("Connect your wallet!")
                }
                if(!activeOfferTokenId){
                    throw new Error("Provide token ID!")
                }
                if(!amount){
                    throw new Error("Provide amount first!")
                }
                const amountInWei = ethers.parseEther(amount);
                const tx = await MarketplaceService.submitOffer(signer, activeOfferTokenId, amountInWei);
                console.log("submitted offer:",tx)
            } catch (error:any) {
                console.log("ERROR:",error.message)
                throw error
            }
        }
    })
}