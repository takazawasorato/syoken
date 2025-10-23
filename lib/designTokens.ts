/**
 * Design Tokens for Commercial Area Analysis Application
 *
 * This file contains all design tokens used throughout the application.
 * These tokens ensure consistency and make it easy to maintain the design system.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary colors (Blue)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary colors (Indigo)
  secondary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Success (Green)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warning (Yellow/Amber)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error (Red)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Info (Blue)
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Neutral (Gray)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  semantic: {
    male: '#3B82F6',
    female: '#EC4899',
    area1: '#3B82F6',
    area2: '#10B981',
    area3: '#F59E0B',
    circle: '#3B82F6',
    driveTime: '#10B981',
  },

  // Gradient presets
  gradients: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    secondary: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    success: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    blue: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    blueIndigo: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'system-ui, -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", "Courier New", monospace',
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Circle
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  // Durations
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  // Timing functions (easing)
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Keyframes
  keyframes: {
    fadeIn: {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    slideInRight: {
      from: { transform: 'translateX(100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',    // Small devices (mobile landscape)
  md: '768px',    // Medium devices (tablets)
  lg: '1024px',   // Large devices (desktop)
  xl: '1280px',   // Extra large devices (large desktop)
  '2xl': '1536px', // 2X Extra large devices
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
} as const;

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const components = {
  button: {
    height: {
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },

  input: {
    height: {
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
    },
  },

  card: {
    padding: {
      sm: '1rem',     // 16px
      md: '1.5rem',   // 24px
      lg: '2rem',     // 32px
    },
  },

  toast: {
    width: '24rem',   // 384px
    maxWidth: '90vw',
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a color value from the color palette
 * @param path - Color path (e.g., 'primary.500', 'success.600')
 * @returns Color hex value
 */
export function getColor(path: string): string {
  const [category, shade] = path.split('.');
  const colorCategory = (colors as any)[category];

  if (!colorCategory) {
    console.warn(`Color category "${category}" not found`);
    return colors.gray[500];
  }

  if (typeof colorCategory === 'string') {
    return colorCategory;
  }

  const colorValue = colorCategory[shade];
  if (!colorValue) {
    console.warn(`Color shade "${shade}" not found in category "${category}"`);
    return colors.gray[500];
  }

  return colorValue;
}

/**
 * Get a spacing value
 * @param size - Spacing size (0-64)
 * @returns Spacing value
 */
export function getSpacing(size: keyof typeof spacing): string {
  return spacing[size];
}

/**
 * Get a shadow value
 * @param level - Shadow level ('sm', 'md', 'lg', etc.)
 * @returns Shadow CSS value
 */
export function getShadow(level: keyof typeof shadows): string {
  return shadows[level];
}

/**
 * Generate a gradient background CSS
 * @param gradient - Gradient name
 * @returns Gradient CSS value
 */
export function getGradient(gradient: keyof typeof colors.gradients): string {
  return colors.gradients[gradient];
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ColorCategory = keyof typeof colors;
export type SpacingSize = keyof typeof spacing;
export type ShadowLevel = keyof typeof shadows;
export type BorderRadiusSize = keyof typeof borderRadius;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;

// Default export
export default {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  animations,
  breakpoints,
  zIndex,
  components,
  getColor,
  getSpacing,
  getShadow,
  getGradient,
};
