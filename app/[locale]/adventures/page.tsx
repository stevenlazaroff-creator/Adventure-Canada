import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'
import { SearchFilters } from './SearchFilters'
import { ListingCard } from '@/components/listings/ListingCard'

interface SearchParams {
  q?: string
  activity?: string
  region?: string
  price?: string
  season?: string
}

interface AdventuresPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdventuresPage({ searchParams }: AdventuresPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Get filters data
  const [{ data: activities }, { data: regions }] = await Promise.all([
    supabase.from('activities').select('*').order('display_order'),
    supabase.from('regions').select('*').order('display_order'),
  ])

  // Build query for listings
  let query = supabase
    .from('listings')
    .select(`
      *,
      regions (id, name, slug),
      listing_images (url, is_primary, alt_text),
      listing_activities (activity_id, activities (id, name, slug))
    `)
    .eq('status', 'active')

  // Apply search filter
  if (params.q) {
    query = query.textSearch('fts', params.q, { type: 'websearch' })
  }

  // Apply region filter
  if (params.region) {
    const region = regions?.find((r) => r.slug === params.region)
    if (region) {
      query = query.eq('region_id', region.id)
    }
  }

  // Apply price filter
  if (params.price) {
    query = query.eq('price_range', params.price)
  }

  // Apply season filter
  if (params.season) {
    query = query.contains('seasons', [params.season])
  }

  // Order by featured first, then by name
  query = query.order('is_featured', { ascending: false }).order('name')

  const { data: listings } = await query

  // Filter by activity if specified (needs to be done client-side due to junction table)
  let filteredListings = listings || []
  if (params.activity) {
    const activity = activities?.find((a) => a.slug === params.activity)
    if (activity) {
      filteredListings = filteredListings.filter((listing: any) =>
        listing.listing_activities?.some((la: any) => la.activity_id === activity.id)
      )
    }
  }

  return (
    <div className="min-h-screen bg-beige-100">
      {/* Hero */}
      <div className="bg-secondary-700 text-white py-16">
        <div className="container-wide">
          <h1 className="text-4xl font-bold mb-4">Explore Adventures</h1>
          <p className="text-xl text-secondary-100 max-w-2xl">
            Discover incredible outdoor experiences across Canada. From mountain peaks to ocean shores,
            find your next adventure.
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <SearchFilters
              activities={activities || []}
              regions={regions || []}
              currentFilters={params}
            />
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{filteredListings.length}</span>{' '}
                adventure{filteredListings.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Listings grid */}
            {filteredListings.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No adventures found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your filters or search for something else
                  </p>
                  <Link
                    href="/adventures"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all filters
                  </Link>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
