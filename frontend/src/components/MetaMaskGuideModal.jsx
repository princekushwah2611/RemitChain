import React, { useState } from 'react';
import { getContractAddresses } from '../services/blockchainService';
import {
  Wallet,
  Download,
  Key,
  HelpCircle,
  Copy,
  Check,
  PlusCircle,
  Network,
  ExternalLink,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';

const HARDHAT_ACCOUNTS = [
  {
    name: 'Deployer Account',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    balance: '10,000 ETH',
    role: 'Admin / Contract Deployer',
  },
  {
    name: 'Rahul (NRI Sender)',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    balance: '10,000 ETH',
    role: 'Primary Sender',
  },
  {
    name: 'Priya (Family Recipient)',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    privateKey: '0x5de4111daf4ef5b27e0898e296492794d78701e6f5166891a0aa249fe6050b96',
    balance: '10,000 ETH',
    role: 'Primary Recipient',
  },
];

export const MetaMaskGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [copiedKey, setCopiedKey] = useState('');

  if (!isOpen) return null;

  const addresses = getContractAddresses();

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleAddTokenToMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not detected. Please install MetaMask extension first.');
      return;
    }
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: addresses.remitCoin,
            symbol: 'RMT',
            decimals: 18,
            image: 'https://cdn-icons-png.flaticon.com/512/12114/12114233.png',
          },
        },
      });

      if (wasAdded) {
        alert('✅ RemitCoin (RMT) token successfully added to your MetaMask wallet!');
      }
    } catch (error) {
      console.error('Error adding token to MetaMask:', error);
      alert(`Could not add token: ${error.message}`);
    }
  };

  const handleAddHardhatNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not detected.');
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x7A69',
            chainName: 'Hardhat Localnet (RemitChain)',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['http://127.0.0.1:8545'],
            blockExplorerUrls: null,
          },
        ],
      });
      alert('✅ Hardhat Local Network added & selected in MetaMask!');
    } catch (error) {
      console.error('Error adding chain:', error);
      alert(`Network setup error: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6 relative shadow-2xl bg-zinc-950 text-white my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-zinc-900 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-zinc-900 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white border border-zinc-800">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>MetaMask Web3 Setup Guide</span>
              <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-bold text-zinc-300 border border-zinc-800">
                Web3 Wallet
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-normal mt-0.5">
              Everything you need to connect, configure test networks, and import RMT tokens
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'quickstart'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>1-Click Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'install'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install Extension</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'accounts'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>Test Accounts</span>
          </button>
        </div>

        {activeTab === 'quickstart' && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-black border border-zinc-800 p-4 space-y-3">
                <div className="flex items-center space-x-2 text-zinc-200 font-bold">
                  <PlusCircle className="h-4 w-4 text-zinc-300" />
                  <span>Import RMT Token to MetaMask</span>
                </div>
                <p className="text-zinc-400 leading-relaxed font-normal">
                  Automatically add the RemitCoin (RMT) token symbol and contract to your wallet asset list.
                </p>
                <button
                  onClick={handleAddTokenToMetaMask}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-white text-black py-2.5 text-xs font-black shadow-md hover:bg-zinc-200 transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add RMT Token to MetaMask</span>
                </button>
              </div>

              <div className="rounded-2xl bg-black border border-zinc-800 p-4 space-y-3">
                <div className="flex items-center space-x-2 text-zinc-200 font-bold">
                  <Network className="h-4 w-4 text-zinc-300" />
                  <span>Add Local Hardhat Network</span>
                </div>
                <p className="text-zinc-400 leading-relaxed font-normal">
                  Add custom RPC network (`http://127.0.0.1:8545`, Chain ID 31337) to MetaMask in one click.
                </p>
                <button
                  onClick={handleAddHardhatNetwork}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 py-2.5 text-xs font-bold hover:bg-zinc-700 transition-all"
                >
                  <Network className="h-4 w-4" />
                  <span>Add Hardhat Localnet</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-black border border-zinc-800 p-4 space-y-3">
              <h4 className="font-bold text-white">Deployed Smart Contract Addresses</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 font-medium">RemitCoin (RMT Token):</span>
                    <p className="font-mono text-white text-[11px] font-bold">{addresses.remitCoin}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(addresses.remitCoin, 'remitCoin')}
                    className="flex items-center space-x-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-300 font-bold hover:bg-zinc-800 hover:text-white"
                  >
                    {copiedKey === 'remitCoin' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'remitCoin' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 font-medium">RemittanceSystem (Escrow):</span>
                    <p className="font-mono text-white text-[11px] font-bold">{addresses.remittanceSystem}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(addresses.remittanceSystem, 'system')}
                    className="flex items-center space-x-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-300 font-bold hover:bg-zinc-800 hover:text-white"
                  >
                    {copiedKey === 'system' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'system' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'install' && (
          <div className="space-y-4 text-xs">
            <p className="text-zinc-400 font-normal">
              MetaMask is a secure Web3 browser extension and mobile wallet that lets you interact with Ethereum DApps like RemitChain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rounded-2xl bg-black border border-zinc-800 p-3.5 hover:border-zinc-500 transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                  <Download className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Chrome / Brave</h4>
                  <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                    Browser Extension <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-zinc-300 font-normal">
              <span className="font-bold text-white">⚡ For Evaluators & Testers:</span> Import any of the following pre-funded private keys into your MetaMask wallet to immediately get <strong>10,000 ETH</strong> on localnet!
            </div>

            <div className="space-y-3">
              {HARDHAT_ACCOUNTS.map((acc, idx) => (
                <div key={idx} className="rounded-2xl bg-black border border-zinc-800 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">{acc.name}</h4>
                      <span className="text-[11px] text-zinc-400 font-normal">{acc.role} — <strong className="text-emerald-400 font-bold">{acc.balance}</strong></span>
                    </div>
                    <button
                      onClick={() => handleCopy(acc.privateKey, `pk_${idx}`)}
                      className="flex items-center space-x-1 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1 text-zinc-200 font-bold hover:bg-zinc-800 hover:text-white"
                    >
                      {copiedKey === `pk_${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Key className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `pk_${idx}` ? 'Copied' : 'Copy Key'}</span>
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-zinc-500">Address: <span className="text-zinc-300 font-bold">{acc.address}</span></div>
                    <div className="text-zinc-500">Private Key: <span className="text-zinc-200 font-bold">{acc.privateKey}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
