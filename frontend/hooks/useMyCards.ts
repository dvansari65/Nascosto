import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { getShadowCardContract } from "@/lib/contracts";
import { getLogsInChunks } from "@/helpers/getLogInChunks";
import { DEPLOYMENT_BLOCK } from "@/constants/blockNumber";

export type MyCard = {
  tokenId: bigint;
  contentHash: string;
};

async function fetchMyCards(
  address: string,
  providerOrSigner: ethers.Signer | ethers.Provider
): Promise<MyCard[]> {
  const contract = getShadowCardContract(providerOrSigner);
  if (!contract) {
    throw new Error("ShadowCard contract not configured.");
  }

  const provider =
    "provider" in providerOrSigner && providerOrSigner.provider
      ? providerOrSigner.provider
      : (providerOrSigner as ethers.Provider);

  const filter = contract.filters.CardMinted(null, address);
  const events = await getLogsInChunks(contract, filter, DEPLOYMENT_BLOCK, provider);
  const data = events.map((e: any) => ({
    tokenId: e.args.tokenId as bigint,
    contentHash: e.args.contentHash as string,
  }));
  console.log("my cards:",data)
  return data 
}

export function useMyCards(
  address: string | null | undefined,
  providerOrSigner: ethers.Signer | ethers.Provider | null
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myCards", address],
    queryFn: () => fetchMyCards(address!, providerOrSigner!),
    enabled: Boolean(address && providerOrSigner),
  });

  return {
    cards: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}