import React, { useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { CheckCircle2, Clock, Info, Coins, X } from 'lucide-react';

export const ToastNotification = () => {
  const { activeToast, dismissToast } = useWeb3();

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'claim':
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />;
      case 'faucet':
        return <Coins className="h-6 w-6 text-amber-400 shrink-0" />;
      case 'send':
        return <Clock className="h-6 w-6 text-white shrink-0" />;
      default:
        return <Info className="h-6 w-6 text-zinc-300 shrink-0" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 transition-all duration-300 ease-out animate-bounce-short">
      <div className="glass-panel rounded-2xl p-4 border border-zinc-700 shadow-2xl bg-zinc-950 text-white flex items-start space-x-3.5 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-white" />
        {getIcon()}
        <div className="flex-1 pr-6">
          <h4 className="font-black text-sm text-white tracking-tight">{activeToast.title}</h4>
          <p className="text-xs text-zinc-300 font-normal leading-relaxed mt-0.5">{activeToast.message}</p>
        </div>
        <button
          onClick={dismissToast}
          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-all absolute top-3 right-3"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
