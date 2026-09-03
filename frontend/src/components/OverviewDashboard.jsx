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
      {/* Executive Welcome & Account Banner - High Contrast Light Theme */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg relative overflow-hidden bg-white text-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-xs text-blue-800 font-extrabold">
                <Globe className="h-3.5 w-3.5 text-blue-600" />
                <span>Official RemitChain Dashboard</span>
              </span>
              <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-1 text-[11px] text-emerald-800 font-extrabold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-bit Encrypted Vault</span>
              </span>
            </div>

            {/* Ultra-Clear & Bold Welcome Heading */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome back,{' '}
              <span className="text-blue-600 underline decoration-blue-300 underline-offset-4">
                {userProfile?.name || 'Account User'}
              </span>
              ! 👋
            </h1>

            <p className="text-xs font-semibold text-slate-600 max-w-xl">
              Account Email:{' '}
              <strong className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                {userProfile?.email}
              </strong>{' '}
              | Contact:{' '}
              <strong className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                {userProfile?.phone}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateSend}
              className="flex items-center space-x-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Send Remittance</span>
            </button>

            <button
              onClick={onNavigateHistory}
              className="flex items-center space-x-2 rounded-2xl bg-slate-100 border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-200 transition-all"
            >
              <History className="h-4 w-4 text-slate-600" />
              <span>View Escrow Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* New User Welcome Callout */}
      {isNewUser && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-blue-500/10 border border-amber-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">New Secure Account Initialized!</h3>
              <p className="text-xs text-slate-600 font-medium">
                Your account is clean with 0 transfers. Claim 1,000 free RMT test tokens from the faucet to send your first remittance!
              </p>
            </div>
          </div>

          <button
            onClick={() => claimFaucet(account, '1000')}
            className="rounded-xl bg-amber-500 py-2.5 px-4 text-xs font-extrabold text-slate-950 hover:bg-amber-400 shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Coins className="h-4 w-4" />
            <span>Claim 1,000 Free RMT Tokens</span>
          </button>
        </div>
      )}

      {/* 4 Executive Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: User Remittance Volume */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 space-y-3 relative overflow-hidden bg-white shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Your Remittance Volume</span>
            <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ${userVolumeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-blue-600 font-bold mt-1 block">
              {transfers.length} Total Remittances Sent/Received
            </span>
          </div>
        </div>

        {/* Card 2: Total Banking Fees Saved */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 space-y-3 relative overflow-hidden bg-white shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Your Banking Fees Saved</span>
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              ${(userVolumeUSD * 0.06).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
              Saved vs traditional 6.2% bank fees
            </span>
          </div>
        </div>

        {/* Card 3: Wallet RMT Balance */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 space-y-3 relative overflow-hidden bg-white shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Available RMT Balance</span>
            <div className="h-10 w-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">{rmtBalance} RMT</div>
            <span className="text-[11px] text-purple-700 font-bold mt-1 block">
              1 RMT ≈ 1.00 USD
            </span>
          </div>
        </div>

        {/* Card 4: Active Pending Escrows */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 space-y-3 relative overflow-hidden bg-white shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Active Escrow Deposits</span>
            <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-700 font-mono">
              {pendingTransfers.length} Pending
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
              {completedTransfers.length} Completed Payouts
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Activity Ledger (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 space-y-4 bg-white shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                <span>Your Transaction Ledger</span>
              </h3>
              <button
                onClick={onNavigateHistory}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {transfers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <Coins className="h-10 w-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-medium">No transactions recorded for this account yet.</p>
                  <button
                    onClick={onNavigateSend}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500"
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
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/60 text-blue-700 border border-blue-200">
                          {statusNum === 1 ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">
                            {t.senderName || shortenAddress(t.sender)} → {t.recipientName || shortenAddress(t.recipient)}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Tx Hash: {shortenAddress(t.txHash || t.transferId)}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex items-center sm:block justify-between">
                        <div className="text-sm font-extrabold text-slate-900">{formatTokens(t.amount)} RMT</div>
                        <div className="text-xs text-emerald-700 font-extrabold">
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
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 space-y-4 bg-white shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-600" />
              <span>Quick Send Remittance</span>
            </h3>
            <p className="text-xs text-slate-500">
              Send instant USD payout to family in India or Mexico with 0.2% fee.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600 font-bold">USD ➡️ INR Rate</span>
                <span className="text-sm font-extrabold text-emerald-600 font-mono">1 USD = ₹83.50</span>
              </div>

              <button
                onClick={onNavigateSend}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-md"
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
