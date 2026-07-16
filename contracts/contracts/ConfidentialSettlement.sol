// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IEncryptedERC20 {
    function confidentialTransferFrom(
        address from,
        address to,
        bytes32 encryptedAmountHandle,
        bytes calldata proof
    ) external returns (bool);
}

contract ConfidentialSettlement is Ownable {
    error ConfidentialPaymentFailed();
    error Unauthorized();
    error MarketplaceAlreadySet();

    address public marketplace;

    event TradeSettled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller
    );

    constructor() Ownable(msg.sender) {}

    /// @notice One-time setup: links this contract to its Marketplace.
    /// Must be called once, right after both contracts are deployed.
    function setMarketplace(address _marketplace) external onlyOwner {
        if (marketplace != address(0)) revert MarketplaceAlreadySet();
        marketplace = _marketplace;
    }

    modifier onlyMarketplace() {
        if (msg.sender != marketplace) revert Unauthorized();
        _;
    }

    function executeSettlement(
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        address buyer,
        address seller,
        bytes32 encryptedAmountHandle,
        bytes calldata proof
    ) external onlyMarketplace {
        bool paymentSuccess = IEncryptedERC20(paymentToken).confidentialTransferFrom(
            buyer,
            seller,
            encryptedAmountHandle,
            proof
        );

        if (!paymentSuccess) {
            revert ConfidentialPaymentFailed();
        }

        IERC721(nftContract).transferFrom(seller, buyer, tokenId);

        emit TradeSettled(nftContract, tokenId, buyer, seller);
    }
}