"use client";

import { getMyOffers, useAcceptOffer } from "@/api/http";
import { DotsLoader } from "@/components/loaders/dots-loader";
import OfferPriceModal from "@/components/modal/price";
import { SimpleButton } from "@/components/simple-button";
import { useWallet } from "@/provider/WalletContext";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useEthersSigner } from "@/hooks/useEtherSigner";
import { toast } from "sonner";
export default function OfferPage() {
  const { address } = useWallet();
  const {
    data: offers,
    isPending,
    isError,
    error,
  } = getMyOffers(address?.toString());
  const [isOfferPriceModalOpen, setIsOfferPriceModal] = useState({
    isOpen: false,
    price: "",
  });

  const signer = useEthersSigner();
  const {
    mutate: acceptOffer,
    isPending: isAccepting,
    variables,
  } = useAcceptOffer();

  const handleAcceptClick = (tokenId: number, buyer: string) => {
    if (!signer) {
      toast.error("Wallet not connected");
      return;
    }
    acceptOffer({ signer, tokenId, buyer });
  };

  const statusColors = (status: string | null) => {
    if (!status) {
      return "";
    }
    if (status == "Pending") {
      return "text-red-500 bg-red-100";
    }
    if (status == "Accepted") {
      return "text-green-500 bg-green-100";
    }
    if (status == "WithDrawn") {
      return "text-amber-500 bg-amber-100";
    }
  };

  if (!isPending && offers?.length == 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-3xl">
        Oops! There's no offers!
      </div>
    );
  }
  if (isPending) {
    return (
      <div className="relative overflow-hidden w-full h-screen  flex justify-center">
        <DotsLoader className="absolute top-[40%] left-[45%]" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-3xl">
        {error.message || "Failed to fetch Offers!"}
      </div>
    );
  }

  return (
    <div className="w-full h-screen py-4 px-2">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-5">
        {offers?.map((offer, i) => (
          <div
            className="flex flex-col gap-1.5 p-3 border rounded-xl"
            key={offer.tokenId ?? i}
          >
            {offer.card?.image && (
              <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-neutral-100 my-2">
                <img
                  src={offer.card.image}
                  alt={offer.card.name || "Trading Card"}
                  className=" object-cover"
                />
              </div>
            )}
            <div className="bg-white flex items-center justify-start ">
              <div
                className={`${offer.status && statusColors(offer.status)} rounded-xl p-1 px-2 text-xs font-semibold`}
              >
                {offer.status && offer.status.toString()}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold shrink-0">Token ID:</span>
              <span className="truncate">{offer.tokenId}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold shrink-0">Buyer:</span>
              <button
                onClick={() => navigator.clipboard.writeText(offer?.buyer)}
                className="flex items-center gap-1 truncate rounded bg-neutral-100 px-1.5 py-0.5 text-xs hover:bg-neutral-200"
              >
                <span className="truncate">{`${offer.buyer.slice(0, 6)}...${offer.buyer.slice(-4)}`}</span>
                <Copy size={11} className="shrink-0 opacity-50" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold shrink-0">Offered Price:</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(offer.encryptedAmountHandle)
                }
                className="flex items-center gap-1 truncate rounded bg-neutral-100 px-1.5 py-0.5 text-xs hover:bg-neutral-200"
              >
                <span className="truncate">{`${offer.encryptedAmountHandle.slice(0, 6)}...${offer.encryptedAmountHandle.slice(-4)}`}</span>
                <Copy size={11} className="shrink-0 opacity-50" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold shrink-0">Name:</span>
              <span>{offer.card?.name || ""}</span>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
              <SimpleButton
                isLoading={
                  isAccepting &&
                  variables?.tokenId === offer.tokenId &&
                  variables?.buyer === offer.buyer
                }
                disabled={
                  (isAccepting &&
                    variables?.tokenId === offer.tokenId &&
                    variables?.buyer === offer.buyer) ||
                  offer.status !== "Pending"
                }
                onClick={() => handleAcceptClick(offer.tokenId, offer.buyer)}
                className="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 text-sm py-2"
              >
                {isAccepting &&
                variables?.tokenId === offer.tokenId &&
                variables?.buyer === offer.buyer
                  ? "Accepting..."
                  : offer.status === "Pending"
                    ? "Accept Offer"
                    : "Offer Processed"}
              </SimpleButton>
              <SimpleButton
                onClick={() =>
                  setIsOfferPriceModal({
                    isOpen: true,
                    price: offer.encryptedForSeller,
                  })
                }
                className="w-full justify-center bg-neutral-100 text-slate-900 hover:bg-neutral-200 text-sm py-2"
              >
                Decrypt Offer Price
              </SimpleButton>
            </div>
          </div>
        ))}
      </div>
      {isOfferPriceModalOpen.isOpen && (
        <OfferPriceModal
          price={isOfferPriceModalOpen.price}
          isOpen={isOfferPriceModalOpen.isOpen}
          onClose={() => setIsOfferPriceModal({ isOpen: false, price: "" })}
        />
      )}
    </div>
  );
}
