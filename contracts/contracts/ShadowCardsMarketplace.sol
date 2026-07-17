// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ConfidentialSettlement.sol";

/**
 * @title ShadowCardsMarketplace
 * @notice A privacy-preserving NFT marketplace for digital trading cards.
 * Uses AvaCloud eERC for confidential settlements.
 */
contract ShadowCardsMarketplace {
    // Custom Errors
    error NotOwner();
    error InvalidListing();
    error OfferDoesNotExist();
    error InvalidAddress();

    enum ListingStatus { None, Listed, OfferPending, Sold, Delisted }

    struct Listing {
        uint256 tokenId;             // which card this listing is for
        address seller;              // MUST be public
        ListingStatus status;        // public lifecycle state
        bytes32 encryptedPriceHandle; // Pointer to eERC encrypted balance storage
        uint64  createdAt;           // useful for listing expiry/staleness
    }

    struct Offer {
        uint256 tokenId;
        address buyer;                 // public buyer address
        bytes32 encryptedAmountHandle; // Pointer to eERC encrypted offer amount
        uint64  submittedAt;
        bool    withdrawn;
    }

    // State Variables
    ConfidentialSettlement public immutable settlementContract;
    address public immutable paymentToken;

    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    // nftContract => tokenId => buyer => Offer
    mapping(address => mapping(uint256 => mapping(address => Offer))) public offers;

    // Events
    event CardListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, bytes32 encryptedPriceHandle);
    event CardDelisted(address indexed nftContract, uint256 indexed tokenId);
    event OfferSubmitted(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, bytes32 encryptedAmountHandle);
    event OfferAccepted(address indexed nftContract, uint256 indexed tokenId, address indexed buyer);

    constructor(address _settlementContract, address _paymentToken) {
        if (_settlementContract == address(0) || _paymentToken == address(0)) revert InvalidAddress();
        settlementContract = ConfidentialSettlement(_settlementContract);
        paymentToken = _paymentToken;
    }

    function listCard(address nftContract, uint256 tokenId, bytes32 encryptedPriceHandle) external {
        if (IERC721(nftContract).ownerOf(tokenId) != msg.sender) revert NotOwner();
        
        listings[nftContract][tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            status: ListingStatus.Listed,
            encryptedPriceHandle: encryptedPriceHandle,
            createdAt: uint64(block.timestamp)
        });

        emit CardListed(nftContract, tokenId, msg.sender, encryptedPriceHandle);
    }

    function delistCard(address nftContract, uint256 tokenId) external {
        if (listings[nftContract][tokenId].seller != msg.sender) revert NotOwner();
        
        listings[nftContract][tokenId].status = ListingStatus.Delisted;
        
        emit CardDelisted(nftContract, tokenId);
    }

    function submitOffer(address nftContract, uint256 tokenId, bytes32 encryptedAmountHandle) external {
         Listing storage listing = listings[nftContract][tokenId];
        if (listings[nftContract][tokenId].status != ListingStatus.Listed) revert InvalidListing();

        offers[nftContract][tokenId][msg.sender] = Offer({
            tokenId: tokenId,
            buyer: msg.sender,
            encryptedAmountHandle: encryptedAmountHandle,
            submittedAt: uint64(block.timestamp),
            withdrawn: false
        });

        emit OfferSubmitted(nftContract, tokenId, msg.sender, listing.seller, encryptedAmountHandle);
    }

    function acceptOffer(
        address nftContract,
        uint256 tokenId,
        address buyer,
        bytes calldata proof
    ) external {
        Listing storage listing = listings[nftContract][tokenId];
        Offer storage offer = offers[nftContract][tokenId][buyer];
        
        if (listing.seller != msg.sender) revert NotOwner();
        if (listing.status != ListingStatus.Listed && listing.status != ListingStatus.OfferPending) revert InvalidListing();
        if (offer.buyer == address(0) || offer.withdrawn) revert OfferDoesNotExist();

        // 1. Mark listing as Sold (Checks-Effects-Interactions pattern)
        listing.status = ListingStatus.Sold;

        // 2. Delegate the atomic swap to the Settlement Module
        settlementContract.executeSettlement(
            nftContract,
            tokenId,
            paymentToken,
            buyer,
            msg.sender,
            offer.encryptedAmountHandle,
            proof
        );

        emit OfferAccepted(nftContract, tokenId, buyer);
    }
}

