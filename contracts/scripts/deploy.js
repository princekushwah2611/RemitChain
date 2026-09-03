const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting RemitChain Smart Contract Deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📍 Deployer Address: ${deployer.address}`);

  // 1. Deploy RemitCoin ERC-20
  const RemitCoin = await hre.ethers.getContractFactory("RemitCoin");
  const remitCoin = await RemitCoin.deploy(1000000); // 1,000,000 initial supply
  await remitCoin.waitForDeployment();
  const remitCoinAddress = await remitCoin.getAddress();
  console.log(`✅ RemitCoin (RMT) Deployed to: ${remitCoinAddress}`);

  // 2. Deploy RemittanceSystem Escrow
  const RemittanceSystem = await hre.ethers.getContractFactory("RemittanceSystem");
  const remittanceSystem = await RemittanceSystem.deploy(remitCoinAddress);
  await remittanceSystem.waitForDeployment();
  const remittanceSystemAddress = await remittanceSystem.getAddress();
  console.log(`✅ RemittanceSystem Escrow Deployed to: ${remittanceSystemAddress}`);

  // 3. Export ABIs & Addresses to Frontend
  const remitCoinArtifact = await hre.artifacts.readArtifact("RemitCoin");
  const remittanceSystemArtifact = await hre.artifacts.readArtifact("RemittanceSystem");

  const configData = {
    network: "localhost",
    chainId: 31337,
    remitCoin: {
      address: remitCoinAddress,
      abi: remitCoinArtifact.abi
    },
    remittanceSystem: {
      address: remittanceSystemAddress,
      abi: remittanceSystemArtifact.abi
    }
  };

  const frontendConfigPath = path.join(__dirname, "../../frontend/src/contracts/contractsConfig.json");
  const frontendDir = path.dirname(frontendConfigPath);

  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  fs.writeFileSync(frontendConfigPath, JSON.stringify(configData, null, 2));
  console.log(`📁 Contract Config & ABIs exported to: ${frontendConfigPath}`);

  console.log("\n🎉 RemitChain Smart Contracts Deployment Complete!");
}

main().catch((error) => {
  console.error("❌ Deployment Error:", error);
  process.exitCode = 1;
});
