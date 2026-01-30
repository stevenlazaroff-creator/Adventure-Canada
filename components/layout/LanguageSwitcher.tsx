'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';
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
    <div className="flex items-center rounded-lg border border-beige-300 overflow-hidden">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium transition-colors',
            locale === currentLocale
              ? 'bg-beige-200 text-pantone-293'
              : 'bg-pantone-293 text-beige-200 hover:text-white'
          )}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
