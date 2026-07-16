// components/ConnectWalletButton.tsx
"use client";

import { useWallet } from "@/provider/WalletContext";
import { Button } from "@/components/button";

export function ConnectWalletButton() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

  if (isConnected && address) {
    return (
      <Button onClick={disconnectWallet} shadowColor="#a99b89">
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={connectWallet} shadowColor="#e4dae2">
      Connect Wallet
    </Button>
  );
}