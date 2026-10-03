import { cn } from '@/shared/lib/cn';

export const Section = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <section className={cn('py-30 max-sm:py-18', className)} {...props} />
);
