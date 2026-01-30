import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { ListingCard } from '@/components/listings/ListingCard'
import { ChevronLeft } from 'lucide-react'

interface ActivityPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: activity } = await supabase
    .from('activities')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!activity) {
    return {
      title: 'Activity Not Found | Adventure Canada',
    }
  }

  return {
    title: `${activity.name} Adventures in Canada | Adventure Canada`,
    description:
      activity.description ||
      `Discover the best ${activity.name.toLowerCase()} adventures and tours across Canada.`,
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug, locale } = await params
  const supabase = await createClient()

  // Get activity details
  const { data: activity, error } = await supabase
    .from('activities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !activity) {
    notFound()
  }

  // Get listings that have this activity
  const { data: listingActivities } = await supabase
    .from('listing_activities')
    .select('listing_id')
    .eq('activity_id', activity.id)

  const listingIds = listingActivities?.map((la) => la.listing_id) || []

  // Get full listing details
  const { data: listings } = await supabase
    .from('listings')
    .select(
      `
      id,
      slug,
      name,
      city,
      description_short,
      price_range,
      is_featured,
      is_verified,
      seasons,
      regions(name),
      listing_images(url, is_primary),
      listing_activities(activity_id, activities(name))
    `
    )
    .in('id', listingIds.length > 0 ? listingIds : ['00000000-0000-0000-0000-000000000000'])
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('name')

  // Activity icons mapping
  const activityIcons: Record<string, string> = {
    kayaking: '🛶',
    canoeing: '🚣',
    hiking: '🥾',
    camping: '⛺',
    fishing: '🎣',
    wildlife: '🦌',
    'northern-lights': '🌌',
    skiing: '⛷️',
    snowboarding: '🏂',
    snowshoeing: '❄️',
    'dog-sledding': '🛷',
    'ice-fishing': '🎣',
    climbing: '🧗',
    rafting: '🚣‍♂️',
    cycling: '🚴',
    'mountain-biking': '🚵',
    sailing: '⛵',
    surfing: '🏄',
    diving: '🤿',
    snorkeling: '🤿',
    'whale-watching': '🐋',
    'bird-watching': '🦅',
    photography: '📷',
    'cultural-tours': '🏛️',
    'food-tours': '🍽️',
    'wine-tours': '🍷',
    'aurora-viewing': '🌌',
    'glacier-tours': '🏔️',
    'hot-springs': '♨️',
    zipline: '🪢',
  }

  const icon = activityIcons[activity.slug] || '🏔️'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/activities"
            className="inline-flex items-center text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            All Activities
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{activity.name}</h1>
              {activity.description && (
                <p className="text-xl text-primary-100 mt-2 max-w-2xl">{activity.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {listings?.length || 0} {activity.name} Adventures
          </h2>
          <Link href="/adventures" className="text-primary-600 hover:text-primary-700 font-medium">
            Browse All Adventures
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No adventures found</h3>
            <p className="text-gray-600 mb-6">
              There are no {activity.name.toLowerCase()} adventures listed yet. Check back soon or
              explore other activities!
            </p>
            <Link
              href="/adventures"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse All Adventures
            </Link>
          </div>
        )}

        {/* Related Activities */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Explore More Activities</h3>
          <RelatedActivities currentSlug={activity.slug} />
        </div>
      </div>
    </div>
  )
}

async function RelatedActivities({ currentSlug }: { currentSlug: string }) {
  const supabase = await createClient()

  const { data: activities } = await supabase
    .from('activities')
    .select('id, name, slug')
    .neq('slug', currentSlug)
    .limit(6)

  const activityIcons: Record<string, string> = {
    kayaking: '🛶',
    canoeing: '🚣',
    hiking: '🥾',
    camping: '⛺',
    fishing: '🎣',
    wildlife: '🦌',
    'northern-lights': '🌌',
    skiing: '⛷️',
    snowboarding: '🏂',
    snowshoeing: '❄️',
    'dog-sledding': '🛷',
    'ice-fishing': '🎣',
    climbing: '🧗',
    rafting: '🚣‍♂️',
    cycling: '🚴',
    'mountain-biking': '🚵',
    sailing: '⛵',
    surfing: '🏄',
    diving: '🤿',
    snorkeling: '🤿',
    'whale-watching': '🐋',
    'bird-watching': '🦅',
    photography: '📷',
    'cultural-tours': '🏛️',
    'food-tours': '🍽️',
    'wine-tours': '🍷',
    'aurora-viewing': '🌌',
    'glacier-tours': '🏔️',
    'hot-springs': '♨️',
    zipline: '🪢',
  }

  if (!activities || activities.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3">
      {activities.map((activity) => {
        const icon = activityIcons[activity.slug] || '🏔️'
        return (
          <Link
            key={activity.id}
            href={`/activities/${activity.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <span>{icon}</span>
            <span className="font-medium text-gray-700">{activity.name}</span>
          </Link>
        )
      })}
      <Link
        href="/activities"
        className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
      >
        View All →
      </Link>
    </div>
  )
}
