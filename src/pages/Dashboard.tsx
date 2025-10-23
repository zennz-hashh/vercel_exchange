import { CandleChart } from '../components/CandleChart';
import { useApp } from '../context/AppContext';
import { formatNumber } from '../utils/format';
import { SPHYNX_TO_IDR_RATE, SUPPORTED_NETWORKS, NETWORK_ICONS } from '../utils/constants';
import { t } from '../i18n/translations';
import { ArrowDownToLine, ArrowRightLeft, ArrowUpFromLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchMarketPrices, MarketPrices } from '../utils/market';

interface DashboardProps {
  onNavigate: (page: 'deposit' | 'swap' | 'withdraw') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useApp();
  if (!user) return null;

  const sphynxBalance = user.sphynxBalance;
  const idrValue = sphynxBalance * SPHYNX_TO_IDR_RATE;

  const [prices, setPrices] = useState<MarketPrices | null>(null);
  useEffect(() => {
    fetchMarketPrices().then(setPrices);
    const interval = setInterval(() => fetchMarketPrices().then(setPrices), 30000);
    return () => clearInterval(interval);
  }, []);

  // Estimasi saldo coin utama (dari SPHYNX) - removed, now showing actual wallet balances

  const quickActions = [
    { key: 'deposit' as const, icon: ArrowDownToLine, labelKey: 'nav.deposit', color: 'from-green-500 to-emerald-600' },
    { key: 'swap' as const, icon: ArrowRightLeft, labelKey: 'nav.swap', color: 'from-blue-500 to-cyan-600' },
    { key: 'withdraw' as const, icon: ArrowUpFromLine, labelKey: 'nav.withdraw', color: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <p className="text-lg font-bold mb-2">{user.locale === 'id' ? 'Saldo Anda' : 'Your Balance'}</p>
          <p className="text-sm opacity-90 mb-2">{t(user.locale, 'dashboard.balance')}</p>
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-4xl md:text-5xl font-bold">{formatNumber(sphynxBalance, 0)}</h2>
            <span className="text-xl md:text-2xl font-semibold">SPHYNX</span>
          </div>
          <p className="text-sm opacity-80 mb-4">
            Rp {formatNumber(idrValue, 0)}
          </p>
          {/* Wallet balances section (actual wallet balances) */}
          <div className="mt-6">
            <h4 className="text-base font-bold mb-2">Wallet Balances</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl">$</span>
                <span className="font-semibold">USDT</span>
                <span className="text-lg font-bold">0.0000</span>
                <span className="text-xs">${prices ? formatNumber(1, 2) : '--'}/USDT</span>
              </div>
              <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl">⬡</span>
                <span className="font-semibold">BNB</span>
                <span className="text-lg font-bold">{formatNumber(user.bnbBalance, 6)}</span>
                <span className="text-xs">${prices ? formatNumber(prices.bnb, 2) : '--'}/BNB</span>
              </div>
              <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl">🔵</span>
                <span className="font-semibold">BASE</span>
                <span className="text-lg font-bold">{formatNumber(user.baseBalance, 6)}</span>
                <span className="text-xs">${prices ? formatNumber(prices.base, 2) : '--'}/BASE</span>
              </div>
              <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl">⟠</span>
                <span className="font-semibold">ETH</span>
                <span className="text-lg font-bold">{formatNumber(user.ethBalance, 6)}</span>
                <span className="text-xs">${prices ? formatNumber(prices.eth, 2) : '--'}/ETH</span>
              </div>
              <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl">◎</span>
                <span className="font-semibold">SOL</span>
                <span className="text-lg font-bold">{formatNumber(user.solBalance, 6)}</span>
                <span className="text-xs">${prices ? formatNumber(prices.sol, 2) : '--'}/SOL</span>
              </div>
              <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl">₿</span>
                <span className="font-semibold">BTC</span>
                <span className="text-lg font-bold">{formatNumber(user.btcBalance, 8)}</span>
                <span className="text-xs">${prices ? formatNumber(prices.btc, 2) : '--'}/BTC</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t(user.locale, 'dashboard.quickActions')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map(({ key, icon: Icon, labelKey, color }) => (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`bg-gradient-to-br ${color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
              >
                <Icon className="w-8 h-8 mb-3" />
                <p className="text-lg font-semibold">{t(user.locale, labelKey)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Candle charts section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Grafik Candle Market</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CandleChart coinId="bitcoin" symbol="BTC" color="#f7931a" />
            <CandleChart coinId="ethereum" symbol="ETH" color="#6366f1" />
            <CandleChart coinId="binancecoin" symbol="BNB" color="#f3ba2f" />
            <CandleChart coinId="base-protocol" symbol="BASE" color="#0052ff" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t(user.locale, 'dashboard.supportedNetworks')}</h3>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {SUPPORTED_NETWORKS.map((network) => (
                <div key={network} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-2xl">{NETWORK_ICONS[network]}</span>
                  <span className="font-semibold text-gray-700">{network}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
