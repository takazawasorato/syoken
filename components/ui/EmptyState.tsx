'use client';

import { memo, ReactNode } from 'react';

/**
 * EmptyState Component
 *
 * Placeholder component for empty data states.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="No results"
 *   description="Start analysis to see results"
 *   action={<Button>Start Analysis</Button>}
 * />
 * ```
 */

export interface EmptyStateProps {
  /** Icon to display */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button or element */
  action?: ReactNode;
  /** Additional className */
  className?: string;
}

const EmptyState = memo<EmptyStateProps>(
  ({ icon, title, description, action, className = '' }) => {
    return (
      <div
        className={`bg-white p-12 rounded-2xl shadow-lg border border-gray-100 text-center ${className}`}
      >
        {/* Icon */}
        {icon && (
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
            <div className="w-10 h-10 text-blue-600">{icon}</div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>

        {/* Description */}
        {description && (
          <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
        )}

        {/* Action */}
        {action && <div className="mt-6">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
