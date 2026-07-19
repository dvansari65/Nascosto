import { Offer } from "@/types/offer";
import { TokenData } from "@/types/token";
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner";


const BACKEND_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export const getMyOffers = (publicKey:string | undefined)=>{
    return useQuery({
        queryKey:["offers",publicKey],
        queryFn:async():Promise<Offer[] | []>=>{
            try {
                if(!publicKey){
                    return []
                }
                const result = await fetch(`${BACKEND_URL}/api/offers/${publicKey.toString()}`);
                const data = await result.json()
                if(!result.ok){
                    toast.error(data.message || "Failed to fetch offers!")
                    return []
                }
                return data.data
            } catch (error) {
                throw error
            }
        }
    })
}

export const useSubscribe = ()=>{
    return useMutation({
        mutationFn:async(email:string)=>{
            try {
                if(!email){
                    throw new Error("Email not found!")
                }
                const result = await fetch(`${BACKEND_URL}/api/subcribe/${email.toString()}`)
                const data = await result.json();
                if(!result.ok){
                    throw new Error(data.message || "Failed to subscribe!")
                }
                return data
            } catch (error) {
                throw error
            }
        }
    })
}


export const getMyTokens = (publicKey:string | undefined)=>{
    return useQuery({
        queryKey:["tokenIds",publicKey],
        queryFn:async():Promise<TokenData[] | []>=>{
            try {
                if(!publicKey){
                    return []
                }
                const result = await fetch(`${BACKEND_URL}/api/tokenIds/${publicKey.toString()}`);
                const data = await result.json();
                if(!result.ok){
                    throw new Error(data.message || "Failed to fetch tokens IDs!")
                }
                return data.data
            } catch (error) {
                throw error
            }
        }
    })
}

