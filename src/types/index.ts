export type Locale = 'id' | 'en';

export type NetworkType = 'ETH' | 'BNB' | 'Base' | 'SOL' | 'BTC';

export type PayoutType = 'crypto' | 'fiat';

export type FiatMethod = 'bank' | 'ovo' | 'gopay';

export type TransactionType = 'deposit' | 'swap' | 'withdraw';

export type TransactionChannel = 'crypto' | 'fiat';

export type TransactionStatus = 'processing' | 'completed' | 'failed';

export interface UserState {
  id: string; // uuid from Supabase
  displayName: string;
  email: string;
  sphynxBalance: number;
  bnbBalance: number;
  ethBalance: number;
  btcBalance: number;
  solBalance: number;
  baseBalance: number;
  locale: Locale;
  greetingVoiceEnabled: boolean;
}

export interface Transaction {
  id: string;
  user_id: string; // uuid foreign key
  date: string;
  type: TransactionType;
  channel: TransactionChannel;
  networkOrMethod: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  details?: string;
}

export interface CryptoWithdrawal {
  network: NetworkType;
  address: string;
  amount: number;
}

export interface FiatWithdrawal {
  method: FiatMethod;
  amount: number;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  phoneNumber?: string;
}