// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RemittanceSystem
 * @dev Smart Contract Escrow engine managing cross-border remittance deposits, withdrawals, and refunds.
 */
contract RemittanceSystem is ReentrancyGuard, Ownable {
    IERC20 public immutable remitCoin;

    enum TransferStatus { Pending, Completed, Refunded, Cancelled }

    struct Transfer {
        bytes32 transferId;
        address sender;
        address recipient;
        uint256 amount;
        uint256 targetAmount; // Scaled target currency payout (2 decimals)
        uint256 timestamp;
        TransferStatus status;
        string senderCurrency;
        string recipientCurrency;
        uint256 exchangeRate; // Scaled by 1e8
    }

    mapping(bytes32 => Transfer) public transfers;
    bytes32[] public transferIds;

    event RemittanceInitiated(
        bytes32 indexed transferId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string senderCurrency,
        string recipientCurrency,
        uint256 exchangeRate
    );

    event RemittanceWithdrawn(
        bytes32 indexed transferId,
        address indexed recipient,
        uint256 amount
    );

    event RemittanceCancelled(
        bytes32 indexed transferId,
        address indexed sender,
        uint256 amount
    );

    constructor(address _remitCoin) Ownable(msg.sender) {
        require(_remitCoin != address(0), "Invalid token address");
        remitCoin = IERC20(_remitCoin);
    }

    /**
     * @dev Initiate a cross-border remittance by locking tokens in escrow.
     */
    function initiateTransfer(
        address recipient,
        uint256 amount,
        uint256 targetAmount,
        string calldata senderCurrency,
        string calldata recipientCurrency,
        uint256 exchangeRate
    ) external nonReentrant returns (bytes32) {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");

        bytes32 transferId = keccak256(
            abi.encodePacked(msg.sender, recipient, amount, block.timestamp, transferIds.length)
        );

        require(transfers[transferId].sender == address(0), "Transfer ID collision");

        bool success = remitCoin.transferFrom(msg.sender, address(this), amount);
        require(success, "RMT token transfer failed");

        transfers[transferId] = Transfer({
            transferId: transferId,
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            targetAmount: targetAmount,
            timestamp: block.timestamp,
            status: TransferStatus.Pending,
            senderCurrency: senderCurrency,
            recipientCurrency: recipientCurrency,
            exchangeRate: exchangeRate
        });

        transferIds.push(transferId);

        emit RemittanceInitiated(
            transferId,
            msg.sender,
            recipient,
            amount,
            senderCurrency,
            recipientCurrency,
            exchangeRate
        );

        return transferId;
    }

    /**
     * @dev Designated recipient claims locked escrow payout.
     */
    function withdrawFunds(bytes32 transferId) external nonReentrant {
        Transfer storage t = transfers[transferId];
        require(t.sender != address(0), "Transfer does not exist");
        require(msg.sender == t.recipient, "Only designated recipient can withdraw");
        require(t.status == TransferStatus.Pending, "Transfer is not pending");

        t.status = TransferStatus.Completed;

        bool success = remitCoin.transfer(t.recipient, t.amount);
        require(success, "Payout transfer failed");

        emit RemittanceWithdrawn(transferId, msg.sender, t.amount);
    }

    /**
     * @dev Sender cancels pending transfer and receives refund.
     */
    function cancelTransfer(bytes32 transferId) external nonReentrant {
        Transfer storage t = transfers[transferId];
        require(t.sender != address(0), "Transfer does not exist");
        require(msg.sender == t.sender, "Only sender can cancel transfer");
        require(t.status == TransferStatus.Pending, "Transfer is not pending");

        t.status = TransferStatus.Cancelled;

        bool success = remitCoin.transfer(t.sender, t.amount);
        require(success, "Refund transfer failed");

        emit RemittanceCancelled(transferId, msg.sender, t.amount);
    }

    /**
     * @dev Fetch all transfers.
     */
    function getAllTransfers() external view returns (Transfer[] memory) {
        Transfer[] memory all = new Transfer[](transferIds.length);
        for (uint256 i = 0; i < transferIds.length; i++) {
            all[i] = transfers[transferIds[i]];
        }
        return all;
    }
}
