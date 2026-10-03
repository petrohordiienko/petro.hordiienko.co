export type PortfolioFilter =
  | 'web'
  | 'mobile'
  | 'backend'
  | 'ai'
  | 'fintech'
  | 'realtime'
  | 'webgl'
  | 'wasm';
export type PortfolioKind =
  | 'exchange'
  | 'data'
  | 'audio'
  | 'chat'
  | 'delivery'
  | 'crm'
  | 'mvp'
  | 'cloud'
  | 'webgl'
  | 'wasm';

export type Dictionary = {
  meta: { title: string; description: string; keywords: string[] };
  nav: {
    services: string;
    work: string;
    process: string;
    contact: string;
    language: string;
    menu: string;
    close: string;
  };
  theme: { label: string; light: string; dark: string };
  hero: {
    notes: string[];
    titleTop: string;
    titleBottom: string;
    lede: string;
    ctaBook: string;
    ctaServices: string;
    canvasLabel: string;
    fieldLabel: string;
    fieldHint: string;
    stackLabel: string;
    stack: string[];
  };
  manifesto: {
    label: string;
    text: string;
    textMuted: string;
    pillars: { title: string; body: string }[];
    facts: { k: string; v: string }[];
  };
  services: {
    label: string;
    title: string;
    titleMuted: string;
    sub: string;
    outcomeLabel: string;
    pointsLabel: string;
    stackLabel: string;
    relatedLabel: string;
    detailsLabel: string;
    closeLabel: string;
    items: {
      title: string;
      body: string;
      points: string[];
      tech: string[];
      outcome: string;
      related: PortfolioKind[];
    }[];
    cto: { strong: string; body: string; cta: string };
  };
  work: {
    label: string;
    title: string;
    titleMuted: string;
    sub: string;
    filterLabel: string;
    dialog: { close: string; workflow: string; prev: string; next: string; open: string };
    filters: Record<'all' | PortfolioFilter, string>;
    items: {
      kind: PortfolioKind;
      categories: PortfolioFilter[];
      title: string;
      summary: string;
      highlights: string[];
      workflow: { title: string; caption: string }[];
      platforms: string[];
      stack: string[];
      role: string;
      company: string;
      when: string;
    }[];
  };
  process: {
    label: string;
    title: string;
    titleMuted: string;
    steps: { title: string; body: string; time: string }[];
    modelLabel: string;
    models: { title: string; body: string }[];
  };
  contact: {
    label: string;
    title: string;
    sub: string;
    copy: string;
    copied: string;
    note: string;
  };
  footer: { ceidg: string };
};
