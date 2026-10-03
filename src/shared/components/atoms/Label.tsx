import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const labelVariants = cva('font-medium font-mono text-xs uppercase tracking-widest', {
  variants: {
    tone: {
      default: 'text-foreground-muted',
      night: 'text-night-muted',
    },
  },
  defaultVariants: { tone: 'default' },
});

export type LabelProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof labelVariants>;

export const Label = ({ tone, className, children, ...props }: LabelProps) => (
  <p className={cn(labelVariants({ tone }), className)} {...props}>
    <span aria-hidden="true">[ </span>
    {children}
    <span aria-hidden="true"> ]</span>
  </p>
);
