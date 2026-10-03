'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Heading } from '@/shared/components/atoms/Heading';

function Letters({
  text,
  className,
  offset,
  register,
}: {
  text: string;
  className: string;
  offset: number;
  register: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <span aria-hidden="true" className="flex">
      {[...text].map((ch, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: letters are static and positional
          key={i}
          ref={register}
          style={{ '--i': offset + i } as React.CSSProperties}
          className={`${className} rise-delay animate-rise motion-reduce:animate-none`}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

export function useKinetic(autoplay = false) {
  const letters = useRef<HTMLSpanElement[]>([]);
  const frame = useRef(0);

  const register = (el: HTMLSpanElement | null) => {
    if (el && !letters.current.includes(el)) letters.current.push(el);
  };

  const apply = useCallback((x: number | null, y: number | null) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const el of letters.current) {
        if (x === null || y === null) {
          el.style.setProperty('--p', '0');
          continue;
        }
        const r = el.getBoundingClientRect();
        const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        el.style.setProperty('--p', String(Math.max(0, 1 - d / 240) ** 2));
      }
    });
  }, []);

  useEffect(() => {
    if (!autoplay || !window.matchMedia('(hover: none)').matches) return;
    let raf = 0;
    const loop = (now: number) => {
      const rects = letters.current.map((el) => el.getBoundingClientRect());
      if (rects.length > 0) {
        const left = Math.min(...rects.map((r) => r.left));
        const right = Math.max(...rects.map((r) => r.right));
        const top = Math.min(...rects.map((r) => r.top));
        const bottom = Math.max(...rects.map((r) => r.bottom));
        const k = 0.5 + 0.5 * Math.sin(now / 1100);
        apply(left + (right - left) * k, (top + bottom) / 2 + Math.sin(now / 1700) * 30);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, apply]);

  return { register, apply };
}

export function KineticTitle({
  top,
  bottom,
  register,
}: {
  top: string;
  bottom: string;
  register: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <Heading level={1} size="hero" className="flex flex-col">
      <span className="sr-only">
        {top} {bottom}
      </span>
      <Letters text={top} className="kinetic-solid" offset={0} register={register} />
      <Letters text={bottom} className="kinetic-outline" offset={top.length} register={register} />
    </Heading>
  );
}
