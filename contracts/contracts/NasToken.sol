// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // Wait, we just need ERC20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NasToken is ERC20, Ownable {
    constructor() ERC20("Nascosto Token", "NAS") Ownable(msg.sender) {
        // Mint an initial supply of 1,000,000 NAS to the deployer
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Mock implementation of the AvaCloud eERC confidentialTransferFrom function.
     * In a real eERC token, this would verify the zk-SNARK proof and decrypt the amount on-chain.
     * For the hackathon demo, we just simulate a successful confidential transfer.
     */
    function confidentialTransferFrom(
        address from,
        address to,
        bytes32 /* encryptedAmountHandle */,
        bytes calldata /* proof */
    ) external returns (bool) {
        // In the real eERC implementation, the amount would be decrypted securely.
        // We mock the transfer of 10 tokens (the hardcoded hackathon demo price).
        uint256 mockAmount = 10 * 10 ** decimals();
        
        // Execute the underlying standard transfer
        _transfer(from, to, mockAmount);
        
        return true;
    }
}
