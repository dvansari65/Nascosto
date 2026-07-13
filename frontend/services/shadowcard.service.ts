import { ethers } from "ethers";
import { getShadowCardContract, CONTRACT_ADDRESSES } from "@/lib/contracts";

export class ShadowCardService {
  static async mintCard(signer: ethers.Signer, address: string, uri: string, contentHash: string) {
    if(!address){
      console.log("address not found!!")
      return
    }
    console.log("address:",address)
    const contract = getShadowCardContract(signer);
    if(!contract){
      return;
    }
    console.log("card contract:")
    const tx = await contract.mintCard(address, uri, contentHash);
    return tx.wait();
  }

  /**
   * Approves the ConfidentialSettlement contract to transfer the token —
   * NOT the Marketplace. The actual transferFrom call happens inside
   * ConfidentialSettlement.executeSettlement, so that's the address that
   * needs ERC-721 approval per EIP-721's msg.sender check.
   */
  static async approveSettlement(signer: ethers.Signer, tokenId: string | bigint) {
    const contract = getShadowCardContract(signer);
    if(!contract){
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
    if(!contract){
      return
    }
    return contract.tokenURI(tokenId);
  }
}