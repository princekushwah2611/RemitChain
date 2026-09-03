import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress, formatTokens } from '../services/blockchainService';
import {
  History,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Download,
  Filter,
  Search,
} from 'lucide-react';

export const Dashboard = () => {
  const { account, transfers, withdrawRemittance, cancelRemittance, loading } = useWeb3();

  const [filterTab, setFilterTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const accountLower = account ? account.toLowerCase() : '';

  const filteredTransfers = transfers.filter((t) => {
    const senderLower = t.sender ? t.sender.toLowerCase() : '';
    const recipientLower = t.recipient ? t.recipient.toLowerCase() : '';

    if (filterTab === 'sent' && senderLower !== accountLower) return false;
    if (filterTab === 'received' && recipientLower !== accountLower) return false;

    const statusNum = Number(t.status);
    if (statusFilter === 'pending' && statusNum !== 0) return false;
    if (statusFilter === 'completed' && statusNum !== 1) return false;
    if (statusFilter === 'cancelled' && statusNum !== 3) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = t.transferId && t.transferId.toLowerCase().includes(q);
      const matchSender = senderLower.includes(q);
      const matchRecipient = recipientLower.includes(q);
      const matchSenderName = t.senderName && t.senderName.toLowerCase().includes(q);
      const matchRecipientName = t.recipientName && t.recipientName.toLowerCase().includes(q);
      if (!matchId && !matchSender && !matchRecipient && !matchSenderName && !matchRecipientName) return false;
    }

    return true;
  });

  const getStatusBadge = (statusNum) => {
    switch (Number(statusNum)) {
      case 0:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>Escrow Pending</span>
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 3:
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-800 border border-rose-200">
            <XCircle className="h-3 w-3 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <History className="h-6 w-6 text-blue-600" />
            <span>Transaction History & Escrow Status</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit log of locked escrows, claimed payouts, and transfer proofs
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1">
            <button
              onClick={() => setFilterTab('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterTab === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Transfers
            </button>
            <button
              onClick={() => setFilterTab('sent')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterTab === 'sent' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sent by Me
            </button>
            <button
              onClick={() => setFilterTab('received')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filterTab === 'received' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Received by Me
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Transfer ID, Name, or Wallet Address..."
          className="w-full rounded-2xl bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none shadow-xs"
        />
      </div>

      {/* Transfers Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Transfer Hash / Date</th>
                <th className="px-6 py-4">Sender → Recipient</th>
                <th className="px-6 py-4">Source Amount</th>
                <th className="px-6 py-4">Target Payout</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No remittance transfers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((t, idx) => {
                  const isRecipient = accountLower && t.recipient && t.recipient.toLowerCase() === accountLower;
                  const isSender = accountLower && t.sender && t.sender.toLowerCase() === accountLower;
                  const statusNum = Number(t.status);

                  const formattedDate = new Date(Number(t.timestamp) * 1000).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const formattedTargetPayout = (Number(t.targetAmount) / 100).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  return (
                    <tr key={t.transferId || idx} className="hover:bg-slate-50 transition-all">
                      <td className="px-6 py-4">
                        <div className="font-mono text-slate-900 font-bold flex items-center space-x-1.5">
                          <span>{shortenAddress(t.transferId)}</span>
                          <a
                            href={`https://sepolia.etherscan.io/tx/${t.txHash || t.transferId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-600"
                            title="View proof on Block Explorer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">{formattedDate}</span>
                      </td>

                      <td className="px-6 py-4 text-xs font-semibold">
                        <div>{t.senderName || shortenAddress(t.sender)}</div>
                        <div className="text-[11px] text-slate-500">→ {t.recipientName || shortenAddress(t.recipient)}</div>
                      </td>

                      <td className="px-6 py-4 font-extrabold text-slate-900">
                        {formatTokens(t.amount)} RMT
                      </td>

                      <td className="px-6 py-4 font-extrabold text-emerald-700 font-mono">
                        {formattedTargetPayout} {t.recipientCurrency}
                      </td>

                      <td className="px-6 py-4">{getStatusBadge(statusNum)}</td>

                      <td className="px-6 py-4 text-right">
                        {statusNum === 0 && (
                          <div className="flex justify-end space-x-2">
                            {isRecipient && (
                              <button
                                onClick={() => withdrawRemittance(t.transferId)}
                                disabled={loading}
                                className="flex items-center space-x-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-all disabled:opacity-50"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Claim Funds</span>
                              </button>
                            )}

                            {isSender && (
                              <button
                                onClick={() => cancelRemittance(t.transferId)}
                                disabled={loading}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                        {statusNum === 1 && (
                          <span className="text-[11px] text-slate-500 font-semibold">Payout Claimed</span>
                        )}
                        {statusNum === 3 && (
                          <span className="text-[11px] text-slate-500 font-semibold">Refunded to Sender</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
