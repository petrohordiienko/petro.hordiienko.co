# AGENTS.md

Company website for Petro Hordiienko (JDG, Poznań). Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4. Bilingual (en/pl). Layout follows the Next.js app template (`src/`, Atomic Design). Runtime dependencies: next, react, react-dom, clsx, class-variance-authority, tailwind-merge. See `README.md` for the full layout.

## Commands

```bash
bun run dev         # http://localhost:3000
bun run build
bun run typecheck   # tsc --noEmit
bun run lint         # biome check (lint, format, import and class order)
bun run lint:fix
bun run check:comments   # comment policy (see Code comments)
bun run format       # biome format --write
bun run format:check
docker compose up --build                  # prod image
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build   # dev image with hot reload
```

Makefile wrappers around compose (`MODE=dev` adds `docker-compose.dev.yml` on top of `docker-compose.yml`; `APPS` limits the services):

```bash
make dc-build            # build image(s)
make dc-up-d             # run detached
make dc-build-up-d       # build, then run detached
make dc-down             # stop services
make dc-down-v           # stop services and remove volumes
make MODE=dev dc-build-up-d
```

There is no test suite. Run `typecheck`, `format:check` and `build` before finishing a change.

## Conventions

- **All copy lives in `src/content/en.ts` and `src/content/pl.ts`**, typed by `src/content/types.ts`. Always change both files together; the build fails if they drift. Never hardcode user-facing text in components.
- **Contacts and legal data** (email, booking link, socials, NIP, REGON, address) live in `src/shared/lib/site.ts`. If the production domain changes, update `site.url` there.
- **Formatting** is Biome (`biome.json`, formatter only, 2-space indent). Run `bun run format` before finishing a change.
- **Styling** is Tailwind CSS v4 only: utility classes in components, semantic tokens in `src/styles/tokens.css` (light values in `@theme`, dark overrides under `[data-theme="dark"]`), `cva` variants joined with `cn()` from `src/shared/lib/cn.ts`. No raw palette classes, no hex colours in components, no arbitrary values (add a named utility in `src/app/globals.css` instead), no per-component CSS, no `@apply`. Pages place, components style. Light is the default theme; the header switch stores `theme=dark` in `localStorage` and a script in the root layout applies it before first paint.
- **Routing:** pages live under `src/app/[lang]/`. `src/middleware.ts` redirects `/` to `/en` or `/pl` (cookie `NEXT_LOCALE` first, then browser language). Locale handling is in `src/shared/lib/i18n.ts`.
- **Structure:** `src/shared/components/{atoms,molecules,organisms}` for UI, `src/shared/lib` for helpers (`cn`, `i18n`, `site`, `particles`, `theme-script`), `src/features/` for feature code when it appears.
- **Keep dependencies minimal.** Ask before adding any package.
- **No cookies besides `NEXT_LOCALE`, and no analytics.** Adding either has legal implications (privacy policy, consent banner in Poland/EU); flag it to the user first.

## Code comments

Zero by default, for every engineer and every language. Decision and rationale: ADR 0011 (code comment policy; not included in this repo).

**Applies to** all source code, tests, SQL and migrations, scripts, Makefiles, Dockerfiles, CI workflows, IaC, and code embedded in strings. It covers every comment syntax, docstrings included. Markdown docs are out of scope.

**Before writing any comment:**

1. Can a better name, a smaller function, a type, or an assertion say it? Do that instead.
2. Is it one of the three tags below, and does it pass that tag's test? If not, don't write it.
3. Is it about the past or the future? It belongs in the commit message or a ticket.
4. Is it about design? It belongs in the package `AGENTS.md` or an ADR.

**Allowed: three tags.** Each tagged comment is at most 3 lines, says _why_ and never _what_, and does not point to other files.

| Tag           | Use for                                                                                                 | Test                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `WORKAROUND:` | Behavior of an external library, runtime, OS, driver, API, or platform that the code has to work around | Would a competent reader "fix" the code back into the broken version?   |
| `SECURITY:`   | A "never do X" that prevents a vulnerability, a data leak, or data loss                                 | Would the obvious refactor open a hole?                                 |
| `INVARIANT:`  | An assumption guaranteed somewhere else that no type, assertion, or test can express                    | If a type, an assertion, or a test could express it, write that instead |

**Allowed without a tag:**

- Tool directives: pragmas, build tags, shebangs, markers a tool parses, and linter or type-checker suppressions that give a reason.
- Docstrings or annotations that a tool turns into a published or runtime artifact (OpenAPI, CLI `--help`, reference docs for a library published outside this repo).
- License headers.
- Sample-config files (`.env.example`): the only place config is documented. Code does not repeat it.

## Docker

- `Dockerfile` targets: `dev` and `prod`, both Bun-based (`oven/bun:1.4-slim`), non-root user `app`, port 3000.
- Production runs `next start` from the builder's `.next` output with production-only `node_modules`.
- Files needed at runtime in `prod` are copied explicitly (`package.json`, `next.config.mjs`, `tsconfig.json`, `public`, `.next`). If you add a runtime file or directory, add a matching `COPY` line.
- No lockfile is committed yet, so installs are not frozen. Bun is the package manager everywhere; commit `bun.lock` after the first `bun install`.
- `middleware.ts` requires a Node server, so a static export does not work (see the README for the static-hosting caveat).
