import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress, formatTokens } from '../services/blockchainService';
import {
  TrendingUp,
  DollarSign,
  Zap,
  ShieldCheck,
  Send,
  History,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  ExternalLink,
  Users,
  Globe,
  Lock,
  Sparkles,
} from 'lucide-react';

export const OverviewDashboard = ({ onNavigateSend, onNavigateHistory }) => {
  const { account, ethBalance, rmtBalance, transfers, isAuthenticated, userProfile, claimFaucet } = useWeb3();

  const pendingTransfers = transfers.filter((t) => Number(t.status) === 0);
  const completedTransfers = transfers.filter((t) => Number(t.status) === 1);

  const userVolumeUSD = transfers.reduce((acc, t) => {
    return acc + parseFloat(formatTokens(t.amount || 0));
  }, 0);

  const isNewUser = transfers.length === 0 && parseFloat(rmtBalance.replace(/,/g, '')) === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Executive Welcome & Account Banner - Stylish Gray and Black Theme */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden bg-zinc-950/80 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs text-zinc-300 font-bold">
                <Globe className="h-3.5 w-3.5 text-zinc-400" />
                <span>RemitChain Executive Dashboard</span>
              </span>
              <span className="inline-flex items-center space-x-1 rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>256-bit Encrypted Vault</span>
              </span>
            </div>

            {/* Bold Welcome Heading in Stylish Gray and Black */}
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent underline decoration-zinc-600 underline-offset-4">
                {userProfile?.name || 'Account User'}
              </span>
              ! 👋
            </h1>

            <p className="text-xs font-semibold text-zinc-400 max-w-xl">
              Account Email:{' '}
              <strong className="text-zinc-200 font-mono bg-black px-2 py-0.5 rounded border border-zinc-800 font-bold">
                {userProfile?.email}
              </strong>{' '}
              | Contact:{' '}
              <strong className="text-zinc-200 font-mono bg-black px-2 py-0.5 rounded border border-zinc-800 font-bold">
                {userProfile?.phone}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateSend}
              className="flex items-center space-x-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-black shadow-lg shadow-white/10 hover:bg-zinc-200 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Send Remittance</span>
            </button>

            <button
              onClick={onNavigateHistory}
              className="flex items-center space-x-2 rounded-2xl bg-zinc-900 border border-zinc-800 px-5 py-3 text-sm font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <History className="h-4 w-4 text-zinc-400" />
              <span>View Escrow Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* New User Welcome Callout */}
      {isNewUser && (
        <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm">New Secure Account Initialized</h3>
              <p className="text-xs text-zinc-400 font-normal">
                Your account is clean with 0 transfers. Claim 1,000 free RMT test tokens from the faucet to send your first remittance!
              </p>
            </div>
          </div>

          <button
            onClick={() => claimFaucet(account, '1000')}
            className="rounded-xl bg-white py-2.5 px-4 text-xs font-black text-black hover:bg-zinc-200 shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Coins className="h-4 w-4" />
            <span>Claim 1,000 Free RMT Tokens</span>
          </button>
        </div>
      )}

      {/* 4 Executive Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: User Remittance Volume */}
        <div className="glass-panel rounded-3xl p-5 border border-zinc-800 space-y-3 relative overflow-hidden bg-zinc-950/80 shadow-xl glass-card-hover">
          <div className="flex justify-between items-center text-zinc-400 text-xs font-bold">
            <span>Remittance Volume</span>
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">
              ${userVolumeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-zinc-400 font-medium mt-1 block">
              {transfers.length} Total Remittances Sent/Received
            </span>
          </div>
        </div>

        {/* Card 2: Total Banking Fees Saved */}
        <div className="glass-panel rounded-3xl p-5 border border-zinc-800 space-y-3 relative overflow-hidden bg-zinc-950/80 shadow-xl glass-card-hover">
          <div className="flex justify-between items-center text-zinc-400 text-xs font-bold">
            <span>Banking Fees Saved</span>
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${(userVolumeUSD * 0.06).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-zinc-400 font-medium mt-1 block">
              Saved vs traditional 6.2% bank fees
            </span>
          </div>
        </div>

        {/* Card 3: Wallet RMT Balance */}
        <div className="glass-panel rounded-3xl p-5 border border-zinc-800 space-y-3 relative overflow-hidden bg-zinc-950/80 shadow-xl glass-card-hover">
          <div className="flex justify-between items-center text-zinc-400 text-xs font-bold">
            <span>Available RMT Balance</span>
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{rmtBalance} RMT</div>
            <span className="text-[11px] text-zinc-400 font-medium mt-1 block">
              1 RMT ≈ 1.00 USD
            </span>
          </div>
        </div>

        {/* Card 4: Active Pending Escrows */}
        <div className="glass-panel rounded-3xl p-5 border border-zinc-800 space-y-3 relative overflow-hidden bg-zinc-950/80 shadow-xl glass-card-hover">
          <div className="flex justify-between items-center text-zinc-400 text-xs font-bold">
            <span>Active Escrow Deposits</span>
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {pendingTransfers.length} Pending
            </div>
            <span className="text-[11px] text-zinc-400 font-medium mt-1 block">
              {completedTransfers.length} Completed Payouts
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Activity Ledger (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-zinc-800 space-y-4 bg-zinc-950/80 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <History className="h-5 w-5 text-zinc-400" />
                <span>Your Transaction Ledger</span>
              </h3>
              <button
                onClick={onNavigateHistory}
                className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View Full History</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {transfers.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-3">
                  <Coins className="h-10 w-10 text-zinc-700 mx-auto" />
                  <p className="text-xs font-medium">No transactions recorded for this account yet.</p>
                  <button
                    onClick={onNavigateSend}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-white px-4 py-2 text-xs font-black text-black shadow-md hover:bg-zinc-200"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Your First Remittance</span>
                  </button>
                </div>
              ) : (
                transfers.slice(0, 4).map((t, idx) => {
                  const statusNum = Number(t.status);
                  const targetPayoutStr = (Number(t.targetAmount) / 100).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  return (
                    <div
                      key={t.transferId || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-black border border-zinc-800/80 gap-3 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {statusNum === 1 ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs">
                            {t.senderName || shortenAddress(t.sender)} → {t.recipientName || shortenAddress(t.recipient)}
                          </h4>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            Tx Hash: {shortenAddress(t.txHash || t.transferId)}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex items-center sm:block justify-between">
                        <div className="text-sm font-black text-white">{formatTokens(t.amount)} RMT</div>
                        <div className="text-xs text-emerald-400 font-bold font-mono">
                          {targetPayoutStr} {t.recipientCurrency}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Send Widget (1 col) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-zinc-800 space-y-4 bg-zinc-950/80 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-zinc-400" />
              <span>Quick Send Remittance</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Send instant USD payout to family in India or Mexico with 0.2% fee.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-black border border-zinc-800">
                <span className="text-xs text-zinc-400 font-bold">USD ➡️ INR Rate</span>
                <span className="text-sm font-black text-emerald-400 font-mono">1 USD = ₹83.50</span>
              </div>

              <button
                onClick={onNavigateSend}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-white py-3 text-xs font-black text-black hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
              >
                <span>Open Remittance Form</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
