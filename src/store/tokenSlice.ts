import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  Token, 
  PriceUpdate, 
  SortConfig, 
  FilterConfig, 
  TokenCategory,
  LoadingState 
} from '@/types/token';

interface TokenState {
  tokens: Record<string, Token>;
  newPairs: string[];
  finalStretch: string[];
  migrated: string[];
  activeCategory: TokenCategory['id'];
  sort: SortConfig;
  filter: FilterConfig;
  selectedTokenId: string | null;
  loading: LoadingState;
  priceFlash: Record<string, 'up' | 'down' | null>;
  wsConnected: boolean;
}

const initialState: TokenState = {
  tokens: {},
  newPairs: [],
  finalStretch: [],
  migrated: [],
  activeCategory: 'new-pairs',
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  filter: {},
  selectedTokenId: null,
  loading: {
    isLoading: true,
    isRefreshing: false,
    error: null,
  },
  priceFlash: {},
  wsConnected: false,
};

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      const tokens: Record<string, Token> = {};
      const newPairs: string[] = [];
      const finalStretch: string[] = [];
      const migrated: string[] = [];

      action.payload.forEach((token) => {
        tokens[token.id] = token;
        
        if (token.isMigrated) {
          migrated.push(token.id);
        } else if (token.bondingProgress >= 80) {
          finalStretch.push(token.id);
        } else {
          newPairs.push(token.id);
        }
      });

      state.tokens = tokens;
      state.newPairs = newPairs;
      state.finalStretch = finalStretch;
      state.migrated = migrated;
      state.loading.isLoading = false;
      state.loading.error = null;
    },

    addToken: (state, action: PayloadAction<Token>) => {
      const token = action.payload;
      state.tokens[token.id] = token;
      
      if (token.isMigrated) {
        state.migrated.unshift(token.id);
      } else if (token.bondingProgress >= 80) {
        state.finalStretch.unshift(token.id);
      } else {
        state.newPairs.unshift(token.id);
      }
    },

    updatePrices: (state, action: PayloadAction<PriceUpdate[]>) => {
      action.payload.forEach((update) => {
        const token = state.tokens[update.tokenId];
        if (token) {
          const oldPrice = token.price;
          token.price = update.price;
          token.marketCap = update.marketCap;
          token.volume = update.volume;
          token.priceChange5m = update.priceChange5m;

          // Track price flash direction
          if (update.price > oldPrice) {
            state.priceFlash[update.tokenId] = 'up';
          } else if (update.price < oldPrice) {
            state.priceFlash[update.tokenId] = 'down';
          }
        }
      });
    },

    clearPriceFlash: (state, action: PayloadAction<string>) => {
      state.priceFlash[action.payload] = null;
    },

    migrateToken: (state, action: PayloadAction<string>) => {
      const tokenId = action.payload;
      const token = state.tokens[tokenId];
      
      if (token) {
        token.isMigrated = true;
        token.bondingProgress = 100;
        
        // Move from other lists to migrated
        state.newPairs = state.newPairs.filter(id => id !== tokenId);
        state.finalStretch = state.finalStretch.filter(id => id !== tokenId);
        state.migrated.unshift(tokenId);
      }
    },

    setActiveCategory: (state, action: PayloadAction<TokenCategory['id']>) => {
      state.activeCategory = action.payload;
    },

    setSort: (state, action: PayloadAction<SortConfig>) => {
      state.sort = action.payload;
    },

    setFilter: (state, action: PayloadAction<FilterConfig>) => {
      state.filter = action.payload;
    },

    setSelectedToken: (state, action: PayloadAction<string | null>) => {
      state.selectedTokenId = action.payload;
    },

    setLoading: (state, action: PayloadAction<Partial<LoadingState>>) => {
      state.loading = { ...state.loading, ...action.payload };
    },

    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload;
    },
  },
});

export const {
  setTokens,
  addToken,
  updatePrices,
  clearPriceFlash,
  migrateToken,
  setActiveCategory,
  setSort,
  setFilter,
  setSelectedToken,
  setLoading,
  setWsConnected,
} = tokenSlice.actions;

export default tokenSlice.reducer;

// Selectors
export const selectAllTokens = (state: { tokens: TokenState }) => 
  Object.values(state.tokens.tokens);

export const selectTokensByCategory = (state: { tokens: TokenState }) => {
  const { activeCategory, tokens, newPairs, finalStretch, migrated, sort, filter } = state.tokens;
  
  let tokenIds: string[];
  switch (activeCategory) {
    case 'new-pairs':
      tokenIds = newPairs;
      break;
    case 'final-stretch':
      tokenIds = finalStretch;
      break;
    case 'migrated':
      tokenIds = migrated;
      break;
    default:
      tokenIds = [];
  }

  let tokenList = tokenIds.map(id => tokens[id]).filter(Boolean);

  // Apply filters
  if (filter.minMarketCap) {
    tokenList = tokenList.filter(t => t.marketCap >= filter.minMarketCap!);
  }
  if (filter.maxMarketCap) {
    tokenList = tokenList.filter(t => t.marketCap <= filter.maxMarketCap!);
  }
  if (filter.minHolders) {
    tokenList = tokenList.filter(t => t.holders >= filter.minHolders!);
  }
  if (filter.minVolume) {
    tokenList = tokenList.filter(t => t.volume >= filter.minVolume!);
  }
  if (filter.hideInsiders) {
    tokenList = tokenList.filter(t => t.insiderPercent < 10);
  }

  // Apply sorting
  tokenList.sort((a, b) => {
    const aValue = a[sort.field as keyof Token];
    const bValue = b[sort.field as keyof Token];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return tokenList;
};

export const selectTokenById = (id: string) => (state: { tokens: TokenState }) => 
  state.tokens.tokens[id];

export const selectPriceFlash = (id: string) => (state: { tokens: TokenState }) =>
  state.tokens.priceFlash[id];

export const selectActiveCategory = (state: { tokens: TokenState }) =>
  state.tokens.activeCategory;

export const selectLoadingState = (state: { tokens: TokenState }) =>
  state.tokens.loading;

export const selectWsConnected = (state: { tokens: TokenState }) =>
  state.tokens.wsConnected;
