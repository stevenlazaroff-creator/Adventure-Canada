import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface RegionCardProps {
  href: string;
  name: string;
  image?: string;
}

export function RegionCard({ href, name, image }: RegionCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl aspect-[4/3] card-hover"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-600 to-secondary-800">
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5" />
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
      </div>
    </Link>
  );
}
