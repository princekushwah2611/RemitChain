import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress } from '../services/blockchainService';
import {
  Phone,
  Mail,
  Wallet,
  Lock,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  Key,
  User,
  LogOut,
  RefreshCw,
  Zap,
  Globe,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', country: '🇺🇸 United States / Canada' },
  { code: '+91', country: '🇮🇳 India' },
  { code: '+44', country: '🇬🇧 United Kingdom' },
  { code: '+63', country: '🇵🇭 Philippines' },
  { code: '+52', country: '🇲🇽 Mexico' },
  { code: '+234', country: '🇳🇬 Nigeria' },
];

export const LoginModal = ({ isOpen, onClose }) => {
  const {
    account,
    isConnected,
    isDemoMode,
    connectWallet,
    enableDemoMode,
    loginUser,
    loginWithMetaMask,
    logout,
    userProfile,
    isAuthenticated,
    loading,
  } = useWeb3();

  const [authTab, setAuthTab] = useState('phone');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('555-0192');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);

  const [email, setEmail] = useState('rahul.sharma@remitchain.io');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('sender');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone) return alert('Please enter a valid phone number');
    setOtpStep(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const res = await loginUser(phone, 'password123');
    if (res.success) {
      setOtpStep(false);
      onClose();
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res.success) {
      onClose();
    }
  };

  const handleMetaMaskLogin = async () => {
    const res = await loginWithMetaMask();
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6 relative shadow-2xl bg-zinc-950 text-white my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-zinc-900 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {isAuthenticated ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-lg shadow-white/5">
              <User className="h-8 w-8" />
            </div>

            <div>
              <div className="flex items-center justify-center space-x-2">
                <h3 className="text-xl font-black text-white">{userProfile?.name || 'Authenticated User'}</h3>
                <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300 border border-zinc-800 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> {userProfile?.kycLevel || 'Verified'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-1 font-semibold">{shortenAddress(account || userProfile?.address)}</p>
            </div>

            <div className="rounded-2xl bg-black border border-zinc-800 p-4 space-y-2.5 text-xs text-left text-zinc-300">
              <div className="flex justify-between text-zinc-400">
                <span>Phone / Contact:</span>
                <span className="text-white font-bold">{userProfile?.phone || 'Not linked'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Email Address:</span>
                <span className="text-white font-bold">{userProfile?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Account Role:</span>
                <span className="text-zinc-200 font-bold capitalize">{userProfile?.role || 'Sender'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-zinc-900 border border-zinc-800 py-3 text-xs font-bold text-zinc-300 hover:text-rose-400 hover:bg-zinc-800 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center space-x-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs text-zinc-300 font-bold mb-1">
                <Globe className="h-3.5 w-3.5" />
                <span>RemitChain Auth Portal</span>
              </div>
              <h3 className="text-2xl font-black text-white">Sign In to Your Account</h3>
            </div>

            <div className="flex rounded-2xl bg-black p-1 border border-zinc-800 text-xs font-bold">
              <button
                onClick={() => {
                  setAuthTab('phone');
                  setOtpStep(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl py-2 transition-all ${
                  authTab === 'phone'
                    ? 'bg-white text-black shadow-sm font-black'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Phone OTP</span>
              </button>

              <button
                onClick={() => setAuthTab('email')}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl py-2 transition-all ${
                  authTab === 'email'
                    ? 'bg-white text-black shadow-sm font-black'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </button>

              <button
                onClick={() => setAuthTab('metamask')}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl py-2 transition-all ${
                  authTab === 'metamask'
                    ? 'bg-zinc-800 text-white border border-zinc-700 font-black'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>MetaMask</span>
              </button>
            </div>

            {authTab === 'phone' && (
              <div>
                {!otpStep ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Mobile Phone Number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="rounded-xl bg-black border border-zinc-800 px-3 py-2.5 text-xs font-bold text-white focus:outline-none cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                              {c.code} ({c.country.split(' ')[0]})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="555-0192"
                          className="w-full rounded-xl bg-black border border-zinc-800 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-zinc-400 focus:outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-white py-3 text-sm font-black text-black shadow-lg shadow-white/10 hover:bg-zinc-200 transition-all"
                    >
                      <span>Send SMS Verification</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1 text-center">
                    <div>
                      <span className="text-xs text-zinc-400 font-normal">Enter 6-digit SMS code sent to:</span>
                      <p className="font-black text-white text-sm font-mono">{countryCode} {phone}</p>
                    </div>

                    <div className="flex justify-center space-x-2 my-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[idx] = e.target.value;
                            setOtp(newOtp);
                          }}
                          className="w-10 h-12 text-center text-lg font-black bg-black border border-zinc-800 rounded-xl text-white focus:border-zinc-400 focus:outline-none shadow-inner"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-white py-3 text-sm font-black text-black shadow-lg shadow-white/10 hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-black" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Verify & Sign In</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {authTab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul.sharma@remitchain.io"
                      className="w-full rounded-xl bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-zinc-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:border-zinc-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-white py-3 text-sm font-black text-black shadow-lg shadow-white/10 hover:bg-zinc-200 transition-all"
                >
                  <span>Sign In to Account</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {authTab === 'metamask' && (
              <div className="space-y-4 pt-1">
                <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-white font-bold">
                    <ShieldCheck className="h-4 w-4 text-zinc-300" />
                    <span>Cryptographic Signature Auth</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-normal">
                    Connect and sign an official Web3 challenge message with your MetaMask wallet.
                  </p>
                </div>

                <button
                  onClick={handleMetaMaskLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2.5 rounded-2xl bg-white py-3.5 text-sm font-black text-black shadow-md hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-black" />
                      <span>Verifying Signature...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 text-black" />
                      <span>Sign In with MetaMask</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
