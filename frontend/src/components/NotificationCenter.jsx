import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Bell, CheckCircle2, Info, Coins, Clock, X, Trash2, CheckCheck } from 'lucide-react';

export const NotificationCenter = () => {
  const { notifications, markNotificationsAsRead, clearNotifications } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200 bg-white"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-slate-200 shadow-2xl z-50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <h4 className="font-extrabold text-sm text-slate-900">Notifications</h4>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                {notifications.length} Total
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No notifications recorded yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                    n.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-blue-50/70 border-blue-200 text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h5 className="font-extrabold text-slate-900">{n.title}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
