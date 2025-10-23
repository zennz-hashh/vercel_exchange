import { Locale } from '../types';

export const translations = {
  id: {
  app: { title: 'VercelEX', tagline: 'Exchange Kripto Modern' },
    auth: { login: 'Masuk', signup: 'Daftar', username: 'Nama Pengguna', email: 'Email', password: 'Kata Sandi', loginButton: 'Masuk', signupButton: 'Daftar', loginError: 'Email atau password salah.', alreadyHaveAccount: 'Sudah punya akun?', dontHaveAccount: 'Belum punya akun?', logout: 'Keluar' },
  greeting: { hello: 'Hallo, {name}!', welcome: 'Selamat datang di VercelEX.', continue: 'Lanjutkan ke Dashboard' },
    nav: { dashboard: 'Dashboard', deposit: 'Deposit', swap: 'Swap', withdraw: 'Tarik', history: 'Riwayat' },
    dashboard: { balance: 'Saldo', quickActions: 'Aksi Cepat', supportedNetworks: 'Jaringan Didukung', fiatEstimate: '≈ Rp {amount} (fiktif)' }
  },
  en: {
  app: { title: 'VercelEX', tagline: 'Modern Crypto Exchange' },
    auth: { login: 'Login', signup: 'Sign Up', username: 'Username', email: 'Email', password: 'Password', loginButton: 'Login', signupButton: 'Sign Up', loginError: 'Incorrect email or password.', alreadyHaveAccount: 'Already have an account?', dontHaveAccount: "Don't have an account?", logout: 'Logout' },
  greeting: { hello: 'Hello, {name}!', welcome: 'Welcome to VercelEX.', continue: 'Continue to Dashboard' },
    nav: { dashboard: 'Dashboard', deposit: 'Deposit', swap: 'Swap', withdraw: 'Withdraw', history: 'History' },
    dashboard: { balance: 'Balance', quickActions: 'Quick Actions', supportedNetworks: 'Supported Networks', fiatEstimate: '≈ Rp {amount} (demo)' }
  }
};

export const t = (locale: Locale, key: string, replacements?: Record<string, string>): string => {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) value = value?.[k];
  if (typeof value !== 'string') return key;
  if (replacements) return Object.entries(replacements).reduce((str, [key, val]) => str.replace(`{${key}}`, val), value);
  return value;
};
