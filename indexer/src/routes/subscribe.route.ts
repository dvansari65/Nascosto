import { app } from "../server";
import { subscribe } from "../services/subscribe";



app.post("/api/subscribe/:email",async(req,res)=>{
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