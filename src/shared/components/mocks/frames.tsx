'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';

export type Device = 'browser' | 'phone';

export function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mock-browser flex flex-col overflow-hidden rounded-xl border border-border bg-surface-raised shadow-xl">
      <div className="flex h-7 flex-none items-center gap-1.5 border-border border-b bg-surface px-3">
        <span className="size-2 rounded-full bg-foreground/20" />
        <span className="size-2 rounded-full bg-foreground/20" />
        <span className="size-2 rounded-full bg-foreground/20" />
        <span className="mx-auto h-3.5 w-1/3 rounded-full bg-foreground/8" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mock-phone relative overflow-hidden rounded-4xl border-4 border-foreground bg-surface-raised shadow-xl">
      <span className="absolute top-1.5 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground" />
      <div className="relative h-full overflow-hidden pt-7">{children}</div>
    </div>
  );
}

const SIZE: Record<Device, { w: number; h: number }> = {
  browser: { w: 640, h: 400 },
  phone: { w: 220, h: 440 },
};

export function ScaledDevice({
  device,
  children,
  className,
}: {
  device: Device;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const { w, h } = SIZE[device];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={ref} className={cn('relative w-full', className)} style={{ height: h * scale }}>
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: w, height: h }}
      >
        {device === 'browser' ? (
          <BrowserFrame>{children}</BrowserFrame>
        ) : (
          <PhoneFrame>{children}</PhoneFrame>
        )}
      </div>
    </div>
  );
}
