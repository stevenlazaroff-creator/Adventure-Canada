import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TIER_LIMITS } from '@/types'
import { InquiryForm } from './InquiryForm'
import { ImageGallery } from './ImageGallery'
import { ListingCard } from '@/components/listings/ListingCard'
import { ListingMap } from '@/components/listings/ListingMap'

interface AdventurePageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: AdventurePageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('name, description_short, city, regions(name), listing_images(url, is_primary)')
    .eq('slug', slug)
    .single()

  if (!listing) {
    return {
      title: 'Adventure Not Found | Adventure Canada',
    }
  }

  const primaryImage = listing.listing_images?.find((img: any) => img.is_primary)?.url ||
    listing.listing_images?.[0]?.url

  // Handle regions as either object or array
  const regionName = Array.isArray(listing.regions)
    ? listing.regions[0]?.name
    : (listing.regions as { name: string } | null)?.name

  return {
    title: `${listing.name} | Adventure Canada`,
    description: listing.description_short ||
      `Experience ${listing.name} in ${listing.city}${regionName ? `, ${regionName}` : ''}.`,
    openGraph: {
      title: listing.name,
      description: listing.description_short || undefined,
      images: primaryImage ? [{ url: primaryImage }] : undefined,
    },
  }
}

export default async function AdventurePage({ params }: AdventurePageProps) {
  const { slug, locale } = await params
  const supabase = await createClient()

  // Get listing with all relations
  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      regions (id, name, slug, description),
      listing_images (id, url, alt_text, is_primary, display_order),
      listing_activities (
        activity_id,
        activities (id, name, slug, icon)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !listing) {
    notFound()
  }

  // Get operator's subscription tier to check what features to show
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('operator_id', listing.operator_id)
    .single()

  const tier = subscription?.tier || 'free'
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS]

  // Sort images by display_order
  const images = listing.listing_images?.sort((a: any, b: any) =>
    a.display_order - b.display_order
  ) || []

  const activities = listing.listing_activities?.map((la: any) => la.activities) || []

  // Track view event (fire and forget)
  supabase.functions.invoke('track-analytics', {
    body: {
      listing_id: listing.id,
      event_type: 'view',
      referrer: null,
    },
  }).catch(() => {})

  return (
    <div className="min-h-screen bg-beige-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/adventures" className="text-gray-500 hover:text-gray-700">Adventures</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{listing.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {listing.name}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.city}
                    {listing.regions?.name ? `, ${listing.regions.name}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  {listing.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {listing.is_verified && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Activities */}
              {activities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activities.map((activity: any) => (
                    <Link
                      key={activity.id}
                      href={`/activities/${activity.slug}`}
                      className="bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-primary-100 transition-colors"
                    >
                      {activity.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <ImageGallery images={images} name={listing.name} />
            )}

            {/* Description */}
            {(listing.description_short || listing.description_long) && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                  {listing.description_long ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="whitespace-pre-wrap">{listing.description_long}</p>
                    </div>
                  ) : listing.description_short ? (
                    <p className="text-gray-600">{listing.description_short}</p>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
                <dl className="grid grid-cols-2 gap-4">
                  {listing.price_range && (
                    <div>
                      <dt className="text-sm text-gray-500">Price Range</dt>
                      <dd className="font-medium text-gray-900">{listing.price_range}</dd>
                    </div>
                  )}
                  {listing.seasons && listing.seasons.length > 0 && (
                    <div>
                      <dt className="text-sm text-gray-500">Seasons</dt>
                      <dd className="font-medium text-gray-900">{listing.seasons.join(', ')}</dd>
                    </div>
                  )}
                  {listing.regions && (
                    <div>
                      <dt className="text-sm text-gray-500">Region</dt>
                      <dd className="font-medium text-gray-900">
                        <Link href={`/regions/${listing.regions.slug}`} className="hover:text-primary-600">
                          {listing.regions.name}
                        </Link>
                      </dd>
                    </div>
                  )}
                  {listing.address && (
                    <div className="col-span-2">
                      <dt className="text-sm text-gray-500">Address</dt>
                      <dd className="font-medium text-gray-900">
                        {listing.address}, {listing.city} {listing.postal_code}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Location Map */}
            {listing.city && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <ListingMap
                    businessName={listing.name}
                    address={listing.address || ''}
                    city={listing.city}
                    province={listing.regions?.name || ''}
                    postalCode={listing.postal_code}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>

                <div className="space-y-4">
                  {/* Contact Email */}
                  <a
                    href={`mailto:${listing.contact_email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{listing.contact_email}</span>
                  </a>

                  {/* Phone */}
                  {limits.hasPhone && listing.phone && (
                    <a
                      href={`tel:${listing.phone}`}
                      onClick={() => {
                        supabase.functions.invoke('track-analytics', {
                          body: { listing_id: listing.id, event_type: 'phone_click' },
                        })
                      }}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{listing.phone}</span>
                    </a>
                  )}

                  {/* Website */}
                  {limits.hasWebsite && listing.website_url && (
                    <a
                      href={listing.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        supabase.functions.invoke('track-analytics', {
                          body: { listing_id: listing.id, event_type: 'website_click' },
                        })
                      }}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary-600"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {limits.hasSocialLinks && (listing.instagram_url || listing.facebook_url || listing.youtube_url) && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Follow Us</h4>
                    <div className="flex gap-3">
                      {listing.instagram_url && (
                        <a
                          href={listing.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                      {listing.facebook_url && (
                        <a
                          href={listing.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      {listing.youtube_url && (
                        <a
                          href={listing.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                {limits.hasWebsite && listing.website_url && (
                  <a
                    href={listing.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block"
                  >
                    <Button variant="primary" className="w-full">
                      Book Now
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Inquiry Form */}
            {limits.hasInquiryForm && (
              <InquiryForm listingId={listing.id} listingName={listing.name} />
            )}
          </div>
        </div>

        {/* Related Listings */}
        <RelatedListings
          currentId={listing.id}
          regionId={listing.region_id}
          activityIds={activities.map((a: any) => a.id)}
          locale={locale}
        />
      </div>
    </div>
  )
}

async function RelatedListings({
  currentId,
  regionId,
  activityIds,
  locale,
}: {
  currentId: string
  regionId: string | null
  activityIds: number[]
  locale: string
}) {
  const supabase = await createClient()

  // Get listings in the same region or with similar activities
  let query = supabase
    .from('listings')
    .select(`
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
    `)
    .eq('status', 'active')
    .neq('id', currentId)
    .limit(3)

  if (regionId) {
    query = query.eq('region_id', regionId)
  }

  const { data: listings } = await query

  if (!listings || listings.length === 0) return null

  return (
    <div className="mt-16 pt-12 border-t">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">More Adventures You Might Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} locale={locale} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          href="/adventures"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          Browse All Adventures
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
