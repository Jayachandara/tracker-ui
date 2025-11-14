import { SvgIconComponent } from '@mui/icons-material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LuggageIcon from '@mui/icons-material/Luggage';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export interface CategoryConfig {
  icon?: SvgIconComponent;
  color: string;
  bgColor: string;
  letter?: string;
}

export const categoryConfigs: Record<string, CategoryConfig> = {
  'FOOD & DRINKS': {
    icon: FastfoodIcon,
    color: '#FF6B6B',
    bgColor: '#FFE5E5',
  },
  'GROCERIES': {
    icon: LocalGroceryStoreIcon,
    color: '#4ECDC4',
    bgColor: '#E0F7F6',
  },
  'TRAVEL': {
    icon: DirectionsCarIcon,
    color: '#95E1D3',
    bgColor: '#E8F8F5',
  },
  'ENTERTAINMENT': {
    icon: MovieIcon,
    color: '#F38181',
    bgColor: '#FCE8E8',
  },
  'MEDICINES': {
    icon: LocalHospitalIcon,
    color: '#AA96DA',
    bgColor: '#F0EBFC',
  },
  'FUEL': {
    icon: LocalAtmIcon,
    color: '#FCBAD3',
    bgColor: '#FEF0F6',
  },
  'SALARY': {
    icon: AttachMoneyIcon,
    color: '#48BB78',
    bgColor: '#E6F7ED',
  },
  'EMI': {
    icon: AccountBalanceIcon,
    color: '#ED8936',
    bgColor: '#FEF0E6',
  },
  'HOUSE RENT': {
    icon: HomeIcon,
    color: '#9F7AEA',
    bgColor: '#F0E9FC',
  },
  'TRANSFER': {
    icon: SwapHorizIcon,
    color: '#4299E1',
    bgColor: '#E6F2FC',
  },
  'ACCOUNT TRANSFER': {
    icon: SwapHorizIcon,
    color: '#3182CE',
    bgColor: '#E0EFFC',
  },
  'BILL PAYMENT': {
    icon: ReceiptIcon,
    color: '#DD6B20',
    bgColor: '#FCE9DD',
  },
  'BILLS': {
    icon: ReceiptIcon,
    color: '#D69E2E',
    bgColor: '#FCF3DD',
  },
  'CREDI CARD BILL': {
    icon: CreditCardIcon,
    color: '#E53E3E',
    bgColor: '#FCE5E5',
  },
  'ATM': {
    icon: LocalAtmIcon,
    color: '#38B2AC',
    bgColor: '#E0F7F5',
  },
  'CREDIT': {
    icon: CreditCardIcon,
    color: '#805AD5',
    bgColor: '#EDE9FC',
  },
  'INTEREST': {
    icon: TrendingUpIcon,
    color: '#38A169',
    bgColor: '#E6F5EC',
  },
/*   'PERSONAL': {
    icon: PersonIcon,
    color: '#D53F8C',
    bgColor: '#FCE5F1',
  }, */
/*   'WIFE': {
    icon: FavoriteIcon,
    color: '#EC4899',
    bgColor: '#FCE7F3',
  }, */
  'REWARDS': {
    icon: CardGiftcardIcon,
    color: '#F59E0B',
    bgColor: '#FEF3DD',
  },
  'HOUSE HOLDS': {
    icon: CleaningServicesIcon,
    color: '#10B981',
    bgColor: '#E6F7ED',
  },
  'TRIPS': {
    icon: LuggageIcon,
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  'GROWN LOAN': {
    icon: AccountBalanceIcon,
    color: '#DC2626',
    bgColor: '#FCE5E5',
  },
  'UNCATEGORIZED': {
    icon: HelpOutlineIcon,
    color: '#6B7280',
    bgColor: '#F3F4F6',
  },
};

/**
 * Generate a consistent color from a string using a hash function
 */
const stringToColor = (str: string): { color: string; bgColor: string } => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate vibrant colors by using HSL
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash >> 8) % 15); // 65-80%
  const lightness = 50 + (Math.abs(hash >> 16) % 10); // 50-60%
  
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const bgColor = `hsl(${hue}, ${Math.min(saturation + 10, 95)}%, ${lightness + 40}%)`; // Lighter background
  
  return { color, bgColor };
};

/**
 * Get category configuration by category name
 * Returns icon-based config if available, otherwise generates letter-based config
 */
export const getCategoryConfig = (category: string | null): CategoryConfig => {
  const key = category || 'UNCATEGORIZED';
  
  // Check if we have a predefined config
  if (categoryConfigs[key]) {
    return categoryConfigs[key];
  }
  
  // Generate dynamic config for unknown categories
  const { color, bgColor } = stringToColor(key);
  const letter = key.charAt(0).toUpperCase();
  
  return {
    color,
    bgColor,
    letter,
  };
};
