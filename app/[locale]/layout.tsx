import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isEnglish = locale === 'en';

  return {
    title: {
      default: isEnglish ? 'Adventure Canada' : 'Aventure Canada',
      template: isEnglish
        ? '%s | Adventure Canada'
        : '%s | Aventure Canada',
    },
    description: isEnglish
      ? "Discover Canada's greatest adventures. Find the perfect adventure tour operator for your next Canadian expedition."
      : "Découvrez les plus grandes aventures du Canada. Trouvez l'opérateur de tourisme d'aventure parfait pour votre prochaine expédition canadienne.",
    keywords: isEnglish
      ? ['adventure', 'Canada', 'tours', 'outdoor', 'hiking', 'rafting', 'skiing', 'kayaking']
      : ['aventure', 'Canada', 'tours', 'plein air', 'randonnée', 'rafting', 'ski', 'kayak'],
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
