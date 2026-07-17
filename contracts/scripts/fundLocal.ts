// scripts/fundMyAddress.ts
import { ethers } from "hardhat";

async function main() {
  const [ewoq] = await ethers.getSigners(); 
  console.log("ewoq:",ewoq.address.toString());
  console.log()
  // ewoq is the account set in your avalancheLocal network config
  const myAddress = "0x9B45001b34bE6B08cF7381C81B5Db3F39c8b6dC1";

  const tx = await ewoq.sendTransaction({
    to: myAddress,
    value: ethers.parseEther("1000"),
  });
  await tx.wait();

  const balance = await ethers.provider.getBalance(myAddress);
  console.log(`Sent 1000 AVAX to ${myAddress}`);
  console.log(`New balance: ${ethers.formatEther(balance)} AVAX`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});