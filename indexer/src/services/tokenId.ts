import prisma from "../../lib/prisma"


export const getTokenIds = async(publicKey:string | null)=>{
    try {
        if(!publicKey){
            throw new Error("Public not found!")
        }
        const tokenIds = await prisma.card.findMany({
            where: {
              owner: publicKey.toString()
            },
            select: {
              tokenId: true,
              name: true
            }
          })
          return tokenIds
    } catch (error) {
        throw error
    }
}