import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Greeting } from './pages/Greeting';
import { Dashboard } from './pages/Dashboard';
import { Deposit } from './pages/Deposit';
import { Swap } from './pages/Swap';
import { Withdraw } from './pages/Withdraw';
import { History } from './pages/History';
import { Layout } from './components/Layout';

type Page = 'dashboard' | 'deposit' | 'swap' | 'withdraw' | 'history';

function AppContent() {
  const { user } = useApp();
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [showGreeting, setShowGreeting] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (!user) {
    return view === 'login' ? (
      <Login onSwitch={() => setView('signup')} />
    ) : (
      <Signup onSwitch={() => setView('login')} onSuccess={() => setShowGreeting(true)} />
    );
  }

  if (showGreeting) {
    return <Greeting onContinue={() => setShowGreeting(false)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'deposit':
        return <Deposit />;
      case 'swap':
        return <Swap />;
      case 'withdraw':
        return <Withdraw />;
      case 'history':
        return <History />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
