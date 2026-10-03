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
        className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800 bg-zinc-900"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-zinc-950/95 border border-zinc-800 shadow-2xl z-50 p-4 space-y-3 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-zinc-300" />
              <h4 className="font-black text-sm text-white">Notifications</h4>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-300 border border-zinc-800">
                {notifications.length} Total
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-[11px] font-bold text-zinc-400 hover:text-rose-400 hover:underline flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-zinc-600 text-xs font-medium">
                No notifications recorded yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                    n.read ? 'bg-black border-zinc-900 text-zinc-500' : 'bg-zinc-900 border-zinc-800 text-zinc-200 font-medium'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-white">{n.title}</h5>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
