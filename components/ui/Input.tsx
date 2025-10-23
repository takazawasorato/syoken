'use client';

import { memo, forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';

/**
 * Input Component
 *
 * Form input with validation states, icons, and accessibility features.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Address"
 *   placeholder="Enter your address"
 *   error={error}
 *   icon={<LocationIcon />}
 *   required
 * />
 * ```
 */

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Helper text */
  helperText?: string;
  /** Icon to display */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Input size */
  inputSize?: 'sm' | 'md' | 'lg';
  /** Full width input */
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      icon,
      iconPosition = 'left',
      inputSize = 'md',
      fullWidth = false,
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Generate unique ID for accessibility
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Base input styles
    const baseStyles =
      'border-2 rounded-lg transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed';

    // Size styles
    const sizeStyles = {
      sm: 'py-2 text-sm',
      md: 'py-3 text-base',
      lg: 'py-4 text-lg',
    };

    // Icon padding
    const iconPaddingStyles = icon
      ? iconPosition === 'left'
        ? 'pl-10 pr-4'
        : 'pl-4 pr-10'
      : 'px-4';

    // State styles
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : success
      ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
      : isFocused
      ? 'border-blue-500 ring-4 ring-blue-100'
      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Combine input styles
    const inputStyles = `${baseStyles} ${sizeStyles[inputSize]} ${iconPaddingStyles} ${stateStyles} ${widthStyles} ${className}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={inputStyles}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText || success ? helperId : undefined
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right icon */}
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={errorId} className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Success message */}
        {!error && success && (
          <p id={helperId} className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </p>
        )}

        {/* Helper text */}
        {!error && !success && helperText && (
          <p id={helperId} className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default memo(Input);
