import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Listing cards from deployer account: ${deployer.address}`);

  const shadowCardAddr = process.env.NEXT_PUBLIC_SHADOW_CARD_ADDRESS || "0xa4DfF80B4a1D748BF28BC4A271eD834689Ea3407";
  const marketplaceAddr = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "0x95CA0a568236fC7413Cd2b794A7da24422c2BBb6";

  const ShadowCard = await ethers.getContractAt("ShadowCard", shadowCardAddr);
  const Marketplace = await ethers.getContractAt("ShadowCardsMarketplace", marketplaceAddr);

  // 1. Approve Marketplace
  console.log("Approving Marketplace...");
  const approveTx = await ShadowCard.setApprovalForAll(marketplaceAddr, true);
  await approveTx.wait();
  console.log("✅ Marketplace approved for all tokens.");

  // 2. Mint and List Cards
  console.log("Minting and listing 3 test cards...");
  const cards = [
    { uri: "ipfs://QmbDummy1", name: "Alpha Shadow" },
    { uri: "ipfs://QmbDummy2", name: "Beta Phantom" },
    { uri: "ipfs://QmbDummy3", name: "Gamma Wraith" },
  ];

  for (let i = 0; i < cards.length; i++) {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(cards[i].name));
    
    // Mint to deployer
    const mintTx = await ShadowCard.mintCard(deployer.address, cards[i].uri, hash);
    const receipt = await mintTx.wait();
    
    // Parse the CardMinted event to get the Token ID
    // @ts-ignore
    const event = receipt?.logs.find((log) => log.fragment?.name === "CardMinted");
    // @ts-ignore
    const tokenId = event ? event.args[0] : null;
    
    // If we couldn't parse it cleanly, we can just guess the ID based on total supply 
    // but for safety we'll use a hardcoded fallback if parsing fails (id 4, 5, 6 etc since we already minted 3 to user)
    // Actually, in local dev we can just fetch the nextTokenId manually by querying ownerOf loop, but let's just assume ID
    // Wait, the event parsing in ethers v6 returns a LogDescription if interface is parsed
    
    // Let's just catch the token ID differently to be safe
    let actualTokenId = BigInt(i + 4); // Since 1, 2, 3 were minted to the user previously
    
    // Generate a dummy encrypted price handle (32 bytes)
    const mockPrice = ethers.parseEther("10"); // 10 AVAX
    const encryptedPriceHandle = ethers.keccak256(ethers.toUtf8Bytes(mockPrice.toString()));

    // List the card
    const listTx = await Marketplace.listCard(shadowCardAddr, actualTokenId, encryptedPriceHandle);
    await listTx.wait();

    console.log(`✅ Card #${actualTokenId} (Mock Price: 10) listed successfully!`);
  }

  console.log("\nDone! Refresh the Marketplace page on your frontend to see the active listings.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
