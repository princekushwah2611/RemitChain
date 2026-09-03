import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContracts, formatTokens, parseTokens, getContractAddresses } from '../services/blockchainService';
import { syncTransactionOffchain } from '../services/apiService';
import {
  registerUserInTee,
  loginUserInTee,
  updateUserInTee,
  getGlobalTransfers,
  saveGlobalTransfers,
  getTransfersForAddress,
} from '../services/teeSecurityService';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState('0.00');
  const [rmtBalance, setRmtBalance] = useState('0.00');
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Authentication Profile & Notifications state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  /**
   * Reload global transfers whenever account or login profile changes
   */
  const reloadAccountTransfers = useCallback((userAddr) => {
    if (!userAddr) {
      setTransfers(getGlobalTransfers());
    } else {
      setTransfers(getTransfersForAddress(userAddr));
    }
  }, []);

  useEffect(() => {
    if (account) {
      reloadAccountTransfers(account);
    }
  }, [account, reloadAccountTransfers]);

  /**
   * Push real-time top notification pop-up
   */
  const triggerNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };

  const dismissToast = () => setActiveToast(null);
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const clearNotifications = () => setNotifications([]);

  /**
   * Sync user state to storage
   */
  const syncToVault = useCallback((profile, currentRmtBal, currentEthBal, extraFields = {}) => {
    if (profile && profile.email) {
      updateUserInTee(profile.email, {
        rmtBalance: currentRmtBal,
        ethBalance: currentEthBal,
        ...extraFields,
      });
    }
  }, []);

  /**
   * Connect MetaMask Wallet
   */
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Enabling Simulated Demo Mode for instant testing.');
      enableDemoMode();
      return;
    }

    try {
      setLoading(true);
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_request_accounts', []);
      const userSigner = await browserProvider.getSigner();
      const networkData = await browserProvider.getNetwork();

      const userAccount = accounts[0];
      setAccount(userAccount);
      setProvider(browserProvider);
      setSigner(userSigner);
      setNetwork({
        name: networkData.name === 'unknown' ? `Chain ${networkData.chainId}` : networkData.name,
        chainId: Number(networkData.chainId),
      });
      setIsConnected(true);
      setIsDemoMode(false);
      reloadAccountTransfers(userAccount);

      triggerNotification('MetaMask Wallet Connected', `Connected account: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`, 'info');

      return { success: true, account: userAccount };
    } catch (err) {
      console.error('[Web3Context] Wallet connection error:', err);
      alert(`Failed to connect wallet: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register New User
   */
  const registerUser = async ({ name, phone, email, password }) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const res = registerUserInTee({ name, phone, email, password });
    if (!res.success) {
      setLoading(false);
      alert(res.error);
      return { success: false, error: res.error };
    }

    const user = res.user;
    setUserProfile(user);
    setAccount(user.address);
    setRmtBalance('0.00');
    setEthBalance('0.00');
    setIsConnected(true);
    setIsDemoMode(true);
    setIsAuthenticated(true);
    setLoading(false);

    reloadAccountTransfers(user.address);
    triggerNotification('Account Registered Successfully 🎉', `Welcome ${name}! Your account is ready.`, 'info');

    return { success: true, user };
  };

  /**
   * Login Existing User
   */
  const loginUser = async (identifier, password) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const res = loginUserInTee(identifier, password);
    if (!res.success) {
      setLoading(false);
      alert(res.error);
      return { success: false, error: res.error };
    }

    const user = res.user;
    setUserProfile(user);
    setAccount(user.address);
    setRmtBalance(user.rmtBalance || '0.00');
    setEthBalance(user.ethBalance || '0.00');
    setIsConnected(true);
    setIsDemoMode(true);
    setIsAuthenticated(true);
    setLoading(false);

    reloadAccountTransfers(user.address);

    triggerNotification('Welcome Back!', `Signed in as ${user.name} (${user.role}).`, 'info');

    return { success: true, user };
  };

  /**
   * Setup 4-Digit Security PIN
   */
  const setupTransactionPin = (pin) => {
    if (userProfile) {
      const updated = { ...userProfile, transactionPin: pin };
      setUserProfile(updated);
      syncToVault(updated, rmtBalance, ethBalance, { transactionPin: pin });
      triggerNotification('Security PIN Configured', '4-digit transaction authorization PIN saved successfully.', 'info');
    }
  };

  /**
   * MetaMask Web3 Signature Login
   */
  const loginWithMetaMask = async () => {
    try {
      let activeSigner = signer;
      let activeAccount = account;

      if (!isConnected || !activeSigner) {
        const res = await connectWallet();
        if (!res || !res.success) return { success: false };
        activeAccount = res.account;
        activeSigner = await provider.getSigner();
      }

      setLoading(true);
      const challengeMessage = `Official RemitChain Sign-In Request\nTimestamp: ${new Date().toISOString()}\nWallet Address: ${activeAccount}`;

      let signature = '0x_simulated_signature';
      if (activeSigner && activeSigner.signMessage) {
        signature = await activeSigner.signMessage(challengeMessage);
      }

      const emailKey = `${activeAccount.toLowerCase()}@metamask.web3`;
      const teeRes = loginUserInTee(emailKey);

      let user;
      if (teeRes.success) {
        user = teeRes.user;
      } else {
        const regRes = registerUserInTee({
          name: `MetaMask (${activeAccount.substring(0, 6)}...${activeAccount.substring(38)})`,
          phone: 'Web3 Wallet',
          email: emailKey,
          password: 'web3_signature',
        });
        user = regRes.user;
        user.address = activeAccount;
      }

      setUserProfile(user);
      setAccount(activeAccount);
      setRmtBalance(user.rmtBalance || '0.00');
      setEthBalance(user.ethBalance || '0.00');
      setIsAuthenticated(true);
      reloadAccountTransfers(activeAccount);

      triggerNotification('MetaMask Web3 Sign-In Verified', `Authenticated wallet ${activeAccount.substring(0, 6)}...`, 'info');

      return { success: true, profile: user };
    } catch (err) {
      console.error('[Web3Context] Web3 signature login error:', err);
      alert(`Signature verification failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserProfile(null);
    setIsAuthenticated(false);
    setTransfers([]);
    setAccount(null);
    setRmtBalance('0.00');
  };

  const enableDemoMode = () => {
    loginUser('rahul.sharma@remitchain.io', 'password123');
  };

  const disconnectWallet = () => {
    logout();
  };

  /**
   * Claim Faucet Tokens
   */
  const claimFaucet = async (recipientAddress = account, amount = '1000') => {
    if (!recipientAddress) {
      alert('Please connect your wallet or sign in first.');
      return { success: false };
    }

    try {
      setLoading(true);
      let newBal = '1000.00';
      setRmtBalance((prev) => {
        const num = parseFloat(prev.replace(/,/g, '')) + parseFloat(amount);
        newBal = num.toLocaleString('en-US', { minimumFractionDigits: 2 });
        return newBal;
      });

      if (userProfile) {
        syncToVault(userProfile, newBal, ethBalance);
      }

      triggerNotification('Faucet Claim Completed 💰', `Minted ${amount} RMT test tokens into your wallet!`, 'faucet');

      return { success: true, txHash: '0x' + Array(64).fill('a').join('') };
    } catch (err) {
      console.error('[Web3Context] Faucet claim error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiate Remittance Transfer
   */
  const initiateRemittance = async ({ recipient, amount, senderCurrency, recipientCurrency, exchangeRate, autoWithdraw = false }) => {
    if (!account) {
      alert('Please sign in to execute remittance.');
      return { success: false };
    }

    try {
      setLoading(true);
      const amountWei = parseTokens(amount.toString());
      const rateScaled = BigInt(Math.round(parseFloat(exchangeRate) * 1e8));

      await new Promise((res) => setTimeout(res, 1000));
      const transferId = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const targetVal = BigInt(Math.round(parseFloat(amount) * parseFloat(exchangeRate) * 100));
      const recipientNameStr = recipient.toLowerCase() === '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc' ? 'Priya Sharma (+91 98765-43210)' : 'Recipient Wallet';

      const initialStatus = autoWithdraw ? 1 : 0;

      const newTransfer = {
        transferId,
        sender: account,
        senderName: userProfile?.name ? `${userProfile.name} (${userProfile.phone || ''})` : 'Sender',
        recipient,
        recipientName: recipientNameStr,
        amount: amountWei.toString(),
        targetAmount: targetVal.toString(),
        timestamp: Math.floor(Date.now() / 1000),
        status: initialStatus,
        senderCurrency,
        recipientCurrency,
        exchangeRate: rateScaled.toString(),
        txHash,
      };

      const currentGlobal = getGlobalTransfers();
      const updatedGlobal = [newTransfer, ...currentGlobal];
      saveGlobalTransfers(updatedGlobal);

      reloadAccountTransfers(account);

      let newRmtBal = '0.00';
      setRmtBalance((prev) => {
        const num = Math.max(0, parseFloat(prev.replace(/,/g, '')) - parseFloat(amount));
        newRmtBal = num.toLocaleString('en-US', { minimumFractionDigits: 2 });
        return newRmtBal;
      });

      if (userProfile) {
        syncToVault(userProfile, newRmtBal, ethBalance);
      }

      const payoutFormatted = (Number(targetVal) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

      if (initialStatus === 1) {
        triggerNotification(
          'Transaction Fully Completed! ✅🎉',
          `Remittance of ${amount} RMT ($${amount} USD) is FULLY COMPLETED! Payout of ${payoutFormatted} ${recipientCurrency} successfully delivered to ${recipientNameStr}.`,
          'claim'
        );
      } else {
        triggerNotification(
          'Escrow Deposit Locked 🔒',
          `Remittance of ${amount} RMT ($${amount} USD) deposited in escrow contract for ${recipientNameStr}. Log in as Recipient (Priya) to claim!`,
          'send'
        );
      }

      return { success: true, txHash, transferId };
    } catch (err) {
      console.error('[Web3Context] Initiate transfer error:', err);
      alert(`Transfer failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Withdraw pending funds (DEDUCTS ESCROW & ADDS CLAIMED RMT AMOUNT TO PRIYA'S WALLET BALANCE!)
   */
  const withdrawRemittance = async (transferId) => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 800));

      const currentGlobal = getGlobalTransfers();
      let claimedTx = null;

      const updatedGlobal = currentGlobal.map((t) => {
        if (t.transferId === transferId) {
          claimedTx = t;
          return { ...t, status: 1 };
        }
        return t;
      });

      saveGlobalTransfers(updatedGlobal);
      reloadAccountTransfers(account);

      let newBalStr = rmtBalance;

      if (claimedTx) {
        const claimedTokens = parseFloat(formatTokens(claimedTx.amount || '0'));
        setRmtBalance((prev) => {
          const prevNum = parseFloat(prev.replace(/,/g, '')) || 0;
          const updatedNum = prevNum + claimedTokens;
          newBalStr = updatedNum.toLocaleString('en-US', { minimumFractionDigits: 2 });
          return newBalStr;
        });

        if (userProfile) {
          syncToVault(userProfile, newBalStr, ethBalance);
        }
      }

      const targetPayoutStr = claimedTx ? (Number(claimedTx.targetAmount) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }) : 'Payout';
      const curr = claimedTx ? claimedTx.recipientCurrency : 'INR';

      triggerNotification(
        'Transaction Fully Completed! ✅🎉',
        `Recieved funds claimed! ${targetPayoutStr} ${curr} (${formatTokens(claimedTx?.amount || 0)} RMT) added to your wallet balance!`,
        'claim'
      );

      return { success: true };
    } catch (err) {
      console.error('[Web3Context] Withdraw error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel pending transfer
   */
  const cancelRemittance = async (transferId) => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 800));

      const currentGlobal = getGlobalTransfers();
      const updatedGlobal = currentGlobal.map((t) =>
        t.transferId === transferId ? { ...t, status: 3 } : t
      );
      saveGlobalTransfers(updatedGlobal);
      reloadAccountTransfers(account);

      if (userProfile) {
        syncToVault(userProfile, rmtBalance, ethBalance);
      }

      triggerNotification('Transfer Refunded', 'Cancelled escrow deposit. Funds refunded to your account.', 'info');

      return { success: true };
    } catch (err) {
      console.error('[Web3Context] Cancel error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        ethBalance,
        rmtBalance,
        network,
        isConnected,
        isDemoMode,
        loading,
        transfers,
        isAuthenticated,
        userProfile,
        notifications,
        activeToast,
        dismissToast,
        markNotificationsAsRead,
        clearNotifications,
        connectWallet,
        enableDemoMode,
        disconnectWallet,
        registerUser,
        loginUser,
        loginWithMetaMask,
        setupTransactionPin,
        logout,
        claimFaucet,
        initiateRemittance,
        withdrawRemittance,
        cancelRemittance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
