import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserState, Transaction, Locale } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getSupabase, isSupabaseEnabled } from '../lib/supabase';

interface AppContextType {
  user: UserState | null;
  transactions: Transaction[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateBalance: (currency: string, amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'user_id'>) => Promise<boolean>;
  setLocale: (locale: Locale) => void;
  toggleGreetingVoice: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const init = async () => {
      if (isSupabaseEnabled) {
        const supabase = getSupabase();
        try {
          const stored = localStorage.getItem('zixiex_user');
          if (stored) setUser(JSON.parse(stored));

          // If user exists in local storage, try to fetch their transactions from Supabase
          const localUser = stored ? JSON.parse(stored) : null;
          if (localUser && localUser.email && supabase) {
            const { data, error } = await supabase
              .from('transactions')
              .select('*')
              .eq('user_email', localUser.email)
              .order('date', { ascending: false });
            if (!error && data) setTransactions(data as Transaction[]);
          } else {
            const storedTx = localStorage.getItem('zixiex_transactions');
            if (storedTx) setTransactions(JSON.parse(storedTx));
          }
        } catch (err) {
          const stored = localStorage.getItem('zixiex_user');
          if (stored) setUser(JSON.parse(stored));
          const storedTx = localStorage.getItem('zixiex_transactions');
          if (storedTx) setTransactions(JSON.parse(storedTx));
        }
      } else {
        const stored = localStorage.getItem('zixiex_user');
        if (stored) setUser(JSON.parse(stored));
        const storedTx = localStorage.getItem('zixiex_transactions');
        if (storedTx) setTransactions(JSON.parse(storedTx));
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseEnabled) {
      // fallback local demo
      const accountsStr = localStorage.getItem('zixiex_accounts');
      if (!accountsStr) return false;
      const accounts = JSON.parse(accountsStr);
      const account = accounts.find((a: any) => a.email === email && a.password === password);
      if (!account) return false;
      // Use persisted user data if available
      const storedUser = localStorage.getItem('zixiex_user');
      let userData: UserState;
      if (storedUser) {
        userData = JSON.parse(storedUser);
      } else {
        userData = {
          id: '',
          displayName: account.username,
          email: account.email,
          sphynxBalance: 850000,
          bnbBalance: 0,
          ethBalance: 0,
          btcBalance: 0,
          solBalance: 0,
          baseBalance: 0,
          locale: 'id',
          greetingVoiceEnabled: true,
        };
      }
      setUser(userData);
      localStorage.setItem('zixiex_user', JSON.stringify(userData));
      return true;
    }
    // Supabase tanpa Auth: cari user by email & password (password disimpan di kolom display_name untuk demo, atau tambahkan kolom password jika mau)
    const supabase = getSupabase();
    if (!supabase) return false;
    // NOTE: Untuk demo, password bisa disimpan di kolom display_name atau tambahkan kolom password di tabel users
    const { data: userRows, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('display_name', password) // GUNAKAN display_name sebagai password DEMO
      .limit(1);
    if (userErr || !userRows || userRows.length === 0) return false;
    const dbUser = userRows[0];
    const userData: UserState = {
      id: dbUser.id,
      displayName: dbUser.display_name,
      email: dbUser.email,
      sphynxBalance: Number(dbUser.sphynx_balance) || 0,
      bnbBalance: Number(dbUser.bnb_balance) || 0,
      ethBalance: Number(dbUser.eth_balance) || 0,
      btcBalance: Number(dbUser.btc_balance) || 0,
      solBalance: Number(dbUser.sol_balance) || 0,
      baseBalance: Number(dbUser.base_balance) || 0,
      locale: 'id',
      greetingVoiceEnabled: true,
    };
    setUser(userData);
    localStorage.setItem('zixiex_user', JSON.stringify(userData));
    // Fetch transactions for this user_id
    const { data: txs, error: txErr } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', dbUser.id)
      .order('date', { ascending: false });
    if (!txErr && txs) {
      setTransactions(txs as Transaction[]);
      localStorage.setItem('zixiex_transactions', JSON.stringify(txs));
    } else {
      setTransactions([]);
      localStorage.setItem('zixiex_transactions', '[]');
    }
    return true;
  };

  const signup = async (username: string, email: string, password: string): Promise<void> => {
    if (!isSupabaseEnabled) {
      // fallback local demo
      const accountsStr = localStorage.getItem('zixiex_accounts');
      const accounts = accountsStr ? JSON.parse(accountsStr) : [];
      accounts.push({ username, email, password });
      localStorage.setItem('zixiex_accounts', JSON.stringify(accounts));
      const userData: UserState = {
        id: '',
        displayName: username,
        email,
        sphynxBalance: 850000,
        bnbBalance: 0,
        ethBalance: 0,
        btcBalance: 0,
        solBalance: 0,
        baseBalance: 0,
        locale: 'id',
        greetingVoiceEnabled: false,
      };
      setUser(userData);
      localStorage.setItem('zixiex_user', JSON.stringify(userData));
      return;
    }
    // Supabase tanpa Auth: insert user row, password disimpan di display_name (DEMO, sebaiknya tambahkan kolom password di tabel users untuk produksi)
    const supabase = getSupabase();
    if (!supabase) return;
    // Cek apakah email sudah ada
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);
    if (existing && existing.length > 0) throw new Error('Email already registered');
    // Insert user baru
    const { data: upserted, error: upsertErr } = await supabase
      .from('users')
      .insert({ email, display_name: password, sphynx_balance: 850000 })
      .select();
    if (upsertErr || !upserted || upserted.length === 0) throw new Error('Failed to create user');
    const dbUser = upserted[0];
    const userData: UserState = {
      id: dbUser.id,
      displayName: dbUser.display_name,
      email: dbUser.email,
      sphynxBalance: Number(dbUser.sphynx_balance) || 0,
      bnbBalance: Number(dbUser.bnb_balance) || 0,
      ethBalance: Number(dbUser.eth_balance) || 0,
      btcBalance: Number(dbUser.btc_balance) || 0,
      solBalance: Number(dbUser.sol_balance) || 0,
      baseBalance: Number(dbUser.base_balance) || 0,
      locale: 'id',
      greetingVoiceEnabled: false,
    };
    setUser(userData);
    localStorage.setItem('zixiex_user', JSON.stringify(userData));
    // Fetch transactions (should be empty)
    const { data: txs, error: txErr } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', dbUser.id)
      .order('date', { ascending: false });
    if (!txErr && txs) {
      setTransactions(txs as Transaction[]);
      localStorage.setItem('zixiex_transactions', JSON.stringify(txs));
    } else {
      setTransactions([]);
      localStorage.setItem('zixiex_transactions', '[]');
    }
  };

  const logout = () => { setUser(null); localStorage.removeItem('zixiex_user'); };
  // Do NOT reset sphynxBalance on logout, just clear user from context and localStorage

  const updateBalance = (_currency: string, amount: number) => {
    if (!user) return;
    // Only support sphynx for now
    const updated = { ...user, sphynxBalance: amount };
    setUser(updated);
    localStorage.setItem('zixiex_user', JSON.stringify(updated));
    // persist to supabase if enabled
    (async () => {
      if (!isSupabaseEnabled) return;
      const supabase = getSupabase();
      if (!supabase) return;
      try {
        await supabase.from('users').update({ sphynx_balance: amount }).eq('id', user.id);
      } catch (err) {
        // ignore
      }
    })();
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date' | 'user_id'>): Promise<boolean> => {
    if (!user) return false;
    const newTx: Transaction = {
      ...transaction,
      id: uuidv4(),
      user_id: user.id,
      date: new Date().toISOString(),
    };
    if (isSupabaseEnabled) {
      const supabase = getSupabase();
      if (!supabase || !user) return false;
      try {
        const { error } = await supabase.from('transactions').insert([{ ...newTx }]);
        if (error) return false;
        // Fetch latest transactions after insert
        const { data: txs, error: txErr } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (!txErr && txs) {
          setTransactions(txs as Transaction[]);
          localStorage.setItem('zixiex_transactions', JSON.stringify(txs));
        }
        return true;
      } catch (err) {
        return false;
      }
    } else {
      // fallback local
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem('zixiex_transactions', JSON.stringify(updated));
      return true;
    }
  };

  const setLocale = (locale: Locale) => {
    if (!user) return;
    const updated = { ...user, locale };
    setUser(updated);
    localStorage.setItem('zixiex_user', JSON.stringify(updated));
  };

  const toggleGreetingVoice = () => {
    if (!user) return;
    const updated = { ...user, greetingVoiceEnabled: !user.greetingVoiceEnabled };
    setUser(updated);
    localStorage.setItem('zixiex_user', JSON.stringify(updated));
  };

  return <AppContext.Provider value={{ user, transactions, login, signup, logout, updateBalance, addTransaction, setLocale, toggleGreetingVoice }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
