import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { getShadowCardContract } from "@/lib/contracts";
import { toast } from "sonner";

async function fetchOwner(providerOrSigner: ethers.Signer | ethers.Provider): Promise<string> {
  const contract = getShadowCardContract(providerOrSigner);
  if (!contract) {
    throw new Error("ShadowCard contract not configured.");
  }
  const owner = await contract.owner();
  return owner;
}

export function useIsContractOwner(
  address: string | null | undefined,
  providerOrSigner: ethers.Signer | ethers.Provider | null
) {
  const { data: ownerAddress, isLoading } = useQuery({
    queryKey: ["shadowCardOwner"],
    queryFn: () => {
      if(!providerOrSigner){
        toast.error("Signer missing!")
        return
      }
      const owner = fetchOwner(providerOrSigner);
      console.log("owner :",owner)
      return owner
    },
    enabled: Boolean(providerOrSigner),
    staleTime: Infinity, // contract owner never changes at runtime, no need to refetch
  });

  const isOwner = Boolean(
    address && ownerAddress && address.toLowerCase() === ownerAddress.toLowerCase()
  );

  return { isOwner, isLoading };
}