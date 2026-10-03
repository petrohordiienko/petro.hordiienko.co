import type { MetadataRoute } from 'next';
import { locales } from '@/shared/lib/i18n';
import { site } from '@/shared/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((lang) => ({
    url: `${site.url}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: lang === 'en' ? 1 : 0.9,
    alternates: {
      languages: { en: `${site.url}/en`, pl: `${site.url}/pl`, 'x-default': `${site.url}/en` },
    },
  }));
}
