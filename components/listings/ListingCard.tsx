import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle } from 'lucide-react';

interface ListingCardProps {
  listing: {
    id: string;
    slug: string;
    name: string;
    city: string | null;
    region?: { name: string } | null;
    // regions can be a single object or array depending on how Supabase returns it
    regions?: { name: string } | { name: string }[] | null;
    description_short: string | null;
    price_range: string | null;
    is_featured: boolean;
    is_verified: boolean;
    seasons?: string[] | null;
    primary_image?: string | null;
    listing_images?: { url: string; is_primary: boolean }[];
    activities?: { name: string }[];
    listing_activities?: { activity_id: number; activities: { name: string } }[];
  };
  locale?: string;
}

export function ListingCard({ listing, locale }: ListingCardProps) {
  // Get primary image from either primary_image or listing_images
  const primaryImage = listing.primary_image ||
    listing.listing_images?.find((img) => img.is_primary)?.url ||
    listing.listing_images?.[0]?.url;

  // Get region name from either region or regions (handling both object and array)
  const regionName = listing.region?.name ||
    (Array.isArray(listing.regions) ? listing.regions[0]?.name : listing.regions?.name);

  // Get activities from either activities or listing_activities
  const activities = listing.activities ||
    listing.listing_activities?.map((la) => la.activities).filter(Boolean) ||
    [];

  return (
    <Link href={`/adventures/${listing.slug}`}>
      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full">
        {/* Image */}
        <div className="aspect-[4/3] relative bg-gray-100">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {listing.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {listing.name}
            </h3>
            {listing.is_verified && (
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )}
          </div>

          {(listing.city || regionName) && (
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>
                {[listing.city, regionName].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {listing.description_short && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {listing.description_short}
            </p>
          )}

          {/* Activities */}
          {activities && activities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {activities.slice(0, 3).map((activity, idx) => (
                <span
                  key={activity.name || idx}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {activity.name}
                </span>
              ))}
              {activities.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{activities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {listing.price_range && (
            <div className="mt-3 text-sm font-medium text-gray-700">
              {listing.price_range}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
