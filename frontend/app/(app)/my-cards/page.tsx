"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/provider/WalletContext";
import { useMyCards } from "@/hooks/useMyCards";
import { Button } from "@/components/button";
import { Copy, Check } from "lucide-react";

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
      className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy Token ID"}
    </button>
  );
}

export default function MyCardsPage() {
  const { isConnected, address, getEthersSigner, connectWallet } = useWallet();
  const [readProvider, setReadProvider] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    if (!isConnected) return;
    getEthersSigner().then(setReadProvider);
  }, [isConnected, getEthersSigner]);

  const { cards, loading, error } = useMyCards(address, readProvider);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <h1 className="text-3xl font-display mb-6">Connect to view your cards</h1>
        <Button onClick={connectWallet} shadowColor="#e4dae2">Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-350 px-6 lg:px-10 py-12">
      <h1 className="text-4xl font-bold mb-4 font-display">My Cards</h1>
      <p className="text-neutral-600 mb-10 max-w-2xl text-lg">
        Every card you've minted, pulled directly from on-chain history. Copy a Token ID to use it on the List a Card panel.
      </p>

      {loading ? (
        <p className="text-neutral-500">Loading your cards from the blockchain...</p>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
          <p className="text-neutral-500">You haven't minted any cards yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const tokenIdStr = card.tokenId.toString();
            return (
              <div
                key={tokenIdStr}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Token #{tokenIdStr}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-1">Content Hash:</p>
                  <p className="text-xs font-mono text-neutral-700 break-all mb-4">
                    {card.contentHash}
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