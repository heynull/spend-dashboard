import React from 'react';

/**
 * Animated skeleton loader component for summary cards
 */
export const SummaryCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse"
        >
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-8 bg-gray-300 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Animated skeleton loader component for transaction table
 */
export const TransactionTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded flex-1"></div>
        ))}
      </div>

      {/* Rows */}
      {[...Array(5)].map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="border-b border-gray-200 px-6 py-4 flex items-center gap-4"
        >
          {[...Array(7)].map((_, colIdx) => (
            <div key={colIdx} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      ))}

      {/* Footer/Pagination */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="h-4 bg-gray-300 rounded w-48"></div>
        <div className="flex items-center gap-2">
          <div className="h-10 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-10 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Animated skeleton loader component for spend breakdown chart
 */
export const SpendBreakdownChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-40 mb-6"></div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chart placeholder */}
        <div className="flex-1 min-h-64 flex items-center justify-center">
          <div className="w-64 h-64 bg-gray-200 rounded-full"></div>
        </div>

        {/* Legend placeholder */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="h-4 bg-gray-300 rounded flex-1"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Animated skeleton loader component for filters
 */
export const TransactionFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4 animate-pulse">
      {/* Search input */}
      <div className="h-10 bg-gray-300 rounded-lg w-full"></div>

      {/* Filter controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-300 rounded-full w-24"></div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
          <div className="text-gray-400">to</div>
          <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-2 border-t border-gray-200 flex gap-2 ml-auto">
        <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
        <div className="h-10 bg-gray-300 rounded-lg w-20"></div>
      </div>
    </div>
  );
};

/**
 * Animated skeleton loader for the entire dashboard page
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCardsSkeleton />

      {/* Filters */}
      <TransactionFiltersSkeleton />

      {/* Chart */}
      <SpendBreakdownChartSkeleton />

      {/* Table */}
      <TransactionTableSkeleton />
    </div>
  );
};
