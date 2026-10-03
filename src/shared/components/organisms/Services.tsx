import type { Dictionary } from '@/content/types';
import { Button } from '@/shared/components/atoms/Button';
import { Container } from '@/shared/components/atoms/Container';
import { Section } from '@/shared/components/atoms/Section';
import { SectionHead } from '@/shared/components/molecules/SectionHead';
import { ServicesBento } from '@/shared/components/molecules/ServicesBento';

export function Services({ t }: { t: Dictionary }) {
  const s = t.services;
  const entries = s.items.map((item, index) => ({
    index,
    item,
    projects: item.related.flatMap((kind) => {
      const project = t.work.items.find((w) => w.kind === kind);
      return project ? [{ kind, title: project.title }] : [];
    }),
  }));

  return (
    <Section id="services">
      <Container>
        <SectionHead label={s.label} title={s.title} muted={s.titleMuted} sub={s.sub} />
        <ServicesBento s={s} entries={entries} />
        <div className="mt-20 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-4xl border border-foreground/25 p-9 max-sm:mt-12 max-sm:p-6">
          <p className="max-w-3xl text-2xl tracking-tight max-sm:text-xl">
            <strong className="font-semibold">{s.cto.strong}</strong>
            <span className="text-foreground-muted">{s.cto.body}</span>
          </p>
          <Button tone="dark" href="#contact">
            {s.cto.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
