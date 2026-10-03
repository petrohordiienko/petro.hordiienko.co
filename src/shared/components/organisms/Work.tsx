import type { Dictionary } from '@/content/types';
import { Container } from '@/shared/components/atoms/Container';
import { Section } from '@/shared/components/atoms/Section';
import { PortfolioGrid } from '@/shared/components/molecules/PortfolioGrid';
import { SectionHead } from '@/shared/components/molecules/SectionHead';

export function Work({ t }: { t: Dictionary }) {
  const w = t.work;
  return (
    <Section id="work" className="border-border border-t">
      <Container>
        <SectionHead label={w.label} title={w.title} muted={w.titleMuted} sub={w.sub} />
        <PortfolioGrid w={w} />
      </Container>
    </Section>
  );
}
