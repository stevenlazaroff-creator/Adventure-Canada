import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Search, MapPin, Mountain, Waves, TreePine, Fish, Snowflake } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryCard } from '@/components/marketing/CategoryCard';
import { RegionCard } from '@/components/marketing/RegionCard';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
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

const featuredRegions = [
  { slug: 'british-columbia', image: '/images/regions/bc.jpg' },
  { slug: 'alberta', image: '/images/regions/alberta.jpg' },
  { slug: 'ontario', image: '/images/regions/ontario.jpg' },
  { slug: 'quebec', image: '/images/regions/quebec.jpg' },
];

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('home');
  const tActivities = useTranslations('activities');
  const tRegions = useTranslations('regions');
  const tNav = useTranslations('nav');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-600 to-secondary-800 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container-wide py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90">
              {t('heroSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="mt-10">
              <SearchBar locale={locale} />
            </div>

            {/* Operator Count */}
            <p className="mt-8 text-white/70">
              {t('operatorCount', { count: '500+' })}
            </p>
          </div>
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

      {/* Browse by Region */}
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('browseByRegion')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRegions.map((region) => (
              <RegionCard
                key={region.slug}
                href={`/${locale}/browse/regions/${region.slug}`}
                name={tRegions(
                  region.slug
                    .split('-')
                    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
                    .join('') as any
                )}
                image={region.image}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${locale}/browse/regions`}
              className="btn btn-outline btn-md"
            >
              {tNav('regions')} →
            </Link>
          </div>
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
            className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg mt-8"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
