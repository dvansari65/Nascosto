import { ethers } from "hardhat";

const main = async () => {
    const NasToken = await ethers.getContractFactory("NasToken");
    const nasToken = await NasToken.deploy();
    await nasToken.waitForDeployment();
    const nasTokenAddr = await nasToken.getAddress();
    console.log(`✅ NasToken (Mock eERC) deployed to: ${nasTokenAddr}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});