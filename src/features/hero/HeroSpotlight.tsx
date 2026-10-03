'use client';

import { useRef } from 'react';
import type { Dictionary } from '@/content/types';
import { Heading } from '@/shared/components/atoms/Heading';
import { Magnetic } from '@/shared/components/atoms/Magnetic';
import { HeroShell } from './HeroShell';

export function HeroSpotlight({ t }: { t: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const track = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${clientX - r.left}px`);
      el.style.setProperty('--my', `${clientY - r.top}px`);
    });
  };

  return (
    <HeroShell
      t={t}
      sectionRef={ref}
      onPointerMove={track}
      cta={(button) => <Magnetic>{button}</Magnetic>}
      background={
        <>
          <div
            aria-hidden="true"
            className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-60"
          />
          <div
            aria-hidden="true"
            className="spot-grid pointer-events-none absolute inset-0 -z-10"
          />
          <div
            aria-hidden="true"
            className="spot-glow pointer-events-none absolute inset-0 -z-10"
          />
        </>
      }
      title={
        <Heading level={1} size="hero" className="flex flex-col text-balance">
          <span className="animate-rise motion-reduce:animate-none">{t.hero.titleTop}</span>
          <span
            style={{ '--i': 4 } as React.CSSProperties}
            className="rise-delay animate-rise text-outline motion-reduce:animate-none"
          >
            {t.hero.titleBottom}
          </span>
        </Heading>
      }
    />
  );
}
