import { ethers } from 'ethers';
import contractsConfig from '../contracts/contractsConfig.json';

/**
 * Get deployed contract addresses and ABIs
 */
export function getContractAddresses() {
  return {
    remitCoin: contractsConfig.remitCoin.address,
    remittanceSystem: contractsConfig.remittanceSystem.address,
  };
}

/**
 * Instantiate ethers Contract instances
 */
export function getContracts(providerOrSigner) {
  const remitCoinContract = new ethers.Contract(
    contractsConfig.remitCoin.address,
    contractsConfig.remitCoin.abi,
    providerOrSigner
  );

  const remittanceSystemContract = new ethers.Contract(
    contractsConfig.remittanceSystem.address,
    contractsConfig.remittanceSystem.abi,
    providerOrSigner
  );

  return { remitCoinContract, remittanceSystemContract };
}

/**
 * Shorten Ethereum address (0x1234...5678)
 */
export function shortenAddress(address) {
  if (!address || typeof address !== 'string') return '0x000...000';
  if (address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format BigInt wei balance to formatted string
 */
export function formatTokens(weiAmount, decimals = 18) {
  try {
    if (!weiAmount) return '0.00';
    const val = typeof weiAmount === 'bigint' ? weiAmount : BigInt(weiAmount.toString());
    const formatted = ethers.formatUnits(val, decimals);
    const num = parseFloat(formatted);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (e) {
    return '0.00';
  }
}

/**
 * Parse decimal string to Wei BigInt
 */
export function parseTokens(tokenAmount, decimals = 18) {
  try {
    const cleanStr = tokenAmount.toString().replace(/,/g, '');
    return ethers.parseUnits(cleanStr, decimals);
  } catch (e) {
    return BigInt(0);
  }
}
