import { SvgIconComponent } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

export interface AccountConfig {
  icon?: SvgIconComponent;
  color: string;
  bgColor: string;
  bankLogo?: string;
  brandColor: string; // Official brand color
}

export const accountConfigs: Record<string, AccountConfig> = {
  // HDFC Bank - Blue branding
  'HDFC': {
    icon: AccountBalanceIcon,
    color: '#004C8F', // HDFC Official Blue
    bgColor: '#E3F2FD',
    brandColor: '#004C8F',
    bankLogo: '/tracker/bank-logos/hdfc.png',
  },
  'HDFC credit': {
    icon: CreditCardIcon,
    color: '#004C8F',
    bgColor: '#E3F2FD',
    brandColor: '#004C8F',
    bankLogo: '/tracker/bank-logos/hdfc.png',
  },
  
  // ICICI Bank - Orange branding
  'ICICI': {
    icon: AccountBalanceIcon,
    color: '#F37021', // ICICI Official Orange
    bgColor: '#FFF3E0',
    brandColor: '#F37021',
    bankLogo: '/tracker/bank-logos/icici.png',
  },
  'ICICI credit': {
    icon: CreditCardIcon,
    color: '#F37021',
    bgColor: '#FFF3E0',
    brandColor: '#F37021',
    bankLogo: '/tracker/bank-logos/icici.png',
  },
  
  // IDFC Bank - Maroon/Red branding
  'IDFC': {
    icon: AccountBalanceIcon,
    color: '#8B1538', // IDFC Official Maroon
    bgColor: '#FCE4EC',
    brandColor: '#8B1538',
    bankLogo: '/tracker/bank-logos/idfc.png',
  },
  'IDFC credit': {
    icon: CreditCardIcon,
    color: '#8B1538',
    bgColor: '#FCE4EC',
    brandColor: '#8B1538',
    bankLogo: '/tracker/bank-logos/idfc.png',
  },
  'IDFC debit': {
    icon: LocalAtmIcon,
    color: '#8B1538',
    bgColor: '#FCE4EC',
    brandColor: '#8B1538',
    bankLogo: '/tracker/bank-logos/idfc.png',
  },
  
  // HSBC Bank - Red & White branding
  'HSBC': {
    icon: AccountBalanceIcon,
    color: '#DB0011', // HSBC Official Red
    bgColor: '#FFEBEE',
    brandColor: '#DB0011',
    bankLogo: '/tracker/bank-logos/hsbc.png',
  },
  
  // Axis Bank - Maroon/Burgundy branding
  'Axis': {
    icon: AccountBalanceIcon,
    color: '#800020', // Axis Official Burgundy
    bgColor: '#F3E5F5',
    brandColor: '#800020',
    bankLogo: '/tracker/bank-logos/axis.png',
  },
  'Axis credit': {
    icon: CreditCardIcon,
    color: '#800020',
    bgColor: '#F3E5F5',
    brandColor: '#800020',
    bankLogo: '/tracker/bank-logos/axis.png',
  },
  
  // Cash - Green for money
  'CASH': {
    icon: AccountBalanceWalletIcon,
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    brandColor: '#2E7D32',
  },
  'CASH Spends': {
    icon: AccountBalanceWalletIcon,
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    brandColor: '#2E7D32',
  },
  
  // Default/Unknown
  'DEFAULT': {
    icon: AccountBalanceIcon,
    color: '#546E7A',
    bgColor: '#ECEFF1',
    brandColor: '#546E7A',
  },
};

/**
 * Generate a consistent color from a string using a hash function
 */
const stringToColor = (str: string): { color: string; bgColor: string } => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  
  const hue = Math.abs(hash % 360);
  const saturation = 60 + (Math.abs(hash >> 8) % 15);
  const lightness = 45 + (Math.abs(hash >> 16) % 10);
  
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const bgColor = `hsl(${hue}, ${Math.min(saturation + 15, 90)}%, ${lightness + 45}%)`;
  
  return { color, bgColor };
};

/**
 * Get account configuration by account name
 * Matches based on bank name prefix in the account name
 */
export const getAccountConfig = (accountName: string | null): AccountConfig => {
  if (!accountName) {
    return accountConfigs['DEFAULT'];
  }
  
  // Try to match exact account name first
  if (accountConfigs[accountName]) {
    return accountConfigs[accountName];
  }
  
  // Try to match by checking if account name contains the key
  // This handles cases like "HDFC  4671" matching with "HDFC"
  // and "HDFC credit 9603" matching with "HDFC credit"
  const normalizedAccount = accountName.trim().toUpperCase();
  
  // Sort keys by length descending to match more specific patterns first
  // e.g., "HDFC credit" before "HDFC"
  const sortedKeys = Object.keys(accountConfigs).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const normalizedKey = key.toUpperCase();
    if (normalizedAccount.startsWith(normalizedKey)) {
      return accountConfigs[key];
    }
  }
  
  // Generate dynamic config for unknown accounts
  const { color, bgColor } = stringToColor(accountName);
  
  return {
    icon: AccountBalanceIcon,
    color,
    bgColor,
    brandColor: color,
  };
};

/**
 * Get bank name from account string
 * Extracts the first word which is typically the bank name
 */
export const getBankName = (accountName: string | null): string => {
  if (!accountName) return 'Unknown';
  return accountName.split(/\s+/)[0] || 'Unknown';
};

/**
 * Get account type from account string
 * Determines if it's credit, debit, or other
 */
export const getAccountType = (accountName: string | null): 'credit' | 'debit' | 'cash' | 'other' => {
  if (!accountName) return 'other';
  
  const lower = accountName.toLowerCase();
  if (lower.includes('credit')) return 'credit';
  if (lower.includes('debit')) return 'debit';
  if (lower.includes('cash')) return 'cash';
  
  return 'debit'; // Default to debit for regular accounts
};
