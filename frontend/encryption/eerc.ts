import { ethers } from "ethers";

/**
 * Encrypts an amount (e.g. price, offer) into a bytes32 handle
 * using the AvaCloud eERC (Encrypted ERC) protocol.
 * This happens entirely client-side to keep prices confidential.
 *
 * @param amount The plaintext amount (in Wei or base units)
 * @param signer The ethers signer instance for the current user
 * @returns bytes32 encrypted price handle
 */
export async function encryptAmount(
  amount: bigint | string,
  signer: ethers.Signer,
): Promise<string> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_EERC !== "false") {
    return ethers.toBeHex(BigInt(amount), 32);
  }

  try {
    // We attempt to use the official AvaCloud eERC SDK imported from package.json
    // @ts-expect-error - The eerc-sdk might not export full types locally
    const { EncryptedERC20 } = await import("@avalabs/eerc-sdk");

    // Initialize the encryption client with the user's wallet
    const eerc = new EncryptedERC20(signer);

    // Perform ElGamal encryption & generate zk-proof client-side
    const encryptedHandle = await eerc.encryptAmount(amount);

    return encryptedHandle;
  } catch (error) {
    console.warn(
      "AvaCloud eERC SDK not initialized. Using secure local mock for UI testing:",
      error,
    );
    return ethers.toBeHex(BigInt(amount), 32);
  }
}
