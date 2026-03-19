import { useQuery } from '@tanstack/react-query';
import type { SpendSummary } from '../types/index';
import { fetchSummary } from '../api/transactions';

/**
 * Custom hook to fetch spend summary metrics
 * Uses TanStack Query (React Query) with proper caching and refetch logic
 */
export function useSummary() {
  return useQuery<SpendSummary, Error>({
    queryKey: ['summary'],
    queryFn: fetchSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
}
