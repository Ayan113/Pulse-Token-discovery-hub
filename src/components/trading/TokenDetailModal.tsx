import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Token, formatNumber, formatCurrency, formatPercent, formatTimeAgo } from '@/types/token';
import { 
  ExternalLink, 
  Copy, 
  TrendingUp, 
  TrendingDown,
  Users,
  BarChart3,
  Droplets,
  Clock,
  Shield,
  AlertTriangle,
  Zap,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TokenDetailModalProps {
  token: Token;
  open: boolean;
  onClose: () => void;
}

export const TokenDetailModal: React.FC<TokenDetailModalProps> = memo(({ token, open, onClose }) => {
  const isPositive = token.priceChange24h >= 0;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.address);
  };

  const handleTrade = () => {
    // Would open trading interface
    console.log('Trade:', token.symbol);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg bg-card border-border p-0 gap-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary/20 to-transparent p-6 pb-4">
          <DialogHeader>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={token.avatar}
                  alt={token.name}
                  className="w-16 h-16 rounded-xl bg-secondary object-cover shadow-lg"
                />
                {token.isVerified && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Shield className="w-3 h-3 text-primary-foreground" />
                  </span>
                )}
              </div>

              {/* Title & Info */}
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  {token.symbol}
                  <span className="text-sm font-normal text-muted-foreground truncate">
                    {token.name}
                  </span>
                </DialogTitle>
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 hover:bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="font-mono">{token.address}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Created {formatTimeAgo(token.createdAt)} ago
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {formatCurrency(token.marketCap)}
              </p>
            </div>
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              isPositive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-mono font-semibold">
                {formatPercent(token.priceChange24h)}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Volume</span>
              </div>
              <p className="font-mono font-semibold text-foreground">
                {formatCurrency(token.volume)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Holders</span>
              </div>
              <p className="font-mono font-semibold text-foreground">
                {formatNumber(token.holders)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Liquidity</span>
              </div>
              <p className="font-mono font-semibold text-foreground">
                {formatCurrency(token.liquidity)}
              </p>
            </div>
          </div>

          {/* Bonding Progress */}
          {!token.isMigrated && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bonding Curve Progress</span>
                <span className={cn(
                  'font-mono font-medium',
                  token.bondingProgress >= 80 ? 'text-warning' : 'text-foreground'
                )}>
                  {token.bondingProgress.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={token.bondingProgress} 
                className="h-2 bg-trading-progress"
              />
              {token.bondingProgress >= 80 && (
                <div className="flex items-center gap-2 p-2 rounded bg-warning/10 border border-warning/20">
                  <Zap className="w-4 h-4 text-warning" />
                  <span className="text-xs text-warning">
                    Close to migration! Get in before Raydium pump.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Holder Distribution */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Holder Distribution</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Top Holder', value: token.topHolderPercent, warn: 30 },
                { label: 'Dev Holding', value: token.devHolderPercent, warn: 5 },
                { label: 'Snipers', value: token.sniperPercent, warn: 20 },
                { label: 'Insiders', value: token.insiderPercent, warn: 10 },
              ].map(({ label, value, warn }) => (
                <div key={label} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className={cn(
                    'font-mono text-sm',
                    value > warn ? 'text-danger' : 'text-foreground'
                  )}>
                    {value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Indicator */}
          {(token.sniperPercent > 20 || token.insiderPercent > 10 || token.topHolderPercent > 50) && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-danger/10 border border-danger/20">
              <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-danger">High Risk Token</p>
                <p className="text-xs text-danger/80">
                  Distribution metrics indicate potential rug risk. Trade with caution.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={handleTrade}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
            >
              <Zap className="w-4 h-4" />
              Quick Trade
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 border-border hover:bg-secondary"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

TokenDetailModal.displayName = 'TokenDetailModal';

export default TokenDetailModal;
