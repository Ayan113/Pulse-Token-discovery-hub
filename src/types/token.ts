// Token Types
export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  avatar: string;
  createdAt: number;
  
  // Social Links
  twitter?: string;
  website?: string;
  telegram?: string;
  
  // Trading Data
  marketCap: number;
  volume: number;
  txCount: number;
  holders: number;
  liquidity: number;
  
  // Price Data
  price: number;
  priceChange24h: number;
  priceChange1h: number;
  priceChange5m: number;
  
  // Bonding Curve Progress (for pump.fun tokens)
  bondingProgress: number;
  
  // Holder Distribution
  topHolderPercent: number;
  devHolderPercent: number;
  sniperPercent: number;
  insiderPercent: number;
  
  // Flags
  isVerified: boolean;
  isMigrated: boolean;
  hasBundledBuy: boolean;
  
  // Quick Buy Amount
  quickBuyAmount: number;
}

export interface TokenCategory {
  id: 'new-pairs' | 'final-stretch' | 'migrated';
  label: string;
  description: string;
}

export type SortField = 
  | 'createdAt'
  | 'marketCap'
  | 'volume'
  | 'holders'
  | 'priceChange24h'
  | 'bondingProgress';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  minMarketCap?: number;
  maxMarketCap?: number;
  minHolders?: number;
  minVolume?: number;
  hideRugged?: boolean;
  hideInsiders?: boolean;
}

// WebSocket Message Types
export interface PriceUpdate {
  tokenId: string;
  price: number;
  marketCap: number;
  volume: number;
  priceChange5m: number;
  timestamp: number;
}

export interface NewTokenEvent {
  type: 'NEW_TOKEN';
  token: Token;
}

export interface PriceUpdateEvent {
  type: 'PRICE_UPDATE';
  updates: PriceUpdate[];
}

export interface MigrationEvent {
  type: 'MIGRATION';
  tokenId: string;
  timestamp: number;
}

export type WebSocketEvent = NewTokenEvent | PriceUpdateEvent | MigrationEvent;

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

export interface TableState {
  activeCategory: TokenCategory['id'];
  sort: SortConfig;
  filter: FilterConfig;
  selectedTokenId: string | null;
}

// Format helpers
export const formatNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

export const formatCurrency = (num: number): string => {
  return `$${formatNumber(num)}`;
};

export const formatPercent = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

export const truncateAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// Categories
export const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    id: 'new-pairs',
    label: 'New Pairs',
    description: 'Newly created tokens'
  },
  {
    id: 'final-stretch',
    label: 'Final Stretch',
    description: 'Tokens close to migration'
  },
  {
    id: 'migrated',
    label: 'Migrated',
    description: 'Recently migrated to Raydium'
  }
];
