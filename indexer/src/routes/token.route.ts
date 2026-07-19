import { app } from "../server";
import { getTokenIds } from "../services/tokenId";
import {Router} from "express"

const router = Router()

router.get("/:publicKey",async (req,res)=>{
    try {
        const {publicKey} = req.params;
        const tokenIds = await getTokenIds(publicKey);
        return res.status(200).json({
            message:"Token IDs successfully fetched!",
            data:tokenIds
        })
    } catch (error:any) {
        return res.status(500).json({message:error.message || "Failed to fetch tokens!!"})
    }
})


export default router