import "dotenv/config";
import { ethers, network } from "hardhat";

async function main() {
  const nasTokenAddress =
    process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS ||
    process.env.PAYMENT_TOKEN_ADDRESS;

  const recipient = "0x88E9e72B9893756E19f6634C887010f3492EB16d"
  const amount =  "100";

  if (!nasTokenAddress) {
    throw new Error(
      "Set NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS or PAYMENT_TOKEN_ADDRESS in contracts/.env",
    );
  }
  if (!recipient || !ethers.isAddress(recipient)) {
    throw new Error("Set RECIPIENT to a valid wallet address");
  }

  const [sender] = await ethers.getSigners();
  const chain = await ethers.provider.getNetwork();

  console.log(`Network: ${network.name} (${chain.chainId})`);
  console.log(`Signer: ${sender.address}`);
  console.log(`NAS token: ${nasTokenAddress}`);
  console.log(`Recipient: ${recipient}`);
  console.log(`Amount: ${amount} NAS`);

  const code = await ethers.provider.getCode(nasTokenAddress);
  if (code === "0x") {
    throw new Error(
      `No contract found at ${nasTokenAddress} on network "${network.name}". ` +
        `Use --network fuji and the NAS token address deployed on Fuji.`,
    );
  }

  const nasToken = await ethers.getContractAt("NasToken", nasTokenAddress);
  const owner = await nasToken.owner();
  if (owner.toLowerCase() !== sender.address.toLowerCase()) {
    throw new Error(
      `Signer is not NasToken owner. Owner is ${owner}, signer is ${sender.address}.`,
    );
  }

  const tx = await nasToken.mint(recipient, ethers.parseEther(amount));
  console.log(`Mint tx: ${tx.hash}`);
  await tx.wait();

  const balance = await nasToken.balanceOf(recipient);
  console.log(`Minted ${amount} NAS to ${recipient}`);
  console.log(`Sender: ${sender.address}`);
  console.log(`Recipient NAS balance: ${ethers.formatEther(balance)} NAS`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
