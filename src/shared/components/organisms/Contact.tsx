import type { Dictionary } from '@/content/types';
import { Button } from '@/shared/components/atoms/Button';
import { Container } from '@/shared/components/atoms/Container';
import { Heading } from '@/shared/components/atoms/Heading';
import { Label } from '@/shared/components/atoms/Label';
import { Section } from '@/shared/components/atoms/Section';
import { CopyEmail } from '@/shared/components/molecules/CopyEmail';
import { site } from '@/shared/lib/site';

export function Contact({ t }: { t: Dictionary }) {
  const c = t.contact;
  return (
    <Section id="contact" className="bg-night text-night-foreground">
      <Container className="grid grid-cols-contact items-end gap-16 max-md:grid-cols-1 max-md:gap-11">
        <div className="min-w-0">
          <Label tone="night">{c.label}</Label>
          <Heading level={2} size="contact" className="mt-4.5">
            {c.title}
          </Heading>
          <p className="mt-5.5 max-w-xl text-lg text-night-muted">{c.sub}</p>
          <CopyEmail email={site.email} copy={c.copy} copied={c.copied} />
          <Button
            tone="accent"
            className="mt-7"
            href={site.calendar}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hero.ctaBook}
          </Button>
          <p className="mt-4.5 font-mono text-night-muted text-xs/normal">{c.note}</p>
        </div>
        <ul className="min-w-0">
          {site.socials.map((s) => (
            <li key={s.label} className="border-night-border border-t last:border-b">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer me"
                className="focus-ring-night group flex justify-between gap-4 py-3.75 text-night-foreground no-underline"
              >
                {s.label}{' '}
                <span className="wrap-anywhere font-mono text-night-muted text-xs/relaxed group-hover:text-night-accent">
                  {s.handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
