import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adventure Activities | Adventure Canada',
  description: 'Explore all adventure activities available across Canada - from kayaking and hiking to wildlife tours and northern lights experiences.',
}

export default async function ActivitiesPage() {
  const supabase = await createClient()

  // Get all activities with listing counts
  const { data: activities } = await supabase
    .from('activities')
    .select(`
      id,
      name,
      slug,
      description,
      icon,
      listing_activities(count)
    `)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Adventure Activities</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Discover thrilling adventures across Canada. From water sports to winter activities,
            find your next outdoor experience.
          </p>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activities?.map((activity) => {
            const listingCount = (activity.listing_activities as { count: number }[])?.[0]?.count || 0
            const icon = activityIcons[activity.slug] || '🏔️'

            return (
              <Link
                key={activity.id}
                href={`/activities/${activity.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {activity.name}
                </h2>
                {activity.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {activity.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-3">
                  {listingCount} {listingCount === 1 ? 'adventure' : 'adventures'}
                </p>
              </Link>
            )
          })}
        </div>

        {(!activities || activities.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No activities found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
