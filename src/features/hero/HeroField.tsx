'use client';

import type { Dictionary } from '@/content/types';
import { Heading } from '@/shared/components/atoms/Heading';
import { ShaderField } from '@/shared/lib/shader-field';
import { useStage } from '@/shared/lib/use-stage';
import { HeroShell } from './HeroShell';

export function HeroField({ t }: { t: Dictionary }) {
  const { sectionRef, canvasRef, status } = useStage<ShaderField>({
    create: (canvas, reducedMotion) => new ShaderField(canvas, { calm: reducedMotion }),
  });

  return (
    <HeroShell
      t={t}
      sectionRef={sectionRef}
      status={status}
      background={
        <>
          <div
            aria-hidden="true"
            className="hero-grid pointer-events-none absolute inset-0 -z-10"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 block size-full cursor-crosshair"
            role="img"
            aria-label={t.hero.fieldLabel}
          />
        </>
      }
      title={
        <Heading level={1} size="hero" className="flex flex-col text-balance">
          <span>{t.hero.titleTop}</span>
          <span className="text-outline">{t.hero.titleBottom}</span>
        </Heading>
      }
      footer={
        <div className="flex items-center justify-end border-night-border border-t pt-4.5">
          <p className="pointer-coarse:hidden font-mono text-night-muted text-xs/snug tracking-wide max-md:hidden">
            {t.hero.fieldHint}
          </p>
        </div>
      }
    />
  );
}
