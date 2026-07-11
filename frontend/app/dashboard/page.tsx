"use client";

import { useState } from "react";
import { useWallet } from "@/provider/WalletContext";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useMintCard } from "@/hooks/useMintCard";
import { useListCard } from "@/hooks/useListCard";
import { Button } from "@/components/button";
import { ListCardPanel } from "@/components/dashboard/ListCardPanel";
import { useCardForm } from "@/hooks/useForm";
import { CreateCardPanel } from "@/components/dashboard/create-card-panel";

export default function DashboardPage() {
  const { isConnected, address, getEthersSigner, connectWallet } = useWallet();
  const { cardForm, updateCardForm, resetCardForm } = useCardForm();
  const { isUploading: isUploadingImage, uploadImage } = useImageUpload();
  const { isMinting, mintCard } = useMintCard({ getEthersSigner, address });
  const { status: listStatus, isListing, listCard } = useListCard({ getEthersSigner, address });
  const [tokenIdToList, setTokenIdToList] = useState("");

  const handleImageSelect = async (file?: File) => {
    if (!file) return;
    const uri = await uploadImage(file);
    if (uri) {
      updateCardForm("imageUri", uri);
    }
  };

  const handleMint = async () => {
    const result = await mintCard(cardForm);
    if (result.success) {
      resetCardForm();
    } else if (result.imageRolledBack) {
      // Image was unpinned as part of rollback — clear it so the form
      // doesn't keep pointing at a file that no longer exists on IPFS.
      updateCardForm("imageUri", "");
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <h1 className="text-3xl font-display mb-6">Connect to view Dashboard</h1>
        <Button onClick={connectWallet} shadowColor="#e4dae2">Connect Wallet</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-350 px-6 lg:px-10 py-12">
      <h1 className="text-4xl font-bold mb-8 font-display">Collector Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CreateCardPanel
          cardForm={cardForm}
          onFieldChange={updateCardForm}
          onImageSelect={handleImageSelect}
          isUploadingImage={isUploadingImage}
          isMinting={isMinting}
          onMint={handleMint}
        />
        <ListCardPanel
          tokenId={tokenIdToList}
          onTokenIdChange={setTokenIdToList}
          isListing={isListing}
          listStatus={listStatus}
          onList={() => listCard(tokenIdToList)}
        />
      </div>
    </div>
  );
}