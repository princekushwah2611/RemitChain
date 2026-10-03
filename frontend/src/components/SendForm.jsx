import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { fetchExchangeRate } from '../services/apiService';
import { shortenAddress } from '../services/blockchainService';
import { TransactionAuthModal } from './TransactionAuthModal';
import {
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  Zap,
  Info,
  ExternalLink,
  UserCheck,
  Check,
  Sparkles,
  Lock,
  Fingerprint,
  Key,
} from 'lucide-react';

const CURRENCY_FLAGS = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  CAD: '🇨🇦',
  INR: '🇮🇳',
  PHP: '🇵🇭',
  MXN: '🇲🇽',
  NGN: '🇳🇬',
  BDT: '🇧🇩',
  PKR: '🇵🇰',
};

const SAMPLE_RECIPIENTS = [
  { label: 'Priya (India - Family)', address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', country: '🇮🇳' },
  { label: 'Amit (International Student)', address: '0x90F79bf6EB2c4f80B08530902646572b310e0709', country: '🇮🇳' },
  { label: 'Carlos (Mexico - Freelancer)', address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', country: '🇲🇽' },
];

export const SendForm = ({ onTransferSuccess }) => {
  const { account, isConnected, rmtBalance, initiateRemittance, loading, enableDemoMode } = useWeb3();

  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [amount, setAmount] = useState('500');
  const [recipient, setRecipient] = useState('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');

  const [rateData, setRateData] = useState({ rate: 83.5, source: 'loading' });
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const [txStep, setTxStep] = useState(0);
  const [txResult, setTxResult] = useState(null);

  // Security Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const updateRate = async () => {
    setIsFetchingRate(true);
    try {
      const data = await fetchExchangeRate(sourceCurrency, targetCurrency);
      setRateData(data);
    } catch (err) {
      console.warn('Rate update error:', err);
    } finally {
      setIsFetchingRate(false);
    }
  };

  useEffect(() => {
    updateRate();
  }, [sourceCurrency, targetCurrency]);

  const numericAmount = parseFloat(amount) || 0;
  const calculatedPayout = (numericAmount * (rateData.rate || 1)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const remitFeeUSD = (numericAmount * 0.002).toFixed(2);
  const traditionalBankFeeUSD = (numericAmount * 0.062 + 5.0).toFixed(2);
  const netSavingsUSD = (parseFloat(traditionalBankFeeUSD) - parseFloat(remitFeeUSD)).toFixed(2);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!isConnected) {
      enableDemoMode();
      return;
    }

    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      alert('Please enter a valid Ethereum recipient wallet address (0x...)');
      return;
    }

    if (numericAmount <= 0) {
      alert('Please enter an amount greater than 0');
      return;
    }

    // Trigger Security Auth Modal (PIN / Touch ID)
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccessAndExecute = async () => {
    setIsAuthModalOpen(false);
    setTxStep(1);

    const result = await initiateRemittance({
      recipient,
      amount: numericAmount,
      senderCurrency: sourceCurrency,
      recipientCurrency: targetCurrency,
      exchangeRate: rateData.rate,
    });

    if (result.success) {
      setTxResult(result);
      setTxStep(3);
      if (onTransferSuccess) onTransferSuccess();
    } else {
      setTxStep(0);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Visual Stepper */}
      <div className="flex items-center justify-between px-4 text-xs font-bold text-zinc-500">
        <div className="flex items-center space-x-2 text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black font-black">1</span>
          <span>Configure Remittance</span>
        </div>
        <div className="h-0.5 flex-1 bg-zinc-800 mx-3" />
        <div className="flex items-center space-x-2 text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black font-black">2</span>
          <span>PIN / Biometric Auth</span>
        </div>
        <div className="h-0.5 flex-1 bg-zinc-800 mx-3" />
        <div className="flex items-center space-x-2 text-zinc-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 font-bold">3</span>
          <span>Smart Contract Escrow</span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 space-y-6 bg-zinc-950/85 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Send className="h-5 w-5 text-zinc-400" />
              <span>Send Global Remittance</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Instant peer-to-peer payout via Smart Contract Escrow</p>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs text-zinc-300 font-bold">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>PIN / Biometric Protected</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Amount & Source Currency */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              You Send (Source Amount)
            </label>
            <div className="relative flex rounded-2xl bg-black border border-zinc-800 focus-within:border-zinc-400 transition-all p-1.5 shadow-inner">
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent px-4 text-2xl font-black text-white placeholder-zinc-600 focus:outline-none"
                required
              />
              <div className="flex items-center space-x-2 bg-zinc-900 rounded-xl px-3 py-2 border border-zinc-800 shadow-sm">
                <span className="text-lg">{CURRENCY_FLAGS[sourceCurrency]}</span>
                <select
                  value={sourceCurrency}
                  onChange={(e) => setSourceCurrency(e.target.value)}
                  className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="USD" className="bg-zinc-900 text-white">USD ($)</option>
                  <option value="EUR" className="bg-zinc-900 text-white">EUR (€)</option>
                  <option value="GBP" className="bg-zinc-900 text-white">GBP (£)</option>
                  <option value="CAD" className="bg-zinc-900 text-white">CAD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exchange Rate Banner */}
          <div className="flex items-center justify-between rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs text-zinc-300">
            <div className="flex items-center space-x-2">
              <RefreshCw className={`h-3.5 w-3.5 text-zinc-400 ${isFetchingRate ? 'animate-spin' : ''}`} />
              <span>
                1 {sourceCurrency} = <strong className="text-white">{rateData.rate}</strong> {targetCurrency}
              </span>
              <span className="text-[10px] text-zinc-300 bg-black px-2 py-0.5 rounded border border-zinc-800 uppercase font-bold shadow-xs">
                {rateData.source}
              </span>
            </div>
            <button type="button" onClick={updateRate} className="text-zinc-400 hover:text-white hover:underline text-[11px] font-bold">
              Refresh Rate
            </button>
          </div>

          {/* Target Currency Payout */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Recipient Receives (Target Payout)
            </label>
            <div className="relative flex items-center rounded-2xl bg-black border border-zinc-800 p-3 shadow-inner">
              <div className="w-full px-2 text-2xl font-black text-emerald-400 font-mono">{calculatedPayout}</div>
              <div className="flex items-center space-x-2 bg-zinc-900 rounded-xl px-3 py-2 border border-zinc-800 shadow-sm">
                <span className="text-lg">{CURRENCY_FLAGS[targetCurrency]}</span>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="INR" className="bg-zinc-900 text-white">INR (₹)</option>
                  <option value="PHP" className="bg-zinc-900 text-white">PHP (₱)</option>
                  <option value="MXN" className="bg-zinc-900 text-white">MXN ($)</option>
                  <option value="NGN" className="bg-zinc-900 text-white">NGN (₦)</option>
                  <option value="BDT" className="bg-zinc-900 text-white">BDT (৳)</option>
                  <option value="PKR" className="bg-zinc-900 text-white">PKR (Rs)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recipient Wallet Address */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Recipient Ethereum Wallet Address
              </label>
              <span className="text-xs text-zinc-500 font-mono">0x... (42 chars)</span>
            </div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-3 text-xs font-mono text-white placeholder-zinc-600 focus:border-zinc-400 focus:outline-none"
              required
            />

            {/* Demo Quick Selectors */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-bold">
                <UserCheck className="h-3 w-3" /> Quick presets:
              </span>
              {SAMPLE_RECIPIENTS.map((rec) => (
                <button
                  type="button"
                  key={rec.address}
                  onClick={() => setRecipient(rec.address)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all flex items-center gap-1 ${
                    recipient === rec.address
                      ? 'bg-zinc-800 border-zinc-500 text-white font-bold'
                      : 'bg-black border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>{rec.country}</span>
                  <span>{rec.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fee & Savings Breakdown */}
          <div className="rounded-2xl bg-black border border-zinc-800/90 p-4 space-y-2.5 text-xs text-zinc-300">
            <div className="flex justify-between text-zinc-400">
              <span>RemitChain Fee (0.2%):</span>
              <span className="font-bold text-emerald-400 font-mono">${remitFeeUSD}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Est. Network Gas Fee:</span>
              <span className="font-bold text-zinc-300 font-mono">~$0.15 USD</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Traditional Bank Fee (~6.2% + $5):</span>
              <span className="font-bold text-rose-400 font-mono">${traditionalBankFeeUSD}</span>
            </div>
            <div className="border-t border-zinc-800 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-white font-black">Net Savings vs Banking:</span>
              <span className="text-emerald-400 bg-zinc-900 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg font-mono">
                Save ${netSavingsUSD} (96% less)
              </span>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2.5 rounded-2xl bg-white py-4 text-base font-black text-black shadow-xl shadow-white/5 hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin text-black" />
                <span>Executing Escrow Smart Contract...</span>
              </>
            ) : (
              <>
                <Key className="h-5 w-5" />
                <span>Authorize & Send via PIN / Biometrics</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Auth Modal */}
      <TransactionAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticateSuccess={handleAuthSuccessAndExecute}
        transferDetails={{
          amount: numericAmount,
          targetPayout: calculatedPayout,
          recipientCurrency: targetCurrency,
          recipient,
        }}
      />

      {/* Success Modal */}
      {txStep === 3 && txResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-zinc-700 text-center space-y-4 shadow-2xl bg-zinc-950 text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-emerald-400 border border-zinc-800">
              <CheckCircle2 className="h-10 w-10 animate-pulse" />
            </div>

            <h3 className="text-2xl font-black text-white">Transfer Authorized & Escrowed</h3>
            <p className="text-xs text-zinc-400">
              Security PIN verified. Tokens successfully deposited into <code className="text-zinc-200 font-bold">RemittanceSystem.sol</code>.
            </p>

            <div className="rounded-2xl bg-black p-4 text-left space-y-2 text-xs font-mono border border-zinc-800">
              <div className="flex justify-between text-zinc-400">
                <span>Transaction Hash:</span>
                <span className="text-zinc-200 font-bold">{shortenAddress(txResult.txHash)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Escrow Transfer ID:</span>
                <span className="text-zinc-200 font-bold">{shortenAddress(txResult.transferId)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Target Payout:</span>
                <span className="text-emerald-400 font-bold">{calculatedPayout} {targetCurrency}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setTxStep(0);
                setTxResult(null);
              }}
              className="w-full rounded-xl bg-white py-3 text-sm font-black text-black hover:bg-zinc-200 transition-all shadow-md"
            >
              View Escrow Status in Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
