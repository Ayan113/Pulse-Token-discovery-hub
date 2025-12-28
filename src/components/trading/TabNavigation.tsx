import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { TOKEN_CATEGORIES, TokenCategory } from '@/types/token';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveCategory, selectActiveCategory } from '@/store/tokenSlice';
import { Zap } from 'lucide-react';

interface TabNavigationProps {
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = memo(({ className }) => {
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector(selectActiveCategory);

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-secondary/50 rounded-lg', className)}>
      {TOKEN_CATEGORIES.map((category) => (
        <TabButton
          key={category.id}
          category={category}
          isActive={activeCategory === category.id}
          onClick={() => dispatch(setActiveCategory(category.id))}
        />
      ))}
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';

interface TabButtonProps {
  category: TokenCategory;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = memo(({ category, isActive, onClick }) => {
  const getIcon = () => {
    switch (category.id) {
      case 'new-pairs':
        return <span className="w-2 h-2 rounded-full bg-success animate-pulse" />;
      case 'final-stretch':
        return <Zap className="w-3.5 h-3.5 text-warning" />;
      case 'migrated':
        return <span className="w-2 h-2 rounded-full bg-primary" />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isActive 
          ? 'bg-card text-foreground shadow-sm' 
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
      )}
    >
      {getIcon()}
      <span className="hidden sm:inline">{category.label}</span>
      <span className="sm:hidden">
        {category.id === 'new-pairs' && 'New'}
        {category.id === 'final-stretch' && 'Final'}
        {category.id === 'migrated' && 'Migrated'}
      </span>
    </button>
  );
});

TabButton.displayName = 'TabButton';

export default TabNavigation;
