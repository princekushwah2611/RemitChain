# RemitChain

> **Decentralized, zero-fee cross-border remittance framework powered by Ethereum Smart Contracts, Hardware TEE Enclave Encryption, and WebAuthn Biometrics. Replaces legacy wire transfers with <60s instant payouts & 0.2% transaction fees.**

---

## 🌟 Key Features

- **Instant Low-Cost Payouts**: 0.2% fee vs 6.2% legacy bank wires with < 60-second settlement.
- **Strict Authentication Gate**: Phone SMS OTP, Email/Password, and MetaMask Web3 Signature login.
- **Hardware-Grade TEE Vault Security**: Hardware AES-256 PII encryption and isolated user data.
- **ATM 4-Digit Security PIN & Touch ID / Face ID Biometrics**: Authenticate every remittance before smart contract escrow lock.
- **Real-Time Cross-Account Sync**: Instant inter-account ledger sync between Sender (*Rahul*) and Recipient (*Priya*) for judging presentations.
- **Recipient Wallet Credit**: Claiming an escrow transfer immediately adds the RMT tokens directly into the recipient's wallet balance.
- **Real-Time Top Pop-up Notifications**: Toast notifications slide down from top on transaction completion.

---

## 📁 Directory Structure

```text
RemitChain/
├── contracts/                  # Solidity Smart Contracts (RemitCoin.sol & RemittanceSystem.sol)
│   ├── contracts/
│   ├── scripts/deploy.js       # Hardhat deployment script
│   └── test/                   # Hardhat unit tests (7 passing)
├── backend/                    # Express.js REST API
│   ├── src/index.js            # Server entry point (Port 5001)
│   ├── src/routes/             # Forex rates & transaction sync routes
│   └── src/services/           # Currency service with 5-min caching
└── frontend/                   # React 18 + Vite + Tailwind CSS DApp
    ├── src/components/         # UI Components (AuthLandingPage, OverviewDashboard, SendForm, etc.)
    ├── src/context/            # Web3Context provider
    ├── src/services/           # TEE security vault & blockchain helpers
    └── index.html              # Light theme entry point
```

---

## 🚀 Quick Start Guide

### 1. Run Smart Contract Tests
```bash
cd contracts
npm install
npm test
```

### 2. Start Backend API
```bash
cd backend
npm install
npm start
```

### 3. Start Frontend DApp
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to launch the RemitChain Portal!
