'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import provinceData from './canadaMapData.json';

interface CanadaMapProps {
  locale: string;
  labels: {
    western: string;
    eastern: string;
    atlantic: string;
    northern: string;
  };
}

// Map provinces to regions
const regionMapping: Record<string, string> = {
  BC: 'western',
  AB: 'western',
  SK: 'western',
  MB: 'western',
  ON: 'eastern',
  QC: 'eastern',
  NB: 'atlantic',
  NS: 'atlantic',
  PE: 'atlantic',
  NL: 'atlantic',
  YT: 'northern',
  NT: 'northern',
  NU: 'northern',
};

const regionSlugs: Record<string, string> = {
  western: 'western-canada',
  eastern: 'eastern-canada',
  atlantic: 'atlantic-canada',
  northern: 'northern-canada',
};

// Type for province data
interface ProvinceInfo {
  name: string;
  d: string;
}

const provinces = provinceData as Record<string, ProvinceInfo>;

export function CanadaMap({ locale, labels }: CanadaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const router = useRouter();

  const regions = [
    { id: 'western', slug: 'western-canada', label: labels.western },
    { id: 'eastern', slug: 'eastern-canada', label: labels.eastern },
    { id: 'atlantic', slug: 'atlantic-canada', label: labels.atlantic },
    { id: 'northern', slug: 'northern-canada', label: labels.northern },
  ];

  const handleProvinceClick = (provinceCode: string) => {
    const region = regionMapping[provinceCode];
    if (region) {
      router.push(`/${locale}/browse/regions/${regionSlugs[region]}`);
    }
  };

  const handleRegionClick = (slug: string) => {
    router.push(`/${locale}/browse/regions/${slug}`);
  };

  const getProvinceFill = (provinceCode: string) => {
    const region = regionMapping[provinceCode];
    const isHovered = hoveredRegion === region;
    return isHovered ? '#9B1C31' : '#C41E3A';
  };

  const getProvinceStroke = (provinceCode: string) => {
    const region = regionMapping[provinceCode];
    const isHovered = hoveredRegion === region;
    return isHovered ? '#0033A0' : '#7a1528';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Map container - no background, sits on page beige */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-26000 -16500 60000 36000"
          className="w-full h-auto"
          role="img"
          aria-label="Interactive map of Canada showing four regions"
        >
          {/* Render each province */}
          {Object.entries(provinces).map(([code, province]) => {
            const region = regionMapping[code];
            const isRegionHovered = hoveredRegion === region;

            return (
              <path
                key={code}
                d={province.d}
                fill={getProvinceFill(code)}
                stroke={getProvinceStroke(code)}
                strokeWidth={isRegionHovered ? 150 : 80}
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isRegionHovered ? 'drop-shadow(0 200px 400px rgba(0, 0, 0, 0.3))' : 'none',
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => handleProvinceClick(code)}
              >
                <title>{province.name}</title>
              </path>
            );
          })}
        </svg>
      </div>

      {/* Legend buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {regions.map((region) => {
          const isHovered = hoveredRegion === region.id;
          return (
            <button
              key={`legend-${region.id}`}
              onClick={() => handleRegionClick(region.slug)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={cn(
                'px-5 py-2.5 rounded-full font-medium transition-all duration-300 border-2',
                isHovered
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg scale-105'
                  : 'bg-beige-100 text-gray-700 border-beige-300 hover:border-primary-400 hover:text-primary-600'
              )}
            >
              {region.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
