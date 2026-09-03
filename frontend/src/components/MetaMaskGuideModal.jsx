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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 relative shadow-2xl bg-white my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>MetaMask Integration & Setup Guide</span>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                Web3 Wallet
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Everything you need to connect, configure test networks, and import RMT tokens
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'quickstart'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>1-Click Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'install'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install MetaMask</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'accounts'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>Pre-funded Test Accounts</span>
          </button>
        </div>

        {activeTab === 'quickstart' && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="flex items-center space-x-2 text-blue-700 font-bold">
                  <PlusCircle className="h-4 w-4 text-blue-600" />
                  <span>Import RMT Token to MetaMask</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Automatically add the RemitCoin (RMT) token symbol and contract to your wallet asset list.
                </p>
                <button
                  onClick={handleAddTokenToMetaMask}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add RMT Token to MetaMask</span>
                </button>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                  <Network className="h-4 w-4 text-emerald-600" />
                  <span>Add Local Hardhat Network</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Add custom RPC network (`http://127.0.0.1:8545`, Chain ID 31337) to MetaMask in one click.
                </p>
                <button
                  onClick={handleAddHardhatNetwork}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all"
                >
                  <Network className="h-4 w-4" />
                  <span>Add Hardhat Localnet</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <h4 className="font-bold text-slate-900">Deployed Smart Contract Addresses</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  <div>
                    <span className="text-slate-500 font-medium">RemitCoin (RMT Token):</span>
                    <p className="font-mono text-slate-900 text-[11px] font-extrabold">{addresses.remitCoin}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(addresses.remitCoin, 'remitCoin')}
                    className="flex items-center space-x-1 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    {copiedKey === 'remitCoin' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'remitCoin' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                  <div>
                    <span className="text-slate-500 font-medium">RemittanceSystem (Escrow):</span>
                    <p className="font-mono text-slate-900 text-[11px] font-extrabold">{addresses.remittanceSystem}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(addresses.remittanceSystem, 'system')}
                    className="flex items-center space-x-1 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    {copiedKey === 'system' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'system' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'install' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 font-medium">
              MetaMask is a secure Web3 browser extension and mobile wallet that lets you interact with Ethereum DApps like RemitChain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 hover:border-amber-400 transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Download className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Chrome / Brave</h4>
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    Browser Extension <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-indigo-800 font-medium">
              <span className="font-bold">⚡ For Evaluators & Testers:</span> Import any of the following pre-funded private keys into your MetaMask wallet to immediately get <strong>10,000 ETH</strong> on localnet!
            </div>

            <div className="space-y-3">
              {HARDHAT_ACCOUNTS.map((acc, idx) => (
                <div key={idx} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{acc.name}</h4>
                      <span className="text-[11px] text-slate-600 font-medium">{acc.role} — <strong className="text-emerald-700 font-bold">{acc.balance}</strong></span>
                    </div>
                    <button
                      onClick={() => handleCopy(acc.privateKey, `pk_${idx}`)}
                      className="flex items-center space-x-1 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-blue-700 font-bold hover:bg-blue-100"
                    >
                      {copiedKey === `pk_${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Key className="h-3.5 w-3.5" />}
                      <span>{copiedKey === `pk_${idx}` ? 'Key Copied!' : 'Copy Private Key'}</span>
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="text-slate-500">Address: <span className="text-slate-900 font-bold">{acc.address}</span></div>
                    <div className="text-slate-500">Private Key: <span className="text-amber-800 font-extrabold">{acc.privateKey}</span></div>
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
