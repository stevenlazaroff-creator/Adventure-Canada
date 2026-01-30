'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const navigation = [
    { name: t('activities'), href: `/${locale}/activities` },
    { name: t('regions'), href: `/${locale}/regions` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-pantone-293">
      <nav className="container-wide">
        <div className="flex h-14 items-center justify-between">
          {/* Home link - minimal text */}
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-beige-200 hover:text-white transition-colors"
          >
            {t('home')}
          </Link>

          {/* Desktop Navigation - centered */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-white',
                  pathname === item.href
                    ? 'text-white'
                    : 'text-beige-200'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-beige-200 hover:text-white"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="btn bg-beige-200 text-pantone-293 hover:bg-beige-100 btn-sm"
            >
              {t('listYourBusiness')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="p-2 text-beige-200"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
        locale={locale}
      />
    </header>
  );
}
