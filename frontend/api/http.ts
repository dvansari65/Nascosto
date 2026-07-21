import { Offer } from "@/types/offer";
import { TokenData } from "@/types/token";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MarketplaceService } from "@/services/marketplace.service";
import { ethers } from "ethers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const getMyOffers = (publicKey: string | undefined) => {
  return useQuery({
    queryKey: ["offers", publicKey],
    queryFn: async (): Promise<Offer[] | []> => {
      try {
        if (!publicKey) {
          return [];
        }
        const result = await fetch(
          `${BACKEND_URL}/api/offers/${publicKey.toString()}`,
        );
        console.log("result:", result);
        const data = await result.json();
        if (!result.ok) {
          toast.error(data.message || "Failed to fetch offers!");
          return [];
        }
        const offers = data?.data;
        return offers;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!publicKey,
  });
};

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        if (!email) {
          throw new Error("Email not found!");
        }
        if (!BACKEND_URL) {
          return;
        }
        console;
        const result = await fetch(
          `${BACKEND_URL}/api/subscribe/${email.toString()}`,
          {
            method: "POST",
          },
        );
        const data = await result.json();
        if (!result.ok) {
          throw new Error(data.message || "Failed to subscribe!");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const getMyTokens = (publicKey: string | undefined) => {
  return useQuery({
    queryKey: ["tokenIds", publicKey],
    queryFn: async (): Promise<TokenData[] | []> => {
      try {
        if (!publicKey) {
          return [];
        }
        const result = await fetch(
          `${BACKEND_URL}/api/tokenIds/${publicKey.toString()}`,
        );
        const data = await result.json();
        if (!result.ok) {
          throw new Error(data.message || "Failed to fetch tokens IDs!");
        }
        return data.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!publicKey,
  });
};

export const totalSubscribed = () => {
  return useQuery({
    queryKey: ["count"],
    queryFn: async () => {
      try {
        const result = await fetch(`${BACKEND_URL}/api/subscribe/count`);
        const data = await result.json();
        if (!result.ok) {
          throw new Error(data.message || "Failed to fetch count!");
        }
        console.log("counts:", data.data);
        return data.data;
      } catch (error: any) {
        console.log("error:", error.message);
        throw error;
      }
    },
  });
};

interface EncryptPriceForSellerInputs {
  encryptedPrice: string;
  tokenId: number;
  buyer: string;
}

export const savePriceForSeller = async ({
  encryptedPrice,
  tokenId,
  buyer,
}: EncryptPriceForSellerInputs) => {
  try {
    if (!encryptedPrice) {
      throw new Error("Please provide encrypted price!");
    }
    const result = await fetch(`${BACKEND_URL}/api/offers/encrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encryptedPrice,
        tokenId,
        buyer,
      }),
    });
    const data = await result.json();
    if (!result.ok) {
      throw new Error(data.message || "Failed to save encrypted price in DB!");
    }
    return data.message;
  } catch (error) {
    throw error;
  }
};

interface AcceptOfferInputs {
  signer: ethers.Signer;
  tokenId: string | number;
  buyer: string;
}

export const useAcceptOffer = () => {
  return useMutation({
    mutationFn: async ({ signer, tokenId, buyer }: AcceptOfferInputs) => {
      if (!signer) throw new Error("Wallet not connected");
      await MarketplaceService.acceptOffer(
        signer,
        BigInt(tokenId),
        buyer,
        "0x",
      );
      return true;
    },
    onSuccess: () => {
      toast.success(
        "Offer accepted successfully! Transaction is being processed on-chain.",
      );
    },
    onError: (error: any) => {
      console.error("Accept error:", error);
      toast.error(error.message || "Failed to accept offer");
    },
  });
};
