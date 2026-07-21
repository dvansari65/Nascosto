// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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

    function confidentialTransferFrom(
        address from,
        address to,
        bytes32 encryptedAmountHandle,
        bytes calldata /* proof */
    ) external returns (bool) {
        uint256 mockAmount = uint256(encryptedAmountHandle);
        _transfer(from, to, mockAmount);
        return true;
    }
}
