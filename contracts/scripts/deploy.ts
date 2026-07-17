import { ethers } from "hardhat";

async function main() {
  
  // 0. Deploy NasToken (Mock eERC20 Payment Token)
  const NasToken = await ethers.getContractFactory("NasToken");
  const nasToken = await NasToken.deploy();
  await nasToken.waitForDeployment();
  const nasTokenAddr = await nasToken.getAddress();
  console.log(`✅ NasToken (Mock eERC) deployed to: ${nasTokenAddr}`);

  // 1. Deploy ShadowCard (NFT)
  const ShadowCard = await ethers.getContractFactory("ShadowCard");
  const shadowCard = await ShadowCard.deploy();
  await shadowCard.waitForDeployment();
  const shadowCardAddr = await shadowCard.getAddress();
  console.log(`✅ ShadowCard deployed to: ${shadowCardAddr}`);

  // 2. Deploy ConfidentialSettlement
  const ConfidentialSettlement = await ethers.getContractFactory("ConfidentialSettlement");
  const settlement = await ConfidentialSettlement.deploy();
  await settlement.waitForDeployment();
  const settlementAddr = await settlement.getAddress();
  console.log(`✅ ConfidentialSettlement deployed to: ${settlementAddr}`);

  // 3. Deploy ShadowCardsMarketplace
  const Marketplace = await ethers.getContractFactory("ShadowCardsMarketplace");
  const marketplace = await Marketplace.deploy(settlementAddr, nasTokenAddr);
  await marketplace.waitForDeployment();
  const marketplaceAddr = await marketplace.getAddress();
  console.log(`✅ ShadowCardsMarketplace deployed to: ${marketplaceAddr}`);

  // 4. Link Settlement to Marketplace
  console.log("Linking ConfidentialSettlement to Marketplace...");
  const tx = await settlement.setMarketplace(marketplaceAddr);
  await tx.wait();
  console.log("✅ Settlement linked successfully!");

  console.log("\nDeployment Complete! Update your frontend/.env.local with these addresses:");
  console.log(`NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=${nasTokenAddr}`);
  console.log(`NEXT_PUBLIC_SHADOW_CARD_ADDRESS=${shadowCardAddr}`);
  console.log(`NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddr}`);
  console.log(`NEXT_PUBLIC_SETTLEMENT_ADDRESS=${settlementAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
