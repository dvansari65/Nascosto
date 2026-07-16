// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ShadowCard is ERC721, Ownable {
    error CardDoesNotExist();

    struct TradingCard {
        uint256 tokenId;
        address mintedBy;
        string  metadataURI;
        bytes32 contentHash;
    }

    uint256 private _nextTokenId;
    mapping(uint256 => TradingCard) public cards;

    event CardMinted(uint256 indexed tokenId, address indexed mintedBy, bytes32 contentHash);

    constructor() ERC721("ShadowCard", "SHADOW") Ownable(msg.sender) {}

    function mintCard(address to, string calldata uri, bytes32 hash) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_nextTokenId;

        cards[tokenId] = TradingCard({
            tokenId: tokenId,
            mintedBy: msg.sender,
            metadataURI: uri,
            contentHash: hash
        });

        _safeMint(to, tokenId); // was _mint — this checks the recipient can receive ERC-721 tokens

        emit CardMinted(tokenId, msg.sender, hash);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert CardDoesNotExist();
        return cards[tokenId].metadataURI;
    }
}