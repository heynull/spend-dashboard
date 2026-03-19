import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useSummary } from '../hooks/useSummary';
import { useCategoryBreakdown } from '../hooks/useCategoryBreakdown';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { Layout } from './Layout';
import { SummaryCards } from './SummaryCards';
import { SpendBreakdownChart } from './SpendBreakdownChart';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { ComingSoon } from './ComingSoon';
import {
  DashboardSkeleton,
  SummaryCardsSkeleton,
  SpendBreakdownChartSkeleton,
  TransactionTableSkeleton,
  TransactionFiltersSkeleton,
} from './SkeletonLoaders';
import {
  filterTransactionsByDateRange,
  getTransactionsFromPreviousPeriod,
} from '../utils/dateFiltering';
import { getMockSummary, getMockCategoryBreakdown } from '../data/mockTransactions';

/**
 * Main dashboard page component
 */
export const Dashboard: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<'last30' | 'last90' | 'thisYear'>(
    'last90'
  );
  const [activeNav, setActiveNav] = useState<'dashboard' | 'transactions' | 'departments' | 'cards'>(
    'dashboard'
  );

  // React Query hooks
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useTransactions();

  const {
    data: summary,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useSummary();

  const {
    data: categoryBreakdown = [],
    isLoading: isLoadingCategoryBreakdown,
    error: categoryBreakdownError,
  } = useCategoryBreakdown();

  // Filter hook
  const {
    filteredTransactions: filtereredByFilters,
    filters,
    setFilters,
    toggleCategory,
    toggleStatus,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useTransactionFilters(transactions);

  // Compute filtered transactions by date range with useMemo
  const { filteredByDateRange, previousPeriodTransactions, dateRangeFilteredSummary, dateFilteredCategoryBreakdown } = useMemo(() => {
    const byDateRange = filterTransactionsByDateRange(transactions, selectedDateRange);
    const previousPeriod = getTransactionsFromPreviousPeriod(transactions, selectedDateRange);
    
    // Also apply user's category and status filters to the date-filtered transactions
    const finalFiltered = byDateRange.filter((txn) => {
      const categoryMatch = filters.selectedCategories.length === 0 || filters.selectedCategories.includes(txn.category);
      const statusMatch = filters.selectedStatuses.length === 0 || filters.selectedStatuses.includes(txn.status);
      const searchMatch = 
        !filters.searchTerm ||
        txn.merchant.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        txn.cardholderName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    });

    // Compute summary from filtered data
    const summary = getMockSummary(byDateRange, previousPeriod);
    
    // Compute category breakdown from date-filtered transactions
    const categoryBreakdown = getMockCategoryBreakdown(byDateRange);
    
    return {
      filteredByDateRange: finalFiltered,
      previousPeriodTransactions: previousPeriod,
      dateRangeFilteredSummary: summary,
      dateFilteredCategoryBreakdown: categoryBreakdown,
    };
  }, [transactions, selectedDateRange, filters]);

  // Check if any data is loading
  const isLoading =
    isLoadingTransactions || isLoadingSummary || isLoadingCategoryBreakdown;

  // Check for errors
  const hasError = transactionsError || summaryError || categoryBreakdownError;

  // Determine page title based on active navigation
  const getPageTitle = () => {
    switch (activeNav) {
      case 'transactions':
        return 'Transactions';
      case 'departments':
        return 'Departments';
      case 'cards':
        return 'Cards';
      default:
        return 'Dashboard';
    }
  };

  // Render content based on active navigation
  const renderContent = () => {
    if (activeNav === 'dashboard') {
      if (hasError) {
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error loading data</h3>
            <p className="text-red-700">
              Unable to load dashboard data. Please refresh the page and try again.
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          {/* Summary Cards */}
          {isLoading ? (
            <SummaryCardsSkeleton />
          ) : (
            <SummaryCards summary={dateRangeFilteredSummary} />
          )}

          {/* Filters */}
          {isLoading ? (
            <TransactionFiltersSkeleton />
          ) : (
            <TransactionFilters
              filters={filters}
              onFiltersChange={setFilters}
              onToggleCategory={toggleCategory}
              onToggleStatus={toggleStatus}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
              filteredTransactions={filteredByDateRange}
            />
          )}

          {/* Spend Breakdown Chart */}
          {isLoading ? (
            <SpendBreakdownChartSkeleton />
          ) : (
            <SpendBreakdownChart data={dateFilteredCategoryBreakdown} />
          )}

          {/* Transactions Table */}
          {isLoading ? (
            <TransactionTableSkeleton />
          ) : (
            <TransactionTable transactions={filteredByDateRange} />
          )}
        </div>
      );
    }

    if (activeNav === 'transactions') {
      return <ComingSoon pageName="Transactions" />;
    }

    if (activeNav === 'departments') {
      return <ComingSoon pageName="Departments" />;
    }

    if (activeNav === 'cards') {
      return <ComingSoon pageName="Cards" />;
    }
  };

  return (
    <Layout
      pageTitle={getPageTitle()}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      selectedDateRange={selectedDateRange}
      onDateRangeChange={setSelectedDateRange}
    >
      {renderContent()}
    </Layout>
  );
};

export default Dashboard;
