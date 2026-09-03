// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RemitCoin (RMT)
 * @dev ERC20 Stablecoin token used for peer-to-peer cross-border remittances.
 */
contract RemitCoin is ERC20, Ownable {
    uint8 private immutable _decimals;

    event FaucetClaimed(address indexed recipient, uint256 amount);

    constructor(
        uint256 initialSupply
    ) ERC20("RemitCoin", "RMT") Ownable(msg.sender) {
        _decimals = 18;
        _mint(msg.sender, initialSupply * 10**_decimals);
    }

    /**
     * @dev Public faucet function allowing users to claim test RMT tokens for demonstration.
     */
    function claimFaucet(address recipient, uint256 amount) external {
        require(amount > 0 && amount <= 5000 * 10**_decimals, "Faucet claim amount out of bounds");
        _mint(recipient, amount);
        emit FaucetClaimed(recipient, amount);
    }

    /**
     * @dev Mint function restricted to owner or contract faucet.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
