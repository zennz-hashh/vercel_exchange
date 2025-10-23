import { ReactNode, useState } from 'react';
import { BottomNav } from './BottomNav';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { LayoutDashboard, ArrowDownToLine, ArrowRightLeft, ArrowUpFromLine, History, LogOut, Globe } from 'lucide-react';
import { AccountSettings } from './AccountSettings';

type Page = 'dashboard' | 'deposit' | 'swap' | 'withdraw' | 'history';

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout, setLocale } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!user) return <>{children}</>;

  const navItems: { page: Page; icon: any; labelKey: string }[] = [
    { page: 'dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
    { page: 'deposit', icon: ArrowDownToLine, labelKey: 'nav.deposit' },
    { page: 'swap', icon: ArrowRightLeft, labelKey: 'nav.swap' },
    { page: 'withdraw', icon: ArrowUpFromLine, labelKey: 'nav.withdraw' },
    { page: 'history', icon: History, labelKey: 'nav.history' }
  ];

  const toggleLocale = () => {
    setLocale(user.locale === 'id' ? 'en' : 'id');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">▴</span>
              <h1 className="text-2xl font-bold text-gray-900">VercelEX</h1>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ page, icon: Icon, labelKey }) => (
                <button
                  key={page}
                  onClick={() => onNavigate(page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(user.locale, labelKey)}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLocale}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                title={user.locale === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
              >
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700 uppercase">{user.locale}</span>
              </button>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{user.displayName}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100"
                  title="Account settings"
                >
                  <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">{user.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  title={t(user.locale, 'auth.logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

  {/* Bottom navigation bar for mobile */}
  <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
        <AccountSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} user={user} />
      </nav>

      <main>{children}</main>
    </div>
  );
}
