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

// Accurate vector paths for Canadian regions based on geographic boundaries
const paths = {
  // Western Canada: British Columbia, Alberta, Saskatchewan, Manitoba
  western: {
    // British Columbia mainland
    bc: "M 52 248 L 48 238 L 44 225 L 42 210 L 45 195 L 43 180 L 48 165 L 52 152 L 58 142 L 62 135 L 58 128 L 62 120 L 68 115 L 68 118 L 72 115 L 76 118 L 80 115 L 80 280 L 52 280 Z",
    // Vancouver Island
    vancouverIsland: "M 35 265 Q 32 255, 34 245 Q 36 235, 40 228 Q 44 235, 44 245 Q 44 255, 40 262 Q 38 266, 35 265 Z",
    // Haida Gwaii
    haidaGwaii: "M 30 195 Q 28 188, 30 182 Q 33 188, 33 195 Q 32 200, 30 195 Z",
    // Alberta
    alberta: "M 80 115 L 80 280 L 115 280 L 115 115 Z",
    // Saskatchewan
    saskatchewan: "M 115 115 L 115 280 L 150 280 L 150 115 Z",
    // Manitoba
    manitoba: "M 150 115 L 150 280 L 185 275 L 190 265 L 188 255 L 192 245 L 188 235 L 185 220 L 182 200 L 185 180 L 190 165 L 185 150 L 180 135 L 175 120 L 170 115 Z",
  },

  // Eastern Canada: Ontario, Quebec
  eastern: {
    // Ontario
    ontario: "M 170 115 L 175 120 L 180 135 L 185 150 L 190 165 L 185 180 L 182 200 L 185 220 L 188 235 L 192 245 L 188 255 L 190 265 L 185 275 L 190 285 L 200 290 L 212 288 L 220 282 L 225 275 L 222 268 L 228 262 L 235 258 L 240 250 L 238 242 L 242 235 L 250 232 L 255 225 L 252 218 L 248 210 L 250 200 L 255 190 L 260 180 L 258 170 L 252 162 L 245 155 L 238 150 L 230 148 L 222 150 L 215 145 L 210 138 L 205 130 L 200 122 L 195 118 L 188 115 Z",
    // Quebec
    quebec: "M 245 155 L 252 162 L 258 170 L 260 180 L 255 190 L 250 200 L 248 210 L 252 218 L 255 225 L 250 232 L 255 240 L 262 248 L 270 255 L 280 260 L 290 262 L 298 258 L 305 250 L 310 242 L 315 235 L 320 240 L 328 245 L 335 242 L 340 235 L 338 225 L 335 215 L 340 205 L 348 195 L 355 185 L 358 175 L 355 165 L 348 155 L 340 148 L 330 142 L 320 138 L 310 135 L 300 133 L 290 132 L 280 135 L 270 140 L 262 145 L 255 150 Z",
  },

  // Atlantic Canada: New Brunswick, Nova Scotia, PEI, Newfoundland & Labrador
  atlantic: {
    // Labrador
    labrador: "M 355 185 L 358 175 L 355 165 L 348 155 L 365 150 L 380 148 L 395 152 L 408 160 L 415 172 L 418 185 L 415 198 L 408 208 L 398 215 L 385 218 L 372 215 L 362 205 L 355 195 Z",
    // Newfoundland island
    newfoundland: "M 420 178 Q 432 172, 445 175 Q 458 180, 465 192 Q 470 205, 468 220 Q 464 235, 452 245 Q 438 252, 422 248 Q 408 242, 402 228 Q 398 215, 405 200 Q 412 186, 420 178 Z",
    // New Brunswick
    newBrunswick: "M 335 242 L 340 235 L 350 238 L 358 245 L 362 255 L 358 265 L 350 272 L 340 270 L 335 262 L 332 252 Z",
    // Nova Scotia
    novaScotia: "M 358 265 L 365 260 L 375 262 L 385 268 L 392 278 L 388 288 L 378 295 L 365 292 L 358 282 L 355 272 Z",
    // Cape Breton
    capeBreton: "M 392 255 Q 400 250, 410 255 Q 418 262, 418 272 Q 415 282, 405 285 Q 395 285, 390 275 Q 388 265, 392 255 Z",
    // PEI
    pei: "M 365 248 Q 372 245, 382 246 Q 390 248, 390 252 Q 388 256, 378 256 Q 368 255, 365 252 Q 364 250, 365 248 Z",
  },

  // Northern Canada: Yukon, Northwest Territories, Nunavut
  northern: {
    // Yukon
    yukon: "M 52 152 L 58 142 L 62 135 L 58 128 L 62 120 L 68 115 L 68 95 L 65 80 L 60 65 L 55 52 L 52 45 L 48 52 L 45 65 L 42 80 L 40 95 L 42 110 L 45 125 L 48 140 Z",
    // Northwest Territories mainland
    nwt: "M 68 115 L 72 115 L 76 118 L 80 115 L 115 115 L 150 115 L 170 115 L 188 115 L 195 100 L 200 85 L 198 70 L 192 55 L 182 42 L 170 32 L 155 25 L 138 22 L 120 22 L 102 25 L 85 32 L 72 42 L 65 55 L 62 70 L 65 85 L 68 100 Z",
    // Nunavut mainland (around Hudson Bay)
    nunavutMainland: "M 188 115 L 195 118 L 200 122 L 205 130 L 210 138 L 215 145 L 222 150 L 230 148 L 238 150 L 245 155 L 255 150 L 262 145 L 270 140 L 280 135 L 290 132 L 300 133 L 310 135 L 320 138 L 330 142 L 340 148 L 348 155 L 365 150 L 380 148 L 395 152 L 395 140 L 390 125 L 382 110 L 370 95 L 355 82 L 338 72 L 318 65 L 298 60 L 278 58 L 258 60 L 240 65 L 225 72 L 212 82 L 202 95 L 195 108 Z",
    // Victoria Island
    victoriaIsland: "M 135 58 Q 155 52, 178 55 Q 200 60, 210 72 Q 215 82, 210 92 Q 200 100, 178 98 Q 155 95, 142 85 Q 132 75, 135 58 Z",
    // Banks Island
    banksIsland: "M 85 55 Q 98 48, 112 52 Q 122 58, 120 70 Q 115 80, 100 82 Q 88 80, 82 70 Q 80 60, 85 55 Z",
    // Baffin Island
    baffinIsland: "M 330 40 Q 355 32, 382 38 Q 408 48, 425 68 Q 438 90, 440 115 Q 438 140, 425 158 Q 408 172, 385 175 Q 362 172, 345 155 Q 332 138, 328 115 Q 326 90, 328 65 Q 330 50, 330 40 Z",
    // Ellesmere Island
    ellesmereIsland: "M 310 18 Q 330 12, 352 15 Q 372 20, 378 32 Q 380 42, 370 50 Q 355 55, 335 52 Q 318 48, 310 38 Q 305 28, 310 18 Z",
    // Devon Island
    devonIsland: "M 275 38 Q 292 32, 308 38 Q 318 45, 315 58 Q 308 68, 290 68 Q 275 65, 270 55 Q 268 45, 275 38 Z",
    // Southampton Island
    southamptonIsland: "M 225 105 Q 242 98, 258 102 Q 270 110, 268 122 Q 262 132, 245 135 Q 228 132, 222 122 Q 218 112, 225 105 Z",
  },
};

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

  const labelPositions: Record<string, { x: number; y: number }> = {
    western: { x: 100, y: 200 },
    eastern: { x: 270, y: 200 },
    atlantic: { x: 400, y: 220 },
    northern: { x: 220, y: 75 },
  };

  const getRegionStyle = (regionId: string) => {
    const isHovered = hoveredRegion === regionId;
    return {
      fill: isHovered ? '#9B1C31' : '#C41E3A',
      stroke: '#1E3A5F',
      strokeWidth: isHovered ? 2 : 1.2,
      strokeLinejoin: 'round' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' : 'none',
    };
  };

  const regionHandlers = (regionId: string, slug: string) => ({
    onMouseEnter: () => setHoveredRegion(regionId),
    onMouseLeave: () => setHoveredRegion(null),
    onClick: () => handleRegionClick(slug),
    style: getRegionStyle(regionId),
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg
        viewBox="0 0 500 320"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive map of Canada showing four regions"
      >
        {/* Ocean background */}
        <rect width="500" height="320" fill="#a8d4e6" rx="8" />

        {/* Hudson Bay */}
        <path
          d="M 195 130 Q 215 135, 232 155 Q 245 180, 248 210 Q 245 235, 230 250 Q 210 260, 190 255 Q 175 245, 172 220 Q 170 195, 178 170 Q 185 150, 195 130 Z"
          fill="#8ac4d8"
        />

        {/* James Bay */}
        <path
          d="M 230 250 Q 238 258, 245 275 Q 248 288, 242 295 Q 232 298, 222 292 Q 215 282, 218 268 Q 222 258, 230 250 Z"
          fill="#8ac4d8"
        />

        {/* Great Lakes */}
        <ellipse cx="228" cy="282" rx="8" ry="5" fill="#8ac4d8" />
        <ellipse cx="242" cy="286" rx="6" ry="4" fill="#8ac4d8" />
        <ellipse cx="255" cy="290" rx="5" ry="3" fill="#8ac4d8" />

        {/* NORTHERN CANADA */}
        <g {...regionHandlers('northern', 'northern-canada')}>
          <path d={paths.northern.yukon} />
          <path d={paths.northern.nwt} />
          <path d={paths.northern.nunavutMainland} />
          <path d={paths.northern.victoriaIsland} />
          <path d={paths.northern.banksIsland} />
          <path d={paths.northern.baffinIsland} />
          <path d={paths.northern.ellesmereIsland} />
          <path d={paths.northern.devonIsland} />
          <path d={paths.northern.southamptonIsland} />
        </g>

        {/* WESTERN CANADA */}
        <g {...regionHandlers('western', 'western-canada')}>
          <path d={paths.western.bc} />
          <path d={paths.western.vancouverIsland} />
          <path d={paths.western.haidaGwaii} />
          <path d={paths.western.alberta} />
          <path d={paths.western.saskatchewan} />
          <path d={paths.western.manitoba} />
        </g>

        {/* EASTERN CANADA */}
        <g {...regionHandlers('eastern', 'eastern-canada')}>
          <path d={paths.eastern.ontario} />
          <path d={paths.eastern.quebec} />
        </g>

        {/* ATLANTIC CANADA */}
        <g {...regionHandlers('atlantic', 'atlantic-canada')}>
          <path d={paths.atlantic.labrador} />
          <path d={paths.atlantic.newfoundland} />
          <path d={paths.atlantic.newBrunswick} />
          <path d={paths.atlantic.novaScotia} />
          <path d={paths.atlantic.capeBreton} />
          <path d={paths.atlantic.pei} />
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
              fontSize={isHovered ? '12' : '10'}
              fontWeight="600"
              fill="white"
              style={{
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {region.label}
            </text>
          );
        })}

        {/* USA label */}
        <text
          x="120"
          y="305"
          className="pointer-events-none select-none"
          textAnchor="middle"
          fontSize="9"
          fill="#5a8fa8"
          fontStyle="italic"
        >
          United States
        </text>

        {/* Atlantic Ocean label */}
        <text
          x="450"
          y="280"
          className="pointer-events-none select-none"
          textAnchor="middle"
          fontSize="8"
          fill="#5a8fa8"
          fontStyle="italic"
        >
          Atlantic
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
