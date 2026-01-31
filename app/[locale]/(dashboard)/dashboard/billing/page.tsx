import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { getTranslations } from 'next-intl/server'
import { TIER_LIMITS, PRICING, type SubscriptionTier } from '@/types'
import { CheckoutButton } from './CheckoutButton'

export default async function BillingPage() {
  const supabase = await createClient()
  const t = await getTranslations('dashboard')
  const tPricing = await getTranslations('pricing.tiers')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('operator_id', user.id)
    .single()

  const currentTier = (subscription?.tier || 'free') as SubscriptionTier

  const tiers: SubscriptionTier[] = ['free', 'basic', 'pro']

  const getTierFeatures = (tier: SubscriptionTier): string[] => {
    if (tier === 'free') {
      return [
        t('basicListingFeature'),
        t('contactEmailFeature'),
        t('listedInDirectory'),
      ]
    }
    if (tier === 'basic') {
      return [
        t('everythingInFree'),
        t('phoneDisplayed'),
        t('websiteLink'),
        t('shortDescription'),
        t('onePhoto'),
      ]
    }
    return [
      t('everythingInBasic'),
      t('fullDescription'),
      t('logoDisplay'),
      t('fivePhotos'),
      t('socialMediaLinks'),
      t('analyticsDashboard'),
      t('inquiryForm'),
    ]
  }

  const getTierLabel = (tier: SubscriptionTier) => {
    if (tier === 'free') return tPricing('free.name')
    if (tier === 'basic') return tPricing('basic.name')
    return tPricing('pro.name')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('billingSubscription')}</h1>
        <p className="text-gray-600 mt-1">{t('manageSubscription')}</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{t('currentPlan')}</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{getTierLabel(currentTier)}</p>
              {subscription?.current_period_end && (
                <p className="text-sm text-gray-500">
                  {subscription.cancel_at_period_end
                    ? t('expiresOn', { date: new Date(subscription.current_period_end).toLocaleDateString() })
                    : t('renewsOn', { date: new Date(subscription.current_period_end).toLocaleDateString() })}
                </p>
              )}
            </div>
            {currentTier !== 'free' && subscription?.stripe_subscription_id && (
              <form action="/api/billing/portal" method="POST">
                <button
                  type="submit"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('manageSubscriptionLink')}
                </button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('availablePlans')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrentPlan = tier === currentTier
            const pricing = PRICING[tier]
            const features = getTierFeatures(tier)

            return (
              <Card
                key={tier}
                className={isCurrentPlan ? 'ring-2 ring-primary-500' : ''}
              >
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{getTierLabel(tier)}</h3>
                    <div className="mt-2">
                      {pricing.monthly === 0 ? (
                        <span className="text-3xl font-bold">{t('free')}</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold">${pricing.monthly}</span>
                          <span className="text-gray-500">{t('perMonth')}</span>
                        </>
                      )}
                    </div>
                    {pricing.annual > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {t('orAnnual', { annual: pricing.annual, savings: pricing.monthly * 12 - pricing.annual })}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <div className="w-full py-2 px-4 bg-gray-100 text-gray-600 text-center rounded-lg font-medium">
                      {t('currentPlan')}
                    </div>
                  ) : tier === 'free' ? (
                    <div className="w-full py-2 px-4 bg-gray-50 text-gray-400 text-center rounded-lg font-medium">
                      —
                    </div>
                  ) : (
                    <CheckoutButton tier={tier} currentTier={currentTier} />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{t('faq')}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">{t('faqUpgradeTitle')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('faqUpgradeAnswer')}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{t('faqDowngradeTitle')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('faqDowngradeAnswer')}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{t('faqRefundTitle')}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('faqRefundAnswer')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
