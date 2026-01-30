import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { TIER_LIMITS, PRICING, type SubscriptionTier } from '@/types'
import { CheckoutButton } from './CheckoutButton'

const tierFeatures: Record<SubscriptionTier, string[]> = {
  free: [
    'Basic listing with name and location',
    'Contact email visible',
    'Listed in directory',
  ],
  basic: [
    'Everything in Free, plus:',
    'Phone number displayed',
    'Website link',
    'Short description (500 chars)',
    '1 photo',
  ],
  pro: [
    'Everything in Basic, plus:',
    'Full description (2000 chars)',
    'Logo display',
    '5 photos',
    'Social media links',
    'Analytics dashboard',
    'Inquiry form',
  ],
  premium: [
    'Everything in Pro, plus:',
    '15 photos',
    'Featured badge',
    'Verified badge',
    'Priority placement in search',
    'Dedicated support',
  ],
}

export default async function BillingPage() {
  const supabase = await createClient()

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription plan</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Current Plan</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 capitalize">{currentTier}</p>
              {subscription?.current_period_end && (
                <p className="text-sm text-gray-500">
                  {subscription.cancel_at_period_end
                    ? `Expires on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                </p>
              )}
            </div>
            {currentTier !== 'free' && subscription?.stripe_subscription_id && (
              <form action="/api/billing/portal" method="POST">
                <button
                  type="submit"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Manage Subscription →
                </button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrentPlan = tier === currentTier
            const pricing = PRICING[tier]
            const features = tierFeatures[tier]

            return (
              <Card
                key={tier}
                className={isCurrentPlan ? 'ring-2 ring-primary-500' : ''}
              >
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 capitalize">{tier}</h3>
                    <div className="mt-2">
                      {pricing.monthly === 0 ? (
                        <span className="text-3xl font-bold">Free</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold">${pricing.monthly}</span>
                          <span className="text-gray-500">/month</span>
                        </>
                      )}
                    </div>
                    {pricing.annual > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        or ${pricing.annual}/year (save ${pricing.monthly * 12 - pricing.annual})
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
                      Current Plan
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
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Can I upgrade or downgrade anytime?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Yes! You can upgrade anytime and the new features will be available immediately.
              If you downgrade, you&apos;ll keep your current features until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">What happens to my listings if I downgrade?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Your listings will remain, but features above your new plan limit will be hidden.
              For example, extra photos won&apos;t be displayed until you upgrade again.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Do you offer refunds?</h3>
            <p className="text-sm text-gray-600 mt-1">
              We offer a 14-day money-back guarantee. Contact us within 14 days of your purchase
              for a full refund.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
