import { NetworkType } from '../types';

export function validateAddress(address: string, network: NetworkType): boolean {
  switch (network) {
    case 'ETH':
    case 'BNB':
    case 'Base':
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case 'SOL':
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    case 'BTC':
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
             /^bc1[a-z0-9]{39,59}$/.test(address);
    default:
      return false;
  }
}

export function validatePhone(phone: string): boolean {
  return /^[0-9]{10,13}$/.test(phone);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
