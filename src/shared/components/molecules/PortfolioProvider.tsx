'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Dictionary, PortfolioKind } from '@/content/types';
import { PortfolioDialog } from '@/shared/components/molecules/PortfolioDialog';

type Item = Dictionary['work']['items'][number];

const PortfolioContext = createContext<{
  open: (item: Item) => void;
  openKind: (kind: PortfolioKind) => void;
} | null>(null);

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
}

export function PortfolioProvider({
  w,
  children,
}: {
  w: Dictionary['work'];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<Item | null>(null);
  const open = useCallback((item: Item) => setActive(item), []);
  const openKind = useCallback(
    (kind: PortfolioKind) => setActive(w.items.find((i) => i.kind === kind) ?? null),
    [w.items],
  );
  const value = useMemo(() => ({ open, openKind }), [open, openKind]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
      <PortfolioDialog item={active} w={w} onClose={() => setActive(null)} />
    </PortfolioContext.Provider>
  );
}
