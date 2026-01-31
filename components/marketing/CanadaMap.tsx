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
// Adjusted to ensure all provinces in each region are fully visible and centered
const regionViewBoxes: Record<string, { x: number; y: number; width: number; height: number }> = {
  western: { x: -27000, y: -14000, width: 35000, height: 32000 },   // BC, AB, SK, MB - wider to include Manitoba
  eastern: { x: -8000, y: -8000, width: 26000, height: 26000 },     // ON, QC - centered on Ontario and Quebec
  atlantic: { x: 6000, y: -4000, width: 20000, height: 18000 },     // NB, NS, PE, NL - zoomed in and centered
  northern: { x: -22000, y: -17000, width: 42000, height: 24000 },  // YT, NT, NU - centered on territories
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

    // When zooming, only show provinces in the selected region
    if (zoomingRegion && region !== zoomingRegion) {
      return 'transparent';
    }

    return isHovered ? '#9B1C31' : '#C41E3A';
  };

  const getProvinceStroke = (provinceCode: string) => {
    const region = regionMapping[provinceCode];
    const isHovered = hoveredRegion === region;

    // When zooming, only show provinces in the selected region
    if (zoomingRegion && region !== zoomingRegion) {
      return 'transparent';
    }

    return isHovered ? '#0033A0' : '#7a1528';
  };

  const getProvinceOpacity = (provinceCode: string) => {
    const region = regionMapping[provinceCode];

    // When zooming, fade out provinces not in the selected region
    if (zoomingRegion && region !== zoomingRegion) {
      return 0;
    }

    return 1;
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

            const isInZoomedRegion = zoomingRegion === region;
            const opacity = getProvinceOpacity(code);

            return (
              <path
                key={code}
                d={province.d}
                fill={getProvinceFill(code)}
                stroke={getProvinceStroke(code)}
                strokeWidth={isRegionHovered || isInZoomedRegion ? 150 : 80}
                strokeLinejoin="round"
                opacity={opacity}
                className="cursor-pointer transition-all duration-700 ease-in-out"
                style={{
                  filter: isRegionHovered && !zoomingRegion ? 'drop-shadow(0 200px 400px rgba(0, 0, 0, 0.3))' : 'none',
                }}
                onMouseEnter={() => !zoomingRegion && setHoveredRegion(region)}
                onMouseLeave={() => !zoomingRegion && setHoveredRegion(null)}
                onClick={() => handleProvinceClick(code)}
              >
                <title>{province.name}</title>
              </path>
            );
          })}
        </svg>
      </div>

      {/* Zooming indicator - positioned at bottom */}
      {zoomingRegion && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3 border border-gray-200">
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
