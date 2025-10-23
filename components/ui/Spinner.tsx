'use client';

import { memo } from 'react';

/**
 * Spinner Component
 *
 * Loading spinner indicator with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Spinner size="lg" variant="default" />
 * <Spinner size="md" variant="dots" color="blue" />
 * ```
 */

export interface SpinnerProps {
  /** Spinner variant */
  variant?: 'default' | 'dots' | 'pulse';
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg';
  /** Color theme */
  color?: 'blue' | 'green' | 'purple' | 'red' | 'white' | 'gray';
  /** Additional className */
  className?: string;
}

const Spinner = memo<SpinnerProps>(
  ({ variant = 'default', size = 'md', color = 'blue', className = '' }) => {
    // Size styles
    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-16 h-16',
    };

    // Color styles
    const colorStyles = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
      white: 'text-white',
      gray: 'text-gray-600',
    };

    // Default spinner (circular)
    if (variant === 'default') {
      return (
        <div className={`inline-flex ${className}`} role="status" aria-label="Loading">
          <div className="relative">
            <svg
              className={`animate-spin ${sizeStyles[size]} ${colorStyles[color]}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {/* Inner pulse effect */}
            {size === 'lg' && (
              <div
                className={`absolute inset-0 flex items-center justify-center`}
              >
                <div
                  className={`animate-pulse ${
                    size === 'lg' ? 'h-8 w-8' : 'h-4 w-4'
                  } bg-blue-100 rounded-full`}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Dots spinner
    if (variant === 'dots') {
      const dotSize = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2.5 h-2.5',
        lg: 'w-4 h-4',
      };

      return (
        <div className={`inline-flex gap-2 ${className}`} role="status" aria-label="Loading">
          <div className={`${dotSize[size]} ${colorStyles[color]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
          <div className={`${dotSize[size]} ${colorStyles[color]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
          <div className={`${dotSize[size]} ${colorStyles[color]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
        </div>
      );
    }

    // Pulse spinner
    if (variant === 'pulse') {
      return (
        <div className={`inline-flex ${className}`} role="status" aria-label="Loading">
          <div
            className={`${sizeStyles[size]} ${colorStyles[color]} bg-current rounded-full animate-pulse`}
          />
        </div>
      );
    }

    return null;
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
