import { ListingCard } from './ListingCard';

interface ListingGridProps {
  listings: Array<{
    id: string;
    slug: string;
    name: string;
    city: string | null;
    region?: { name: string } | null;
    description_short: string | null;
    price_range: string | null;
    is_featured: boolean;
    is_verified: boolean;
    primary_image?: string | null;
    activities?: { name: string }[];
  }>;
  locale: string;
  emptyMessage?: string;
}

export function ListingGrid({ listings, locale, emptyMessage }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage || 'No listings found'}</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} locale={locale} />
      ))}
    </div>
  );
}
