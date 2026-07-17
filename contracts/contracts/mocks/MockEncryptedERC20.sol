// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../ConfidentialSettlement.sol";

contract MockEncryptedERC20 is IEncryptedERC20 {
    bool public shouldFail;

    function setShouldFail(bool _shouldFail) external {
        shouldFail = _shouldFail;
    }

    function confidentialTransferFrom(
        address /*from*/,
        address /*to*/,
        bytes32 /*encryptedAmountHandle*/,
        bytes calldata /*proof*/
    ) external view returns (bool) {
        if (shouldFail) {
            return false;
        }
        return true;
    }
}
