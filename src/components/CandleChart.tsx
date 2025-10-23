import { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';

interface CandleChartProps {
  coinId: string; // e.g. 'bitcoin', 'ethereum', 'binancecoin', 'base-protocol'
  symbol: string; // e.g. 'BTC', 'ETH', 'BNB', 'BASE'
  color?: string;
}

// Fetch OHLC data from CoinGecko
async function fetchOhlc(coinId: string): Promise<any[]> {
  // 1 = 1 day, 7 = 7 days, 30 = 30 days
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=7`;
  const res = await fetch(url);
  const data = await res.json();
  // Format: [timestamp, open, high, low, close]
  return data.map((d: any) => ({
    x: new Date(d[0]),
    y: [d[1], d[2], d[3], d[4]]
  }));
}

export function CandleChart({ coinId, symbol, color = '#6366f1' }: CandleChartProps) {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOhlc(coinId).then((ohlc) => {
      setSeries([{ data: ohlc }]);
      setLoading(false);
    });
  }, [coinId]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-lg" style={{ color }}>{symbol}</span>
        <span className="text-xs text-gray-500">/USD</span>
      </div>
      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading chart...</div>
      ) : (
        <ApexChart
          type="candlestick"
          height={220}
          series={series}
          options={{
            chart: { toolbar: { show: false } },
            xaxis: { type: 'datetime' },
            yaxis: { tooltip: { enabled: true } },
            plotOptions: { candlestick: { colors: { upward: color, downward: '#ef4444' } } },
            grid: { show: false },
          }}
        />
      )}
    </div>
  );
}
