import type { ReactNode, RefObject } from 'react';
import type { Dictionary } from '@/content/types';
import { Button } from '@/shared/components/atoms/Button';
import { Container } from '@/shared/components/atoms/Container';
import { Heading } from '@/shared/components/atoms/Heading';
import { cn } from '@/shared/lib/cn';

type Props = {
  t: Dictionary;
  sectionRef?: RefObject<HTMLElement | null>;
  background?: ReactNode;
  title?: ReactNode;
  cta?: (button: ReactNode, index: number) => ReactNode;
  footer?: ReactNode;
  status?: string;
  className?: string;
  onPointerMove?: React.PointerEventHandler<HTMLElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLElement>;
};

export function HeroShell({
  t,
  sectionRef,
  background,
  title,
  cta = (button) => button,
  footer,
  status,
  className,
  onPointerMove,
  onPointerLeave,
}: Props) {
  return (
    <section
      className={cn(
        'relative isolate flex min-h-hero overflow-hidden bg-night text-night-foreground max-md:min-h-hero-sm',
        className,
      )}
      ref={sectionRef}
      data-stage={status}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {background}

      <Container className="pointer-events-none relative z-10 grid grid-cols-1 grid-rows-hero gap-8 pt-28 pb-10 max-md:pt-25 max-md:pb-7">
        <ul className="flex flex-wrap gap-x-7 gap-y-1.5 font-mono text-night-muted text-xs/normal uppercase tracking-wider">
          {t.hero.notes.map((note, index) => (
            <li key={note} className="flex items-center gap-2.5">
              {index === 0 ? (
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-night-accent ring-4 ring-night-accent/20"
                />
              ) : null}
              {note}
            </li>
          ))}
        </ul>

        <div className="self-end">
          {title ?? (
            <Heading level={1} size="hero" className="flex flex-col text-balance">
              <span>{t.hero.titleTop}</span>
              <span className="text-outline">{t.hero.titleBottom}</span>
            </Heading>
          )}
          <p className="mt-7 max-w-xl text-lg/relaxed text-night-muted">{t.hero.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {cta(
              <Button key="book" tone="accent" href="#contact">
                {t.hero.ctaBook}
              </Button>,
              0,
            )}
            {cta(
              <Button key="services" tone="line" href="#services">
                {t.hero.ctaServices}
              </Button>,
              1,
            )}
          </div>
        </div>

        {footer ?? <div />}
      </Container>
      <span className="sr-only">{t.meta.title}</span>
    </section>
  );
}
