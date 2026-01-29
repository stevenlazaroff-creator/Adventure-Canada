'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split('/')[1] as Locale;

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  return (
    <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium transition-colors',
            locale === currentLocale
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
