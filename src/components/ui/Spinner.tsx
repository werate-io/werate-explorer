import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define spinner variants using CVA
const spinnerVariants = cva(
  'animate-spin rounded-full border-t-transparent', // common styles
  {
    variants: {
      size: {
        small: 'h-4 w-4 border-2',
        medium: 'h-8 w-8 border-4',
        large: 'h-12 w-12 border-4',
        responsive: 'h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 border-4' // responsive size
      },
      color: {
        default: 'border-purple-700',
        primary: 'border-primary',
        secondary: 'border-secondary',
        accent: 'border-accent'
      }
    },
    defaultVariants: {
      size: 'responsive', // Default to responsive size
      color: 'default'
    }
  }
);

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  borderColor?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, borderColor = 'rgba(239, 229, 255, 0.5)', ...props }, ref) => {
    return (
      <div className={cn('flex justify-center items-center', className)} ref={ref} {...props}>
        <div
          className={cn(spinnerVariants({ size, color }))}
          style={{ borderTopColor: borderColor }}></div>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
