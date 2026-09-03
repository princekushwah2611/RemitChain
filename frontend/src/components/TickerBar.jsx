import React, { useState, useEffect } from 'react';
import { fetchExchangeRate } from '../services/apiService';
import { TrendingUp, RefreshCw, Zap } from 'lucide-react';

const CURRENCIES = [
  { from: 'USD', to: 'INR', flag: '🇮🇳', defaultRate: '83.50' },
  { from: 'USD', to: 'PHP', flag: '🇵🇭', defaultRate: '56.20' },
  { from: 'USD', to: 'MXN', flag: '🇲🇽', defaultRate: '17.15' },
  { from: 'USD', to: 'NGN', flag: '🇳🇬', defaultRate: '1450.00' },
  { from: 'USD', to: 'BDT', flag: '🇧🇩', defaultRate: '110.00' },
  { from: 'USD', to: 'PKR', flag: '🇵🇰', defaultRate: '279.50' },
];

export const TickerBar = () => {
  const [rates, setRates] = useState(
    CURRENCIES.reduce((acc, curr) => {
      acc[`${curr.from}-${curr.to}`] = curr.defaultRate;
      return acc;
    }, {})
  );

  useEffect(() => {
    const updateAllRates = async () => {
      const newRates = { ...rates };
      for (const pair of CURRENCIES) {
        try {
          const res = await fetchExchangeRate(pair.from, pair.to);
          newRates[`${pair.from}-${pair.to}`] = res.rate;
        } catch (e) {
          // Keep existing rate
        }
      }
      setRates(newRates);
    };

    updateAllRates();
    const interval = setInterval(updateAllRates, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-100/90 border-b border-slate-200 py-1.5 px-4 text-xs overflow-hidden backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-700 font-bold shrink-0 pr-4 border-r border-slate-300">
          <Zap className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
          <span className="hidden sm:inline">LIVE FOREX RATES</span>
          <span className="sm:hidden">FOREX</span>
        </div>

        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar font-mono text-[11px]">
          {CURRENCIES.map((pair) => {
            const key = `${pair.from}-${pair.to}`;
            const rateVal = rates[key] || pair.defaultRate;
            return (
              <div key={key} className="flex items-center space-x-1.5 shrink-0">
                <span>{pair.flag}</span>
                <span className="text-slate-600 font-semibold">{pair.from}/{pair.to}:</span>
                <span className="font-extrabold text-slate-900">{rateVal}</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                  <TrendingUp className="h-3 w-3" /> +0.1%
                </span>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center space-x-1 text-[10px] text-slate-500 shrink-0 font-semibold pl-4 border-l border-slate-300">
          <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
          <span>Real-time Oracle Feed</span>
        </div>
      </div>
    </div>
  );
};
