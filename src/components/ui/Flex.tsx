import React from 'react';
import { cn } from '@/lib/utils'; // Utility function to combine classNames

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  align?: 'center' | 'start' | 'end' | 'baseline' | 'stretch';
  justify?: 'center' | 'start' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'column';
  wrap?: 'wrap' | 'nowrap';
}

export const Flex: React.FC<FlexProps> = ({
  gap = '0',
  align = 'stretch',
  justify = 'start',
  direction = 'row',
  wrap = 'nowrap',
  className,
  ...props
}) => {
  const classes = cn(
    `flex`,
    `gap-${gap}`,
    `items-${align}`,
    `justify-${justify}`,
    `flex-${direction}`,
    `flex-${wrap}`,
    className
  );

  return <div className={classes} {...props} />;
};
