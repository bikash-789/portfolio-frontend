import { useState, useCallback, useEffect } from 'react';
import { ApiError } from '../client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  immediate: boolean = false,
  immediateArgs: unknown[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : 'An unexpected error occurred';
        
        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute(...immediateArgs);
    }
  }, [immediate, execute, immediateArgs]);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useApiWithRetry<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  retryCount: number = 3,
  retryDelay: number = 1000
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          const result = await apiFunction(...args);
          setState({ data: result, loading: false, error: null });
          return result;
        } catch (error) {
          lastError = error as Error;
          
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            break;
          }
          
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }
      
      const errorMessage = lastError instanceof ApiError 
        ? lastError.message 
        : 'An unexpected error occurred';
      
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    },
    [apiFunction, retryCount, retryDelay]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useOptimisticApi<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  optimisticUpdate: (data: T) => void,
  rollbackUpdate: () => void
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        optimisticUpdate(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : 'An unexpected error occurred';
        
        setState({ data: null, loading: false, error: errorMessage });
        rollbackUpdate();
        return null;
      }
    },
    [apiFunction, optimisticUpdate, rollbackUpdate]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
} 