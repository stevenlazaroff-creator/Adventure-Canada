'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, MapPin, Activity } from 'lucide-react';

interface SearchBarProps {
  locale: string;
  variant?: 'hero' | 'compact';
}

export function SearchBar({ locale, variant = 'hero' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [activity, setActivity] = useState('');
  const [region, setRegion] = useState('');
  const router = useRouter();
  const t = useTranslations('home');
  const tActivities = useTranslations('activities');
  const tRegions = useTranslations('regions');
  const tBrowse = useTranslations('browse');

  const activities = [
    'rafting',
    'hiking',
    'skiing',
    'kayaking',
    'wildlifeTours',
    'dogSledding',
    'fishing',
    'climbing',
    'camping',
    'multiSport',
  ];

  const regions = [
    'britishColumbia',
    'alberta',
    'ontario',
    'quebec',
    'novaScotia',
    'newBrunswick',
    'manitoba',
    'saskatchewan',
    'yukon',
    'northwestTerritories',
    'nunavut',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (activity) params.set('activity', activity);
    if (region) params.set('region', region);

    const searchQuery = params.toString();
    const basePath = activity
      ? `/${locale}/browse/activities/${activity}`
      : region
      ? `/${locale}/browse/regions/${region}`
      : `/${locale}/browse/activities`;

    router.push(searchQuery ? `${basePath}?${searchQuery}` : basePath);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="input pl-10"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-md">
          {tBrowse('search') || 'Search'}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-xl shadow-lg p-4 md:p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Query */}
        <div className="md:col-span-2">
          <label className="sr-only">{t('searchPlaceholder')}</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="input pl-10 text-gray-900"
            />
          </div>
        </div>

        {/* Activity Select */}
        <div>
          <label className="sr-only">{tBrowse('activities')}</label>
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="input pl-10 text-gray-900 appearance-none cursor-pointer"
            >
              <option value="">{tBrowse('allActivities')}</option>
              {activities.map((act) => (
                <option key={act} value={act.replace(/([A-Z])/g, '-$1').toLowerCase()}>
                  {tActivities(act as any)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Region Select */}
        <div>
          <label className="sr-only">{tBrowse('regions')}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input pl-10 text-gray-900 appearance-none cursor-pointer"
            >
              <option value="">{tBrowse('allRegions')}</option>
              {regions.map((reg) => (
                <option
                  key={reg}
                  value={reg.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}
                >
                  {tRegions(reg as any)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="btn btn-primary btn-lg w-full mt-4"
      >
        <Search className="h-5 w-5 mr-2" />
        {tBrowse('search') || 'Search'}
      </button>
    </form>
  );
}
