'use client';

import { useState } from 'react';
import type { Dictionary, PortfolioKind } from '@/content/types';
import { ServiceIcon } from '@/shared/components/atoms/ServiceIcon';
import { ScaledDevice } from '@/shared/components/mocks/frames';
import { DEVICES, SCENES } from '@/shared/components/mocks/scenes';
import { type ActiveService, ServiceDialog } from '@/shared/components/molecules/ServiceDialog';
import { cn } from '@/shared/lib/cn';

type Service = Dictionary['services']['items'][number];
type Entry = { index: number; item: Service; projects: { kind: PortfolioKind; title: string }[] };

const LAYOUT: Record<number, { span: string; visual?: PortfolioKind; step?: number }> = {
  0: { span: 'col-span-2 row-span-2 max-lg:col-span-2', visual: 'crm', step: 0 },
  1: { span: '' },
  2: { span: '' },
  3: { span: 'col-span-2 max-lg:col-span-1' },
  5: { span: '' },
  6: { span: '' },
  4: { span: 'col-span-2 row-span-2 max-lg:col-span-2', visual: 'data', step: 1 },
  7: { span: 'col-span-2 max-lg:col-span-1' },
};

const ORDER = [0, 1, 2, 3, 5, 6, 4, 7];

export function ServicesBento({ s, entries }: { s: Dictionary['services']; entries: Entry[] }) {
  const [active, setActive] = useState<ActiveService | null>(null);
  const ordered = ORDER.flatMap((i) => entries.filter((e) => e.index === i));

  return (
    <>
      <ul className="grid grid-flow-dense auto-rows-bento grid-cols-4 gap-4 max-sm:grid-cols-1 max-lg:grid-cols-2">
        {ordered.map((entry) => {
          const { item, index } = entry;
          const layout = LAYOUT[index] ?? { span: '' };
          const big = Boolean(layout.visual);
          return (
            <li
              key={item.title}
              className={cn('min-w-0', layout.span, 'max-sm:col-span-1 max-sm:row-span-1')}
            >
              <button
                type="button"
                onClick={() => setActive(entry)}
                aria-label={`${s.detailsLabel}: ${item.title}`}
                className={cn(
                  'focus-ring group relative flex size-full cursor-pointer flex-col overflow-hidden rounded-4xl border p-7 text-left transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-sm:p-6',
                  big
                    ? 'border-foreground bg-foreground text-surface'
                    : 'border-border bg-surface-raised text-foreground hover:border-foreground',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      'grid size-12 flex-none place-items-center rounded-2xl',
                      big
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-foreground text-surface transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground',
                    )}
                  >
                    <ServiceIcon index={index} className="size-6" />
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-10 place-items-center rounded-full border transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none',
                      big ? 'border-surface/30' : 'border-foreground/25',
                    )}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="size-4 fill-none stroke-current"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12 12 4M5 4h7v7" />
                    </svg>
                  </span>
                </div>

                <h3 className="mt-6 font-semibold text-2xl tracking-tight">{item.title}</h3>
                <p
                  className={cn(
                    'mt-2 max-w-sm text-sm/relaxed',
                    big ? 'text-surface/70' : 'text-foreground-muted',
                  )}
                >
                  {item.body}
                </p>

                {big && layout.visual ? (
                  <div className="relative mt-6 min-h-40 flex-1 overflow-hidden max-sm:hidden">
                    <div className="absolute inset-x-0 top-0 w-full translate-y-0 transition-transform duration-500 group-hover:-translate-y-2 motion-reduce:transition-none">
                      <ScaledDevice device={DEVICES[layout.visual][layout.step ?? 0]}>
                        {SCENES[layout.visual][layout.step ?? 0]}
                      </ScaledDevice>
                    </div>
                  </div>
                ) : null}
                <ul className={cn('mt-auto flex flex-wrap gap-1.5 pt-5', big && 'sm:hidden')}>
                  {item.tech.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className={cn(
                        'rounded-full border px-2.5 py-1 font-mono text-xs leading-none',
                        big
                          ? 'border-surface/30 text-surface/70'
                          : 'border-border text-foreground-muted',
                      )}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </button>
            </li>
          );
        })}
      </ul>
      <ServiceDialog active={active} s={s} onClose={() => setActive(null)} />
    </>
  );
}
