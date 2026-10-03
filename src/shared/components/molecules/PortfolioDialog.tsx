'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/content/types';
import { ScaledDevice } from '@/shared/components/mocks/frames';
import { DEVICES, SCENES } from '@/shared/components/mocks/scenes';
import { cn } from '@/shared/lib/cn';

type Item = Dictionary['work']['items'][number];

export function PortfolioDialog({
  item,
  w,
  onClose,
}: {
  item: Item | null;
  w: Dictionary['work'];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (item && !dialog.open) {
      setStep(0);
      dialog.showModal();
    }
    if (!item && dialog.open) dialog.close();
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [item]);

  const last = (item?.workflow.length ?? 1) - 1;
  const device = item ? DEVICES[item.kind][step] : 'browser';

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onMouseDown={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={item?.title}
      className="m-auto max-h-dvh w-full max-w-6xl overflow-y-auto overscroll-contain rounded-3xl border-0 bg-surface p-0 text-foreground backdrop:bg-foreground/70 backdrop:backdrop-blur-sm max-md:max-h-dvh max-md:rounded-none"
    >
      {item ? (
        <div className="grid grid-cols-5 max-lg:grid-cols-1">
          <div className="col-span-2 flex min-w-0 flex-col gap-7 p-8 max-sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-foreground-muted text-xs uppercase tracking-wider">
                  {item.company} · {item.when}
                </p>
                <h3 className="mt-3 font-semibold text-3xl tracking-tight">{item.title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={w.dialog.close}
                className="focus-ring grid size-11 flex-none cursor-pointer place-items-center rounded-full bg-foreground text-surface"
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
            </div>
            <p className="text-foreground-muted text-sm/relaxed">{item.summary}</p>

            <div>
              <p className="mb-3 font-mono text-foreground-muted text-xs uppercase tracking-wider">
                {w.dialog.workflow}
              </p>
              <ol className="grid gap-2">
                {item.workflow.map((s, i) => (
                  <li key={s.title}>
                    <button
                      type="button"
                      aria-current={i === step ? 'step' : undefined}
                      onClick={() => setStep(i)}
                      className={cn(
                        'focus-ring grid w-full cursor-pointer grid-cols-sec-step gap-x-4 rounded-2xl border p-4 text-left transition-colors motion-reduce:transition-none',
                        i === step
                          ? 'border-foreground bg-surface-raised'
                          : 'border-border hover:border-foreground-muted',
                      )}
                    >
                      <span
                        className={cn(
                          'grid size-7 place-items-center rounded-full font-mono text-xs',
                          i === step ? 'bg-foreground text-surface' : 'bg-foreground/10',
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="font-semibold">{s.title}</span>
                      <span className="col-start-2 mt-1 text-foreground-muted text-sm/snug">
                        {s.caption}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <ul className="flex flex-wrap gap-2">
              {item.stack.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border px-3 py-1.5 font-mono text-foreground-muted text-xs leading-none"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <p className="mt-auto font-mono text-primary text-xs uppercase tracking-wider">
              {item.role}
            </p>
          </div>

          <div className="col-span-3 flex min-w-0 flex-col justify-center gap-5 bg-primary/10 p-8 max-sm:p-5">
            <div className={cn('mx-auto w-full', device === 'phone' && 'max-w-xs')}>
              <ScaledDevice device={device}>{SCENES[item.kind][step]}</ScaledDevice>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="min-w-0 text-foreground-muted text-sm">
                <span className="font-semibold text-foreground">{item.workflow[step].title}</span>
                {' · '}
                {item.workflow[step].caption}
              </p>
              <div className="flex flex-none gap-2">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                  aria-label={w.dialog.prev}
                  className="focus-ring grid size-11 cursor-pointer place-items-center rounded-full border border-foreground disabled:cursor-default disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="size-4 fill-none stroke-current"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 3 5 8l5 5" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={step === last}
                  onClick={() => setStep(step + 1)}
                  aria-label={w.dialog.next}
                  className="focus-ring grid size-11 cursor-pointer place-items-center rounded-full bg-foreground text-surface disabled:cursor-default disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="size-4 fill-none stroke-current"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 3 5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
