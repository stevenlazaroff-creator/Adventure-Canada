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

// Simplified but recognizable SVG paths for Canadian regions
// Based on actual geographic boundaries

const regionPaths = {
  // Western Canada: BC, AB, SK, MB
  western: `
    M 89 295
    L 89 193
    L 99 178
    L 88 161
    L 93 143
    L 110 147
    L 125 137
    L 130 147
    L 145 147
    L 160 147
    L 175 147
    L 190 147
    L 205 147
    L 220 155
    L 220 175
    L 220 195
    L 220 215
    L 220 235
    L 220 255
    L 220 275
    L 220 295
    L 205 305
    L 190 310
    L 175 305
    L 160 295
    L 145 295
    L 130 295
    L 115 295
    L 100 295
    Z
  `,

  // Eastern Canada: ON, QC
  eastern: `
    M 220 295
    L 220 275
    L 220 255
    L 220 235
    L 220 215
    L 220 195
    L 220 175
    L 220 155
    L 235 147
    L 250 147
    L 265 147
    L 280 150
    L 295 155
    L 310 160
    L 325 170
    L 335 185
    L 345 200
    L 350 220
    L 355 240
    L 355 255
    L 350 270
    L 345 285
    L 335 295
    L 320 300
    L 305 305
    L 290 310
    L 275 315
    L 260 320
    L 245 315
    L 230 305
    L 220 295
    Z
  `,

  // Atlantic Canada: NS, NB, PEI, NL
  atlantic: `
    M 355 255
    L 350 270
    L 345 285
    L 360 290
    L 375 295
    L 385 285
    L 395 275
    L 405 280
    L 415 290
    L 410 305
    L 400 315
    L 385 320
    L 370 315
    L 360 305
    L 355 290
    L 355 275
    Z
    M 420 230
    L 435 220
    L 450 225
    L 460 240
    L 455 260
    L 440 275
    L 420 280
    L 405 270
    L 400 250
    L 410 235
    Z
  `,

  // Northern Canada: YT, NT, NU
  northern: `
    M 89 193
    L 89 140
    L 89 100
    L 100 80
    L 120 65
    L 145 55
    L 175 50
    L 210 50
    L 245 55
    L 280 65
    L 310 80
    L 335 100
    L 355 120
    L 370 145
    L 380 170
    L 385 195
    L 380 215
    L 370 230
    L 355 240
    L 350 220
    L 345 200
    L 335 185
    L 325 170
    L 310 160
    L 295 155
    L 280 150
    L 265 147
    L 250 147
    L 235 147
    L 220 155
    L 205 147
    L 190 147
    L 175 147
    L 160 147
    L 145 147
    L 130 147
    L 125 137
    L 110 147
    L 93 143
    L 88 161
    L 99 178
    L 89 193
    Z
    M 300 90
    L 320 85
    L 345 90
    L 365 100
    L 380 115
    L 385 135
    L 375 150
    L 355 155
    L 335 150
    L 320 135
    L 310 115
    L 300 95
    Z
  `,
};

export function CanadaMap({ locale, labels }: CanadaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const router = useRouter();

  const handleRegionClick = (slug: string) => {
    router.push(`/${locale}/browse/regions/${slug}`);
  };

  const regions = [
    { id: 'northern', slug: 'northern-canada', path: regionPaths.northern, label: labels.northern },
    { id: 'western', slug: 'western-canada', path: regionPaths.western, label: labels.western },
    { id: 'eastern', slug: 'eastern-canada', path: regionPaths.eastern, label: labels.eastern },
    { id: 'atlantic', slug: 'atlantic-canada', path: regionPaths.atlantic, label: labels.atlantic },
  ];

  // Label positions for each region
  const labelPositions: Record<string, { x: number; y: number }> = {
    western: { x: 155, y: 230 },
    eastern: { x: 290, y: 250 },
    atlantic: { x: 400, y: 290 },
    northern: { x: 240, y: 110 },
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg
        viewBox="0 0 500 380"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive map of Canada showing four regions"
      >
        {/* Ocean background */}
        <rect width="500" height="380" fill="#e8f4f8" rx="8" />

        {/* Render each region */}
        {regions.map((region) => {
          const isHovered = hoveredRegion === region.id;
          return (
            <g key={region.id}>
              <path
                d={region.path}
                className="cursor-pointer transition-all duration-300"
                fill={isHovered ? '#9B1C31' : '#C41E3A'}
                stroke="#1E3A5F"
                strokeWidth={isHovered ? "3" : "2"}
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transformOrigin: 'center',
                  transformBox: 'fill-box',
                  filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' : 'none',
                }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => handleRegionClick(region.slug)}
              />
            </g>
          );
        })}

        {/* Region labels */}
        {regions.map((region) => {
          const isHovered = hoveredRegion === region.id;
          return (
            <text
              key={`label-${region.id}`}
              x={labelPositions[region.id].x}
              y={labelPositions[region.id].y}
              className="pointer-events-none select-none"
              textAnchor="middle"
              fontSize={isHovered ? '13' : '11'}
              fontWeight="600"
              fill="white"
              style={{
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
              }}
            >
              {region.label}
            </text>
          );
        })}

        {/* USA label for context */}
        <text
          x="180"
          y="350"
          className="pointer-events-none select-none"
          textAnchor="middle"
          fontSize="10"
          fill="#94a3b8"
          fontStyle="italic"
        >
          United States
        </text>
      </svg>

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
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:text-primary-600'
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
