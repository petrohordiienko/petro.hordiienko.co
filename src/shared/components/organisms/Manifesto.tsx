import type { Dictionary } from '@/content/types';
import { Container } from '@/shared/components/atoms/Container';
import { Label } from '@/shared/components/atoms/Label';
import { Section } from '@/shared/components/atoms/Section';

export function Manifesto({ t }: { t: Dictionary }) {
  const m = t.manifesto;
  return (
    <Section className="border-border border-b" aria-labelledby="manifesto-label">
      <Container>
        <Label id="manifesto-label">{m.label}</Label>
        <p className="mt-8 max-w-5xl text-balance text-section">
          {m.text} <span className="text-foreground-muted">{m.textMuted}</span>
        </p>
        <ul className="mt-20 grid grid-cols-4 gap-8 max-sm:grid-cols-1 max-lg:grid-cols-2">
          {m.pillars.map((pillar, index) => (
            <li key={pillar.title} className="min-w-0 border-foreground border-t pt-4.5">
              <span className="font-mono text-foreground-muted text-xs tracking-wider">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-semibold text-xl tracking-tight">{pillar.title}</h3>
              <p className="mt-3 text-pretty text-foreground-muted text-sm/relaxed">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-20 grid grid-cols-4 gap-6 border-border border-t max-md:grid-cols-2">
          {m.facts.map((f) => (
            <div key={f.k} className="min-w-0 pt-4.5">
              <dt className="font-mono text-foreground-muted text-xs/snug uppercase tracking-wider">
                {f.k}
              </dt>
              <dd className="mt-2 font-semibold text-xl tracking-tight">{f.v}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
