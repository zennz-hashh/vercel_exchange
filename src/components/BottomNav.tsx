import { Home, ArrowDownToLine, ArrowRightLeft, ArrowUpFromLine, Clock } from 'lucide-react';

type Page = 'dashboard' | 'deposit' | 'swap' | 'withdraw' | 'history';

const navs: { key: Page; label: string; icon: any }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
  { key: 'swap', label: 'Swap', icon: ArrowRightLeft },
  { key: 'withdraw', label: 'Tarik', icon: ArrowUpFromLine },
  { key: 'history', label: 'Riwayat', icon: Clock },
];

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({ currentPage, onNavigate }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center h-16 md:hidden">
      {navs.map(({ key, label, icon: Icon }) => {
        const active = currentPage === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-1 ${active ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs leading-none">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
