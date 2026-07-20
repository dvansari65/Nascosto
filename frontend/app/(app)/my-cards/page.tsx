"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/provider/WalletContext";
import { Button } from "@/components/button";
import { Copy, Check, Layers } from "lucide-react";
import { getMyTokens } from "@/api/http";

function CopyTokenId({ tokenId }: { tokenId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tokenId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition-colors"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy Token ID"}
    </button>
  );
}

export default function MyCardsPage() {
  const { isConnected, address, getEthersSigner, connectWallet } = useWallet();
  const [readProvider, setReadProvider] = useState<ethers.Signer | null>(null);
  const { data: tokensIds, isPending } = getMyTokens(address?.toString());

  useEffect(() => {
    if (!isConnected) return;
    getEthersSigner().then(setReadProvider);
  }, [isConnected, getEthersSigner]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <h1 className="text-3xl font-display mb-6">
          Connect to view your cards
        </h1>
        <Button onClick={connectWallet} shadowColor="#e4dae2">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-350 px-6 lg:px-10 py-12">
      <h1 className="text-4xl font-bold mb-4 font-display">My Cards</h1>
      <p className="text-neutral-600 mb-10 max-w-2xl text-lg">
        Every card you've minted, synced live from the indexer. Copy a Token ID
        to use it on the List a Card panel.
      </p>

      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 bg-white p-6 h-40 animate-pulse"
            >
              <div className="h-4 w-20 bg-neutral-100 rounded mb-4" />
              <div className="h-3 w-32 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      ) : tokensIds?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
          <Layers className="mx-auto mb-3 text-neutral-300" size={28} />
          <p className="text-neutral-500">You haven't minted any cards yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokensIds?.map((card: any) => {
            const tokenIdStr = card.tokenId.toString();
            return (
              <div
                key={tokenIdStr}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Token #{tokenIdStr}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-1">Name:</p>
                  <p className="text-sm font-medium text-neutral-800 break-words mb-4">
                    {card.name || "Untitled Card"}
                  </p>
                </div>
                <CopyTokenId tokenId={tokenIdStr} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
