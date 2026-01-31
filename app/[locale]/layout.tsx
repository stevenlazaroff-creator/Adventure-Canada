import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <head>
        {/* Google Consent Mode - Default (must load before GTM) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WDP3PNBW');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${inter.className} h-full`} style={{ backgroundColor: '#F5F0E8' }}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WDP3PNBW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieConsent locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
