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
        <h2 className="text-3xl font-black text-white flex items-center justify-center gap-2">
          <Calculator className="h-7 w-7 text-zinc-400" />
          <span>Fee & Settlement Comparison</span>
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto font-normal">
          Compare real-time cost savings between traditional wire services and the RemitChain blockchain framework.
        </p>
      </div>

      {/* Interactive Slider Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-2xl bg-zinc-950/85 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Select Monthly Remittance Amount
            </label>
            <span className="text-2xl font-black text-white font-mono">
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
            className="w-full h-3 bg-black rounded-lg appearance-none cursor-pointer accent-white border border-zinc-800"
          />
          <div className="flex justify-between text-[11px] text-zinc-500 mt-1 font-mono font-bold">
            <span>$50</span>
            <span>$1,000</span>
            <span>$5,000</span>
            <span>$10,000</span>
          </div>
        </div>

        {/* Side by Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Traditional Bank */}
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800/80 p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-zinc-900 px-3 py-1 text-[10px] font-bold text-zinc-400 border-b border-l border-zinc-800 rounded-bl-xl uppercase">
              Legacy Banking
            </div>

            <h3 className="text-lg font-bold text-white">Traditional Wire / Banks</h3>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-zinc-400">
                <span>Base Wire Fee:</span>
                <span className="text-white font-mono font-bold">${(amount * bankFeePercent).toFixed(2)} (6.2%)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Fixed Bank Commission:</span>
                <span className="text-white font-mono font-bold">$5.00</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Hidden FX Spread (2.5%):</span>
                <span className="text-white font-mono font-bold">${(amount * bankForexSpread).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Settlement Speed:</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 2 - 5 Business Days
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-400">Total Transfer Fee:</span>
              <span className="text-xl font-bold text-rose-400 font-mono">${traditionalTotalFee.toFixed(2)}</span>
            </div>
          </div>

          {/* RemitChain DApp */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-700/80 p-6 space-y-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 bg-white px-3 py-1 text-[10px] font-black text-black border-b border-l border-zinc-300 rounded-bl-xl uppercase flex items-center gap-1">
              <Zap className="h-3 w-3" /> Recommended
            </div>

            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>RemitChain Protocol</span>
            </h3>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-zinc-400">
                <span>Platform Fee (0.2%):</span>
                <span className="text-white font-mono font-bold">${(amount * remitChainFeePercent).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Network Gas Fee:</span>
                <span className="text-white font-mono font-bold">~$0.15</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Exchange Rate Spread:</span>
                <span className="text-emerald-400 font-bold">0.00% (Direct Market)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Settlement Speed:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3" /> &lt; 60 Seconds
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-400">Total Transfer Fee:</span>
              <span className="text-xl font-black text-emerald-400 font-mono">${remitChainTotalFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Total Savings Banner */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 text-center space-y-2 shadow-sm">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-zinc-950 border border-zinc-800 px-3 py-1 text-xs font-bold text-emerald-400">
            <TrendingDown className="h-4 w-4" />
            <span>You Save {percentSaved}% per transfer</span>
          </div>

          <div className="text-4xl font-black text-white tracking-tight font-mono">
            ${totalSavedUSD.toFixed(2)} <span className="text-base text-zinc-400 font-sans font-normal">saved per transfer</span>
          </div>

          <p className="text-xs text-zinc-400 font-normal">
            An annual savings of <strong className="text-white font-bold font-mono">${annualSavingsUSD.toFixed(2)} USD</strong> for someone sending money monthly to family abroad.
          </p>
        </div>
      </div>
    </div>
  );
};
