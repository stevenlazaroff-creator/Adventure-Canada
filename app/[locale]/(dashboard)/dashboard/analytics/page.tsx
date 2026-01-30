import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TIER_LIMITS, type SubscriptionTier } from '@/types'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get subscription tier
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('operator_id', user.id)
    .single()

  const tier = (subscription?.tier || 'free') as SubscriptionTier
  const limits = TIER_LIMITS[tier]

  // Check if user has analytics access
  if (!limits.hasAnalytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your listing performance</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upgrade to Pro</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Analytics is available on Pro and Premium plans. Upgrade to see detailed
              insights about your listing views, clicks, and inquiries.
            </p>
            <Link href="/dashboard/billing">
              <Button variant="primary">Upgrade Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get analytics data for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Get all listings for this operator
  const { data: listings } = await supabase
    .from('listings')
    .select('id, name')
    .eq('operator_id', user.id)

  // Get analytics events
  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .in('listing_id', listings?.map((l) => l.id) || [])
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Calculate totals
  const totals = {
    views: events?.filter((e) => e.event_type === 'view').length || 0,
    website_clicks: events?.filter((e) => e.event_type === 'website_click').length || 0,
    phone_clicks: events?.filter((e) => e.event_type === 'phone_click').length || 0,
    inquiries: events?.filter((e) => e.event_type === 'inquiry').length || 0,
  }

  // Group by day for chart
  const eventsByDay: Record<string, { views: number; clicks: number }> = {}
  events?.forEach((event) => {
    const day = event.created_at.split('T')[0]
    if (!eventsByDay[day]) {
      eventsByDay[day] = { views: 0, clicks: 0 }
    }
    if (event.event_type === 'view') {
      eventsByDay[day].views++
    } else {
      eventsByDay[day].clicks++
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Last 30 days performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Total Views</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{totals.views}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Website Clicks</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{totals.website_clicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Phone Clicks</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{totals.phone_clicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500">Inquiries</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{totals.inquiries}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Views Over Time</h2>
        </CardHeader>
        <CardContent>
          {Object.keys(eventsByDay).length > 0 ? (
            <div className="h-64 flex items-end gap-1">
              {Object.entries(eventsByDay)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-14) // Last 14 days
                .map(([day, data]) => {
                  const maxViews = Math.max(
                    ...Object.values(eventsByDay).map((d) => d.views),
                    1
                  )
                  const height = (data.views / maxViews) * 100

                  return (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-500 rounded-t"
                        style={{ height: `${Math.max(height, 4)}%` }}
                        title={`${day}: ${data.views} views`}
                      />
                      <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                        {day.slice(5)}
                      </span>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data yet. Views will appear here once your listings get traffic.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-listing breakdown */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Performance by Listing</h2>
        </CardHeader>
        <CardContent>
          {listings && listings.length > 0 ? (
            <div className="divide-y">
              {listings.map((listing) => {
                const listingEvents = events?.filter((e) => e.listing_id === listing.id) || []
                const views = listingEvents.filter((e) => e.event_type === 'view').length
                const clicks = listingEvents.filter(
                  (e) => e.event_type === 'website_click' || e.event_type === 'phone_click'
                ).length

                return (
                  <div key={listing.id} className="py-4 flex items-center justify-between">
                    <span className="font-medium text-gray-900">{listing.name}</span>
                    <div className="flex gap-6 text-sm">
                      <span className="text-gray-500">
                        <span className="font-medium text-gray-900">{views}</span> views
                      </span>
                      <span className="text-gray-500">
                        <span className="font-medium text-gray-900">{clicks}</span> clicks
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 py-4">
              No listings yet. Create a listing to start tracking analytics.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
