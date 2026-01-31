import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { ListingCard } from '@/components/listings/ListingCard'
import { RegionalMap } from '@/components/marketing/RegionalMap'
import { ChevronLeft, MapPin } from 'lucide-react'

// Map region slugs to region IDs for the map component
const regionSlugToId: Record<string, 'western' | 'eastern' | 'atlantic' | 'northern'> = {
  'western-canada': 'western',
  'eastern-canada': 'eastern',
  'atlantic-canada': 'atlantic',
  'northern-canada': 'northern',
}

interface RegionPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

// Region data with images and descriptions
// Photo credits:
// - Western Canada: Nunzio Guerrera (Pexels)
// - Eastern Canada: Felix-Antoine Coutu (Pexels)
// - Atlantic Canada: Daniel Battersby (Pexels)
// - Northern Canada: Rigo Olvera (Pexels)
const regionData: Record<
  string,
  { image: string; description: string; highlights: string[] }
> = {
  // Regional groupings
  'western-canada': {
    image: '/images/western-canada.jpg',
    description:
      'Western Canada encompasses the majestic Rocky Mountains, pristine Pacific coastlines, and endless prairie skies. From British Columbia\'s ancient rainforests to Alberta\'s world-famous national parks and the vast northern reaches of Saskatchewan and Manitoba, this region offers unparalleled wilderness adventures.',
    highlights: ['Rocky Mountains', 'Pacific Coast', 'National Parks', 'Prairie Skies'],
  },
  'eastern-canada': {
    image: '/images/eastern-canada.jpg',
    description:
      'Eastern Canada blends vibrant cities with breathtaking natural beauty. Experience Ontario\'s Great Lakes and cottage country, Quebec\'s stunning fall colours and French-Canadian culture, from the thundering Niagara Falls to the historic streets of Old Quebec City.',
    highlights: ['Niagara Falls', 'Algonquin Park', 'Quebec City', 'Fall Colours'],
  },
  'atlantic-canada': {
    image: '/images/atlantic-canada.jpg',
    description:
      'Atlantic Canada offers dramatic coastlines, the world\'s highest tides at the Bay of Fundy, and warm maritime hospitality. Explore Nova Scotia\'s iconic lighthouses, Prince Edward Island\'s red sand beaches, New Brunswick\'s covered bridges, and Newfoundland\'s ancient Viking history.',
    highlights: ['Bay of Fundy', 'Cabot Trail', 'Lighthouses', 'Icebergs'],
  },
  'northern-canada': {
    image: '/images/northern-canada.jpg',
    description:
      'Canada\'s Northern territories represent the last true frontier on Earth. Experience spectacular northern lights displays in the Yukon, pristine Arctic wilderness in the Northwest Territories, and authentic Inuit culture in Nunavut. This is adventure at its most raw and magnificent.',
    highlights: ['Northern Lights', 'Arctic Wildlife', 'Inuit Culture', 'Midnight Sun'],
  },
  // Individual provinces
  'british-columbia': {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
    description:
      'British Columbia offers an incredible diversity of landscapes, from the rugged Pacific coastline to the towering peaks of the Rocky Mountains. Experience world-class skiing, kayaking through pristine waters, and wildlife encounters in ancient rainforests.',
    highlights: ['Rocky Mountains', 'Pacific Coast', 'Rainforests', 'Whale Watching'],
  },
  alberta: {
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200',
    description:
      'Home to the Canadian Rockies and vast prairies, Alberta is a land of dramatic contrasts. Explore the iconic Banff and Jasper National Parks, encounter dinosaur history in the Badlands, and experience authentic western culture.',
    highlights: ['Banff National Park', 'Jasper National Park', 'Calgary Stampede', 'Badlands'],
  },
  saskatchewan: {
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
    description:
      'Saskatchewan is known for its endless skies, pristine northern lakes, and rich Indigenous heritage. Discover world-class fishing, northern lights viewing, and the tranquility of the boreal forest.',
    highlights: ['Northern Lakes', 'Aurora Borealis', 'Indigenous Culture', 'Prairie Skies'],
  },
  manitoba: {
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200',
    description:
      "Manitoba is the polar bear capital of the world and a gateway to Canada's north. Experience incredible wildlife encounters, paddle pristine boreal waterways, and explore vibrant Indigenous communities.",
    highlights: ['Polar Bears', 'Churchill', 'Boreal Wilderness', 'Northern Lights'],
  },
  ontario: {
    image: 'https://images.unsplash.com/photo-1569959220744-ff553533f492?w=1200',
    description:
      "Ontario offers everything from the thundering Niagara Falls to the pristine wilderness of Algonquin Park. Explore Great Lakes adventures, cottage country escapes, and Canada's most vibrant cities.",
    highlights: ['Niagara Falls', 'Algonquin Park', 'Muskoka', 'Great Lakes'],
  },
  quebec: {
    image: 'https://images.unsplash.com/photo-1519178614-68673b201f36?w=1200',
    description:
      "Quebec blends European charm with North American wilderness. Experience the historic streets of Quebec City, paddle the Saguenay Fjord, and discover French-Canadian culture in Canada's largest province.",
    highlights: ['Quebec City', 'Saguenay Fjord', 'Laurentians', 'Gaspésie'],
  },
  'new-brunswick': {
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200',
    description:
      "New Brunswick is home to the highest tides in the world at the Bay of Fundy. Explore coastal adventures, covered bridges, and the warm Acadian culture of Canada's Maritime provinces.",
    highlights: ['Bay of Fundy', 'Covered Bridges', 'Acadian Culture', 'Coastal Trails'],
  },
  'nova-scotia': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    description:
      'Nova Scotia offers rugged Atlantic coastlines, world-famous seafood, and rich maritime heritage. Drive the scenic Cabot Trail, explore historic Halifax, and discover charming fishing villages.',
    highlights: ['Cabot Trail', 'Halifax', 'Peggy\'s Cove', 'Cape Breton'],
  },
  'prince-edward-island': {
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200',
    description:
      "Prince Edward Island is Canada's smallest province with the biggest charm. Famous for red sand beaches, Anne of Green Gables, and some of the country's best seafood.",
    highlights: ['Red Sand Beaches', 'Anne of Green Gables', 'Fresh Seafood', 'Cycling Trails'],
  },
  'newfoundland-and-labrador': {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    description:
      'Newfoundland and Labrador is where icebergs drift by ancient fishing villages and Viking history meets raw natural beauty. Experience dramatic fjords, abundant wildlife, and unique local culture.',
    highlights: ['Icebergs', 'Viking Trail', 'Gros Morne', 'Whale Watching'],
  },
  yukon: {
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200',
    description:
      'The Yukon is the last frontier, offering pristine wilderness, incredible northern lights displays, and Gold Rush history. Adventure awaits in one of the least populated places on Earth.',
    highlights: ['Northern Lights', 'Klondike Gold Rush', 'Kluane National Park', 'Midnight Sun'],
  },
  'northwest-territories': {
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200',
    description:
      'The Northwest Territories offers some of the best aurora viewing on the planet, along with incredible Arctic adventures. Experience the midnight sun, pristine lakes, and Indigenous culture.',
    highlights: ['Aurora Viewing', 'Great Slave Lake', 'Nahanni', 'Arctic Adventures'],
  },
  nunavut: {
    image: 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=1200',
    description:
      "Nunavut is Canada's newest and largest territory, offering authentic Arctic experiences. Encounter polar bears, narwhals, and experience Inuit culture in one of the most remote places on Earth.",
    highlights: ['Arctic Wildlife', 'Inuit Culture', 'Polar Bears', 'Arctic Tundra'],
  },
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: region } = await supabase
    .from('regions')
    .select('name')
    .eq('slug', slug)
    .single()

  if (!region) {
    return {
      title: 'Region Not Found | Adventure Canada',
    }
  }

  const data = regionData[slug]

  return {
    title: `${region.name} Adventures | Adventure Canada`,
    description:
      data?.description?.slice(0, 160) ||
      `Discover outdoor adventures and tours in ${region.name}, Canada.`,
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug, locale } = await params
  const supabase = await createClient()

  // Get region details
  const { data: region, error } = await supabase
    .from('regions')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !region) {
    notFound()
  }

  // Get listings in this region
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
    .eq('region_id', region.id)
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('name')

  const data = regionData[slug] || {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
    description: `Discover outdoor adventures and tours in ${region.name}.`,
    highlights: [],
  }

  // Get activities available in this region
  const activityIds = new Set<number>()
  listings?.forEach((listing) => {
    listing.listing_activities?.forEach((la: { activity_id: number }) => {
      activityIds.add(la.activity_id)
    })
  })

  const { data: activities } = await supabase
    .from('activities')
    .select('id, name, slug')
    .in('id', Array.from(activityIds).length > 0 ? Array.from(activityIds) : [0])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={data.image}
          alt={region.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-12">
            <Link
              href={`/${locale}/regions`}
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              All Regions
            </Link>
            <h1 className="text-5xl font-bold text-white mb-4">{region.name}</h1>
            <p className="text-xl text-white/90 max-w-3xl">{data.description}</p>
            {data.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {data.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Regional Map - only show for main region pages, not individual provinces */}
        {regionSlugToId[slug] && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Explore Provinces in {region.name}
            </h2>
            <RegionalMap
              locale={locale}
              regionId={regionSlugToId[slug]}
              regionSlug={slug}
            />
          </div>
        )}

        {/* Activities in Region */}
        {activities && activities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Activities in {region.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/${locale}/activities/${activity.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  {activity.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Listings */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {listings?.length || 0} Adventures in {region.name}
          </h2>
          <Link href={`/${locale}/adventures`} className="text-primary-600 hover:text-primary-700 font-medium">
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
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No adventures found</h3>
            <p className="text-gray-600 mb-6">
              There are no adventures listed in {region.name} yet. Check back soon or explore other
              regions!
            </p>
            <Link
              href={`/${locale}/adventures`}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse All Adventures
            </Link>
          </div>
        )}

        {/* Other Regions */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Explore Other Regions</h3>
          <OtherRegions currentSlug={region.slug} locale={locale} />
        </div>
      </div>
    </div>
  )
}

async function OtherRegions({ currentSlug, locale }: { currentSlug: string; locale: string }) {
  const supabase = await createClient()

  const { data: regions } = await supabase
    .from('regions')
    .select('id, name, slug')
    .neq('slug', currentSlug)
    .limit(6)

  if (!regions || regions.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {regions.map((region) => {
        const data = regionData[region.slug] || {
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
        }

        return (
          <Link
            key={region.id}
            href={`/${locale}/regions/${region.slug}`}
            className="group relative rounded-lg overflow-hidden aspect-square"
          >
            <img
              src={data.image}
              alt={region.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-end p-3">
              <span className="text-white font-medium text-sm">{region.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
