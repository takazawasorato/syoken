'use client';

import { memo, forwardRef, SelectHTMLAttributes, ReactNode, useState } from 'react';

/**
 * Select Component
 *
 * Custom dropdown select component with styling and accessibility.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Category"
 *   options={categoryOptions}
 *   value={selectedCategory}
 *   onChange={handleChange}
 * />
 * ```
 */

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Select label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Select options */
  options: SelectOption[];
  /** Select size */
  selectSize?: 'sm' | 'md' | 'lg';
  /** Full width select */
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      selectSize = 'md',
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
    const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    // Base select styles
    const baseStyles =
      'border-2 rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer bg-white disabled:bg-gray-100 disabled:cursor-not-allowed';

    // Size styles
    const sizeStyles = {
      sm: 'py-2 text-sm',
      md: 'py-3 text-base',
      lg: 'py-4 text-lg',
    };

    // Padding (account for dropdown icon)
    const paddingStyles = 'pl-4 pr-10';

    // State styles
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : isFocused
      ? 'border-blue-500 ring-4 ring-blue-100'
      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Combine select styles
    const selectStyles = `${baseStyles} ${sizeStyles[selectSize]} ${paddingStyles} ${stateStyles} ${widthStyles} ${className}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative">
          {/* Select field */}
          <select
            ref={ref}
            id={selectId}
            className={selectStyles}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon ? `${option.icon} ` : ''}
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

        {/* Helper text */}
        {!error && helperText && (
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

Select.displayName = 'Select';

export default memo(Select);
