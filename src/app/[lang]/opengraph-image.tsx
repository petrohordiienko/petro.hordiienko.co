import { ImageResponse } from 'next/og';
import { getDictionary, isLocale, locales } from '@/shared/lib/i18n';

export const alt = 'Petro Hordiienko';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : 'en');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#16191d',
        color: '#eeece6',
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="72" height="72" viewBox="0 0 64 64" aria-hidden="true">
          <g
            fill="none"
            stroke="#4fb39c"
            strokeWidth="5.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 54V10M13 32H51M51 54V10" />
          </g>
          <path
            d="M13 10H29a11 11 0 0 1 0 22"
            fill="none"
            stroke="#f0b65a"
            strokeWidth="5.4"
            strokeLinecap="round"
          />
        </svg>
        <span style={{ fontSize: 30, color: '#a3a7ad' }}>hordiienko.co</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          Petro Hordiienko
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 28,
            fontSize: 40,
            color: '#a3a7ad',
          }}
        >
          {`${t.hero.titleTop} ${t.hero.titleBottom}`}
          <span
            style={{
              width: 34,
              height: 8,
              background: '#f0b65a',
              marginLeft: 8,
              marginTop: 22,
              borderRadius: 2,
            }}
          />
        </div>
        <div style={{ marginTop: 18, fontSize: 28, color: '#4fb39c' }}>
          Startups · Fintech · Applied AI
        </div>
      </div>
    </div>,
    size,
  );
}
