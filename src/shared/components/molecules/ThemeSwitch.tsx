'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '@/content/types';

const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

const STORAGE_KEY = 'theme';

function Icon({ theme }: { theme: Theme }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {theme === 'light' ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </>
      ) : (
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      )}
    </svg>
  );
}

export function ThemeSwitch({ t }: { t: Dictionary['theme'] }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const choose = (next: Theme) => {
    setTheme(next);
    if (next === 'dark') document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    try {
      if (next === 'dark') localStorage.setItem(STORAGE_KEY, next);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <fieldset className="flex flex-none rounded-full border border-night-border p-0.75">
      <legend className="sr-only">{t.label}</legend>
      {THEMES.map((name) => (
        <button
          key={name}
          type="button"
          aria-pressed={theme === name}
          aria-label={t[name]}
          title={t[name]}
          onClick={() => choose(name)}
          className="focus-ring-night inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-transparent text-night-muted transition-colors hover:text-night-foreground aria-pressed:bg-night-foreground aria-pressed:text-night"
        >
          <Icon theme={name} />
        </button>
      ))}
    </fieldset>
  );
}
