import { useEffect, useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  setTokens, 
  addToken, 
  updatePrices, 
  clearPriceFlash,
  migrateToken,
  setLoading, 
  setWsConnected,
  selectAllTokens,
  selectTokensByCategory,
  selectLoadingState,
  selectWsConnected,
  selectPriceFlash,
} from '@/store/tokenSlice';
import { fetchTokens, mockWebSocket } from '@/services/mockData';
import { Token, PriceUpdate } from '@/types/token';

// Hook for fetching and managing tokens
export const useTokens = () => {
  const dispatch = useAppDispatch();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setTokens(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }, [error, dispatch]);

  const refresh = useCallback(() => {
    dispatch(setLoading({ isRefreshing: true }));
    refetch().finally(() => {
      dispatch(setLoading({ isRefreshing: false }));
    });
  }, [dispatch, refetch]);

  return {
    isLoading,
    error,
    refresh,
  };
};

// Hook for WebSocket connection
export const useWebSocketConnection = () => {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector(selectAllTokens);
  const isConnected = useAppSelector(selectWsConnected);
  const flashTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const hasConnected = useRef(false);

  useEffect(() => {
    if (tokens.length === 0 || hasConnected.current) return;
    hasConnected.current = true;

    const tokenIds = tokens.map(t => t.id);

    mockWebSocket.setPriceUpdateHandler((updates: PriceUpdate[]) => {
      dispatch(updatePrices(updates));
      
      updates.forEach(update => {
        if (flashTimeoutsRef.current[update.tokenId]) {
          clearTimeout(flashTimeoutsRef.current[update.tokenId]);
        }
        
        flashTimeoutsRef.current[update.tokenId] = setTimeout(() => {
          dispatch(clearPriceFlash(update.tokenId));
        }, 600);
      });
    });

    mockWebSocket.setConnectionHandler((connected: boolean) => {
      dispatch(setWsConnected(connected));
    });

    mockWebSocket.setNewTokenHandler((token: Token) => {
      dispatch(addToken(token));
    });

    mockWebSocket.setMigrationHandler((tokenId: string) => {
      dispatch(migrateToken(tokenId));
    });

    mockWebSocket.connect(tokenIds);

    return () => {
      mockWebSocket.disconnect();
      Object.values(flashTimeoutsRef.current).forEach(clearTimeout);
      hasConnected.current = false;
    };
  }, [tokens.length, dispatch]);

  return { isConnected };
};

// Hook for category-filtered tokens
export const useCategoryTokens = () => {
  const tokens = useAppSelector(selectTokensByCategory);
  const loading = useAppSelector(selectLoadingState);
  
  return { tokens, loading };
};

// Hook for price flash animation
export const usePriceFlash = (tokenId: string) => {
  const flash = useAppSelector(selectPriceFlash(tokenId));
  return flash;
};
