import React from 'react';
import { cn } from '@/lib/utils'; // Utility function to combine classNames

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'bold';
  color?: 'black' | 'gray' | 'white' | 'red';
}

export const Text: React.FC<TextProps> = ({
  size = 'md',
  weight = 'normal',
  color = 'black',
  className,
  ...props
}) => {
  const classes = cn(
    `text-${size}`,
    `font-${weight}`,
    `text-${color}`,
    className
  );

  return <p className={classes} {...props} />;
};
