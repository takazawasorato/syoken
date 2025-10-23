'use client';

import { memo, ReactNode } from 'react';

/**
 * Tabs Component
 *
 * Tab navigation component with keyboard navigation and accessibility.
 *
 * @example
 * ```tsx
 * <Tabs value={activeTab} onChange={setActiveTab}>
 *   <Tab value="overview" label="Overview" icon={<ChartIcon />} />
 *   <Tab value="data" label="Data" />
 * </Tabs>
 * ```
 */

export interface TabsProps {
  /** Active tab value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Tab items */
  children: ReactNode;
  /** Aria label */
  ariaLabel?: string;
}

export const Tabs = memo<TabsProps>(({ value, onChange, children, ariaLabel = 'Tabs' }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex" role="tablist" aria-label={ariaLabel}>
        {children}
      </nav>
    </div>
  );
});

Tabs.displayName = 'Tabs';

/**
 * Tab Component (used within Tabs)
 */
export interface TabProps {
  /** Tab value */
  value: string;
  /** Tab label */
  label: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Is active */
  isActive?: boolean;
  /** Click handler */
  onClick?: (value: string) => void;
}

export const Tab = memo<TabProps>(({ value, label, icon, isActive = false, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${value}-panel`}
      tabIndex={isActive ? 0 : -1}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {label}
      </div>
    </button>
  );
});

Tab.displayName = 'Tab';

/**
 * TabPanel Component (content container for tabs)
 */
export interface TabPanelProps {
  /** Panel value (should match tab value) */
  value: string;
  /** Active tab value */
  activeValue: string;
  /** Children content */
  children: ReactNode;
}

export const TabPanel = memo<TabPanelProps>(({ value, activeValue, children }) => {
  if (value !== activeValue) return null;

  return (
    <div
      id={`${value}-panel`}
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
      className="animate-fade-in"
    >
      {children}
    </div>
  );
});

TabPanel.displayName = 'TabPanel';

export default Tabs;
