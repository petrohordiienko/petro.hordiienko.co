'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '@/content/types';
import { HeroAurora } from './HeroAurora';
import { HeroField } from './HeroField';
import { HeroSpotlight } from './HeroSpotlight';

const VARIANTS = ['aurora', 'flow', 'spotlight'] as const;
type Variant = (typeof VARIANTS)[number];

const isVariant = (v: string | null): v is Variant => VARIANTS.includes(v as Variant);

export function HeroSwitcher({ t }: { t: Dictionary }) {
  const [variant, setVariant] = useState<Variant>('aurora');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('hero');
    if (isVariant(requested)) {
      setVariant(requested);
    }
  }, []);

  return (
    <>
      {variant === 'aurora' ? <HeroAurora t={t} /> : null}
      {variant === 'flow' ? <HeroField t={t} /> : null}
      {variant === 'spotlight' ? <HeroSpotlight t={t} /> : null}
    </>
  );
}
