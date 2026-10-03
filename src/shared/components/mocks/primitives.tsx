// biome-ignore-all lint/suspicious/noArrayIndexKey: decorative mock UI built from static positional elements
import { cn } from '@/shared/lib/cn';

export const Line = ({ w = 'w-full', className }: { w?: string; className?: string }) => (
  <span className={cn('block h-1.5 rounded-full bg-foreground/12', w, className)} />
);

export const Num = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={cn('font-mono text-foreground text-xs tabular-nums', className)}>
    {children}
  </span>
);

export function Spark({
  data,
  className,
  fill = true,
}: {
  data: number[];
  className?: string;
  fill?: boolean;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * 100,
    28 - ((v - min) / (max - min || 1)) * 24 - 2,
  ]);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className={cn('block size-full', className)}
      aria-hidden="true"
    >
      {fill ? <polygon points={`0,30 ${line} 100,30`} className="fill-primary/15" /> : null}
      <polyline
        points={line}
        fill="none"
        className="stroke-primary"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Ring({
  value,
  className,
  children,
}: {
  value: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn('relative flex size-24 items-center justify-center rounded-full', className)}
      style={{
        background: `conic-gradient(var(--color-primary) ${value * 3.6}deg, color-mix(in oklab, var(--color-foreground) 10%, transparent) 0)`,
      }}
    >
      <span className="absolute inset-2.5 rounded-full bg-surface-raised" />
      <span className="relative font-semibold text-foreground text-xl">{children}</span>
    </span>
  );
}

export const Bars = ({
  data,
  className,
  accent,
}: {
  data: number[];
  className?: string;
  accent?: number;
}) => (
  <div className={cn('flex h-full items-end gap-1.5', className)}>
    {data.map((v, i) => (
      <span
        key={i}
        style={{ height: `${v}%` }}
        className={cn('flex-1 rounded-t-sm', i === accent ? 'bg-accent' : 'bg-primary/80')}
      />
    ))}
  </div>
);

export const Avatar = ({ className }: { className?: string }) => (
  <span className={cn('block size-6 flex-none rounded-full bg-primary/25', className)} />
);

export const Btn = ({
  tone = 'primary',
  className,
  children,
}: {
  tone?: 'primary' | 'accent' | 'line';
  className?: string;
  children?: React.ReactNode;
}) => (
  <span
    className={cn(
      'inline-flex h-6 items-center justify-center rounded-md px-3 font-mono text-xs',
      tone === 'primary' && 'bg-primary text-primary-foreground',
      tone === 'accent' && 'bg-accent text-accent-foreground',
      tone === 'line' && 'border border-border text-foreground-muted',
      className,
    )}
  >
    {children}
  </span>
);
