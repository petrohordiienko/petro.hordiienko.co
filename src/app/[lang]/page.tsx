import { notFound } from 'next/navigation';
import { HeroSwitcher } from '@/features/hero/HeroSwitcher';
import { Reveal } from '@/shared/components/atoms/Reveal';
import { PortfolioProvider } from '@/shared/components/molecules/PortfolioProvider';
import { Contact } from '@/shared/components/organisms/Contact';
import { Footer } from '@/shared/components/organisms/Footer';
import { Header } from '@/shared/components/organisms/Header';
import { Manifesto } from '@/shared/components/organisms/Manifesto';
import { Process } from '@/shared/components/organisms/Process';
import { Services } from '@/shared/components/organisms/Services';
import { Work } from '@/shared/components/organisms/Work';
import { getDictionary, isLocale } from '@/shared/lib/i18n';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Header lang={lang} t={t} />
      <main id="top">
        <PortfolioProvider w={t.work}>
          <HeroSwitcher t={t} />
          <Reveal>
            <Manifesto t={t} />
          </Reveal>
          <Reveal>
            <Services t={t} />
          </Reveal>
          <Reveal>
            <Work t={t} />
          </Reveal>
          <Reveal>
            <Process t={t} />
          </Reveal>
          <Reveal>
            <Contact t={t} />
          </Reveal>
        </PortfolioProvider>
      </main>
      <Footer t={t} />
    </>
  );
}
