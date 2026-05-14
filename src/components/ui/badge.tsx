import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        success: 'bg-[#38A169] text-white',
        warning: 'bg-[#ED8936] text-white',
        outline: 'border border-primary text-primary',
        muted: 'bg-muted text-muted-foreground',
      },
      size: {
        sm: 'text-xs px-2 py-0.5 rounded',
        default: 'text-xs px-3 py-1 rounded-md',
        lg: 'text-sm px-4 py-1.5 rounded-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';
