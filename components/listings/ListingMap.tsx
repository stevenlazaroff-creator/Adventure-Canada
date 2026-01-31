'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface ListingMapProps {
  businessName: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

// Dynamically import the map to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export function ListingMap({
  businessName,
  address,
  city,
  province,
  postalCode,
  latitude,
  longitude,
}: ListingMapProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [isLoading, setIsLoading] = useState(!coords);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Geocode address if no coordinates provided
  useEffect(() => {
    if (coords || !mounted) return;

    const geocodeAddress = async () => {
      try {
        const fullAddress = [address, city, province, postalCode, 'Canada']
          .filter(Boolean)
          .join(', ');

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
          {
            headers: {
              'User-Agent': 'AdventureCanada/1.0',
            },
          }
        );

        const data = await response.json();

        if (data && data.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        } else {
          setError('Location not found');
        }
      } catch {
        setError('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [address, city, province, postalCode, coords, mounted]);

  // Import Leaflet CSS and create custom icon on client side
  useEffect(() => {
    if (mounted) {
      import('leaflet/dist/leaflet.css');
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !coords) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">{error || 'Map not available'}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          background: #ffffff;
        }
        .leaflet-popup-content-wrapper {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid #0033A0;
        }
        .leaflet-popup-tip {
          background: #ffffff;
          border-right: 2px solid #0033A0;
          border-bottom: 2px solid #0033A0;
        }
        .leaflet-popup-content {
          margin: 8px 12px;
        }
        .custom-marker {
          background: #C41E3A;
          border: 3px solid #0033A0;
          border-radius: 50%;
          width: 24px !important;
          height: 24px !important;
        }
      `}</style>
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        {/* CartoDB Positron - clean, minimal style with mostly street names */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-gray-900" style={{ color: '#0033A0' }}>
                {businessName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {address && `${address}, `}{city}, {province}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
