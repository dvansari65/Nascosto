import { getPublicProvider } from "@/lib/contracts";
import { MarketplaceService } from "@/services/marketplace.service";
import { useQuery } from "@tanstack/react-query"

export const fetchAllCards = () => {
    return useQuery({
        queryKey: ["cards"],
        queryFn: async () => {
            try {
                const provider = getPublicProvider();
                const activeListings = await MarketplaceService.fetchActiveListings(provider);
                
                if(!activeListings){
                    return []
                }
                return activeListings
            } catch (error) {
                console.log("error:",error)
                return []
            }
        },
        staleTime:5 * 60 * 1000
    })
}