import { useQuery } from '@tanstack/react-query';
import type { CategoryBreakdown } from '../types/index';
import { fetchCategoryBreakdown } from '../api/transactions';

/**
 * Custom hook to fetch category breakdown data
 * Uses TanStack Query (React Query) with proper caching and refetch logic
 */
export function useCategoryBreakdown() {
  return useQuery<CategoryBreakdown[], Error>({
    queryKey: ['categoryBreakdown'],
    queryFn: fetchCategoryBreakdown,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
}
