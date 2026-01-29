'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const navigation = [
    { name: t('browse'), href: `/${locale}/browse/activities` },
    { name: t('regions'), href: `/${locale}/browse/regions` },
    { name: t('pricing'), href: `/${locale}/pricing` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="container-wide">
        <div className="flex h-20 md:h-24 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src={locale === 'fr' ? '/images/logo-fr.jpg' : '/images/logo-en.png'}
              alt={locale === 'fr' ? 'Aventure Canada' : 'Adventure Canada'}
              width={280}
              height={70}
              className="h-14 md:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-700'
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
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="btn btn-primary btn-sm"
            >
              {t('listYourBusiness')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="p-2 text-gray-700"
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
