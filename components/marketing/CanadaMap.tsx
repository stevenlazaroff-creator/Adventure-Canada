'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CanadaMapProps {
  locale: string;
  labels: {
    western: string;
    eastern: string;
    atlantic: string;
    northern: string;
  };
}

const regions = [
  {
    id: 'western',
    name: 'Western Canada',
    slug: 'western-canada',
    // BC, Alberta, Saskatchewan, Manitoba - simplified path
    path: 'M50,180 L50,350 L80,380 L180,380 L180,200 L140,180 L100,160 L50,180 Z',
  },
  {
    id: 'eastern',
    name: 'Eastern Canada',
    slug: 'eastern-canada',
    // Ontario, Quebec - simplified path
    path: 'M180,200 L180,380 L280,400 L340,350 L360,280 L340,220 L280,180 L220,180 L180,200 Z',
  },
  {
    id: 'atlantic',
    name: 'Atlantic Canada',
    slug: 'atlantic-canada',
    // NS, NB, PEI, NL - simplified path
    path: 'M340,220 L360,280 L340,350 L380,370 L420,340 L440,280 L420,240 L380,220 L340,220 Z',
  },
  {
    id: 'northern',
    name: 'Northern Canada',
    slug: 'northern-canada',
    // Yukon, NWT, Nunavut - simplified path
    path: 'M50,50 L50,180 L100,160 L140,180 L180,200 L220,180 L280,180 L340,220 L380,220 L420,180 L440,120 L400,60 L300,40 L200,30 L100,40 L50,50 Z',
  },
];

export function CanadaMap({ locale, labels }: CanadaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const router = useRouter();

  const handleRegionClick = (slug: string) => {
    router.push(`/${locale}/browse/regions/${slug}`);
  };

  const getLabel = (id: string) => {
    switch (id) {
      case 'western':
        return labels.western;
      case 'eastern':
        return labels.eastern;
      case 'atlantic':
        return labels.atlantic;
      case 'northern':
        return labels.northern;
      default:
        return '';
    }
  };

  // Label positions for each region
  const labelPositions: Record<string, { x: number; y: number }> = {
    western: { x: 115, y: 290 },
    eastern: { x: 270, y: 300 },
    atlantic: { x: 390, y: 300 },
    northern: { x: 240, y: 120 },
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg
        viewBox="0 0 500 450"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive map of Canada showing four regions"
      >
        {/* Background */}
        <rect width="500" height="450" fill="transparent" />

        {/* Regions */}
        {regions.map((region) => (
          <g key={region.id}>
            <path
              d={region.path}
              className={cn(
                'cursor-pointer transition-all duration-300 ease-out',
                hoveredRegion === region.id
                  ? 'fill-primary-600 stroke-secondary-600 scale-105 origin-center'
                  : 'fill-primary-500 stroke-secondary-600'
              )}
              strokeWidth="3"
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(region.slug)}
              style={{
                transform: hoveredRegion === region.id ? 'scale(1.03)' : 'scale(1)',
                transformOrigin: 'center',
                transformBox: 'fill-box',
              }}
            />
            {/* Region label */}
            <text
              x={labelPositions[region.id].x}
              y={labelPositions[region.id].y}
              className={cn(
                'pointer-events-none font-semibold transition-all duration-300',
                hoveredRegion === region.id ? 'fill-white text-sm' : 'fill-white/90 text-xs'
              )}
              textAnchor="middle"
              fontSize={hoveredRegion === region.id ? '14' : '12'}
            >
              {getLabel(region.id)}
            </text>
          </g>
        ))}
      </svg>

      {/* Hover tooltip */}
      {hoveredRegion && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-secondary-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
          {getLabel(hoveredRegion)}
          <span className="text-white/70 ml-2">→ Click to explore</span>
        </div>
      )}
    </div>
  );
}
