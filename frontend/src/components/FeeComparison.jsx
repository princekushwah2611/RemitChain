import React, { useState } from 'react';
import { Calculator, TrendingDown, DollarSign, Clock, ShieldCheck, Zap, Layers } from 'lucide-react';

export const FeeComparison = () => {
  const [remittanceAmount, setRemittanceAmount] = useState(1000);

  const amount = parseFloat(remittanceAmount) || 100;

  const bankFeePercent = 0.062;
  const bankFixedFee = 5.0;
  const bankForexSpread = 0.025;
  const traditionalTotalFee = amount * bankFeePercent + bankFixedFee + amount * bankForexSpread;

  const remitChainFeePercent = 0.002;
  const gasFeeUSD = 0.15;
  const remitChainTotalFee = amount * remitChainFeePercent + gasFeeUSD;

  const totalSavedUSD = traditionalTotalFee - remitChainTotalFee;
  const percentSaved = ((totalSavedUSD / traditionalTotalFee) * 100).toFixed(1);
  const annualSavingsUSD = totalSavedUSD * 12;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <Calculator className="h-7 w-7 text-blue-400" />
          <span>Fee & Settlement Comparison</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto font-medium">
          Compare real-time cost savings between traditional wire services and the RemitChain blockchain framework.
        </p>
      </div>

      {/* Interactive Slider Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl bg-slate-900/90 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Monthly Remittance Amount
            </label>
            <span className="text-2xl font-extrabold text-blue-400 font-mono">
              ${amount.toLocaleString()} USD
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="10000"
            step="50"
            value={remittanceAmount}
            onChange={(e) => setRemittanceAmount(e.target.value)}
            className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-slate-800"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono font-bold">
            <span>$50</span>
            <span>$1,000</span>
            <span>$5,000</span>
            <span>$10,000</span>
          </div>
        </div>

        {/* Side by Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Traditional Bank */}
          <div className="rounded-2xl bg-rose-950/20 border border-rose-900/50 p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-950/80 px-3 py-1 text-[10px] font-bold text-rose-300 border-b border-l border-rose-800/80 rounded-bl-xl uppercase">
              Legacy Banking
            </div>

            <h3 className="text-lg font-bold text-white">Traditional Wire / Banks</h3>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-slate-400">
                <span>Base Wire Fee:</span>
                <span className="text-white font-mono font-bold">${(amount * bankFeePercent).toFixed(2)} (6.2%)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fixed Bank Commission:</span>
                <span className="text-white font-mono font-bold">$5.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hidden FX Spread (2.5%):</span>
                <span className="text-white font-mono font-bold">${(amount * bankForexSpread).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Settlement Speed:</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 2 - 5 Business Days
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-rose-900/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Total Transfer Fee:</span>
              <span className="text-xl font-extrabold text-rose-400 font-mono">${traditionalTotalFee.toFixed(2)}</span>
            </div>
          </div>

          {/* RemitChain DApp */}
          <div className="rounded-2xl bg-emerald-950/20 border border-emerald-800/50 p-6 space-y-4 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 bg-emerald-950/80 px-3 py-1 text-[10px] font-extrabold text-emerald-300 border-b border-l border-emerald-800/80 rounded-bl-xl uppercase flex items-center gap-1">
              <Zap className="h-3 w-3" /> Recommended
            </div>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>RemitChain Framework</span>
            </h3>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-slate-400">
                <span>Platform Fee (0.2%):</span>
                <span className="text-white font-mono font-bold">${(amount * remitChainFeePercent).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Network Gas Fee:</span>
                <span className="text-white font-mono font-bold">~$0.15</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Exchange Rate Spread:</span>
                <span className="text-emerald-400 font-bold">0.00% (Direct Market)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Settlement Speed:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3" /> &lt; 60 Seconds
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-900/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Total Transfer Fee:</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">${remitChainTotalFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Total Savings Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-800/50 p-6 text-center space-y-2 shadow-sm">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 text-xs font-extrabold text-emerald-300">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <span>You Save {percentSaved}% per transfer</span>
          </div>

          <div className="text-4xl font-extrabold text-white tracking-tight font-mono">
            ${totalSavedUSD.toFixed(2)} <span className="text-base text-slate-400 font-sans font-normal">saved per transfer</span>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            An annual savings of <strong className="text-emerald-400 font-mono">${annualSavingsUSD.toFixed(2)} USD</strong> for someone sending money monthly to family abroad.
          </p>
        </div>
      </div>
    </div>
  );
};
