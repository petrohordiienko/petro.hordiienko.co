'use client';

import type { PortfolioKind } from '@/content/types';
import { usePortfolio } from '@/shared/components/molecules/PortfolioProvider';
import { cn } from '@/shared/lib/cn';

export function RelatedWork({
  label,
  projects,
  tone = 'light',
  onSelect,
}: {
  label: string;
  projects: { kind: PortfolioKind; title: string }[];
  tone?: 'light' | 'dark';
  onSelect?: (kind: PortfolioKind) => void;
}) {
  const { openKind } = usePortfolio();
  if (projects.length === 0) return null;
  const dark = tone === 'dark';

  return (
    <div>
      <p
        className={cn(
          'mb-3 font-mono text-xs uppercase tracking-wider',
          dark ? 'text-surface/50' : 'text-foreground-muted',
        )}
      >
        {label}
      </p>
      <ul className="flex flex-wrap gap-2">
        {projects.map((p) => (
          <li key={p.kind}>
            <button
              type="button"
              onClick={() => (onSelect ?? openKind)(p.kind)}
              className={cn(
                'focus-ring-night flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-left text-xs leading-none transition-colors motion-reduce:transition-none',
                dark
                  ? 'border-surface/30 text-surface hover:border-surface hover:bg-surface hover:text-foreground'
                  : 'border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground hover:text-surface',
              )}
            >
              {p.title}
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="size-3.5 flex-none fill-none stroke-current"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12 12 4M5 4h7v7" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
