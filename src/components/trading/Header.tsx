import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { selectWsConnected, selectLoadingState } from '@/store/tokenSlice';
import { Wifi, WifiOff, Zap } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = memo(({ className }) => {
  const isConnected = useAppSelector(selectWsConnected);
  const loading = useAppSelector(selectLoadingState);

  return (
    <header className={cn(
      'flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50',
      className
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight">Pulse</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">Token Discovery</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Connection Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
              isConnected 
                ? 'bg-success/20 text-success' 
                : 'bg-danger/20 text-danger'
            )}>
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span className="hidden sm:inline">Live</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {isConnected ? 'Receiving real-time updates' : 'Reconnecting...'}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
