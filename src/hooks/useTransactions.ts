import { useQuery } from '@tanstack/react-query';
import type { Transaction } from '../types/index';
import { fetchTransactions } from '../api/transactions';

/**
 * Custom hook to fetch transactions
 * Uses TanStack Query (React Query) with proper caching and refetch logic
 */
export function useTransactions() {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
}
