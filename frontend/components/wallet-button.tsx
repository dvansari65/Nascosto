// components/ConnectWalletButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/provider/WalletContext";
import { Button } from "@/components/button";

export function ConnectWalletButton() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    try {
      connectWallet();
    } catch (e) {
      // Silently ignored here since this component has no error-display
      // slot — if you need visible feedback, use the full WalletButton
      // in the navbar instead, which already handles this.
      console.error("Wallet connection failed:", e);
    }
  };

  // Server render and the client's first paint both hit this branch,
  // since `mounted` starts false on both — no diff, no hydration warning.
  // Only after hydration completes does it re-render with the real
  // connected state, if there is one.
  if (mounted && isConnected && address) {
    return (
      <Button onClick={disconnectWallet} shadowColor="#a99b89">
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} shadowColor="#e4dae2">
      Connect Wallet
    </Button>
  );
}
