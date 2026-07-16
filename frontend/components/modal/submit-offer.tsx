"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SimpleButton } from "../simple-button";

type OfferModalProps = {
  tokenId: string;
  onClose: () => void;
  onSubmit: (amount: string) => Promise<void>;
  isSubmitting: boolean;
};

export function OfferModal({ tokenId, onClose, onSubmit, isSubmitting }: OfferModalProps) {
  const [amount, setAmount] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-display">Make an Offer</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-black">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-4">Token #{tokenId} — your offer amount is encrypted before it's submitted.</p>
        <input
          type="number"
          autoFocus
          placeholder="Offer (e.g. 1.5)"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="w-full flex justify-center items-center">
        <SimpleButton
          className= "text-white bg-black hover:cursor-pointer"
          disabled={isSubmitting || !amount}
          onClick={() => onSubmit(amount)}
        >
          {isSubmitting ? "Submitting..." : "Submit Offer"}
        </SimpleButton>
        </div>
      </div>
    </div>
  );
}