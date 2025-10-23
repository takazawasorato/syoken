'use client';

import { memo, forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Fully accessible with ARIA support and keyboard navigation.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" loading={isLoading}>
 *   Submit
 * </Button>
 * ```
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  iconLeft?: ReactNode;
  /** Icon to display after text */
  iconRight?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Children content */
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50';

    // Variant styles
    const variantStyles = {
      primary:
        'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
      secondary:
        'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
      outline:
        'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-300 shadow-md hover:shadow-lg',
      ghost:
        'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-200',
      danger:
        'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
      success:
        'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Combine all styles
    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    // Loading spinner
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
    );

    return (
      <button
        ref={ref}
        className={combinedStyles}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        <span>{children}</span>
        {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default memo(Button);
