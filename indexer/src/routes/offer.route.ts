import { app } from "../server";
import {Router} from "express"
import { getMyOffers } from "../services/offers";

const router = Router()


router.get("/:publicKey",async(req,res)=>{
    try {
        const {publicKey} = req.params;
        const offers = await getMyOffers(publicKey);
        return res.status(200).json({
            message:"Successful!",
            data:offers
        })
    } catch (error:any) {
       return  res.status(500).json({message:error.message || "Failed to fetch offers!"})
    }
})

export default router