import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const t = await getTranslations('dashboard')
  const tPricing = await getTranslations('pricing.tiers')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get operator with subscription
  const { data: operator } = await supabase
    .from('operators')
    .select('*, subscriptions(*)')
    .eq('id', user.id)
    .single()

  // Get listing count
  const { count: listingCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', user.id)

  const subscription = operator?.subscriptions?.[0]
  const tier = subscription?.tier || 'free'

  const getTierLabel = (tierKey: string) => {
    if (tierKey === 'free') return tPricing('free.name')
    if (tierKey === 'basic') return tPricing('basic.name')
    if (tierKey === 'pro') return tPricing('pro.name')
    return tierKey
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('welcomeBack', { name: operator?.business_name || 'there' })}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('overviewSubtitle')}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">{t('currentPlan')}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {getTierLabel(tier)}
              </span>
              {tier === 'free' && (
                <Link href="/dashboard/billing">
                  <Button variant="outline" size="sm">
                    {t('upgrade')}
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">{t('totalListings')}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {listingCount || 0}
              </span>
              <Link href="/dashboard/listings/new">
                <Button variant="outline" size="sm">
                  {t('addNew')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">{t('accountStatus')}</div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {t('active')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">{t('quickActions')}</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/listings/new"
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">{t('createNewListing')}</div>
              <div className="text-sm text-gray-500">{t('createNewListingDesc')}</div>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">{t('editProfile')}</div>
              <div className="text-sm text-gray-500">{t('editProfileDesc')}</div>
            </div>
          </Link>

          {tier === 'free' && (
            <Link
              href="/dashboard/billing"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors md:col-span-2"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">{t('upgradePlan')}</div>
                <div className="text-sm text-gray-500">
                  {t('upgradePlanDesc')}
                </div>
              </div>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
