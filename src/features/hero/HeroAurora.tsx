'use client';

import type { Dictionary } from '@/content/types';
import { AuroraField } from '@/shared/lib/aurora-field';
import { useStage } from '@/shared/lib/use-stage';
import { HeroShell } from './HeroShell';
import { KineticTitle, useKinetic } from './KineticTitle';
import { StackMarquee } from './StackMarquee';

export function HeroAurora({ t }: { t: Dictionary }) {
  const { sectionRef, canvasRef, status } = useStage<AuroraField>({
    create: (canvas, reducedMotion) => new AuroraField(canvas, { calm: reducedMotion }),
  });
  const { register, apply } = useKinetic(true);

  return (
    <HeroShell
      t={t}
      sectionRef={sectionRef}
      status={status}
      onPointerMove={(e) => apply(e.clientX, e.clientY)}
      onPointerLeave={() => apply(null, null)}
      background={
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 block size-full"
          role="img"
          aria-label={t.hero.canvasLabel}
        />
      }
      title={
        <KineticTitle top={t.hero.titleTop} bottom={t.hero.titleBottom} register={register} />
      }
      footer={<StackMarquee label={t.hero.stackLabel} items={t.hero.stack} />}
    />
  );
}
