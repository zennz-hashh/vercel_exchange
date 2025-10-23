import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NetworkType, FiatMethod } from '../types';
import { validateAddress, validatePhone } from '../utils/validation';
import { SPHYNX_TO_BNB_RATE, SPHYNX_TO_IDR_RATE, USD_TO_IDR, MIN_DEPOSIT_USD } from '../utils/constants';
import { formatNumber } from '../utils/format';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type WithdrawType = 'crypto' | 'fiat';

export function Withdraw() {
  const { user, updateBalance, addTransaction, transactions } = useApp();
  const [withdrawType, setWithdrawType] = useState<WithdrawType>('crypto');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [cryptoNetwork, setCryptoNetwork] = useState<NetworkType>('BNB');
  const [cryptoAddress, setCryptoAddress] = useState('');

  const [fiatMethod, setFiatMethod] = useState<FiatMethod>('bank');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!user) return null;

  const sphynxBalance = user.sphynxBalance;

  // Calculate total completed deposits in SPHYNX
  const totalDepositedSphynx = transactions
    .filter((t) => t.type === 'deposit' && t.status === 'completed' && t.currency === 'SPHYNX')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Convert SPHYNX -> IDR -> USD for minimal deposit check
  const totalDepositedIdr = totalDepositedSphynx * SPHYNX_TO_IDR_RATE;
  const totalDepositedUsd = totalDepositedIdr / USD_TO_IDR;
  const hasMinDepositUsd = totalDepositedUsd >= MIN_DEPOSIT_USD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError(user.locale === 'id' ? 'Jumlah tidak valid' : 'Invalid amount');
      return;
    }

    if (withdrawAmount > sphynxBalance) {
      setError(user.locale === 'id' ? 'Saldo tidak cukup' : 'Insufficient balance');
      return;
    }

    let ok = false;
    if (withdrawType === 'crypto') {
      if (!validateAddress(cryptoAddress, cryptoNetwork)) {
        setError(user.locale === 'id' ? 'Alamat tidak valid' : 'Invalid address');
        return;
      }

  ok = await addTransaction({
        type: 'withdraw',
        channel: 'crypto',
        networkOrMethod: cryptoNetwork,
        amount: withdrawAmount,
        currency: 'SPHYNX',
        status: 'processing',
        details: cryptoAddress
      });
    } else {
      if (fiatMethod === 'bank') {
        if (!bankName || !accountName || !accountNumber) {
          setError(user.locale === 'id' ? 'Lengkapi semua field' : 'Complete all fields');
          return;
        }
      } else {
        if (!validatePhone(phoneNumber)) {
          setError(user.locale === 'id' ? 'Nomor telepon tidak valid' : 'Invalid phone number');
          return;
        }
      }

  ok = await addTransaction({
        type: 'withdraw',
        channel: 'fiat',
        networkOrMethod: fiatMethod === 'bank' ? `Bank ${bankName}` : fiatMethod.toUpperCase(),
        amount: withdrawAmount,
        currency: 'SPHYNX',
        status: 'processing',
        details: fiatMethod === 'bank' ? `${accountName} - ${accountNumber}` : phoneNumber
      });
    }

    if (ok) {
      updateBalance('sphynx', sphynxBalance - withdrawAmount);
      setSuccess(true);
      setAmount('');
      setCryptoAddress('');
      setBankName('');
      setAccountName('');
      setAccountNumber('');
      setPhoneNumber('');
    } else {
      setError('Gagal menyimpan transaksi. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {user.locale === 'id' ? 'Penarikan' : 'Withdraw'}
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setWithdrawType('crypto')}
              className={`pb-3 px-4 font-semibold transition-colors ${
                withdrawType === 'crypto'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {user.locale === 'id' ? 'Kripto' : 'Crypto'}
            </button>
            <button
              onClick={() => setWithdrawType('fiat')}
              className={`pb-3 px-4 font-semibold transition-colors ${
                withdrawType === 'fiat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Fiat
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600">
              {user.locale === 'id' ? 'Saldo SPHYNX Tersedia' : 'Available SPHYNX Balance'}
            </p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(sphynxBalance, 0)} SPHYNX</p>
            <p className="text-sm text-gray-700 mt-1">≈ Rp {formatNumber(sphynxBalance * SPHYNX_TO_IDR_RATE, 0)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {withdrawType === 'crypto' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {user.locale === 'id' ? 'Jaringan' : 'Network'}
                  </label>
                  <select
                    value={cryptoNetwork}
                    onChange={(e) => setCryptoNetwork(e.target.value as NetworkType)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BNB">BNB Smart Chain</option>
                    <option value="ETH">Ethereum (ERC-20)</option>
                    <option value="Base">Base Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {user.locale === 'id' ? 'Alamat Tujuan' : 'Destination Address'}
                  </label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {user.locale === 'id' ? 'Metode Pembayaran' : 'Payment Method'}
                  </label>
                  <select
                    value={fiatMethod}
                    onChange={(e) => setFiatMethod(e.target.value as FiatMethod)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bank">{user.locale === 'id' ? 'Transfer Bank' : 'Bank Transfer'}</option>
                    <option value="ovo">OVO</option>
                    <option value="gopay">GoPay</option>
                  </select>
                </div>

                {fiatMethod === 'bank' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {user.locale === 'id' ? 'Nama Bank' : 'Bank Name'}
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="BCA, Mandiri, BRI, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {user.locale === 'id' ? 'Nama Pemilik Rekening' : 'Account Holder Name'}
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {user.locale === 'id' ? 'Nomor Rekening' : 'Account Number'}
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {user.locale === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {user.locale === 'id' ? 'Jumlah SPHYNX' : 'Amount SPHYNX'}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
                max={sphynxBalance}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {amount && parseFloat(amount) > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {withdrawType === 'crypto'
                    ? `≈ ${formatNumber(parseFloat(amount) * SPHYNX_TO_BNB_RATE, 6)} BNB`
                    : `≈ Rp ${formatNumber(parseFloat(amount) * SPHYNX_TO_IDR_RATE, 0)}`}
                </p>
              )}
            </div>

            {error && (
              <div className="flex gap-2 items-start p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {!hasMinDepositUsd && (
              <div className="flex gap-2 items-start p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  {user.locale === 'id'
                    ? `Minimal deposit sebesar $${MIN_DEPOSIT_USD} diperlukan sebelum melakukan penarikan. Total deposit Anda saat ini setara $${formatNumber(totalDepositedUsd, 2)}.`
                    : `A minimum deposit of $${MIN_DEPOSIT_USD} is required before withdrawing. Your total deposited so far is $${formatNumber(totalDepositedUsd, 2)}.`}
                </div>
              </div>
            )}

            {success && (
              <div className="flex gap-2 items-start p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  {user.locale === 'id' ? 'Penarikan berhasil diproses!' : 'Withdrawal successfully processed!'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!hasMinDepositUsd}
              className={`w-full py-3 text-white font-semibold rounded-xl transition-colors ${
                hasMinDepositUsd ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {user.locale === 'id' ? 'Tarik Dana' : 'Withdraw'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
