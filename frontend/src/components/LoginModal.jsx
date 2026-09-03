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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 relative shadow-2xl bg-white my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {isAuthenticated ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <User className="h-8 w-8" />
            </div>

            <div>
              <div className="flex items-center justify-center space-x-2">
                <h3 className="text-xl font-extrabold text-slate-900">{userProfile?.name || 'Authenticated User'}</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> {userProfile?.kycLevel || 'Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">{shortenAddress(account || userProfile?.address)}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5 text-xs text-left">
              <div className="flex justify-between text-slate-600">
                <span>Phone / Contact:</span>
                <span className="text-slate-900 font-bold">{userProfile?.phone || 'Not linked'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Email Address:</span>
                <span className="text-slate-900 font-bold">{userProfile?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Account Role:</span>
                <span className="text-blue-700 font-bold capitalize">{userProfile?.role || 'Sender'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-rose-50 border border-rose-200 py-3 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out of RemitChain</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs text-blue-700 font-bold mb-1">
                <Globe className="h-3.5 w-3.5" />
                <span>Official RemitChain Auth Portal</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Sign In to Your Account</h3>
            </div>

            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => {
                  setAuthTab('phone');
                  setOtpStep(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl py-2 transition-all ${
                  authTab === 'phone'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Phone OTP</span>
              </button>

              <button
                onClick={() => setAuthTab('email')}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl py-2 transition-all ${
                  authTab === 'email'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </button>

              <button
                onClick={() => setAuthTab('metamask')}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl py-2 transition-all ${
                  authTab === 'metamask'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
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
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Mobile Phone Number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} ({c.country.split(' ')[0]})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="555-0192"
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                    >
                      <span>Send SMS Verification Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1 text-center">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">Enter 6-digit SMS code sent to:</span>
                      <p className="font-extrabold text-slate-900 text-sm font-mono">{countryCode} {phone}</p>
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
                          className="w-10 h-12 text-center text-lg font-extrabold bg-slate-50 border border-slate-200 rounded-xl text-blue-700 focus:border-blue-600 focus:outline-none shadow-xs"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Verify & Complete Sign In</span>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul.sharma@remitchain.io"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                >
                  <span>Sign In to Account</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {authTab === 'metamask' && (
              <div className="space-y-4 pt-1">
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold">
                    <ShieldCheck className="h-4 w-4 text-amber-700" />
                    <span>Cryptographic Signature Auth</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Connect and sign an official Web3 challenge message with your MetaMask wallet.
                  </p>
                </div>

                <button
                  onClick={handleMetaMaskLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2.5 rounded-2xl bg-amber-500 py-3.5 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying Signature...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 text-slate-950" />
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
