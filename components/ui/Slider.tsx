'use client';

import { memo, InputHTMLAttributes } from 'react';

/**
 * Slider Component
 *
 * Range slider for numeric input with visual progress bar.
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Radius"
 *   min={100}
 *   max={5000}
 *   step={100}
 *   value={radius}
 *   onChange={(e) => setRadius(parseInt(e.target.value))}
 *   unit="m"
 * />
 * ```
 */

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Slider label */
  label?: string;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step?: number;
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Unit to display */
  unit?: string;
  /** Color theme */
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  /** Show min/max labels */
  showLabels?: boolean;
}

const Slider = memo<SliderProps>(
  ({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    unit = '',
    color = 'blue',
    showLabels = true,
    disabled = false,
    className = '',
    ...props
  }) => {
    // Generate unique ID for accessibility
    const sliderId = props.id || `slider-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate percentage for visual progress
    const percentage = ((value - min) / (max - min)) * 100;

    // Color styles
    const colorStyles = {
      blue: {
        track: 'rgb(37 99 235)',
        bg: 'rgb(191 219 254)',
        text: 'text-blue-900',
        valueBg: 'bg-white',
        valueText: 'text-blue-600',
        labelText: 'text-blue-700',
      },
      green: {
        track: 'rgb(22 163 74)',
        bg: 'rgb(187 247 208)',
        text: 'text-green-900',
        valueBg: 'bg-white',
        valueText: 'text-green-600',
        labelText: 'text-green-700',
      },
      purple: {
        track: 'rgb(147 51 234)',
        bg: 'rgb(233 213 255)',
        text: 'text-purple-900',
        valueBg: 'bg-white',
        valueText: 'text-purple-600',
        labelText: 'text-purple-700',
      },
      red: {
        track: 'rgb(220 38 38)',
        bg: 'rgb(254 202 202)',
        text: 'text-red-900',
        valueBg: 'bg-white',
        valueText: 'text-red-600',
        labelText: 'text-red-700',
      },
      yellow: {
        track: 'rgb(217 119 6)',
        bg: 'rgb(253 230 138)',
        text: 'text-yellow-900',
        valueBg: 'bg-white',
        valueText: 'text-yellow-600',
        labelText: 'text-yellow-700',
      },
    };

    const colors = colorStyles[color];

    return (
      <div className={`space-y-1 ${className}`}>
        {/* Label and value display */}
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label htmlFor={sliderId} className={`text-sm font-medium ${colors.text}`}>
              {label}
            </label>
            <span
              className={`text-lg font-bold ${colors.valueBg} ${colors.valueText} px-3 py-1 rounded-lg shadow-sm`}
            >
              {value}
              {unit}
            </span>
          </div>
        )}

        {/* Slider input */}
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${unit}`}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50`}
          style={{
            background: `linear-gradient(to right, ${colors.track} 0%, ${colors.track} ${percentage}%, ${colors.bg} ${percentage}%, ${colors.bg} 100%)`,
          }}
          {...props}
        />

        {/* Min/Max labels */}
        {showLabels && (
          <div className={`flex justify-between text-xs ${colors.labelText} font-medium mt-1`}>
            <span>
              {min}
              {unit}
            </span>
            <span>
              {max}
              {unit}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
