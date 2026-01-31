'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import provinceData from './canadaMapData.json';

interface RegionalMapProps {
  locale: string;
  regionId: 'western' | 'eastern' | 'atlantic' | 'northern';
  regionSlug: string;
}

// Map provinces to regions
const regionProvinces: Record<string, string[]> = {
  western: ['BC', 'AB', 'SK', 'MB'],
  eastern: ['ON', 'QC'],
  atlantic: ['NB', 'NS', 'PE', 'NL'],
  northern: ['YT', 'NT', 'NU'],
};

// Province codes to full names for display
const provinceNames: Record<string, string> = {
  BC: 'British Columbia',
  AB: 'Alberta',
  SK: 'Saskatchewan',
  MB: 'Manitoba',
  ON: 'Ontario',
  QC: 'Quebec',
  NB: 'New Brunswick',
  NS: 'Nova Scotia',
  PE: 'Prince Edward Island',
  NL: 'Newfoundland and Labrador',
  YT: 'Yukon',
  NT: 'Northwest Territories',
  NU: 'Nunavut',
};

// Province codes to URL slugs
const provinceSlugs: Record<string, string> = {
  BC: 'british-columbia',
  AB: 'alberta',
  SK: 'saskatchewan',
  MB: 'manitoba',
  ON: 'ontario',
  QC: 'quebec',
  NB: 'new-brunswick',
  NS: 'nova-scotia',
  PE: 'prince-edward-island',
  NL: 'newfoundland-and-labrador',
  YT: 'yukon',
  NT: 'northwest-territories',
  NU: 'nunavut',
};

// ViewBox coordinates for each region (zoomed in)
// Adjusted to ensure all provinces in each region are fully visible and centered
const regionViewBoxes: Record<string, string> = {
  western: '-27000 -14000 35000 32000',   // BC, AB, SK, MB
  eastern: '-8000 -8000 26000 26000',     // ON, QC - centered on Ontario and Quebec
  atlantic: '6000 -4000 20000 18000',      // NB, NS, PE, NL - zoomed in and centered
  northern: '-22000 -17000 42000 24000',  // YT, NT, NU - centered on territories
};

// Type for province data
interface ProvinceInfo {
  name: string;
  d: string;
}

const provinces = provinceData as Record<string, ProvinceInfo>;

export function RegionalMap({ locale, regionId, regionSlug }: RegionalMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const router = useRouter();

  const regionProvinceList = regionProvinces[regionId] || [];

  const handleProvinceClick = (provinceCode: string) => {
    // Navigate to adventures filtered by province
    router.push(`/${locale}/adventures?province=${provinceSlugs[provinceCode]}`);
  };

  const getProvinceFill = (provinceCode: string) => {
    const isHovered = hoveredProvince === provinceCode;
    const isInRegion = regionProvinceList.includes(provinceCode);

    if (!isInRegion) {
      return '#e5e7eb'; // Gray for provinces outside this region
    }
    return isHovered ? '#9B1C31' : '#C41E3A';
  };

  const getProvinceStroke = (provinceCode: string) => {
    const isHovered = hoveredProvince === provinceCode;
    const isInRegion = regionProvinceList.includes(provinceCode);

    if (!isInRegion) {
      return '#d1d5db';
    }
    return isHovered ? '#0033A0' : '#7a1528';
  };

  const getProvinceOpacity = (provinceCode: string) => {
    const isInRegion = regionProvinceList.includes(provinceCode);
    return isInRegion ? 1 : 0.3;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Map container */}
      <div className="relative overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={regionViewBoxes[regionId]}
          className="w-full h-auto"
          role="img"
          aria-label={`Interactive map of ${regionId} Canada showing provinces`}
          style={{ minHeight: '280px' }}
        >
          {/* Render all provinces but highlight only region ones */}
          {Object.entries(provinces).map(([code, province]) => {
            const isInRegion = regionProvinceList.includes(code);

            return (
              <path
                key={code}
                d={province.d}
                fill={getProvinceFill(code)}
                stroke={getProvinceStroke(code)}
                strokeWidth={isInRegion && hoveredProvince === code ? 150 : 80}
                strokeLinejoin="round"
                opacity={getProvinceOpacity(code)}
                className={cn(
                  'transition-all duration-200',
                  isInRegion ? 'cursor-pointer' : 'cursor-default'
                )}
                style={{
                  filter: isInRegion && hoveredProvince === code
                    ? 'drop-shadow(0 200px 400px rgba(0, 0, 0, 0.3))'
                    : 'none',
                }}
                onMouseEnter={() => isInRegion && setHoveredProvince(code)}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => isInRegion && handleProvinceClick(code)}
              >
                <title>{province.name}</title>
              </path>
            );
          })}
        </svg>
      </div>

      {/* Province legend buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {regionProvinceList.map((code) => {
          const isHovered = hoveredProvince === code;
          return (
            <button
              key={`legend-${code}`}
              onClick={() => handleProvinceClick(code)}
              onMouseEnter={() => setHoveredProvince(code)}
              onMouseLeave={() => setHoveredProvince(null)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border-2',
                isHovered
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:text-primary-600'
              )}
            >
              {provinceNames[code]}
            </button>
          );
        })}
      </div>

      {/* Hover info */}
      {hoveredProvince && regionProvinceList.includes(hoveredProvince) && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Click to view adventures in {provinceNames[hoveredProvince]}
        </p>
      )}
    </div>
  );
}
