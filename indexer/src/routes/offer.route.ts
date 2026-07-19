import { app } from "../server";
import { getMyOffers } from "../services/offers";




app.get("/api/offers/:publicKey",async(req,res)=>{
    try {
        const {publicKey} = req.params;
        const offers = await getMyOffers(publicKey);
        return res.status(200).json({
            message:"Successful!",
            data:offers
        })
    } catch (error:any) {
       return  res.status(500).json({error:error.message || "Failed to fetch offers!"})
    }
})