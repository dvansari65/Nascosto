// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title IEncryptedERC20
 * @dev Minimal interface for AvaCloud's eERC standard to perform confidential transfers.
 */
interface IEncryptedERC20 {
    /**
     * @notice Transfers an encrypted amount of tokens from one address to another.
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param encryptedAmountHandle Pointer to the encrypted amount in eERC storage.
     * @param proof The zk-SNARK (Groth16) proof validating the transfer.
     * @return bool True if the transfer succeeds.
     */
    function confidentialTransferFrom(
        address from,
        address to,
        bytes32 encryptedAmountHandle,
        bytes calldata proof
    ) external returns (bool);
}

/**
 * @title ConfidentialSettlement
 * @notice Facilitates the atomic settlement of a digital trading card (NFT) 
 * against a confidential payment using AvaCloud's eERC standard.
 */
contract ConfidentialSettlement {
    // Custom errors for gas efficiency and clean revert messages
    error ConfidentialPaymentFailed();

    /**
     * @notice Emitted when a confidential trade is successfully settled.
     */
    event TradeSettled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller
    );

    /**
     * @notice Atomically settles a trade: transfers the NFT and processes the confidential payment.
     * @dev The buyer must have generated a valid zk-SNARK proof client-side for the `encryptedAmountHandle` 
     * and granted the necessary allowances.
     */
    function executeSettlement(
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        address buyer,
        address seller,
        bytes32 encryptedAmountHandle,
        bytes calldata proof
    ) external {
        // 1. Process the confidential payment from buyer to seller via eERC
        bool paymentSuccess = IEncryptedERC20(paymentToken).confidentialTransferFrom(
            buyer,
            seller,
            encryptedAmountHandle,
            proof
        );

        if (!paymentSuccess) {
            revert ConfidentialPaymentFailed();
        }

        // 2. Transfer the NFT from the seller to the buyer
        IERC721(nftContract).transferFrom(seller, buyer, tokenId);

        // 3. Emit settlement event
        emit TradeSettled(nftContract, tokenId, buyer, seller);
    }
}
