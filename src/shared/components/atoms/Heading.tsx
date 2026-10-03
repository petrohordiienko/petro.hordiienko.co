import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const headingVariants = cva('text-balance', {
  variants: {
    size: {
      hero: 'text-hero',
      section: 'text-section',
      contact: 'text-contact text-night-foreground',
      card: 'font-semibold text-lg/tight tracking-tight',
      small: 'font-semibold text-lg',
    },
  },
  defaultVariants: { size: 'section' },
});

type Level = 1 | 2 | 3 | 4;

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & { level: Level };

export const Heading = ({ level, size, className, ...props }: HeadingProps) => {
  const Tag = `h${level}` as const;
  return <Tag className={cn(headingVariants({ size }), className)} {...props} />;
};
