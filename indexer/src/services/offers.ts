import prisma from "../../lib/prisma"

export const getMyOffers = async(publicKey:string)=>{
    try {
      console.log("Get my offers triggered!")
        const offers = await prisma.offer.findMany({
            where: {
              seller: publicKey.toString()
            },
            select: {
              tokenId: true,
              buyer: true,
              encryptedAmountHandle: true,
              status: true,
              card: {
                select: {
                  image: true,
                  name: true
                }
              }
            }
          })
          return offers
    } catch (error) {
        throw error
    }
}