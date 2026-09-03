const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RemitChain Smart Contracts", function () {
  let RemitCoin, remitCoin;
  let RemittanceSystem, remittanceSystem;
  let owner, sender, recipient, stranger;

  const INITIAL_SUPPLY = 1000000; // 1,000,000 RMT

  beforeEach(async function () {
    [owner, sender, recipient, stranger] = await ethers.getSigners();

    RemitCoin = await ethers.getContractFactory("RemitCoin");
    remitCoin = await RemitCoin.deploy(INITIAL_SUPPLY);
    await remitCoin.waitForDeployment();

    RemittanceSystem = await ethers.getContractFactory("RemittanceSystem");
    remittanceSystem = await RemittanceSystem.deploy(await remitCoin.getAddress());
    await remittanceSystem.waitForDeployment();

    // Fund sender with 5,000 RMT
    await remitCoin.claimFaucet(sender.address, ethers.parseEther("5000"));
  });

  describe("RemitCoin Token", function () {
    it("should initialize with correct name, symbol, and supply", async function () {
      expect(await remitCoin.name()).to.equal("RemitCoin");
      expect(await remitCoin.symbol()).to.equal("RMT");
      expect(await remitCoin.totalSupply()).to.equal(ethers.parseEther("1005000")); // Initial + faucet
    });

    it("should allow users to claim tokens via faucet", async function () {
      await remitCoin.claimFaucet(recipient.address, ethers.parseEther("1000"));
      expect(await remitCoin.balanceOf(recipient.address)).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("RemittanceSystem", function () {
    it("should fail initiateTransfer if token spend is not approved", async function () {
      const amount = ethers.parseEther("500");
      await expect(
        remittanceSystem.connect(sender).initiateTransfer(
          recipient.address,
          amount,
          4175000,
          "USD",
          "INR",
          8350000000
        )
      ).to.be.reverted;
    });

    it("should initiate transfer successfully after approval", async function () {
      const amount = ethers.parseEther("500");
      await remitCoin.connect(sender).approve(await remittanceSystem.getAddress(), amount);

      const tx = await remittanceSystem.connect(sender).initiateTransfer(
        recipient.address,
        amount,
        4175000,
        "USD",
        "INR",
        8350000000
      );

      await tx.wait();

      const allTransfers = await remittanceSystem.getAllTransfers();
      expect(allTransfers.length).to.equal(1);
      expect(allTransfers[0].sender).to.equal(sender.address);
      expect(allTransfers[0].recipient).to.equal(recipient.address);
      expect(allTransfers[0].amount).to.equal(amount);
    });

    it("should allow designated recipient to withdraw funds", async function () {
      const amount = ethers.parseEther("500");
      await remitCoin.connect(sender).approve(await remittanceSystem.getAddress(), amount);
      await remittanceSystem.connect(sender).initiateTransfer(
        recipient.address,
        amount,
        4175000,
        "USD",
        "INR",
        8350000000
      );

      const allTransfers = await remittanceSystem.getAllTransfers();
      const transferId = allTransfers[0].transferId;

      await remittanceSystem.connect(recipient).withdrawFunds(transferId);

      expect(await remitCoin.balanceOf(recipient.address)).to.equal(amount);
    });

    it("should reject withdrawal attempts by non-recipients", async function () {
      const amount = ethers.parseEther("500");
      await remitCoin.connect(sender).approve(await remittanceSystem.getAddress(), amount);
      await remittanceSystem.connect(sender).initiateTransfer(
        recipient.address,
        amount,
        4175000,
        "USD",
        "INR",
        8350000000
      );

      const allTransfers = await remittanceSystem.getAllTransfers();
      const transferId = allTransfers[0].transferId;

      await expect(
        remittanceSystem.connect(stranger).withdrawFunds(transferId)
      ).to.be.revertedWith("Only designated recipient can withdraw");
    });

    it("should allow sender to cancel a pending transfer", async function () {
      const amount = ethers.parseEther("500");
      await remitCoin.connect(sender).approve(await remittanceSystem.getAddress(), amount);
      await remittanceSystem.connect(sender).initiateTransfer(
        recipient.address,
        amount,
        4175000,
        "USD",
        "INR",
        8350000000
      );

      const allTransfers = await remittanceSystem.getAllTransfers();
      const transferId = allTransfers[0].transferId;

      const initialSenderBalance = await remitCoin.balanceOf(sender.address);
      await remittanceSystem.connect(sender).cancelTransfer(transferId);
      const finalSenderBalance = await remitCoin.balanceOf(sender.address);

      expect(finalSenderBalance - initialSenderBalance).to.equal(amount);
    });
  });
});
