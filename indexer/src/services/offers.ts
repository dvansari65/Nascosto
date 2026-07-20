import prisma from "../../lib/prisma"
import { EncryptPriceForSellerInputs } from "../../types/offer"

export const getMyOffers = async(publicKey:string)=>{
    try {
      // TODO: add pagintion
        const offers = await prisma.offer.findMany({
            where: {
              seller: publicKey.toString()
            },
            select: {
              tokenId: true,
              buyer: true,
              encryptedForSeller: true,
              encryptedAmountHandle:true,
              status: true,
              seller:true,
              card: {
                select: {
                  image: true,
                  name: true
                }
              }
            }
          })
          console.log("offers:",offers)
          return offers
    } catch (error) {
        throw error
    }
}


export const addEncryptedPriceForSeller = async ({
  encryptedPrice,
  tokenId,
  buyer
}:EncryptPriceForSellerInputs)=>{
  try {
    if(!encryptedPrice || !tokenId || !buyer){
      throw new Error("Provide encrypted seller price")
    }
    const result = await prisma.offer.upsert({
      where:{
        tokenId_buyer:{
          tokenId,
          buyer
        }
      },
      update: {
        encryptedForSeller:encryptedPrice,
      },
      create: {
        tokenId: Number(tokenId),
        buyer,
        seller: "",              // placeholder, filled by event listener when it arrives
        encryptedAmountHandle: "", // placeholder, filled by event listener when it arrives
        encryptedForSeller:encryptedPrice,
        status: "Pending",
      },
    })
  } catch (error) {
    
  }
}