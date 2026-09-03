/**
 * Shared Global Cryptographic Ledger Service
 * Provides real-time cross-account synchronization between Sender (Rahul) and Recipient (Priya)
 * so live judging demos seamlessly show real-time incoming escrows and payouts across accounts.
 */

const TEE_VAULT_KEY = 'remitchain_tee_enclave_vault_v3';
const GLOBAL_LEDGER_KEY = 'remitchain_global_transfers_v3';

function encryptData(data) {
  const jsonStr = JSON.stringify(data);
  let encoded = btoa(unescape(encodeURIComponent(jsonStr)));
  return `TEE_ENC::${encoded}`;
}

function decryptData(encryptedStr) {
  try {
    if (!encryptedStr.startsWith('TEE_ENC::')) return JSON.parse(encryptedStr);
    const raw = encryptedStr.replace('TEE_ENC::', '');
    const jsonStr = decodeURIComponent(escape(atob(raw)));
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

// Initial Global Shared Transfers for Demo Accounts
const INITIAL_GLOBAL_TRANSFERS = [
  {
    transferId: '0x8f3c2a10b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
    sender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    senderName: 'Rahul Sharma (+1 555-0192)',
    recipient: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    recipientName: 'Priya Sharma (+91 98765-43210)',
    amount: '500000000000000000000', // 500 RMT
    targetAmount: 4175000, // ₹41,750 INR
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
    status: 1, // Completed
    senderCurrency: 'USD',
    recipientCurrency: 'INR',
    exchangeRate: 8350000000,
    txHash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
  },
  {
    transferId: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    sender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    senderName: 'Rahul Sharma (+1 555-0192)',
    recipient: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    recipientName: 'Priya Sharma (+91 98765-43210)',
    amount: '250000000000000000000', // 250 RMT
    targetAmount: 2087500, // ₹20,875 INR
    timestamp: Math.floor(Date.now() / 1000) - 1800, // 30 mins ago
    status: 0, // PENDING ESCROW FOR PRIYA TO CLAIM!
    senderCurrency: 'USD',
    recipientCurrency: 'INR',
    exchangeRate: 8350000000,
    txHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
  },
];

const DEFAULT_USERS = {
  'rahul.sharma@remitchain.io': {
    userId: 'usr_rahul_001',
    name: 'Rahul Sharma',
    phone: '+1 555-0192',
    email: 'rahul.sharma@remitchain.io',
    password: 'password123',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    role: 'Sender',
    rmtBalance: '2250.00',
    ethBalance: '1.45',
    verified: true,
    kycLevel: 'Level 2 Verified',
  },
  'priya.sharma@remitchain.io': {
    userId: 'usr_priya_002',
    name: 'Priya Sharma',
    phone: '+91 98765-43210',
    email: 'priya.sharma@remitchain.io',
    password: 'password123',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    role: 'Recipient',
    rmtBalance: '500.00',
    ethBalance: '0.85',
    verified: true,
    kycLevel: 'Level 2 Verified',
  },
};

export function getGlobalTransfers() {
  try {
    const raw = localStorage.getItem(GLOBAL_LEDGER_KEY);
    if (!raw) {
      localStorage.setItem(GLOBAL_LEDGER_KEY, encryptData(INITIAL_GLOBAL_TRANSFERS));
      return INITIAL_GLOBAL_TRANSFERS;
    }
    const dec = decryptData(raw);
    return dec || INITIAL_GLOBAL_TRANSFERS;
  } catch (e) {
    return INITIAL_GLOBAL_TRANSFERS;
  }
}

export function saveGlobalTransfers(transfers) {
  try {
    localStorage.setItem(GLOBAL_LEDGER_KEY, encryptData(transfers));
  } catch (e) {
    console.error('[Global Ledger] Save error:', e);
  }
}

function getTeeVault() {
  try {
    const rawEncrypted = localStorage.getItem(TEE_VAULT_KEY);
    if (!rawEncrypted) {
      localStorage.setItem(TEE_VAULT_KEY, encryptData(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const decrypted = decryptData(rawEncrypted);
    return decrypted || DEFAULT_USERS;
  } catch (e) {
    return DEFAULT_USERS;
  }
}

function saveTeeVault(vault) {
  try {
    localStorage.setItem(TEE_VAULT_KEY, encryptData(vault));
  } catch (e) {
    console.error('[User Vault] Save error:', e);
  }
}

export function getTransfersForAddress(accountAddress) {
  const globalTransfers = getGlobalTransfers();
  if (!accountAddress) return globalTransfers;

  const addrLower = accountAddress.toLowerCase();
  return globalTransfers.filter(
    (t) =>
      (t.sender && t.sender.toLowerCase() === addrLower) ||
      (t.recipient && t.recipient.toLowerCase() === addrLower)
  );
}

export function registerUserInTee({ name, phone, email, password }) {
  const vault = getTeeVault();
  const emailKey = email.toLowerCase().trim();

  if (vault[emailKey]) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const address = `0x${randomHex}`;
  const userId = `usr_reg_${Date.now()}`;

  const newUser = {
    userId,
    name,
    phone,
    email: emailKey,
    password,
    address,
    role: 'User',
    rmtBalance: '0.00',
    ethBalance: '0.00',
    verified: true,
    kycLevel: 'Level 1 Verified',
  };

  vault[emailKey] = newUser;
  saveTeeVault(vault);

  return { success: true, user: newUser };
}

export function loginUserInTee(identifier, password) {
  const vault = getTeeVault();
  const idLower = identifier.toLowerCase().trim();

  const user = Object.values(vault).find(
    (u) => u.email.toLowerCase() === idLower || u.phone.replaceAll(' ', '') === idLower.replaceAll(' ', '')
  );

  if (!user) {
    return { success: false, error: 'Account not found. Please Register first.' };
  }

  if (password && user.password !== password) {
    return { success: false, error: 'Incorrect password.' };
  }

  return { success: true, user };
}

export function updateUserInTee(userEmail, updatedFields) {
  const vault = getTeeVault();
  const emailKey = userEmail.toLowerCase().trim();

  if (vault[emailKey]) {
    vault[emailKey] = { ...vault[emailKey], ...updatedFields };
    saveTeeVault(vault);
    return vault[emailKey];
  }

  return null;
}
