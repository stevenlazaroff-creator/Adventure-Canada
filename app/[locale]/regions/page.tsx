import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'
import { MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Canadian Regions | Adventure Canada',
  description: 'Explore adventures by region across Canada - from the Rocky Mountains to the Atlantic coast, Northern territories to the Great Lakes.',
}

// Region images and descriptions
const regionData: Record<string, { image: string; tagline: string }> = {
  // Regional groupings
  'western-canada': {
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    tagline: 'Rocky Mountains, Pacific coast, and endless wilderness',
  },
  'eastern-canada': {
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    tagline: 'Fall colours, Great Lakes, and French-Canadian heritage',
  },
  'atlantic-canada': {
    image: 'https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=800',
    tagline: 'Rugged coastlines, lighthouses, and maritime charm',
  },
  'northern-canada': {
    image: 'https://images.unsplash.com/photo-1517783999520-f068d7431d60?w=800',
    tagline: 'Northern lights, Arctic tundra, and pristine wilderness',
  },
  // Individual provinces
  'british-columbia': {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    tagline: 'Mountains, rainforests, and Pacific coastline',
  },
  alberta: {
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800',
    tagline: 'Rocky Mountains and vast prairies',
  },
  saskatchewan: {
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    tagline: 'Northern lakes and open skies',
  },
  manitoba: {
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
    tagline: 'Polar bear capital and boreal wilderness',
  },
  ontario: {
    image: 'https://images.unsplash.com/photo-1569959220744-ff553533f492?w=800',
    tagline: 'Great Lakes and cottage country',
  },
  quebec: {
    image: 'https://images.unsplash.com/photo-1519178614-68673b201f36?w=800',
    tagline: 'French heritage and wilderness',
  },
  'new-brunswick': {
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
    tagline: 'Bay of Fundy and maritime charm',
  },
  'nova-scotia': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    tagline: 'Rugged coastlines and Acadian culture',
  },
  'prince-edward-island': {
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
    tagline: 'Red sand beaches and island charm',
  },
  'newfoundland-and-labrador': {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tagline: 'Icebergs, fjords, and Viking history',
  },
  yukon: {
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    tagline: 'Northern lights and untamed wilderness',
  },
  'northwest-territories': {
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800',
    tagline: 'Arctic adventures and midnight sun',
  },
  nunavut: {
    image: 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=800',
    tagline: 'Arctic tundra and Inuit culture',
  },
}

interface RegionsPageProps {
  params: Promise<{ locale: string }>
}

export default async function RegionsPage({ params }: RegionsPageProps) {
  const { locale } = await params
  const supabase = await createClient()

  // Get all regions with listing counts
  const { data: regions } = await supabase
    .from('regions')
    .select(
      `
      id,
      name,
      slug,
      listings(count)
    `
    )
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Explore Canada by Region</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            From coast to coast to coast, discover unique adventures in every corner of Canada.
            Each region offers its own spectacular landscapes and experiences.
          </p>
        </div>
      </div>

      {/* Map Section - Placeholder */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Interactive map coming soon</p>
        </div>
      </div>

      {/* Regions Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">All Regions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions?.map((region) => {
            const data = regionData[region.slug] || {
              image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
              tagline: 'Discover adventures in this region',
            }
            const listingCount = (region.listings as { count: number }[])?.[0]?.count || 0

            return (
              <Link
                key={region.id}
                href={`/${locale}/regions/${region.slug}`}
                className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all aspect-[4/3]"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={data.image}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{region.name}</h3>
                  <p className="text-white/80 text-sm mb-2">{data.tagline}</p>
                  <p className="text-white/60 text-sm">
                    {listingCount} {listingCount === 1 ? 'adventure' : 'adventures'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {(!regions || regions.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No regions found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
