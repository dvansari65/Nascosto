import { JsonRpcProvider } from "ethers";
import { avalancheFuji } from "@/lib/wagmi";

// Shared read-only provider for the entire application.
// Used for fetching blockchain state without requiring a connected wallet.

export const publicProvider = new JsonRpcProvider(
  avalancheFuji.rpcUrls.default.http[0],
  {
    chainId: avalancheFuji.id,
    name: avalancheFuji.name,
  },
);
