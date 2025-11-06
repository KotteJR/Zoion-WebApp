'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  dualHandle?: boolean;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled = false,
  showTooltip = true,
  formatValue,
  dualHandle = false,
}: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [tooltipValue, setTooltipValue] = useState<number | null>(null);

  const minValue = dualHandle ? (value as [number, number])[0] : (value as number);
  const maxValue = dualHandle ? (value as [number, number])[1] : (typeof value === 'number' ? value : max);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (handle: 'min' | 'max') => {
    if (disabled) return;
    setIsDragging(handle);
  };

  useEffect(() => {
    if (!isDragging || !sliderRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sliderRef.current!.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newValue = min + percentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;

      if (dualHandle) {
        const currentValue = value as [number, number];
        const [currentMin, currentMax] = currentValue;
        if (isDragging === 'min') {
          const clampedValue = Math.min(steppedValue, currentMax);
          onChange([clampedValue, currentMax]);
          setTooltipValue(clampedValue);
        } else {
          const clampedValue = Math.max(steppedValue, currentMin);
          onChange([currentMin, clampedValue]);
          setTooltipValue(clampedValue);
        }
      } else {
        onChange(steppedValue);
        setTooltipValue(steppedValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      setTooltipValue(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, step, onChange, dualHandle, value]);

  const getDisplayValue = (handle: 'min' | 'max' | 'single') => {
    if (tooltipValue !== null) return tooltipValue;
    if (dualHandle) {
      return handle === 'min' ? minValue : maxValue;
    }
    return minValue;
  };
  
  const displayTextMin = formatValue ? formatValue(getDisplayValue('min')) : getDisplayValue('min').toString();
  const displayTextMax = formatValue ? formatValue(getDisplayValue('max')) : getDisplayValue('max').toString();
  const displayTextSingle = formatValue ? formatValue(getDisplayValue('single')) : getDisplayValue('single').toString();

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={sliderRef}
        className="relative h-2 w-full rounded-full bg-white/10"
        onMouseDown={(e) => {
          if (disabled || dualHandle) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          const newValue = min + percentage * (max - min);
          const steppedValue = Math.round(newValue / step) * step;
          onChange(steppedValue);
        }}
      >
        {/* Track fill */}
        <div
          className="absolute h-2 rounded-full bg-white/30"
          style={{
            left: dualHandle ? `${getPercentage(minValue)}%` : '0%',
            width: dualHandle 
              ? `${getPercentage(maxValue) - getPercentage(minValue)}%` 
              : `${getPercentage(minValue)}%`,
          }}
        />

        {/* Min handle (for dual) */}
        {dualHandle && (
          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-grab active:cursor-grabbing rounded-full bg-white border-2 border-white/30 shadow-md hover:scale-110 transition-transform"
            style={{ left: `calc(${getPercentage(minValue)}% - 8px)` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown('min');
            }}
          >
            {showTooltip && isDragging === 'min' && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-white/90 text-gray-900 text-xs whitespace-nowrap">
                {displayTextMin}
              </div>
            )}
          </div>
        )}

        {/* Max handle (or single handle) */}
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-grab active:cursor-grabbing rounded-full bg-white border-2 border-white/30 shadow-md hover:scale-110 transition-transform"
          style={{ left: `calc(${getPercentage(dualHandle ? maxValue : minValue)}% - 8px)` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(dualHandle ? 'max' : 'min');
          }}
        >
          {showTooltip && (isDragging === (dualHandle ? 'max' : 'min') || (!dualHandle && isDragging === 'min')) && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-white/90 text-gray-900 text-xs whitespace-nowrap">
              {dualHandle ? displayTextMax : displayTextSingle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

