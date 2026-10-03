'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Dictionary } from '@/content/types';
import { Button } from '@/shared/components/atoms/Button';
import { Container } from '@/shared/components/atoms/Container';
import { Logo } from '@/shared/components/atoms/Logo';
import { ThemeSwitch } from '@/shared/components/molecules/ThemeSwitch';
import { cn } from '@/shared/lib/cn';
import { type Locale, locales } from '@/shared/lib/i18n';
import { site } from '@/shared/lib/site';

const navLink =
  'focus-ring-night font-mono text-night-muted text-xs uppercase tracking-wider no-underline transition-colors hover:text-night-foreground';

export function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const close = () => setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', close);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', close);
    };
  }, [open]);

  const links = [
    { href: '#services', label: t.nav.services },
    { href: '#work', label: t.nav.work },
    { href: '#process', label: t.nav.process },
    { href: '#contact', label: t.nav.contact },
  ];

  const languages = (
    <fieldset className="flex flex-none rounded-full border border-night-border p-0.75">
      <legend className="sr-only">{t.nav.language}</legend>
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}`}
          hrefLang={l}
          aria-current={l === lang ? 'true' : undefined}
          className="focus-ring-night rounded-full px-2.5 py-1.75 font-medium font-mono text-night-muted text-xs leading-none tracking-wide no-underline aria-[current=true]:bg-night-foreground aria-[current=true]:text-night"
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </fieldset>
  );

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 pt-safe text-night-foreground transition-colors duration-300 motion-reduce:transition-none',
          scrolled || open
            ? 'border-night-border border-b bg-night/85 backdrop-blur-md'
            : 'border-transparent border-b',
        )}
      >
        <Container className="flex h-19 items-center gap-7">
          <a
            className="focus-ring-night flex items-center gap-3 font-semibold text-lg text-night-foreground tracking-tight no-underline max-xs:gap-0"
            href="#top"
            aria-label={site.name}
          >
            <Logo size={30} className="flex-none" />
            <span className="max-xs:sr-only">{site.name}</span>
          </a>
          <nav aria-label="Sections" className="ml-auto flex gap-6.5 max-md:hidden">
            {links.slice(0, 3).map((l) => (
              <a key={l.href} className={navLink} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 max-md:ml-auto">
            <ThemeSwitch t={t.theme} />
            <Button tone="line" href="#contact" className="px-4.5 py-2.5 text-sm max-md:hidden">
              {t.nav.contact}
            </Button>
            <div className="max-md:hidden">{languages}</div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((v) => !v)}
              className="focus-ring-night grid size-11 cursor-pointer place-items-center rounded-full bg-night-foreground text-night md:hidden"
            >
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="size-5 fill-none stroke-current"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                {open ? <path d="M4 4l12 12M16 4 4 16" /> : <path d="M3 7h14M3 13h14" />}
              </svg>
            </button>
          </div>
        </Container>
      </header>
      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-19 bottom-0 z-40 flex flex-col overflow-y-auto bg-night px-4 pt-6 pb-10 md:hidden"
        >
          <nav aria-label="Sections" className="flex flex-col">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="focus-ring-night flex items-baseline gap-4 border-night-border border-b py-5 font-semibold text-4xl text-night-foreground tracking-tight no-underline"
              >
                <span className="font-mono font-normal text-night-muted text-xs tracking-wider">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
            {languages}
            <Button tone="accent" href="#contact" onClick={() => setOpen(false)}>
              {t.hero.ctaBook}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
