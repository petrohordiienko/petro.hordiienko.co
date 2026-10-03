import type { Dictionary } from '@/content/types';
import type { Locale } from './i18n';
import { site } from './site';

export function buildStructuredData(lang: Locale, t: Dictionary) {
  const pageUrl = `${site.url}/${lang}`;
  const person = `${site.url}/#person`;
  const business = `${site.url}/#business`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: lang,
        publisher: { '@id': business },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: lang,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': business },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: site.name,
        url: site.url,
        email: site.email,
        jobTitle: 'Software Engineer',
        knowsAbout: t.meta.keywords,
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'National Aerospace University "Kharkiv Aviation Institute"',
        },
        sameAs: site.socials.map((s) => s.href),
      },
      {
        '@type': 'ProfessionalService',
        '@id': business,
        name: site.legal.name,
        url: site.url,
        email: site.email,
        taxID: site.legal.nip,
        foundingDate: String(site.since),
        founder: { '@id': person },
        description: t.meta.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Ziębicka 14A lok. 19',
          postalCode: '60-164',
          addressLocality: 'Poznań',
          addressCountry: 'PL',
        },
        areaServed: [
          { '@type': 'Country', name: 'Poland' },
          { '@type': 'Place', name: 'Europe' },
        ],
        sameAs: site.socials.map((s) => s.href),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.services.title,
          itemListElement: t.services.items.map((item) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: item.title,
              description: item.body,
              serviceType: item.tech.join(', '),
              provider: { '@id': business },
            },
          })),
        },
      },
    ],
  };
}
