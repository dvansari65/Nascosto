"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWalletClient,
} from "wagmi";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { Client } from "viem";

interface WalletContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  getEthersSigner: () => Promise<JsonRpcSigner | null>;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Converts a wagmi/viem Client into an ethers.JsonRpcSigner, for the
// contract calls (marketplace, NFT) that still expect an ethers signer.
function clientToSigner(client: Client) {
  const { account, chain, transport } = client;
  if (!account || !chain) return null;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  return new JsonRpcSigner(provider, account.address);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();

  const getEthersSigner = async () => {
    if (!walletClient) return null;
    return clientToSigner(walletClient);
  };

  const connectWallet = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected");
    if (!injectedConnector) {
      alert("Please install an Avalanche-compatible wallet like Core or MetaMask.");
      return;
    }
    connect({ connector: injectedConnector });
  };

  const disconnectWallet = () => disconnect();

  const value = useMemo(
    () => ({ address, isConnected, getEthersSigner, connectWallet, disconnectWallet }),
    [address, isConnected, walletClient]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

