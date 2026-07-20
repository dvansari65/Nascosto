import { Router } from "express";
import { addEncryptedPriceForSeller, getMyOffers } from "../services/offers";
import { EncryptPriceForSellerInputs } from "../../types/offer";

const router = Router();

router.get("/:publicKey", async (req, res) => {
  try {
    const { publicKey } = req.params;
    const offers = await getMyOffers(publicKey);
    return res.status(200).json({
      message: "Successful!",
      data: offers,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch offers!" });
  }
});

router.post("/encrypt", async (req, res) => {
  console.log("request hit!!");
  try {
    const { encryptedPrice, tokenId, buyer } =
      req.body as EncryptPriceForSellerInputs;
    await addEncryptedPriceForSeller({ encryptedPrice, tokenId, buyer });
    return res.status(200).json({
      message: "Successfully saved encrypted price!",
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch offers!" });
  }
});

export default router;
