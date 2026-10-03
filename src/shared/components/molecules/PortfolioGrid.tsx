'use client';

import { useState } from 'react';
import type { Dictionary, PortfolioFilter } from '@/content/types';
import { ScaledDevice } from '@/shared/components/mocks/frames';
import { DEVICES, SCENES } from '@/shared/components/mocks/scenes';
import { usePortfolio } from '@/shared/components/molecules/PortfolioProvider';
import { cn } from '@/shared/lib/cn';

type Filter = 'all' | PortfolioFilter;
type Item = Dictionary['work']['items'][number];
const ORDER: Filter[] = [
  'all',
  'web',
  'mobile',
  'backend',
  'ai',
  'fintech',
  'realtime',
  'webgl',
  'wasm',
];
const TINT = ['bg-primary/15', 'bg-accent/30', 'bg-foreground/8', 'bg-primary/25'];

function Media({ item, tint }: { item: Item; tint: string }) {
  const devices = DEVICES[item.kind];
  const phone = devices[0] === 'phone';
  return (
    <div className={cn('relative h-96 overflow-hidden rounded-3xl max-sm:h-80', tint)}>
      <div
        className={cn(
          'absolute transition-transform duration-500 ease-out group-hover:-translate-y-2 motion-reduce:transition-none',
          phone ? 'top-9 left-8 w-1/3' : 'top-9 left-7 w-3/4',
        )}
      >
        <ScaledDevice device={devices[0]}>{SCENES[item.kind][0]}</ScaledDevice>
      </div>
      <div
        className={cn(
          'absolute transition-transform duration-500 ease-out group-hover:translate-y-2 motion-reduce:transition-none',
          phone ? 'top-24 right-8 w-1/3' : 'top-28 right-7 w-3/5',
        )}
      >
        <ScaledDevice device={devices[1] ?? devices[0]}>{SCENES[item.kind][1]}</ScaledDevice>
      </div>
    </div>
  );
}

export function PortfolioGrid({ w }: { w: Dictionary['work'] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const { open } = usePortfolio();
  const items = w.items.filter((item) => filter === 'all' || item.categories.includes(filter));

  return (
    <div>
      <fieldset className="mb-10 flex flex-wrap items-center gap-2">
        <legend className="sr-only">{w.filterLabel}</legend>
        {ORDER.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              'focus-ring cursor-pointer rounded-full border px-4 py-2.5 font-medium text-sm leading-none transition-colors motion-reduce:transition-none',
              filter === key
                ? 'border-foreground bg-foreground text-surface'
                : 'border-foreground/30 text-foreground hover:border-foreground',
            )}
          >
            {w.filters[key]}
          </button>
        ))}
      </fieldset>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-14 max-md:grid-cols-1">
        {items.map((item, index) => (
          <li key={item.title} className="min-w-0">
            <button
              type="button"
              onClick={() => open(item)}
              aria-label={`${w.dialog.open}: ${item.title}`}
              className="focus-ring group block w-full cursor-pointer text-left"
            >
              <div className="relative">
                <Media item={item} tint={TINT[index % TINT.length]} />
                <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  {item.categories.map((c) => (
                    <li
                      key={c}
                      className="rounded-full bg-surface-raised px-3.5 py-2 font-medium text-foreground text-xs leading-none shadow-sm"
                    >
                      {w.filters[c]}
                    </li>
                  ))}
                </ul>
                <span
                  aria-hidden="true"
                  className="absolute right-5 bottom-5 grid size-12 place-items-center rounded-full bg-foreground text-surface transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
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
              <p className="mt-5 text-2xl tracking-tight">
                <strong className="font-semibold">{item.title}</strong>{' '}
                <span className="text-foreground-muted">
                  {item.company} · {item.when}
                </span>
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
