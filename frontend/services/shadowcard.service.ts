import { ethers } from "ethers";
import { getShadowCardContract, CONTRACT_ADDRESSES } from "@/lib/contracts";

export class ShadowCardService {
  static async mintCard(
    signer: ethers.Signer,
    address: string,
    uri: string,
    contentHash: string
  ): Promise<bigint | null> {

    if (!address) {
      throw new Error("Recipient address is required");
    }

    const contract = getShadowCardContract(signer);
    if (!contract) {
      throw new Error("ShadowCard contract not configured");
    }

    const tx = await contract.mintCard(address, uri, contentHash);
    const receipt = await tx.wait(); // was missing await — receipt was a Promise, not real data

    if (!receipt || receipt.status !== 1) {
      throw new Error("Mint transaction failed or was reverted");
    }

    const mintedLog = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: any) => parsed?.name === "CardMinted");

    if (!mintedLog) {
      console.log("minted log not found!")
      return null
    }
    return mintedLog.args.tokenId as bigint;
  }

  /**
   * Approves the ConfidentialSettlement contract to transfer the token —
   * NOT the Marketplace. The actual transferFrom call happens inside
   * ConfidentialSettlement.executeSettlement, so that's the address that
   * needs ERC-721 approval per EIP-721's msg.sender check.
   */
  static async approveSettlement(signer: ethers.Signer, tokenId: string | bigint) {
    const contract = getShadowCardContract(signer);
    if (!contract) {
      return;
    }
    const tx = await contract.approve(CONTRACT_ADDRESSES.SETTLEMENT, tokenId);
    return tx.wait();
  }

  static async getTokenURI(
    providerOrSigner: ethers.Signer | ethers.Provider,
    tokenId: string | bigint
  ) {
    const contract = getShadowCardContract(providerOrSigner);
    if (!contract) {
      return
    }
    return contract.tokenURI(tokenId);
  }
}