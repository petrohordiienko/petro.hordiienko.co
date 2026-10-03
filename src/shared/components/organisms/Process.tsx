import type { Dictionary } from '@/content/types';
import { Container } from '@/shared/components/atoms/Container';
import { Heading } from '@/shared/components/atoms/Heading';
import { Label } from '@/shared/components/atoms/Label';
import { Section } from '@/shared/components/atoms/Section';
import { SectionHead } from '@/shared/components/molecules/SectionHead';

export function Process({ t }: { t: Dictionary }) {
  const p = t.process;
  return (
    <Section id="process" className="bg-primary text-primary-foreground">
      <Container>
        <SectionHead label={p.label} title={p.title} muted={p.titleMuted} tone="band" />
        <ol className="grid grid-cols-4 gap-8 max-md:grid-cols-2 max-xs:grid-cols-1">
          {p.steps.map((step, index) => (
            <li
              key={step.title}
              className="flex min-w-0 flex-col border-primary-foreground/40 border-t pt-5"
            >
              <span className="font-mono text-primary-foreground/60 text-xs tracking-wider">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Heading level={3} size="card" className="mt-4 text-3xl">
                {step.title}
              </Heading>
              <p className="mt-3 text-primary-foreground/75 text-sm/relaxed">{step.body}</p>
              <p className="mt-8 font-mono text-xs uppercase tracking-wider">{step.time}</p>
            </li>
          ))}
        </ol>
        <div className="mt-20 grid grid-cols-3 gap-8 border-primary-foreground/40 border-t pt-8 max-md:grid-cols-1">
          {p.models.map((m) => (
            <div key={m.title} className="min-w-0">
              <Label className="mb-3 text-primary-foreground/60">{p.modelLabel}</Label>
              <Heading level={3} size="small" className="mb-2 text-2xl">
                {m.title}
              </Heading>
              <p className="text-primary-foreground/75 text-sm/relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
