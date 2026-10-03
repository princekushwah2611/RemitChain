import React, { useState } from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import { AuthLandingPage } from './components/AuthLandingPage';
import { TickerBar } from './components/TickerBar';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { SendForm } from './components/SendForm';
import { Dashboard } from './components/Dashboard';
import { FeeComparison } from './components/FeeComparison';
import { FaucetModal } from './components/FaucetModal';
import { MetaMaskGuideModal } from './components/MetaMaskGuideModal';
import { LoginModal } from './components/LoginModal';
import { ToastNotification } from './components/ToastNotification';
import { ShieldCheck, Sparkles, Globe, ArrowRight, Wallet, User, Phone } from 'lucide-react';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFaucetOpen, setIsFaucetOpen] = useState(false);
  const [isMetaMaskGuideOpen, setIsMetaMaskGuideOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuthenticated } = useWeb3();

  // Strict Authentication Gate
  if (!isAuthenticated) {
    return (
      <>
        <AuthLandingPage onOpenMetaMaskGuide={() => setIsMetaMaskGuideOpen(true)} />
        <MetaMaskGuideModal isOpen={isMetaMaskGuideOpen} onClose={() => setIsMetaMaskGuideOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-white selection:text-black relative">
      {/* Top Slide-In Real-Time Transaction Completion Toast Popup */}
      <ToastNotification />

      <div>
        {/* Live Forex Market Ticker Bar */}
        <TickerBar />

        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFaucet={() => setIsFaucetOpen(true)}
          onOpenMetaMaskGuide={() => setIsMetaMaskGuideOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* Main Content Area */}
        <main className="pb-16">
          {activeTab === 'overview' && (
            <OverviewDashboard
              onNavigateSend={() => setActiveTab('send')}
              onNavigateHistory={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'send' && (
            <SendForm onTransferSuccess={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'dashboard' && <Dashboard />}

          {activeTab === 'comparison' && <FeeComparison />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black/90 py-6 text-center text-xs text-zinc-500 font-medium">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-zinc-400" />
            <span className="font-extrabold text-white">RemitChain Enterprise</span>
            <span className="text-zinc-600">— 256-bit Encrypted Bank-Grade Security</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsLoginOpen(true)} className="text-zinc-300 hover:text-white transition-colors font-bold">
              Account Profile
            </button>
            <button onClick={() => setIsMetaMaskGuideOpen(true)} className="text-zinc-300 hover:text-white transition-colors font-bold">
              MetaMask Guide
            </button>
            <button onClick={() => setActiveTab('comparison')} className="text-zinc-400 hover:text-zinc-200 transition-colors font-semibold">
              Fee Calculator
            </button>
            <button onClick={() => setIsFaucetOpen(true)} className="text-zinc-400 hover:text-zinc-200 transition-colors font-semibold">
              RMT Faucet
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} />
      <MetaMaskGuideModal isOpen={isMetaMaskGuideOpen} onClose={() => setIsMetaMaskGuideOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}
