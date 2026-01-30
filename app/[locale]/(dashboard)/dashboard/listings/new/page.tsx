import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ListingForm } from '@/components/dashboard/ListingForm'
import type { SubscriptionTier } from '@/types'

export default async function NewListingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get operator's subscription tier
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('operator_id', user.id)
    .single()

  const tier = (subscription?.tier || 'free') as SubscriptionTier

  // Get activities and regions for the form
  const [{ data: activities }, { data: regions }] = await Promise.all([
    supabase.from('activities').select('*').order('display_order'),
    supabase.from('regions').select('*').order('display_order'),
  ])

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
        <p className="text-gray-600 mt-1">
          Add your adventure business to the directory
        </p>
      </div>

      <ListingForm
        tier={tier}
        activities={activities || []}
        regions={regions || []}
      />
    </div>
  )
}
