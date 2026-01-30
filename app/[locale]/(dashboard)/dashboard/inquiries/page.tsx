import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TIER_LIMITS, type SubscriptionTier, type Inquiry } from '@/types'
import { InquiryList } from './InquiryList'

export default async function InquiriesPage() {
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

  // Check if user has inquiry form access
  if (!limits.hasInquiryForm) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-1">Manage customer inquiries</p>
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
              Inquiry forms are available on Pro and Premium plans. Upgrade to receive
              direct inquiries from potential customers through your listings.
            </p>
            <Link href="/dashboard/billing">
              <Button variant="primary">Upgrade Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get all listings for this operator
  const { data: listings } = await supabase
    .from('listings')
    .select('id, name')
    .eq('operator_id', user.id)

  // Get inquiries for all listings
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*, listings(name)')
    .in('listing_id', listings?.map((l) => l.id) || [])
    .order('created_at', { ascending: false })

  const newCount = inquiries?.filter((i) => i.status === 'new').length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-1">
            {newCount > 0 ? `${newCount} new inquir${newCount === 1 ? 'y' : 'ies'}` : 'Manage customer inquiries'}
          </p>
        </div>
      </div>

      {!inquiries || inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              When customers submit inquiry forms on your listings, they&apos;ll appear here.
              Make sure your listings are active to start receiving inquiries.
            </p>
          </CardContent>
        </Card>
      ) : (
        <InquiryList inquiries={inquiries} />
      )}
    </div>
  )
}
