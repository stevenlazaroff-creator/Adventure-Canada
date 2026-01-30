import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { CanadaMap } from '@/components/marketing/CanadaMap';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: locale === 'en' ? 'Adventure Canada' : 'Aventure Canada',
    description: t('heroSubtitle'),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tRegions = await getTranslations('regions');

  return (
    <div>
      {/* Hero Section with Logo and Map */}
      <section className="py-8 md:py-12">
        <div className="container-wide">
          {/* Large Logo */}
          <div className="flex justify-center mb-8 md:mb-12">
            <Image
              src={locale === 'fr' ? '/images/logo-fr.jpg' : '/images/logo-en.png'}
              alt={locale === 'fr' ? 'Aventure Canada' : 'Adventure Canada'}
              width={500}
              height={125}
              className="h-24 md:h-32 lg:h-40 w-auto"
              priority
            />
          </div>

          {/* Tagline */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-balance">
              {t('heroTitle')}
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Canada Map */}
          <div>
            <CanadaMap
              locale={locale}
              labels={{
                western: tRegions('western'),
                eastern: tRegions('eastern'),
                atlantic: tRegions('atlantic'),
                northern: tRegions('northern'),
              }}
            />
          </div>

          {/* Operator Count */}
          <p className="text-center text-gray-500 mt-8">
            {t('operatorCount', { count: '500+' })}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-wide py-16 md:py-24">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">{t('ctaTitle')}</h2>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link
            href={`/${locale}/pricing`}
            className="btn bg-beige-200 text-primary-600 hover:bg-beige-100 btn-lg mt-8"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
