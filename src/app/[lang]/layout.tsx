import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getDictionary, isLocale, locales } from '@/shared/lib/i18n';
import { site } from '@/shared/lib/site';
import { buildStructuredData } from '@/shared/lib/structured-data';
import { themeScript } from '@/shared/lib/theme-script';
import '../globals.css';

const sans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: '#0b0d0f',
  viewportFit: 'cover',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    applicationName: site.name,
    category: 'technology',
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', pl: '/pl', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      url: `/${lang}`,
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: lang === 'pl' ? ['en_US'] : ['pl_PL'],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@petrohordiienko',
      title: t.meta.title,
      description: t.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    authors: [{ name: site.name, url: site.url }],
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const jsonLd = buildStructuredData(lang, getDictionary(lang));

  const jsonLdHtml = { __html: JSON.stringify(jsonLd) };

  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static constant with no user data; it must run before first paint to avoid a theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of static site constants, no user data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml} />
      </body>
    </html>
  );
}
