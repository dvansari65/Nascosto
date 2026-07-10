// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ShadowCard
 * @notice The ERC-721 token representing the digital trading cards.
 */
contract ShadowCard is ERC721, Ownable {
    error CardDoesNotExist();

    struct TradingCard {
        uint256 tokenId;        // ERC-721 requires this; primary key for the asset
        address mintedBy;       // original issuer — proves authenticity/provenance
        string  metadataURI;    // IPFS/Arweave pointer to image + attributes
        bytes32 contentHash;    // hash of the off-chain metadata for verification
    }

    uint256 private _nextTokenId;
    mapping(uint256 => TradingCard) public cards;

    event CardMinted(uint256 indexed tokenId, address indexed mintedBy, bytes32 contentHash);

    constructor() ERC721("ShadowCard", "SHADOW") Ownable(msg.sender) {}

    /**
     * @notice Mints a new trading card.
     * @param to Address receiving the minted card.
     * @param uri IPFS/Arweave metadata URI.
     * @param hash SHA-256 or Keccak256 hash of the metadata JSON for authenticity.
     */
    function mintCard(address to, string calldata uri, bytes32 hash) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        
        cards[tokenId] = TradingCard({
            tokenId: tokenId,
            mintedBy: msg.sender,
            metadataURI: uri,
            contentHash: hash
        });

        _mint(to, tokenId);
        
        emit CardMinted(tokenId, msg.sender, hash);
        return tokenId;
    }

    /**
     * @notice Returns the specific card's metadata URI.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert CardDoesNotExist();
        return cards[tokenId].metadataURI;
    }
}
