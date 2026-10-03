import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  'pointer-events-auto inline-flex items-center gap-2 rounded-full border px-5.5 py-3.5 font-medium text-base leading-none no-underline transition-all duration-200 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  {
    variants: {
      tone: {
        accent: 'focus-ring-night border-transparent bg-night-amber text-accent-foreground',
        line: 'focus-ring-night border-night-foreground/30 text-night-foreground hover:border-night-foreground',
        dark: 'focus-ring border-transparent bg-foreground text-surface hover:bg-foreground/85',
        ghost:
          'focus-ring border-border bg-surface-raised text-foreground hover:border-foreground-muted',
      },
    },
    defaultVariants: { tone: 'accent' },
  },
);

export type ButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>;

export const Button = ({ tone, className, children, ...props }: ButtonProps) => (
  <a className={cn(buttonVariants({ tone }), className)} {...props}>
    {children}
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-4 flex-none fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  </a>
);
