import { error } from "console";
import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractAt("ShadowCard", "0xfc320FA2753ea4e76fEE118ceEaD81E5CE660A18");
  const owner = await contract.owner()

  console.log("Owner:",owner);
}

main().catch(error);