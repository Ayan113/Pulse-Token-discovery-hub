import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCategoryTokens } from '@/hooks/useTokenData';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSort, selectActiveCategory } from '@/store/tokenSlice';
import { SortField, SortDirection, TOKEN_CATEGORIES } from '@/types/token';
import { TokenCard } from './TokenCard';
import { TokenTableSkeleton } from '@/components/Skeleton';
import { InlineError } from '@/components/ErrorBoundary';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Settings2, 
  RefreshCw,
  Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SortOption {
  field: SortField;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { field: 'createdAt', label: 'Newest' },
  { field: 'marketCap', label: 'Market Cap' },
  { field: 'volume', label: 'Volume' },
  { field: 'holders', label: 'Holders' },
  { field: 'priceChange24h', label: 'Price Change' },
  { field: 'bondingProgress', label: 'Bonding Progress' },
];

interface TokenTableProps {
  onRefresh?: () => void;
}

export const TokenTable: React.FC<TokenTableProps> = memo(({ onRefresh }) => {
  const dispatch = useAppDispatch();
  const { tokens, loading } = useCategoryTokens();
  const activeCategory = useAppSelector(selectActiveCategory);
  const sort = useAppSelector(state => state.tokens.sort);

  const categoryLabel = useMemo(() => 
    TOKEN_CATEGORIES.find(c => c.id === activeCategory)?.label || 'Tokens',
    [activeCategory]
  );

  const handleSort = (field: SortField) => {
    const newDirection: SortDirection = 
      sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
    dispatch(setSort({ field, direction: newDirection }));
  };

  const currentSortLabel = SORT_OPTIONS.find(o => o.field === sort.field)?.label || 'Sort';

  if (loading.error) {
    return (
      <InlineError 
        message={loading.error} 
        onRetry={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">{categoryLabel}</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-mono">
            {tokens.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-2 border-border bg-card hover:bg-secondary"
              >
                {sort.direction === 'desc' ? (
                  <ArrowDown className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{currentSortLabel}</span>
                <span className="sm:hidden">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.field}
                  onClick={() => handleSort(option.field)}
                  className={cn(
                    'flex items-center justify-between cursor-pointer',
                    sort.field === option.field && 'bg-secondary'
                  )}
                >
                  <span>{option.label}</span>
                  {sort.field === option.field && (
                    sort.direction === 'desc' ? (
                      <ArrowDown className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <ArrowUp className="w-3.5 h-3.5 text-primary" />
                    )
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading.isRefreshing}
            className="h-8 w-8 p-0 border-border bg-card hover:bg-secondary"
          >
            <RefreshCw className={cn(
              'w-3.5 h-3.5',
              loading.isRefreshing && 'animate-spin'
            )} />
          </Button>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {loading.isLoading ? (
            <TokenTableSkeleton count={8} />
          ) : tokens.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Inbox className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No tokens found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                New tokens will appear here in real-time
              </p>
            </motion.div>
          ) : (
            tokens.map((token, index) => (
              <TokenCard key={token.id} token={token} index={index} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

TokenTable.displayName = 'TokenTable';

export default TokenTable;
