"use client";
// hooks/useEthersSigner.ts
import { useWallet } from "@/provider/WalletContext";
import { useMemo } from "react";

export function useEthersSigner() {
  const { signer } = useWallet();

  const updatedSigner = useMemo(() => {
    return signer;
  }, [signer]);

  return updatedSigner;
}
