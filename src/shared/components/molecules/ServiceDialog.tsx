'use client';

import { useEffect, useRef } from 'react';
import type { Dictionary, PortfolioKind } from '@/content/types';
import { ServiceIcon } from '@/shared/components/atoms/ServiceIcon';
import { usePortfolio } from '@/shared/components/molecules/PortfolioProvider';
import { RelatedWork } from '@/shared/components/molecules/RelatedWork';

type Service = Dictionary['services']['items'][number];

export type ActiveService = {
  index: number;
  item: Service;
  projects: { kind: PortfolioKind; title: string }[];
};

export function ServiceDialog({
  active,
  s,
  onClose,
}: {
  active: ActiveService | null;
  s: Dictionary['services'];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { openKind } = usePortfolio();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [active]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onMouseDown={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={active?.item.title}
      className="m-auto max-h-dvh w-full max-w-4xl overflow-y-auto overscroll-contain rounded-4xl border-0 bg-surface p-0 text-foreground backdrop:bg-foreground/70 backdrop:backdrop-blur-sm max-md:max-h-dvh max-md:rounded-none"
    >
      {active ? (
        <div className="grid grid-cols-5 max-md:grid-cols-1">
          <div className="col-span-2 flex flex-col gap-6 bg-foreground p-9 text-surface max-sm:p-6">
            <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <ServiceIcon index={active.index} className="size-7" />
            </span>
            <div>
              <h3 className="font-semibold text-3xl tracking-tight">{active.item.title}</h3>
              <p className="mt-3 text-sm/relaxed text-surface/75">{active.item.body}</p>
            </div>
            <p className="mt-auto flex flex-col gap-2 border-surface/20 border-t pt-5 text-sm/snug">
              <span className="font-mono text-surface/50 text-xs uppercase tracking-wider">
                {s.outcomeLabel}
              </span>
              {active.item.outcome}
            </p>
          </div>

          <div className="col-span-3 flex flex-col gap-7 p-9 max-sm:p-6">
            <button
              type="button"
              onClick={onClose}
              aria-label={s.closeLabel}
              className="focus-ring -mb-2 grid size-11 cursor-pointer place-items-center self-end rounded-full bg-foreground text-surface"
            >
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="size-4 fill-none stroke-current"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M3 3l10 10M13 3 3 13" />
              </svg>
            </button>
            <div>
              <p className="mb-4 font-mono text-foreground-muted text-xs uppercase tracking-wider">
                {s.pointsLabel}
              </p>
              <ul className="grid gap-3 text-sm/snug">
                {active.item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="mt-0.5 size-4 flex-none fill-none stroke-primary"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 font-mono text-foreground-muted text-xs uppercase tracking-wider">
                {s.stackLabel}
              </p>
              <ul className="flex flex-wrap gap-2">
                {active.item.tech.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border px-3 py-1.5 font-mono text-foreground text-xs leading-none"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <RelatedWork
              label={s.relatedLabel}
              projects={active.projects}
              onSelect={(kind) => {
                onClose();
                requestAnimationFrame(() => openKind(kind));
              }}
            />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
