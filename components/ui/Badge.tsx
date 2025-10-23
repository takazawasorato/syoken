'use client';

import { memo, HTMLAttributes, ReactNode } from 'react';

/**
 * Badge Component
 *
 * Small status indicator with color variants.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="custom" customColor="#FF5733">Custom</Badge>
 * ```
 */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | 'custom';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom color (for custom variant) */
  customColor?: string;
  /** Show dot indicator */
  dot?: boolean;
  /** Children content */
  children: ReactNode;
}

const Badge = memo<BadgeProps>(
  ({
    variant = 'default',
    size = 'md',
    customColor,
    dot = false,
    className = '',
    children,
    ...props
  }) => {
    // Base styles
    const baseStyles = 'inline-flex items-center gap-2 font-bold rounded-full transition-all duration-200';

    // Size styles
    const sizeStyles = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2 text-base',
    };

    // Variant styles
    const variantStyles = {
      default: 'bg-gray-100 text-gray-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      primary: 'bg-blue-100 text-blue-700',
      secondary: 'bg-purple-100 text-purple-700',
      custom: '',
    };

    // Combine styles
    const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${
      variant !== 'custom' ? variantStyles[variant] : ''
    } ${className}`;

    // Custom style object
    const customStyle =
      variant === 'custom' && customColor
        ? {
            backgroundColor: `${customColor}20`,
            color: customColor,
          }
        : {};

    // Dot color based on variant
    const dotColors = {
      default: 'bg-gray-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      primary: 'bg-blue-500',
      secondary: 'bg-purple-500',
      custom: '',
    };

    return (
      <span className={combinedStyles} style={customStyle} {...props}>
        {dot && (
          <span
            className={`w-2 h-2 rounded-full ${variant !== 'custom' ? dotColors[variant] : ''}`}
            style={variant === 'custom' && customColor ? { backgroundColor: customColor } : {}}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
