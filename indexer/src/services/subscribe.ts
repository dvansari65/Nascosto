import prisma from "../../lib/prisma"



export const subscribe = async(email:string | null)=>{
    try {
        if(!email){
            throw new Error("Email not found!")
        }
        const result = await prisma.subscribe.create({
            data: {
              email
            }
        })
        return result
    } catch (error) {
        throw error
    }
}