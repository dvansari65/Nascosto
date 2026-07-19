"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SimpleButton } from "../simple-button";

type OfferModalProps = {
  tokenId: string;
  onClose: () => void;
  onSubmit: (amount: string) => void;
  isSubmitting: boolean;
};

export function OfferModal({ tokenId, onClose, onSubmit, isSubmitting }: OfferModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Backdrop fade in
    gsap.from(overlayRef.current, {
      backgroundColor: "rgba(0,0,0,0)",
      backdropFilter: "blur(0px)",
      duration: 0.4,
      ease: "power2.out"
    });

    // Modal slide and scale in
    gsap.from(modalRef.current, {
      y: 40,
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.2)",
      delay: 0.05
    });
  }, []);

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    setError("");
    onSubmit(amount);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-sm rounded-[16px] border border-neutral-200/60 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold font-display tracking-tight text-neutral-900">
            Make an Offer
          </h3>
          <button onClick={onClose} className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
          You are making an offer on <span className="font-mono text-neutral-900 font-medium bg-neutral-100 px-1 py-0.5 rounded">Token #{tokenId}</span>. 
          Your offer amount is strictly encrypted on-chain before submission.
        </p>

        <div className="space-y-2 mb-6">
          <div className="relative">
            <input
              type="number"
              autoFocus
              step="any"
              min="0"
              placeholder="Offer amount (e.g. 1.5)"
              className={`w-full rounded-lg border ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500/20"} bg-neutral-50 px-4 py-3 text-base text-neutral-900 outline-none transition-all focus:ring-4`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="text-sm font-medium text-neutral-400">AVAX</span>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 font-medium px-1">{error}</p>}
        </div>

        <SimpleButton
          disabled={isSubmitting || !amount}
          isLoading={isSubmitting}
          className="w-full justify-center text-[15px] py-2.5 font-medium text-white shadow-sm transition-all hover:bg-neutral-800 bg-neutral-900"
          onClick={handleSubmit}
        >
          {isSubmitting ? "Encrypting & Submitting..." : "Submit Encrypted Offer"}
        </SimpleButton>
      </div>
    </div>
  );
}