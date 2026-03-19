import { useMemo, useState, useCallback } from 'react';
import type { Transaction, Category, Status } from '../types/index';

/**
 * Interface for transaction filter state
 */
export interface Filters {
  /** Text search for merchant or cardholder name */
  searchText: string;
  /** Selected transaction categories */
  selectedCategories: Category[];
  /** Selected transaction statuses */
  selectedStatuses: Status[];
  /** Start date for date range filter (ISO string) */
  startDate: string | null;
  /** End date for date range filter (ISO string) */
  endDate: string | null;
}

/**
 * Return type for useTransactionFilters hook
 */
export interface UseTransactionFiltersReturn {
  /** Filtered transactions based on current filter state */
  filteredTransactions: Transaction[];
  /** Current filter state */
  filters: Filters;
  /** Update filters state */
  setFilters: (filters: Filters) => void;
  /** Update specific filter field */
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  /** Toggle a category in the filter */
  toggleCategory: (category: Category) => void;
  /** Toggle a status in the filter */
  toggleStatus: (status: Status) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Check if any filters are active */
  hasActiveFilters: boolean;
  /** Count of active filters */
  activeFilterCount: number;
}

/**
 * Custom hook for filtering transactions
 * Handles text search, category, status, and date range filtering
 * Uses useMemo for performance optimization
 */
export function useTransactionFilters(transactions: Transaction[]): UseTransactionFiltersReturn {
  const [filters, setFilters] = useState<Filters>({
    searchText: '',
    selectedCategories: [],
    selectedStatuses: [],
    startDate: null,
    endDate: null,
  });

  /**
   * Update a specific filter field
   */
  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Toggle category in filter
   */
  const toggleCategory = useCallback((category: Category) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  }, []);

  /**
   * Toggle status in filter
   */
  const toggleStatus = useCallback((status: Status) => {
    setFilters((prev) => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.includes(status)
        ? prev.selectedStatuses.filter((s) => s !== status)
        : [...prev.selectedStatuses, status],
    }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      searchText: '',
      selectedCategories: [],
      selectedStatuses: [],
      startDate: null,
      endDate: null,
    });
  }, []);

  /**
   * Memoized filtered transactions
   * Only recalculates when transactions or filters change
   */
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Text search filter (merchant or cardholder)
      if (filters.searchText.trim() !== '') {
        const searchLower = filters.searchText.toLowerCase();
        const matchesMerchant = transaction.merchant.toLowerCase().includes(searchLower);
        const matchesCardholder = transaction.cardholderName.toLowerCase().includes(searchLower);
        if (!matchesMerchant && !matchesCardholder) {
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(transaction.category)) {
          return false;
        }
      }

      // Status filter
      if (filters.selectedStatuses.length > 0) {
        if (!filters.selectedStatuses.includes(transaction.status)) {
          return false;
        }
      }

      // Date range filter
      if (filters.startDate !== null) {
        if (transaction.date < filters.startDate) {
          return false;
        }
      }
      if (filters.endDate !== null) {
        if (transaction.date > filters.endDate) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, filters]);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchText.trim() !== '' ||
      filters.selectedCategories.length > 0 ||
      filters.selectedStatuses.length > 0 ||
      filters.startDate !== null ||
      filters.endDate !== null
    );
  }, [filters]);

  /**
   * Count of active filters
   */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchText.trim() !== '') count += 1;
    if (filters.selectedCategories.length > 0) count += 1;
    if (filters.selectedStatuses.length > 0) count += 1;
    if (filters.startDate !== null || filters.endDate !== null) count += 1;
    return count;
  }, [filters]);

  return {
    filteredTransactions,
    filters,
    setFilters,
    updateFilter,
    toggleCategory,
    toggleStatus,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
