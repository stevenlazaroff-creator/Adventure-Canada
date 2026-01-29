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

export function CanadaMap({ locale, labels }: CanadaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const router = useRouter();

  const handleRegionClick = (slug: string) => {
    router.push(`/${locale}/browse/regions/${slug}`);
  };

  const regions = [
    { id: 'northern', slug: 'northern-canada', label: labels.northern },
    { id: 'western', slug: 'western-canada', label: labels.western },
    { id: 'eastern', slug: 'eastern-canada', label: labels.eastern },
    { id: 'atlantic', slug: 'atlantic-canada', label: labels.atlantic },
  ];

  // Label positions for each region
  const labelPositions: Record<string, { x: number; y: number }> = {
    western: { x: 115, y: 225 },
    eastern: { x: 295, y: 235 },
    atlantic: { x: 405, y: 230 },
    northern: { x: 220, y: 85 },
  };

  const getRegionStyle = (regionId: string) => {
    const isHovered = hoveredRegion === regionId;
    return {
      fill: isHovered ? '#9B1C31' : '#C41E3A',
      stroke: '#1E3A5F',
      strokeWidth: isHovered ? 2.5 : 1.5,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' : 'none',
      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      transformOrigin: 'center',
      transformBox: 'fill-box' as const,
    };
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg
        viewBox="0 0 500 340"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive map of Canada showing four regions"
      >
        {/* Ocean background */}
        <rect width="500" height="340" fill="#cde4ed" rx="8" />

        {/* Hudson Bay */}
        <path
          d="M 230 140 Q 250 150, 260 180 Q 265 210, 250 235 Q 235 250, 210 245 Q 190 235, 195 210 Q 200 180, 210 160 Q 220 145, 230 140 Z"
          fill="#b8d4e0"
        />

        {/* NORTHERN CANADA - YT, NT, NU and Arctic Islands */}
        <g
          onMouseEnter={() => setHoveredRegion('northern')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('northern-canada')}
          style={getRegionStyle('northern')}
        >
          {/* Mainland Northern Territories */}
          <path d="
            M 55 145
            L 55 115 L 60 95 L 70 75 L 85 60 L 105 50 L 130 45
            L 160 42 L 190 45 L 220 50 L 250 60 L 275 75
            L 295 92 L 310 112 L 320 135
            L 330 140 L 340 135 L 355 132 L 370 140
            L 378 155 L 375 175 L 360 190 L 340 195
            L 320 190 L 305 175 L 300 155
            L 295 145 L 280 140 L 265 142 L 250 140 L 235 142
            L 230 140
            L 210 160 L 200 180 L 195 210 L 200 235 L 210 245
            L 195 250 L 180 245 L 170 235 L 168 220 L 172 200
            L 180 180 L 185 160 L 180 145
            L 165 142 L 150 145 L 135 142 L 120 145 L 105 142
            L 90 145 L 75 142 L 60 145 L 55 145
            Z
          " />
          {/* Victoria Island */}
          <ellipse cx="180" cy="55" rx="35" ry="18" />
          {/* Baffin Island */}
          <path d="
            M 340 45 Q 365 40, 390 50 Q 415 65, 425 90
            Q 430 115, 420 140 Q 405 160, 380 165
            Q 355 165, 340 150 Q 330 130, 335 105
            Q 340 75, 340 45
            Z
          " />
          {/* Ellesmere Island */}
          <ellipse cx="330" cy="25" rx="25" ry="12" />
        </g>

        {/* WESTERN CANADA - BC, AB, SK, MB */}
        <g
          onMouseEnter={() => setHoveredRegion('western')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('western-canada')}
          style={getRegionStyle('western')}
        >
          {/* Main Western provinces */}
          <path d="
            M 55 145
            L 60 145 L 75 142 L 90 145 L 105 142 L 120 145
            L 135 142 L 150 145 L 165 142 L 180 145
            L 180 160 L 180 180 L 180 200 L 180 220 L 180 240
            L 180 260 L 180 280
            L 165 280 L 150 280 L 135 280 L 120 280 L 105 280
            L 90 280 L 75 280 L 60 280 L 50 280
            L 48 265 L 45 250 L 42 235 L 45 220 L 42 205
            L 48 190 L 52 175 L 55 160 L 55 145
            Z
          " />
          {/* Vancouver Island */}
          <ellipse cx="38" cy="248" rx="10" ry="25" />
          {/* Haida Gwaii */}
          <ellipse cx="32" cy="200" rx="6" ry="12" />
        </g>

        {/* EASTERN CANADA - ON, QC */}
        <g
          onMouseEnter={() => setHoveredRegion('eastern')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('eastern-canada')}
          style={getRegionStyle('eastern')}
        >
          <path d="
            M 180 280
            L 180 260 L 180 240 L 180 220 L 180 200 L 180 180
            L 180 160 L 180 145
            L 185 160 L 195 180 L 200 200 L 200 215
            L 200 235
            L 210 245 L 220 250 L 235 250
            L 260 248 L 280 245 L 295 250
            L 300 235 L 302 220 L 300 205
            L 305 190 L 315 175 L 330 165
            L 340 170 L 352 180 L 358 195 L 355 210
            L 348 225 L 338 238 L 325 250
            L 312 260 L 298 268 L 282 275 L 265 280
            L 248 285 L 232 288 L 215 285 L 200 282
            L 180 280
            Z
          " />
          {/* Great Lakes cutouts (showing as water) */}
        </g>

        {/* Great Lakes (drawn on top as water) */}
        <ellipse cx="210" cy="275" rx="12" ry="8" fill="#b8d4e0" />
        <ellipse cx="235" cy="278" rx="10" ry="6" fill="#b8d4e0" />
        <ellipse cx="255" cy="282" rx="8" ry="5" fill="#b8d4e0" />

        {/* ATLANTIC CANADA - NS, NB, PEI, NL */}
        <g
          onMouseEnter={() => setHoveredRegion('atlantic')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('atlantic-canada')}
          style={getRegionStyle('atlantic')}
        >
          {/* Labrador */}
          <path d="
            M 355 210
            L 358 195 L 365 180 L 378 170 L 392 175
            L 400 190 L 395 210 L 382 225 L 365 230 L 355 220 L 355 210
            Z
          " />
          {/* Newfoundland */}
          <path d="
            M 420 185
            Q 438 178, 450 190 Q 460 205, 455 225
            Q 448 245, 430 250 Q 412 248, 405 232
            Q 402 215, 412 198 Q 418 188, 420 185
            Z
          " />
          {/* New Brunswick / Nova Scotia area */}
          <path d="
            M 350 240
            L 365 235 L 378 242 L 385 255 L 380 270
            L 368 278 L 352 275 L 345 260 L 350 240
            Z
          " />
          {/* Nova Scotia peninsula */}
          <path d="
            M 385 255
            L 395 248 L 408 252 L 418 265 L 415 280
            L 402 290 L 388 285 L 382 272 L 385 255
            Z
          " />
          {/* PEI */}
          <ellipse cx="392" cy="238" rx="12" ry="5" />
          {/* Cape Breton */}
          <ellipse cx="420" cy="245" rx="8" ry="10" />
        </g>

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
                textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {region.label}
            </text>
          );
        })}

        {/* USA label */}
        <text
          x="130"
          y="315"
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
