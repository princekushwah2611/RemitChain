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
    <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white">RemitChain</span>
              <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-800/80">
                256-bit Vault
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold hidden sm:block">
              Blockchain Cross-Border Remittance Framework
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 rounded-2xl bg-slate-900/90 p-1 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('send')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'send'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Send Money</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Escrow Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 transition-all ${
              activeTab === 'comparison'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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
            className="flex items-center space-x-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all shadow-xs"
          >
            <Coins className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">RMT Faucet</span>
          </button>

          {/* Top Notifications Bell Center */}
          <NotificationCenter />

          {/* User Account Menu */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 rounded-2xl bg-slate-900 border border-slate-800 px-3.5 py-2 shadow-xs hover:border-slate-700 transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden lg:block text-xs">
                  <div className="font-extrabold text-white leading-tight">
                    {userProfile?.name || 'Account User'}
                  </div>
                  <div className="font-mono text-emerald-400 text-[10px] font-bold">
                    {rmtBalance} RMT
                  </div>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-900/50 transition-all"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all"
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
