import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Token, formatNumber, formatCurrency, formatPercent, formatTimeAgo } from '@/types/token';
import { usePriceFlash } from '@/hooks/useTokenData';
import { 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  TrendingUp, 
  TrendingDown,
  Users,
  BarChart3,
  Clock,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TokenDetailModal } from './TokenDetailModal';

// Social icon component
const SocialIcon: React.FC<{ type: 'twitter' | 'website' | 'telegram'; url?: string }> = memo(({ type, url }) => {
  if (!url) return null;
  
  const icons = {
    twitter: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    website: <ExternalLink className="w-3.5 h-3.5" />,
    telegram: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          {icons[type]}
        </a>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </TooltipContent>
    </Tooltip>
  );
});

SocialIcon.displayName = 'SocialIcon';

// Price change badge
const PriceChangeBadge: React.FC<{ value: number; size?: 'sm' | 'md' }> = memo(({ value, size = 'sm' }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 font-mono',
      size === 'sm' ? 'text-xs' : 'text-sm',
      isPositive ? 'text-success' : 'text-danger'
    )}>
      <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      {formatPercent(value)}
    </span>
  );
});

PriceChangeBadge.displayName = 'PriceChangeBadge';

// Holder info popover content
const HolderInfoContent: React.FC<{ token: Token }> = memo(({ token }) => (
  <div className="space-y-3 p-1">
    <h4 className="font-medium text-sm text-foreground">Holder Distribution</h4>
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Top Holder</span>
        <span className={cn(
          'font-mono',
          token.topHolderPercent > 30 ? 'text-danger' : 'text-foreground'
        )}>
          {token.topHolderPercent.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Dev Holding</span>
        <span className={cn(
          'font-mono',
          token.devHolderPercent > 5 ? 'text-warning' : 'text-foreground'
        )}>
          {token.devHolderPercent.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Snipers</span>
        <span className={cn(
          'font-mono',
          token.sniperPercent > 20 ? 'text-danger' : 'text-foreground'
        )}>
          {token.sniperPercent.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Insiders</span>
        <span className={cn(
          'font-mono',
          token.insiderPercent > 10 ? 'text-danger' : 'text-foreground'
        )}>
          {token.insiderPercent.toFixed(1)}%
        </span>
      </div>
    </div>
    {(token.sniperPercent > 20 || token.insiderPercent > 10) && (
      <div className="flex items-center gap-2 p-2 rounded bg-danger/10 border border-danger/20">
        <AlertTriangle className="w-3.5 h-3.5 text-danger" />
        <span className="text-xs text-danger">High risk distribution</span>
      </div>
    )}
  </div>
));

HolderInfoContent.displayName = 'HolderInfoContent';

// Quick buy button
const QuickBuyButton: React.FC<{ amount: number; onClick: (e: React.MouseEvent) => void }> = memo(({ amount, onClick }) => (
  <Button
    onClick={onClick}
    size="sm"
    className="h-7 px-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 hover:border-primary/50 transition-all duration-200 gap-1.5 font-medium"
  >
    <Zap className="w-3.5 h-3.5" />
    <span className="font-mono text-xs">{amount.toFixed(9)} SOL</span>
  </Button>
));

QuickBuyButton.displayName = 'QuickBuyButton';

// Main Token Card Component
interface TokenCardProps {
  token: Token;
  index: number;
}

export const TokenCard: React.FC<TokenCardProps> = memo(({ token, index }) => {
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const priceFlash = usePriceFlash(token.id);

  const handleCopyAddress = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [token.address]);

  const handleQuickBuy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would trigger a buy transaction
    console.log('Quick buy:', token.symbol, token.quickBuyAmount);
  }, [token.symbol, token.quickBuyAmount]);

  const handleCardClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        onClick={handleCardClick}
        className={cn(
          'flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-card border border-border cursor-pointer',
          'hover:bg-trading-row hover:border-border/80 transition-all duration-200',
          priceFlash === 'up' && 'price-flash-up',
          priceFlash === 'down' && 'price-flash-down'
        )}
      >
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar with online indicator */}
          <div className="relative flex-shrink-0">
            <img
              src={token.avatar}
              alt={token.name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-secondary object-cover"
              loading="lazy"
            />
            {token.bondingProgress >= 80 && !token.isMigrated && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-warning border-2 border-card flex items-center justify-center">
                <Zap className="w-2 h-2 text-warning-foreground" />
              </span>
            )}
            {token.isMigrated && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-card" />
            )}
          </div>

          {/* Token Details */}
          <div className="flex-1 min-w-0">
            {/* Name & Symbol Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground truncate text-sm sm:text-base">
                {token.symbol}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-[150px]">
                {token.name}
              </span>
              {token.isVerified && (
                <Tooltip>
                  <TooltipTrigger>
                    <Shield className="w-3.5 h-3.5 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>Verified Token</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Time & Social Row */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-muted-foreground font-mono">
                {formatTimeAgo(token.createdAt)}
              </span>
              <div className="flex items-center gap-0.5">
                <SocialIcon type="twitter" url={token.twitter ? `https://twitter.com/${token.twitter}` : undefined} />
                <SocialIcon type="website" url={token.website} />
                <SocialIcon type="telegram" url={token.telegram} />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{copied ? 'Copied!' : 'Copy Address'}</TooltipContent>
              </Tooltip>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Users className="w-3 h-3" />
                    <span className="font-mono">{formatNumber(token.holders)}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-56 p-3 bg-popover border-border">
                  <HolderInfoContent token={token} />
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BarChart3 className="w-3 h-3" />
                    <span className="font-mono">{token.txCount}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Transactions</TooltipContent>
              </Tooltip>

              <PriceChangeBadge value={token.priceChange5m} />
              <PriceChangeBadge value={token.priceChange1h} />

              {!token.isMigrated && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground">🔥</span>
                      <span className="font-mono text-warning">{token.bondingProgress.toFixed(0)}%</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Bonding Curve Progress</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-14 sm:pl-0">
          {/* Market Cap & Volume */}
          <div className="text-right space-y-0.5">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[10px] text-muted-foreground uppercase">MC:</span>
              <span className="font-mono font-semibold text-sm text-foreground">
                {formatCurrency(token.marketCap)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[10px] text-muted-foreground uppercase">V:</span>
              <span className="font-mono text-xs text-muted-foreground">
                {formatCurrency(token.volume)}
              </span>
            </div>
            {!token.isMigrated && (
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[10px] text-muted-foreground uppercase">TX:</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {token.txCount}
                </span>
              </div>
            )}
          </div>

          {/* Quick Buy Button */}
          <QuickBuyButton amount={token.quickBuyAmount} onClick={handleQuickBuy} />
        </div>
      </motion.div>

      {/* Detail Modal */}
      <TokenDetailModal 
        token={token} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
});

TokenCard.displayName = 'TokenCard';

export default TokenCard;
