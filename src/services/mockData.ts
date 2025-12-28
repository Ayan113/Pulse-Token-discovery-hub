import { Token, PriceUpdate } from '@/types/token';

// Generate random token data for mock
const generateRandomToken = (index: number, category: 'new' | 'final' | 'migrated'): Token => {
  const names = [
    'Unreal', 'Fixable', 'FINAGENT', 'SEEKEN', 'MOLD', 'AYAMI', 'PumpDog', 'MoonCat',
    'SolBear', 'CryptoFrog', 'DeFiDragon', 'TokenTiger', 'ChainCheetah', 'BlockBull',
    'WhaleFin', 'ApeCoin', 'RocketRat', 'StarShiba', 'MetaMouse', 'CosmicCow',
    'NeonNinja', 'PixelPanda', 'QuantumQuail', 'VaporViper', 'ZenZebra', 'TurboTurtle',
    'LaserLlama', 'GigaGoat', 'HyperHawk', 'MegaMonkey', 'UltraUnicorn', 'SuperSnake'
  ];
  
  const symbols = names.map(n => n.substring(0, 4).toUpperCase());
  
  const nameIndex = (index + Math.floor(Math.random() * names.length)) % names.length;
  const name = names[nameIndex];
  const symbol = symbols[nameIndex];
  
  const bondingProgress = category === 'migrated' 
    ? 100 
    : category === 'final' 
      ? 80 + Math.random() * 19 
      : Math.random() * 79;

  const baseMarketCap = category === 'migrated' 
    ? 50000 + Math.random() * 500000
    : category === 'final'
      ? 30000 + Math.random() * 100000
      : 5000 + Math.random() * 50000;

  return {
    id: `token-${category}-${index}`,
    address: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
    name,
    symbol,
    avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${name}${index}&backgroundColor=1a1a2e`,
    createdAt: Date.now() - Math.random() * 3600000 * (category === 'new' ? 1 : category === 'final' ? 12 : 48),
    
    twitter: Math.random() > 0.3 ? `@${symbol.toLowerCase()}` : undefined,
    website: Math.random() > 0.5 ? `https://${symbol.toLowerCase()}.io` : undefined,
    telegram: Math.random() > 0.4 ? `t.me/${symbol.toLowerCase()}` : undefined,
    
    marketCap: baseMarketCap,
    volume: baseMarketCap * (0.1 + Math.random() * 0.5),
    txCount: Math.floor(10 + Math.random() * 500),
    holders: Math.floor(5 + Math.random() * 300),
    liquidity: baseMarketCap * (0.3 + Math.random() * 0.4),
    
    price: 0.00001 + Math.random() * 0.001,
    priceChange24h: -50 + Math.random() * 150,
    priceChange1h: -20 + Math.random() * 60,
    priceChange5m: -10 + Math.random() * 30,
    
    bondingProgress,
    
    topHolderPercent: Math.random() * 50,
    devHolderPercent: Math.random() * 10,
    sniperPercent: Math.random() * 30,
    insiderPercent: Math.random() * 15,
    
    isVerified: Math.random() > 0.7,
    isMigrated: category === 'migrated',
    hasBundledBuy: Math.random() > 0.8,
    
    quickBuyAmount: 2.0,
  };
};

// Generate initial mock data
export const generateMockTokens = (): Token[] => {
  const tokens: Token[] = [];
  
  // Generate 15 tokens for each category
  for (let i = 0; i < 15; i++) {
    tokens.push(generateRandomToken(i, 'new'));
    tokens.push(generateRandomToken(i + 15, 'final'));
    tokens.push(generateRandomToken(i + 30, 'migrated'));
  }
  
  return tokens;
};

// Mock WebSocket class for real-time updates
type WebSocketCallback = (updates: PriceUpdate[]) => void;
type ConnectionCallback = (connected: boolean) => void;
type NewTokenCallback = (token: Token) => void;
type MigrationCallback = (tokenId: string) => void;

class MockWebSocket {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onPriceUpdate: WebSocketCallback | null = null;
  private onConnectionChange: ConnectionCallback | null = null;
  private onNewToken: NewTokenCallback | null = null;
  private onMigration: MigrationCallback | null = null;
  private tokenIds: string[] = [];
  private connected = false;
  private newTokenCounter = 100;

  connect(tokenIds: string[]) {
    this.tokenIds = tokenIds;
    this.connected = true;
    this.onConnectionChange?.(true);
    
    // Simulate price updates every 500ms
    this.intervalId = setInterval(() => {
      if (!this.connected) return;
      
      const updates: PriceUpdate[] = [];
      
      // Update 3-8 random tokens
      const updateCount = 3 + Math.floor(Math.random() * 5);
      const shuffled = [...this.tokenIds].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < Math.min(updateCount, shuffled.length); i++) {
        const tokenId = shuffled[i];
        const priceChange = (Math.random() - 0.48) * 0.1; // Slight upward bias
        
        updates.push({
          tokenId,
          price: 0.00001 + Math.random() * 0.001,
          marketCap: 10000 + Math.random() * 100000,
          volume: 1000 + Math.random() * 50000,
          priceChange5m: -10 + Math.random() * 30,
          timestamp: Date.now(),
        });
      }
      
      if (updates.length > 0) {
        this.onPriceUpdate?.(updates);
      }
    }, 800);

    // Simulate new token every 5-10 seconds
    setInterval(() => {
      if (!this.connected) return;
      
      if (Math.random() > 0.6) {
        const newToken = generateRandomToken(this.newTokenCounter++, 'new');
        this.tokenIds.push(newToken.id);
        this.onNewToken?.(newToken);
      }
    }, 7000);

    // Simulate migration every 15-20 seconds
    setInterval(() => {
      if (!this.connected) return;
      
      // Find a token with high bonding progress
      const candidateIds = this.tokenIds.filter(id => id.includes('final'));
      if (candidateIds.length > 0 && Math.random() > 0.7) {
        const migratedId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
        this.onMigration?.(migratedId);
      }
    }, 18000);
  }

  disconnect() {
    this.connected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.onConnectionChange?.(false);
  }

  addTokenId(tokenId: string) {
    if (!this.tokenIds.includes(tokenId)) {
      this.tokenIds.push(tokenId);
    }
  }

  setPriceUpdateHandler(handler: WebSocketCallback) {
    this.onPriceUpdate = handler;
  }

  setConnectionHandler(handler: ConnectionCallback) {
    this.onConnectionChange = handler;
  }

  setNewTokenHandler(handler: NewTokenCallback) {
    this.onNewToken = handler;
  }

  setMigrationHandler(handler: MigrationCallback) {
    this.onMigration = handler;
  }

  isConnected() {
    return this.connected;
  }
}

// Singleton instance
export const mockWebSocket = new MockWebSocket();

// API simulation functions
export const fetchTokens = async (): Promise<Token[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  // Simulate occasional errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch tokens. Please try again.');
  }
  
  return generateMockTokens();
};

export const fetchTokenDetails = async (tokenId: string): Promise<Token | null> => {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  
  // Return mock token
  const category = tokenId.includes('migrated') ? 'migrated' : tokenId.includes('final') ? 'final' : 'new';
  return generateRandomToken(parseInt(tokenId.split('-')[2]) || 0, category);
};
