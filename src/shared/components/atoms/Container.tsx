import { cn } from '@/shared/lib/cn';

export const Container = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mx-auto w-full max-w-wrap px-8 max-sm:px-4', className)} {...props} />
);
