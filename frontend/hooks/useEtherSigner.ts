// hooks/useEthersSigner.ts
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useWallet } from "@/provider/WalletContext";

export function useEthersSigner() {
  const { status } = useAccount(); // "connecting" | "reconnecting" | "connected" | "disconnected"
  const { address, getEthersSigner } = useWallet();
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    if (status !== "connected" || !address) {
      setSigner(null);
      return;
    }

    let cancelled = false;
    getEthersSigner().then((s) => {
      if (!cancelled) setSigner(s);
    });

    return () => {
      cancelled = true;
    };
  }, [status, address, getEthersSigner]);

  return signer;
}
