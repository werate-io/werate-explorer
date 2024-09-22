import React from 'react';
import { cn } from '@/lib/utils'; // Utility function to combine classNames

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: string;
  margin?: string;
  borderRadius?: string;
  backgroundColor?: string;
}

export const Box: React.FC<BoxProps> = ({
  padding = '0',
  margin = '0',
  borderRadius = 'none',
  backgroundColor = 'transparent',
  className,
  ...props
}) => {
  const classes = cn(
    `p-${padding}`,
    `m-${margin}`,
    `rounded-${borderRadius}`,
    `bg-${backgroundColor}`,
    className
  );

  return <div className={classes} {...props} />;
};
