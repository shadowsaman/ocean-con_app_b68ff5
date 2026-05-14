import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-md',
        accent: 'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-lg',
        outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground',
        'outline-white': 'border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary',
        ghost: 'hover:bg-accent/10 hover:text-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success: 'bg-[#38A169] text-white hover:bg-[#2F855A] hover:-translate-y-0.5',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-6 py-2 rounded-[var(--radius)] text-sm',
        sm: 'h-9 px-4 rounded-md text-xs',
        lg: 'h-12 px-8 rounded-[var(--radius)] text-base',
        xl: 'h-14 px-10 rounded-[var(--radius)] text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';
