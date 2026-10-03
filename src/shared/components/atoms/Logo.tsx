import { cn } from '@/shared/lib/cn';

export function Logo({
  size = 32,
  tone = 'dark',
  className,
}: {
  size?: number;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <g
        fill="none"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(tone === 'dark' ? 'stroke-night-accent' : 'stroke-primary')}
      >
        <path d="M13 54V10M13 32H51M51 54V10" />
      </g>
      <path
        d="M13 10H29a11 11 0 0 1 0 22"
        fill="none"
        strokeWidth="5.4"
        strokeLinecap="round"
        className="stroke-night-amber"
      />
    </svg>
  );
}
