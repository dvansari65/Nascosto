"use client";
// hooks/useEthersSigner.ts
import { useWallet } from "@/provider/WalletContext";
import { useMemo } from "react";

export function useEthersSigner() {
  const { signer, isConnected, connectWallet, disconnectWallet } = useWallet();

  const updatedSigner = useMemo(() => {
    return signer;
  }, [signer, isConnected, connectWallet, disconnectWallet]);

  return updatedSigner;
}
