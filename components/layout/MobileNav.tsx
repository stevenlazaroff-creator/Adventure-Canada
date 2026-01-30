'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  navigation: { name: string; href: string }[];
  locale: string;
}

export function MobileNav({ open, onClose, navigation, locale }: MobileNavProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href={`/${locale}`} onClick={onClose}>
            <Image
              src={locale === 'fr' ? '/images/logo-fr.jpg' : '/images/logo-en.png'}
              alt={locale === 'fr' ? 'Aventure Canada' : 'Adventure Canada'}
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            className="p-2 text-gray-700"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 py-6">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-4">
            <Link
              href={`/${locale}/login`}
              onClick={onClose}
              className="btn btn-outline btn-md w-full"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              onClick={onClose}
              className="btn btn-primary btn-md w-full"
            >
              {t('listYourBusiness')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
