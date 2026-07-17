import { ethers } from "hardhat";

async function main() {
  const marketplaceAddr = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "0x95CA0a568236fC7413Cd2b794A7da24422c2BBb6";
  const shadowCardAddr = process.env.NEXT_PUBLIC_SHADOW_CARD_ADDRESS || "0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407";

  const Marketplace = await ethers.getContractAt("ShadowCardsMarketplace", marketplaceAddr);

  console.log("Fetching listings 1 to 10...");
  for (let i = 1; i <= 10; i++) {
    try {
      const listing = await Marketplace.listings(shadowCardAddr, i);
      console.log(`Token ID: ${i} -> Status: ${listing.status}, Seller: ${listing.seller}`);
    } catch (e) {
      console.error(`Error on ID ${i}:`, e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
