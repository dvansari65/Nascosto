import { Offer } from "@/types/offer";
import { TokenData } from "@/types/token";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

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
  });
};

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        if (!email) {
          throw new Error("Email not found!");
        }
        const result = await fetch(
          `${BACKEND_URL}/api/subcribe/${email.toString()}`,
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

export const encryptPriceForSeller = async ({
  encryptedPrice,
  tokenId,
  buyer,
}: EncryptPriceForSellerInputs) => {
  try {
    if (!encryptPriceForSeller) {
      throw new Error("Please provide encrypted price!");
    }
    const result = await fetch(`${BACKEND_URL}/api/offer/encrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encryptPriceForSeller,
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
