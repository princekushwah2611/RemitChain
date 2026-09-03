import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import {
  Phone,
  Mail,
  Wallet,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
  Zap,
  User,
  UserPlus,
  RefreshCw,
  Coins,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', country: '🇺🇸 US / Canada' },
  { code: '+91', country: '🇮🇳 India' },
  { code: '+44', country: '🇬🇧 UK' },
  { code: '+63', country: '🇵🇭 Philippines' },
  { code: '+52', country: '🇲🇽 Mexico' },
  { code: '+234', country: '🇳🇬 Nigeria' },
];

export const AuthLandingPage = ({ onOpenMetaMaskGuide }) => {
  const {
    registerUser,
    loginUser,
    loginWithMetaMask,
    loading,
  } = useWeb3();

  const [activeTab, setActiveTab] = useState('register');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountryCode, setRegCountryCode] = useState('+1');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      return alert('Please fill in all registration fields.');
    }
    if (regPassword !== regConfirmPassword) {
      return alert('Passwords do not match.');
    }

    const fullPhone = `${regCountryCode} ${regPhone}`;
    await registerUser({
      name: regName,
      phone: fullPhone,
      email: regEmail,
      password: regPassword,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginId || !loginPassword) {
      return alert('Please enter your email/phone and password.');
    }
    await loginUser(loginId, loginPassword);
  };

  const handleMetaMaskLogin = async () => {
    await loginWithMetaMask();
  };

  const handleQuickRahul = () => {
    loginUser('rahul.sharma@remitchain.io', 'password123');
  };

  const handleQuickPriya = () => {
    loginUser('priya.sharma@remitchain.io', 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]">
      {/* Subtle Light Financial Wallpaper Overlay Art */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-slate-50/20 to-transparent" />

      {/* Decorative Light Money Watermark Icons */}
      <div className="absolute top-20 left-10 text-slate-200/50 pointer-events-none hidden xl:block">
        <DollarSign className="h-64 w-64 -rotate-12" />
      </div>
      <div className="absolute bottom-10 left-1/3 text-blue-100/60 pointer-events-none hidden lg:block">
        <Globe className="h-72 w-72 animate-spin-slow" />
      </div>
      <div className="absolute top-1/3 right-10 text-indigo-100/60 pointer-events-none hidden xl:block">
        <Coins className="h-56 w-56 rotate-12" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md py-4 px-6 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">RemitChain</span>
              <span className="ml-2 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
                256-bit Encrypted Vault
              </span>
            </div>
          </div>

          <button
            onClick={onOpenMetaMaskGuide}
            className="flex items-center space-x-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-all"
          >
            <Wallet className="h-4 w-4 text-amber-700" />
            <span>MetaMask Guide</span>
          </button>
        </div>
      </header>

      {/* Main Auth Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Financial Hero Presentation (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-100 border border-blue-200 px-3.5 py-1 text-xs text-blue-800 font-extrabold">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Bank-Grade 256-bit Encrypted Security Vault</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Global Money Transfers. <br />
            <span className="text-blue-600">Instant. Transparent. 0.2% Fee.</span>
          </h1>

          <p className="text-base text-slate-600 font-semibold leading-relaxed max-w-xl">
            RemitChain provides instant peer-to-peer cross-border remittances via Smart Contract escrows, replacing slow wire transfers with under 60-second payouts.
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2 rounded-2xl bg-white/90 border border-slate-200 px-4 py-2.5 shadow-sm">
              <span className="text-lg">🇺🇸</span>
              <span className="text-xs font-extrabold text-slate-900">USD</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-lg">🇮🇳</span>
              <span className="text-xs font-extrabold text-slate-900">INR</span>
              <span className="text-xs font-mono font-extrabold text-emerald-600 ml-1">₹83.50</span>
            </div>

            <div className="flex items-center space-x-2 rounded-2xl bg-white/90 border border-slate-200 px-4 py-2.5 shadow-sm">
              <span className="text-lg">🇺🇸</span>
              <span className="text-xs font-extrabold text-slate-900">USD</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-lg">🇲🇽</span>
              <span className="text-xs font-extrabold text-slate-900">MXN</span>
              <span className="text-xs font-mono font-extrabold text-emerald-600 ml-1">$17.20</span>
            </div>
          </div>
        </div>

        {/* Right Column: Register / Sign In Form Card (6 cols) */}
        <div className="lg:col-span-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl bg-white/95 backdrop-blur-xl space-y-5">
            {/* Auth Mode Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 flex items-center justify-center space-x-1 rounded-xl py-2.5 transition-all ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Create New Account</span>
              </button>

              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 flex items-center justify-center space-x-1 rounded-xl py-2.5 transition-all ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Sign In (Existing User)</span>
              </button>

              <button
                onClick={() => setActiveTab('metamask')}
                className={`flex-1 flex items-center justify-center space-x-1 rounded-xl py-2.5 transition-all ${
                  activeTab === 'metamask'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="h-4 w-4" />
                <span>MetaMask</span>
              </button>
            </div>

            {/* TAB 1: REGISTER NEW USER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={regCountryCode}
                        onChange={(e) => setRegCountryCode(e.target.value)}
                        className="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2.5 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="555-0192"
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Creating Encrypted Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Create Account & Open Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: LOGIN EXISTING USER */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="e.g. rahul.sharma@remitchain.io or +1 555-0192"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none font-medium"
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Decrypting Vault Data...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Restore Dashboard State</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: METAMASK SIGNATURE */}
            {activeTab === 'metamask' && (
              <div className="space-y-4 pt-1">
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold">
                    <ShieldCheck className="h-4 w-4 text-amber-700" />
                    <span>Cryptographic Signature Auth</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Authenticate using your MetaMask Web3 wallet signature challenge. Data is isolated per wallet address.
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

            {/* Quick Demo Pre-Registered Accounts */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-center">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                Pre-Registered Demo Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleQuickRahul}
                  className="rounded-xl border border-blue-200 bg-blue-50 py-2 px-2.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-all"
                >
                  Rahul Sharma (Sender)
                </button>
                <button
                  onClick={handleQuickPriya}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 py-2 px-2.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-all"
                >
                  Priya Sharma (Recipient)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/90 py-6 text-center text-xs text-slate-600 font-medium relative z-10">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="font-extrabold text-slate-900">RemitChain Enterprise Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onOpenMetaMaskGuide} className="text-amber-800 hover:underline font-bold">
              MetaMask Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
