import React from 'react';
import type { ReactNode } from 'react';

/**
 * Date range filter option
 */
type DateRange = 'last30' | 'last90' | 'thisYear';

/**
 * Props for the Layout component
 */
interface LayoutProps {
  /** Main page title */
  pageTitle: string;
  /** Child components to render in the main content area */
  children: ReactNode;
  /** Current active navigation item */
  activeNav?: 'dashboard' | 'transactions' | 'departments' | 'cards';
  /** Callback when navigation item is clicked */
  onNavChange?: (nav: 'dashboard' | 'transactions' | 'departments' | 'cards') => void;
  /** Callback when date range is changed */
  onDateRangeChange?: (range: DateRange) => void;
  /** Current selected date range */
  selectedDateRange?: DateRange;
}

/**
 * Inline SVG icon components
 */
const DashboardIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"
    />
  </svg>
);

const TransactionIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DepartmentIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m5.581 0a2 2 0 100-4h-.581m0 4a2 2 0 100-4h.581m0 0H9m-5.581-4h.581m0 0a2 2 0 100 4H9m0 0h5.581"
    />
  </svg>
);

const CardIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V5a3 3 0 00-3-3H6a3 3 0 00-3 3v11a3 3 0 003 3z"
    />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

/**
 * Navigation item component
 */
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive
        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

/**
 * Date range selector component
 */
interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <CalendarIcon className="w-5 h-5 text-gray-500" />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as DateRange)}
      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
    >
      <option value="last30">Last 30 days</option>
      <option value="last90">Last 90 days</option>
      <option value="thisYear">This year</option>
    </select>
  </div>
);

/**
 * User avatar placeholder component
 */
const AvatarPlaceholder: React.FC = () => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
    JD
  </div>
);

/**
 * Layout component for the spend dashboard
 * Provides a sidebar navigation and header with main content area
 */
export const Layout: React.FC<LayoutProps> = ({
  pageTitle,
  children,
  activeNav = 'dashboard',
  onNavChange,
  onDateRangeChange,
  selectedDateRange = 'last90',
}) => {
  return (
    <div className="flex h-screen bg-gray-100 w-full max-w-full overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">SpendOS</h1>
          <p className="text-xs text-gray-500 mt-1">Spend Intelligence</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={activeNav === 'dashboard'}
            onClick={() => onNavChange?.('dashboard')}
          />
          <NavItem
            icon={<TransactionIcon />}
            label="Transactions"
            isActive={activeNav === 'transactions'}
            onClick={() => onNavChange?.('transactions')}
          />
          <NavItem
            icon={<DepartmentIcon />}
            label="Departments"
            isActive={activeNav === 'departments'}
            onClick={() => onNavChange?.('departments')}
          />
          <NavItem
            icon={<CardIcon />}
            label="Cards"
            isActive={activeNav === 'cards'}
            onClick={() => onNavChange?.('cards')}
          />
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">© 2026 SpendOS</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-6">
            {onDateRangeChange && (
              <DateRangeSelector
                value={selectedDateRange}
                onChange={onDateRangeChange}
              />
            )}
            <AvatarPlaceholder />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 min-w-0">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
