'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js - only run on client
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

type Coord = { id: string; latitude: number; longitude: number; name?: string };

export default function KennelMap({ points, height = 320 }: { points: Coord[]; height?: number }) {
  const router = useRouter();
  const coords = useMemo(() => points.filter(p => isFinite(p.latitude) && isFinite(p.longitude)), [points]);
  
  if (coords.length === 0) return null;

  // Calculate center point (average of all coordinates)
  const centerLat = coords.reduce((sum, p) => sum + p.latitude, 0) / coords.length;
  const centerLng = coords.reduce((sum, p) => sum + p.longitude, 0) / coords.length;
  const center: [number, number] = [centerLat, centerLng];

  // Calculate appropriate zoom level based on spread of points
  const latRange = Math.max(...coords.map(p => p.latitude)) - Math.min(...coords.map(p => p.latitude));
  const lngRange = Math.max(...coords.map(p => p.longitude)) - Math.min(...coords.map(p => p.longitude));
  const maxRange = Math.max(latRange, lngRange);
  let zoom = 6;
  if (maxRange < 0.1) zoom = 10;
  else if (maxRange < 0.5) zoom = 8;
  else if (maxRange < 2) zoom = 7;

  return (
    <div className="rounded-lg border border-gray-300/30 overflow-hidden shadow-sm">
      {/* @ts-ignore - MapContainer only on client */}
      <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }} className="z-0">
        {/* @ts-ignore */}
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {coords.map(k => (
          // @ts-ignore
          <Marker key={k.id} position={[k.latitude, k.longitude]}>
            {/* @ts-ignore */}
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-1">{k.name || 'Kennel'}</h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/kennel/${k.id}`);
                  }}
                  className="mt-2 px-3 py-1.5 text-xs bg-white/10 text-gray-900 border border-gray-300/30 rounded hover:bg-white/20 hover:border-gray-300/50 transition-colors cursor-pointer"
                >
                  Visa kennel
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


