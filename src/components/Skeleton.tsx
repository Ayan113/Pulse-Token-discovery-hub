import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'text';
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = memo(({ 
  className, 
  variant = 'default',
  animate = true 
}) => {
  return (
    <div
      className={cn(
        'bg-secondary rounded',
        animate && 'shimmer',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 rounded-sm',
        className
      )}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Token Card Skeleton
export const TokenCardSkeleton: React.FC<{ index?: number }> = memo(({ index = 0 }) => {
  const delay = index * 50;
  
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Avatar */}
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" variant="circular" />
      
      {/* Token Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-4 w-4 rounded-full" variant="circular" />
          <Skeleton className="h-4 w-4 rounded-full" variant="circular" />
          <Skeleton className="h-4 w-4 rounded-full" variant="circular" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
      
      {/* Price Info */}
      <div className="text-right space-y-2 flex-shrink-0">
        <div className="flex items-center gap-2 justify-end">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-32 rounded-md" />
      </div>
    </div>
  );
});

TokenCardSkeleton.displayName = 'TokenCardSkeleton';

// Table Skeleton
export const TokenTableSkeleton: React.FC<{ count?: number }> = memo(({ count = 8 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <TokenCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
});

TokenTableSkeleton.displayName = 'TokenTableSkeleton';

// Progress Bar Skeleton
export const ProgressSkeleton: React.FC = memo(() => (
  <div className="w-full h-1.5 bg-trading-progress rounded-full overflow-hidden">
    <Skeleton className="h-full w-3/4" />
  </div>
));

ProgressSkeleton.displayName = 'ProgressSkeleton';

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC = memo(() => (
  <div className="p-4 rounded-lg bg-card border border-border space-y-3">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-16" />
  </div>
));

StatsCardSkeleton.displayName = 'StatsCardSkeleton';

export default Skeleton;
