'use client';

import { memo } from 'react';
import Button from './Button';

/**
 * ErrorState Component
 *
 * Error display component with retry and dismiss actions.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   title="Error occurred"
 *   message={errorMessage}
 *   onRetry={handleRetry}
 *   onDismiss={handleDismiss}
 * />
 * ```
 */

export interface ErrorStateProps {
  /** Error title */
  title: string;
  /** Error message */
  message: string;
  /** Retry handler */
  onRetry?: () => void;
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Additional className */
  className?: string;
}

const ErrorState = memo<ErrorStateProps>(
  ({ title, message, onRetry, onDismiss, className = '' }) => {
    return (
      <div
        className={`bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md animate-fade-in ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start">
          {/* Error icon */}
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Error content */}
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-red-800">{title}</h3>
            <p className="mt-2 text-sm text-red-700">{message}</p>

            {/* Actions */}
            {(onRetry || onDismiss) && (
              <div className="mt-4 flex gap-3">
                {onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    Retry
                  </Button>
                )}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';

export default ErrorState;
