'use client';

import { useState, useEffect } from 'react';
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

// ViewBox coordinates for zooming into each region
// Format: { x, y, width, height }
const regionViewBoxes: Record<string, { x: number; y: number; width: number; height: number }> = {
  western: { x: -26000, y: -8000, width: 22000, height: 22000 },
  eastern: { x: -8000, y: -2000, width: 20000, height: 18000 },
  atlantic: { x: 6000, y: -2000, width: 18000, height: 16000 },
  northern: { x: -20000, y: -16500, width: 45000, height: 18000 },
};

// Default viewBox for full Canada map
const defaultViewBox = { x: -26000, y: -16500, width: 60000, height: 36000 };

// Type for province data
interface ProvinceInfo {
  name: string;
  d: string;
}

const provinces = provinceData as Record<string, ProvinceInfo>;

export function CanadaMap({ locale, labels }: CanadaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [zoomingRegion, setZoomingRegion] = useState<string | null>(null);
  const [currentViewBox, setCurrentViewBox] = useState(defaultViewBox);
  const router = useRouter();

  const regions = [
    { id: 'western', slug: 'western-canada', label: labels.western },
    { id: 'eastern', slug: 'eastern-canada', label: labels.eastern },
    { id: 'atlantic', slug: 'atlantic-canada', label: labels.atlantic },
    { id: 'northern', slug: 'northern-canada', label: labels.northern },
  ];

  // Handle zoom animation and navigation
  useEffect(() => {
    if (zoomingRegion) {
      // Zoom into the region
      setCurrentViewBox(regionViewBoxes[zoomingRegion]);

      // Navigate after 3 seconds
      const timer = setTimeout(() => {
        router.push(`/${locale}/regions/${regionSlugs[zoomingRegion]}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [zoomingRegion, locale, router]);

  const handleProvinceClick = (provinceCode: string) => {
    const region = regionMapping[provinceCode];
    if (region && !zoomingRegion) {
      setZoomingRegion(region);
    }
  };

  const handleRegionClick = (slug: string) => {
    const regionId = regions.find(r => r.slug === slug)?.id;
    if (regionId && !zoomingRegion) {
      setZoomingRegion(regionId);
    }
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

  const viewBoxString = `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Map container - no background, sits on page beige */}
      <div className="relative overflow-hidden rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBoxString}
          className="w-full h-auto transition-all duration-1000 ease-in-out"
          role="img"
          aria-label="Interactive map of Canada showing four regions"
          style={{ minHeight: '300px' }}
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

      {/* Zooming indicator */}
      {zoomingRegion && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 font-medium">
              Exploring {regions.find(r => r.id === zoomingRegion)?.label}...
            </span>
          </div>
        </div>
      )}

      {/* Legend buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {regions.map((region) => {
          const isHovered = hoveredRegion === region.id;
          const isZooming = zoomingRegion === region.id;
          return (
            <button
              key={`legend-${region.id}`}
              onClick={() => handleRegionClick(region.slug)}
              onMouseEnter={() => !zoomingRegion && setHoveredRegion(region.id)}
              onMouseLeave={() => !zoomingRegion && setHoveredRegion(null)}
              disabled={!!zoomingRegion}
              className={cn(
                'px-5 py-2.5 rounded-full font-medium transition-all duration-300 border-2',
                isZooming
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg scale-105'
                  : isHovered
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg scale-105'
                  : zoomingRegion
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
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
