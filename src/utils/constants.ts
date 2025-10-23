import { NetworkType } from '../types';

export const DEPOSIT_ADDRESSES: Record<NetworkType, string> = {
  ETH: '0x53add575cc415f17f60c3bc65c4a8ce7a217309f',
  BNB: '0x53add575cc415f17f60c3bc65c4a8ce7a217309f',
  Base: '0x53add575cc415f17f60c3bc65c4a8ce7a217309f',
  SOL: 'GApediwXymfKmbweEha7Gp1XG83ikrnzTQZX7wAvDMMt',
  BTC: 'bc1p7a9dp02l0675dvlzfpzypyx43k0s29mqawuu02f22nhwyagxhnxsrfhdgv'
};

export const SPHYNX_TO_BNB_RATE = 0.000001;

export const SPHYNX_TO_IDR_RATE = 10.86275;

// Approximate USD conversion rate used for minimal deposit checks
export const USD_TO_IDR = 15000; // 1 USD = 15,000 IDR (assumption)

export const MIN_DEPOSIT_USD = 10; // Minimum deposit required in USD

export const SUPPORTED_NETWORKS: NetworkType[] = ['BNB', 'ETH', 'BTC', 'SOL', 'Base'];

export const NETWORK_ICONS: Record<NetworkType, string> = {
  ETH: '⟠',
  BNB: '⬡',
  Base: '🔵',
  SOL: '◎',
  BTC: '₿'
};
