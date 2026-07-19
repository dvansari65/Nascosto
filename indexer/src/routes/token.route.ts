import { app } from "../server";
import { getTokenIds } from "../services/tokenId";



app.get("/api/tokenIds/:publicKey",async (req,res)=>{
    try {
        const {publicKey} = req.params;
        const tokenIds = await getTokenIds(publicKey);
        return res.status(200).json({
            message:"Token IDs successfully fetched!",
            data:tokenIds
        })
    } catch (error:any) {
        return res.status(500).json({error:error.message || "Failed to fetch tokens!!"})
    }
})
