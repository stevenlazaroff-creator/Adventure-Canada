'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { X, Cookie, Shield, BarChart3, Megaphone, Settings2 } from 'lucide-react';

// Cookie consent types
interface ConsentPreferences {
  necessary: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  locale?: string;
}

// Translations
const translations = {
  en: {
    title: 'We value your privacy',
    description: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    savePreferences: 'Save Preferences',
    close: 'Close',
    preferencesTitle: 'Cookie Preferences',
    preferencesDescription: 'Manage your cookie preferences below. Necessary cookies are required for basic site functionality and cannot be disabled.',
    necessary: {
      title: 'Necessary Cookies',
      description: 'Essential for the website to function. These cannot be disabled.',
    },
    functional: {
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality like remembering your preferences and language settings.',
    },
    analytics: {
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website to improve user experience.',
    },
    marketing: {
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements and track campaign effectiveness.',
    },
    privacyPolicy: 'Privacy Policy',
    learnMore: 'Learn more about our',
  },
  fr: {
    title: 'Nous respectons votre vie privée',
    description: 'Nous utilisons des cookies pour améliorer votre expérience de navigation, analyser le trafic du site et personnaliser le contenu. En cliquant sur « Tout accepter », vous consentez à notre utilisation des cookies.',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    customize: 'Personnaliser',
    savePreferences: 'Enregistrer',
    close: 'Fermer',
    preferencesTitle: 'Préférences de cookies',
    preferencesDescription: 'Gérez vos préférences de cookies ci-dessous. Les cookies nécessaires sont requis pour le fonctionnement de base du site et ne peuvent pas être désactivés.',
    necessary: {
      title: 'Cookies nécessaires',
      description: 'Essentiels au fonctionnement du site. Ils ne peuvent pas être désactivés.',
    },
    functional: {
      title: 'Cookies fonctionnels',
      description: 'Permettent des fonctionnalités améliorées comme la mémorisation de vos préférences et paramètres de langue.',
    },
    analytics: {
      title: 'Cookies analytiques',
      description: 'Nous aident à comprendre comment les visiteurs interagissent avec notre site pour améliorer l\'expérience utilisateur.',
    },
    marketing: {
      title: 'Cookies marketing',
      description: 'Utilisés pour diffuser des publicités personnalisées et suivre l\'efficacité des campagnes.',
    },
    privacyPolicy: 'Politique de confidentialité',
    learnMore: 'En savoir plus sur notre',
  },
};

// Cookie utility functions
const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback to cookie if localStorage fails
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === CONSENT_COOKIE_NAME) {
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function setStoredConsent(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return;

  const preferencesStr = JSON.stringify(preferences);

  // Store in localStorage
  try {
    localStorage.setItem(CONSENT_COOKIE_NAME, preferencesStr);
  } catch {
    // Ignore localStorage errors
  }

  // Also store in cookie for server-side access
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(preferencesStr)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

// Update GTM consent state
function updateGTMConsent(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return;

  // Push consent update to dataLayer for GTM
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: 'consent_update',
    consent: {
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      functionality_storage: preferences.functional ? 'granted' : 'denied',
      personalization_storage: preferences.functional ? 'granted' : 'denied',
      security_storage: 'granted', // Always granted for necessary cookies
    },
  });

  // Also update using gtag consent API if available
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('consent', 'update', {
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      functionality_storage: preferences.functional ? 'granted' : 'denied',
      personalization_storage: preferences.functional ? 'granted' : 'denied',
    });
  }
}

// Set default consent (denied) before user makes a choice
function setDefaultConsent(): void {
  if (typeof window === 'undefined') return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: 'consent_default',
    consent: {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500,
    },
  });
}

// Toggle Switch Component
function ToggleSwitch({
  enabled,
  onChange,
  disabled = false
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:ring-offset-2
        ${enabled ? 'bg-secondary-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

// Preferences Modal Component
function PreferencesModal({
  isOpen,
  onClose,
  preferences,
  setPreferences,
  onSave,
  t,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  preferences: ConsentPreferences;
  setPreferences: (prefs: ConsentPreferences) => void;
  onSave: () => void;
  t: typeof translations.en;
  locale: string;
}) {
  if (!isOpen) return null;

  const categories = [
    {
      key: 'necessary' as const,
      icon: Shield,
      disabled: true,
    },
    {
      key: 'functional' as const,
      icon: Settings2,
      disabled: false,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      disabled: false,
    },
    {
      key: 'marketing' as const,
      icon: Megaphone,
      disabled: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Cookie className="w-6 h-6 text-secondary-600" />
            <h2 className="text-xl font-semibold text-gray-900">{t.preferencesTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t.close}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-600 mb-6">{t.preferencesDescription}</p>

          <div className="space-y-4">
            {categories.map(({ key, icon: Icon, disabled }) => (
              <div
                key={key}
                className={`p-4 rounded-xl border ${
                  disabled ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${disabled ? 'bg-gray-200' : 'bg-secondary-100'}`}>
                      <Icon className={`w-5 h-5 ${disabled ? 'text-gray-500' : 'text-secondary-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{t[key].title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{t[key].description}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={preferences[key]}
                    onChange={(enabled) => setPreferences({ ...preferences, [key]: enabled })}
                    disabled={disabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <a
            href={`/${locale}/privacy`}
            className="text-sm text-secondary-600 hover:text-secondary-700 hover:underline"
          >
            {t.learnMore} {t.privacyPolicy}
          </a>
          <Button onClick={onSave} variant="secondary">
            {t.savePreferences}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Cookie Consent Component
export function CookieConsent({ locale: propLocale }: CookieConsentProps) {
  const pathname = usePathname();
  const locale = propLocale || pathname?.split('/')[1] || 'en';
  const t = translations[locale as keyof typeof translations] || translations.en;

  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  // Check for existing consent on mount
  useEffect(() => {
    const storedConsent = getStoredConsent();

    if (storedConsent) {
      // User has already made a choice
      setPreferences(storedConsent);
      updateGTMConsent(storedConsent);
      setIsVisible(false);
    } else {
      // No consent yet - set defaults and show banner
      setDefaultConsent();
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    setStoredConsent(allAccepted);
    updateGTMConsent(allAccepted);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    const allRejected: ConsentPreferences = {
      necessary: true, // Necessary always stays true
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(allRejected);
    setStoredConsent(allRejected);
    updateGTMConsent(allRejected);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    setStoredConsent(preferences);
    updateGTMConsent(preferences);
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible && !showPreferences) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Icon and Text */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="hidden sm:flex p-3 bg-secondary-100 rounded-xl">
                    <Cookie className="w-8 h-8 text-secondary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t.description}{' '}
                      <a
                        href={`/${locale}/privacy`}
                        className="text-secondary-600 hover:text-secondary-700 underline"
                      >
                        {t.privacyPolicy}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                    className="order-3 sm:order-1"
                  >
                    {t.rejectAll}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreferences(true)}
                    className="order-2"
                  >
                    {t.customize}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleAcceptAll}
                    className="order-1 sm:order-3"
                  >
                    {t.acceptAll}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        setPreferences={setPreferences}
        onSave={handleSavePreferences}
        t={t}
        locale={locale}
      />
    </>
  );
}

export default CookieConsent;
