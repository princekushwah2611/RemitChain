import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress } from '../services/blockchainService';
import { NotificationCenter } from './NotificationCenter';
import {
  Globe,
  Wallet,
  Send,
  History,
  Calculator,
  Coins,
  ShieldCheck,
  User,
  LogOut,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenFaucet,
  onOpenMetaMaskGuide,
  onOpenLogin,
}) => {
  const {
    account,
    ethBalance,
    rmtBalance,
    isConnected,
    isDemoMode,
    connectWallet,
    logout,
    userProfile,
    isAuthenticated,
  } = useWeb3();

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg shadow-white/10">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white">RemitChain</span>
              <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300 border border-zinc-800">
                256-bit Vault
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium hidden sm:block">
              Decentralized Cross-Border Protocol
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 rounded-2xl bg-zinc-950 p-1 border border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('send')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 transition-all ${
              activeTab === 'send'
                ? 'bg-white text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Send Money</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Escrow Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 transition-all ${
              activeTab === 'comparison'
                ? 'bg-white text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Fee Calculator</span>
          </button>
        </div>

        {/* Right Actions: Faucet + Notifications + User Auth Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* RMT Faucet Button */}
          <button
            onClick={onOpenFaucet}
            className="flex items-center space-x-1.5 rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all shadow-xs"
          >
            <Coins className="h-4 w-4 text-zinc-400" />
            <span className="hidden sm:inline">RMT Faucet</span>
          </button>

          {/* Top Notifications Bell Center */}
          <NotificationCenter />

          {/* User Account Menu */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 shadow-xs hover:border-zinc-700 transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-white text-black flex items-center justify-center text-xs font-black">
                  {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden lg:block text-xs">
                  <div className="font-extrabold text-white leading-tight">
                    {userProfile?.name || 'Account User'}
                  </div>
                  <div className="font-mono text-zinc-400 text-[10px] font-bold">
                    {rmtBalance} RMT
                  </div>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 border border-zinc-800 transition-all"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 rounded-2xl bg-white text-black px-4 py-2 text-xs font-black hover:bg-zinc-200 transition-all shadow-md shadow-white/5"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
