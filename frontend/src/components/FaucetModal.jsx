import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Coins, X, CheckCircle2, RefreshCw } from 'lucide-react';

export const FaucetModal = ({ isOpen, onClose }) => {
  const { account, claimFaucet, loading } = useWeb3();
  const [recipient, setRecipient] = useState(account || '');
  const [amount, setAmount] = useState('1000');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleClaim = async (e) => {
    e.preventDefault();
    const targetAddr = recipient || account;
    if (!targetAddr) {
      alert('Please enter a target wallet address.');
      return;
    }

    const res = await claimFaucet(targetAddr, amount);
    if (res.success) {
      setSuccessMsg(`Successfully minted ${amount} RMT test tokens!`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-200 space-y-4 relative shadow-2xl bg-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">RemitCoin Demo Faucet</h3>
            <p className="text-xs text-slate-500 font-medium">Claim test RMT stablecoins to test cross-border payouts</p>
          </div>
        </div>

        {successMsg ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-emerald-800">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleClaim} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Wallet Address
              </label>
              <input
                type="text"
                value={recipient || account || ''}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Claim Amount (RMT)
              </label>
              <select
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="500">500 RMT</option>
                <option value="1000">1,000 RMT (Recommended)</option>
                <option value="2500">2,500 RMT</option>
                <option value="5000">5,000 RMT (Max)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Minting Test Tokens...</span>
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4" />
                  <span>Claim Test RMT Tokens</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
