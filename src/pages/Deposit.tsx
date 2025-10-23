import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NetworkType } from '../types';
import { DEPOSIT_ADDRESSES, NETWORK_ICONS } from '../utils/constants';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';

export function Deposit() {
  const { user } = useApp();
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('BNB');
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const address = DEPOSIT_ADDRESSES[selectedNetwork];

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQR = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {user.locale === 'id' ? 'Deposit' : 'Deposit'}
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              {user.locale === 'id' ? 'Pilih Jaringan' : 'Select Network'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(['BNB', 'ETH', 'BTC', 'SOL', 'Base'] as NetworkType[]).map((network) => (
                <button
                  key={network}
                  onClick={() => setSelectedNetwork(network)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedNetwork === network
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{NETWORK_ICONS[network]}</div>
                  <div className="text-sm font-semibold">{network}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              {user.locale === 'id'
                ? 'Ini adalah alamat wallet anda jangan sampai salah salin address .'
                : 'This is a wallet . Do not send wrong address.'}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {user.locale === 'id' ? 'Alamat Deposit' : 'Deposit Address'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                />
                <button
                  onClick={copyAddress}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="hidden md:inline">
                        {user.locale === 'id' ? 'Tersalin' : 'Copied'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="hidden md:inline">
                        {user.locale === 'id' ? 'Salin' : 'Copy'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* simulate deposit removed */}

            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {user.locale === 'id' ? 'QR Code' : 'QR Code'}
              </p>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <img
                  src={generateQR(address)}
                  alt="Deposit QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">
                {user.locale === 'id' ? 'Catatan Penting:' : 'Important Notes:'}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  {user.locale === 'id'
                    ? `Kirim hanya ${selectedNetwork} ke alamat ini`
                    : `Send only ${selectedNetwork} to this address`}
                </li>
                <li>
                  {user.locale === 'id'
                    ? 'Minimal deposit: 0.001 SPHYNX'
                    : 'Minimum deposit: 0.001 SPHYNX'}
                </li>
                <li>
                  {user.locale === 'id'
                    ? 'Deposit akan dikreditkan setelah 12 konfirmasi'
                    : 'Deposits will be credited after 12 confirmations'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
