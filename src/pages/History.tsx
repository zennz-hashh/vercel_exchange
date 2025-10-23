import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatNumber } from '../utils/format';
import { TransactionType, TransactionChannel } from '../types';
import { Filter } from 'lucide-react';

type FilterType = 'all' | TransactionType | TransactionChannel;

export function History() {
  const { user, transactions } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');

  if (!user) return null;

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'deposit' || filter === 'swap' || filter === 'withdraw') {
      return tx.type === filter;
    }
    if (filter === 'crypto' || filter === 'fiat') {
      return tx.channel === filter;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: TransactionType) => {
    if (user.locale === 'id') {
      return {
        deposit: 'Deposit',
        swap: 'Swap',
        withdraw: 'Tarik'
      }[type];
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusLabel = (status: string) => {
    if (user.locale === 'id') {
      return {
        completed: 'Selesai',
        processing: 'Diproses',
        failed: 'Gagal'
      }[status] || status;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {user.locale === 'id' ? 'Riwayat Transaksi' : 'Transaction History'}
        </h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                {user.locale === 'id' ? 'Filter' : 'Filter'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'deposit', 'swap', 'withdraw', 'crypto', 'fiat'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? (user.locale === 'id' ? 'Semua' : 'All') : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">
                  {user.locale === 'id' ? 'Tidak ada transaksi' : 'No transactions'}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      {user.locale === 'id' ? 'Tanggal' : 'Date'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      {user.locale === 'id' ? 'Tipe' : 'Type'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      {user.locale === 'id' ? 'Channel' : 'Channel'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      {user.locale === 'id' ? 'Jaringan/Metode' : 'Network/Method'}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      {user.locale === 'id' ? 'Jumlah' : 'Amount'}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(tx.date, user.locale)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {getTypeLabel(tx.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">{tx.channel}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tx.networkOrMethod}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatNumber(tx.amount, 2)} {tx.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              tx.status
                            )}`}
                          >
                            {getStatusLabel(tx.status)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
