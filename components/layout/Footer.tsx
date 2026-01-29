'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: tNav('home'), href: `/${locale}` },
    { name: tNav('activities'), href: `/${locale}/browse/activities` },
    { name: tNav('regions'), href: `/${locale}/browse/regions` },
    { name: tNav('about'), href: `/${locale}/about` },
    { name: tNav('contact'), href: `/${locale}/contact` },
  ];

  const operatorLinks = [
    { name: tNav('pricing'), href: `/${locale}/pricing` },
    { name: tNav('listYourBusiness'), href: `/${locale}/register` },
    { name: tNav('login'), href: `/${locale}/login` },
    { name: tNav('dashboard'), href: `/${locale}/dashboard` },
  ];

  const legalLinks = [
    { name: t('privacy'), href: `/${locale}/privacy` },
    { name: t('terms'), href: `/${locale}/terms` },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`}>
              <Image
                src={locale === 'fr' ? '/images/logo-fr.jpg' : '/images/logo-en.png'}
                alt={locale === 'fr' ? 'Aventure Canada' : 'Adventure Canada'}
                width={160}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Operators */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('forOperators')}
            </h3>
            <ul className="mt-4 space-y-3">
              {operatorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('legal')}
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
