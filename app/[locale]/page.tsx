import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Mountain, Waves, TreePine, Fish, Snowflake } from 'lucide-react';
import { CategoryCard } from '@/components/marketing/CategoryCard';
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

const activities = [
  { slug: 'rafting', icon: Waves, color: 'bg-blue-500' },
  { slug: 'hiking', icon: Mountain, color: 'bg-green-600' },
  { slug: 'skiing', icon: Snowflake, color: 'bg-sky-400' },
  { slug: 'kayaking', icon: Waves, color: 'bg-cyan-500' },
  { slug: 'fishing', icon: Fish, color: 'bg-teal-500' },
  { slug: 'camping', icon: TreePine, color: 'bg-emerald-600' },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tActivities = await getTranslations('activities');
  const tRegions = await getTranslations('regions');
  const tNav = await getTranslations('nav');

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
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-6">
              {t('exploreByRegion')}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {t('selectRegion')}
            </p>
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

      {/* Popular Activities */}
      <section className="container-wide py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('popularActivities')}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activities.map((activity) => (
            <CategoryCard
              key={activity.slug}
              href={`/${locale}/browse/activities/${activity.slug}`}
              icon={activity.icon}
              label={tActivities(activity.slug.replace('-', '') as any)}
              color={activity.color}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${locale}/browse/activities`}
            className="btn btn-outline btn-md"
          >
            {tNav('activities')} →
          </Link>
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
