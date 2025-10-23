'use client';

import { memo, HTMLAttributes, ReactNode } from 'react';

/**
 * Card Component
 *
 * A container component for grouping related content.
 * Supports multiple variants and composition patterns.
 *
 * @example
 * ```tsx
 * <Card variant="gradient" className="p-6">
 *   <Card.Header>
 *     <h3>Title</h3>
 *   </Card.Header>
 *   <Card.Body>
 *     <p>Content goes here</p>
 *   </Card.Body>
 * </Card>
 * ```
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card variant style */
  variant?: 'default' | 'gradient' | 'outlined' | 'elevated';
  /** Children content */
  children: ReactNode;
  /** Hover effect */
  hoverable?: boolean;
}

const Card = memo<CardProps>(({ variant = 'default', hoverable = false, className = '', children, ...props }) => {
  // Base styles
  const baseStyles = 'rounded-2xl overflow-hidden';

  // Variant styles
  const variantStyles = {
    default: 'bg-white shadow-lg border border-gray-100',
    gradient: 'bg-gradient-to-br shadow-lg',
    outlined: 'bg-white border-2',
    elevated: 'bg-white shadow-xl',
  };

  // Hover styles
  const hoverStyles = hoverable
    ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer'
    : 'transition-all duration-300';

  // Combine styles
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

  return (
    <div className={combinedStyles} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * Card Header Component
 */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader = memo<CardHeaderProps>(({ className = '', children, ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'Card.Header';

/**
 * Card Body Component
 */
interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardBody = memo<CardBodyProps>(({ className = '', children, ...props }) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = 'Card.Body';

/**
 * Card Footer Component
 */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter = memo<CardFooterProps>(({ className = '', children, ...props }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'Card.Footer';

// Attach sub-components
const CardWithSubComponents = Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export default CardWithSubComponents;
