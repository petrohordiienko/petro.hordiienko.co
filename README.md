# hordiienko.co

Personal services website for **Petro Hordiienko** (JDG, Poznań). Next.js 15 App Router, React 19, TypeScript and Tailwind CSS v4. English and Polish, with a hand-written WebGL particle hero.

## Run it

```bash
bun install
bun run dev          # http://localhost:3000, redirects to /en or /pl
bun run build && bun run start
```

Or in Docker: `make MODE=dev dc-build-up-d` (dev with hot reload) or `make dc-build-up-d` (production image).

## Checks

```bash
bun run typecheck
bun run lint            # Biome: lint, format, import and class order
bun run check:comments  # comment policy from AGENTS.md
bun run build           # also validates the Tailwind CSS
```

## How it is organised

```
src/
  app/
    [lang]/layout.tsx           fonts, metadata, hreflang, JSON-LD, pre-paint theme script
    [lang]/page.tsx             the one-page site
    [lang]/opengraph-image.tsx  1200x630 share image per language
    globals.css                 Tailwind entry and the few custom utilities
    icon.svg, sitemap.ts, robots.ts
  styles/tokens.css             semantic colour, type and breakpoint tokens (light and dark)
  shared/
    components/atoms/           Button, Container, Heading, Label, Logo, Section
    components/molecules/       CopyEmail, SectionHead, ThemeSwitch
    components/organisms/       Header, Hero, Manifesto, Services, Work, Process, Contact, Footer
    lib/                        cn, i18n, site, particles, theme-script
  content/                      en.ts, pl.ts and types.ts: ALL copy
  middleware.ts                 "/" to /pl or /en (NEXT_LOCALE cookie first, then browser language)
```

- **Change text:** edit `src/content/en.ts` and `src/content/pl.ts`. TypeScript fails the build if they drift apart.
- **Change contacts or legal data:** edit `src/shared/lib/site.ts`. If the domain changes, update `site.url`.
- **Change colours, type or breakpoints:** edit `src/styles/tokens.css`. Components only use semantic tokens (`bg-surface`, `text-foreground`, `bg-primary`, `text-night-muted`).

## Theme

Light is the default. The header switch toggles `data-theme="dark"` on `<html>` and keeps the choice in `localStorage` under `theme`; a small script in the root layout applies it before first paint. The hero, contact section and footer are always dark.

## The particle hero

`src/shared/lib/particles.ts` is a dependency-free WebGL renderer. Particles spring towards one of three forms (knot, orbit, signal); the pointer pushes them away, a click scatters them, and scrolling disperses the field. It pauses when off screen, caps the pixel ratio at 2 and respects `prefers-reduced-motion`. Without WebGL the hero keeps its dark background and grid.

Tune the layout in `src/shared/components/organisms/Hero.tsx` (`setLayout`), the colours in `PALETTE`, or add a form with a new `sample...()` function.

## Deploy

The site needs a Node server because `src/middleware.ts` does the language redirect, so a static export does not work. Use Vercel or the Docker image (`Dockerfile`, targets `dev` and `prod`).

## Legal note

The footer shows the business name, NIP, REGON and registered address from CEIDG. The site sets no cookies except the language preference (`NEXT_LOCALE`) and runs no analytics. If you add analytics or a contact form, add a privacy policy and, where needed, a cookie consent banner.
