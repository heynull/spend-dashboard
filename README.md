# SpendOS Dashboard

A high-performance, fully-typed spend analytics dashboard inspired by modern fintech tools like Ramp, built with React 18, TypeScript, and a focus on performance optimization and developer experience.

## Live Demo
[https://spend-dashboard-tjn6.vercel.app]

## Screenshot

![SpendOS Dashboard](https://via.placeholder.com/1200x700?text=SpendOS+Dashboard+Screenshot)

## Tech Stack

- **React 18** – Latest React with hooks and concurrent features
- **TypeScript (strict mode)** – Full type safety with strict compiler settings
- **Vite** – Lightning-fast build tool with HMR
- **Tailwind CSS v4** – @tailwindcss/vite plugin for atomic styling
- **Recharts** – Composable charting library for data visualization
- **TanStack Query v5** – Async state management with caching and refetching

## Features

- **Transaction Table** – Sortable columns (click headers to toggle ascending/descending), full-text search across merchants and cardholders, multi-select filtering by category and status
- **Spend Breakdown Chart** – Donut chart with category breakdown, legend showing amounts and percentages, custom tooltip on hover
- **KPI Summary Cards** – Total spend, transaction count, top category, period-over-period change with trend indicators (red for increase, green for decrease)
- **CSV Export** – Download filtered transactions with proper formatting (handles special characters, amounts formatted as dollars, dates human-readable)
- **Advanced Filtering** – Text search, category/status multi-select, date range picker; active filter count badge; one-click "Clear all"
- **Skeleton Loading States** – Animated placeholder blocks while data fetches (not spinners); provides better perceived performance
- **Responsive Layout** – Sidebar navigation (240px), main content area, header with date range selector and user avatar

## Technical Decisions

### useReducer for Table State
Table state (sort column, direction, current page) is tightly coupled and changes are predictable. `useReducer` provides a single source of truth and makes state transitions explicit via action types, preventing bugs from managing three separate useState calls. This scales better than useState as features grow.

### React Query for Data Fetching
React Query handles caching, stale-time, garbage collection, and deduplication automatically. Without it, we'd need to manually manage loading/error states, implement request deduplication, and handle cache invalidation. The 5-minute staleTime and queryKey system keeps data fresh while reducing unnecessary API calls.

### useMemo for Filter Performance  
Filtered transaction arrays, sorted rows, and chart data transformations are expensive to recompute. useMemo ensures these only recalculate when their dependencies change. Without memoization, the filter UI becomes janky because every parent re-render would trigger exponential re-renders down the component tree (table re-sorts, chart transforms data, filters re-render).

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/spendos-dashboard.git
cd spendos-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:5173` with hot module replacement enabled.

### Build for Production

```bash
npm run build
npm run preview
```

## What I'd Build Next

- **Real API Integration** – Replace mock data with actual backend endpoints; add error boundaries for network failures; implement request retry logic with exponential backoff for reliability
- **Department Drill-Down** – Click on department KPI to see department-specific transactions and budget utilization; budget vs. spent visualization per department with alerts when approaching limits
- **Advanced Analytics** – Spending trends over time (line chart), merchant spend rankings (bar chart), anomaly detection (flag unusual category/amount combinations), custom date range picker instead of fixed ranges

## Project Structure

```
src/
├── components/        # React components (Layout, Dashboard, etc.)
├── hooks/            # Custom React hooks (useTransactions, useTransactionFilters, etc.)
├── api/              # API layer with simulated async functions
├── types/            # TypeScript type definitions
├── data/             # Mock data generation
├── utils/            # Utilities (CSV export, formatting)
└── App.tsx           # Root component with QueryClientProvider
```

## Performance Notes

- Components wrapped in React.memo to prevent unnecessary re-renders when parent updates
- All sorting/filtering computed with useMemo to avoid recalculation on parent state changes
- Callbacks memoized with useCallback to provide stable references to child components
- React Query handles request deduplication and automatic refetching on stale data

## License

MIT

