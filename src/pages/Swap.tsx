import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SPHYNX_TO_BNB_RATE } from '../utils/constants';
import { formatNumber } from '../utils/format';
import { ArrowDownUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Swap() {
  const { user, updateBalance, addTransaction } = useApp();
  const [fromAmount, setFromAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const sphynxBalance = user.sphynxBalance;
  const toAmount = fromAmount ? parseFloat(fromAmount) * SPHYNX_TO_BNB_RATE : 0;

  const handleSwap = async () => {
    setError('');
    setSuccess(false);

    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      setError(user.locale === 'id' ? 'Jumlah tidak valid' : 'Invalid amount');
      return;
    }

    if (amount > sphynxBalance) {
      setError(user.locale === 'id' ? 'Saldo SPHYNX tidak cukup' : 'Insufficient SPHYNX balance');
      return;
    }

    const ok = await addTransaction({
      type: 'swap',
      channel: 'crypto',
      networkOrMethod: 'SPHYNX → BNB',
      amount: amount,
      currency: 'SPHYNX',
      status: 'completed',
      details: `${formatNumber(toAmount, 6)} BNB`
      // user_id, id, date diisi otomatis oleh context
    });
    if (ok) {
      updateBalance('sphynx', sphynxBalance - amount);
      setSuccess(true);
      setFromAmount('');
    } else {
      setError('Gagal menyimpan transaksi. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Swap</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              {user.locale === 'id' ? 'Rate Price' : 'Fixed Price Rate'}
            </p>
            <p className="text-lg font-bold text-blue-700">1 SPHYNX = 0.000001 BNB</p>
            <p className="text-xs text-blue-600 mt-1">1 BNB = 1,000,000 SPHYNX</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {user.locale === 'id' ? 'Dari' : 'From'}
                </span>
                <span className="text-sm text-gray-500">
                  {user.locale === 'id' ? 'Saldo' : 'Balance'}: {formatNumber(sphynxBalance, 0)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={sphynxBalance}
                  className="flex-1 text-2xl font-bold bg-transparent outline-none"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300">
                  <span className="text-xl font-bold">SPHYNX</span>
                </div>
              </div>
              <button
                onClick={() => setFromAmount(sphynxBalance.toString())}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {user.locale === 'id' ? 'Gunakan Maksimal' : 'Use Max'}
              </button>
            </div>

            <div className="flex justify-center">
              <div className="p-3 bg-blue-600 rounded-full">
                <ArrowDownUp className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {user.locale === 'id' ? 'Ke (Estimasi)' : 'To (Estimated)'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={toAmount ? formatNumber(toAmount, 6) : '0.00'}
                  readOnly
                  className="flex-1 text-2xl font-bold bg-transparent outline-none text-gray-700"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300">
                  <span className="text-xl">⬡</span>
                  <span className="text-xl font-bold">BNB</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 flex gap-2 items-start p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 flex gap-2 items-start p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                {user.locale === 'id' ? 'Swap berhasil!' : 'Swap successful!'}
              </p>
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            className="mt-6 w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {user.locale === 'id' ? 'Tukar Sekarang' : 'Swap Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
