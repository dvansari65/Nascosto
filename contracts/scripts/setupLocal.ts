import { ethers } from "hardhat";

async function main() {
  const userAddress = "0x9B45001b34bE6B08cF7381C81B5Db3F39c8b6dC1";
  console.log(`Setting up local environment for user: ${userAddress}`);

  // 1. Fund with local AVAX
  const [deployer] = await ethers.getSigners();
  console.log("Funding 100 AVAX...");
  await deployer.sendTransaction({
    to: userAddress,
    value: ethers.parseEther("100.0"),
  });
  console.log("✅ 100 AVAX sent!");

  // 2. Fund with NasToken (Mock eERC20)
  const nasTokenAddr = process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || "0xA4cD3b0Eb6E5Ab5d8CE4065BcCD70040ADAB1F00";
  const NasToken = await ethers.getContractAt("NasToken", nasTokenAddr);
  console.log("Minting 10,000 NasToken...");
  await NasToken.mint(userAddress, ethers.parseEther("10000.0"));
  console.log("✅ 10,000 NasToken minted!");

  // 3. Mint ShadowCards
  const shadowCardAddr = process.env.NEXT_PUBLIC_SHADOW_CARD_ADDRESS || "0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407";
  const ShadowCard = await ethers.getContractAt("ShadowCard", shadowCardAddr);
  console.log("Minting 3 ShadowCards...");
  
  // Create 3 dummy cards
  const cards = [
    { uri: "ipfs://dummy_metadata_1", hash: ethers.keccak256(ethers.toUtf8Bytes("Card1")) },
    { uri: "ipfs://dummy_metadata_2", hash: ethers.keccak256(ethers.toUtf8Bytes("Card2")) },
    { uri: "ipfs://dummy_metadata_3", hash: ethers.keccak256(ethers.toUtf8Bytes("Card3")) },
  ];

  for (let i = 0; i < cards.length; i++) {
    const tx = await ShadowCard.mintCard(userAddress, cards[i].uri, cards[i].hash);
    await tx.wait();
    console.log(`✅ ShadowCard #${i + 1} minted!`);
  }

  console.log("\nSetup complete! You can now test the frontend locally.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
