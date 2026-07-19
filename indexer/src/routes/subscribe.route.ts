import { app } from "../server";
import { subscribe, totalSubscribed } from "../services/subscribe";
import {Router} from "express"

const router = Router()

router.post("/:email",async(req,res)=>{
    try {
        const {email} = req.params
        const result = await subscribe(email)
        if(result){
            return res.status(200).json({
                message:"Successfully logged in!"
            })
        }
    } catch (error:any) {
        return res.status(500).json({
            error:error.message || "Failed to subscribe!"
        })
    }
})

router.get("/count",async(req,res)=>{
    try {
        const count = await totalSubscribed();
        return res.status(200).json({
            message:"Successfully fetched!",
            data:count
        })
    } catch (error:any) {
        return res.status(500).json({
            message:error.message || "Server error!"
        })
    }
})

export default router