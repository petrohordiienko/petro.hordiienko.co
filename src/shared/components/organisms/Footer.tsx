import type { Dictionary } from '@/content/types';
import { Container } from '@/shared/components/atoms/Container';
import { SocialIcon } from '@/shared/components/atoms/SocialIcon';
import { site } from '@/shared/lib/site';

export function Footer({ t }: { t: Dictionary }) {
  const { legal } = site;
  return (
    <footer className="border-night-border border-t bg-night text-night-muted">
      <Container className="flex flex-wrap justify-between gap-x-6 gap-y-2 pt-7 pb-footer">
        <p className="font-mono text-xs/loose">
          {legal.name} · NIP {legal.nip} · REGON {legal.regon}
          <br />
          {legal.address} · {t.footer.ceidg}
        </p>
        <div className="flex flex-col items-end gap-3 max-sm:items-start">
          <ul className="flex items-center gap-4">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={s.label}
                  title={s.label}
                  className="focus-ring-night flex text-night-muted transition-colors hover:text-night-accent"
                >
                  <SocialIcon name={s.label} />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-right font-mono text-xs/loose max-sm:text-left">
            © {site.since}–{new Date().getFullYear()} {site.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
