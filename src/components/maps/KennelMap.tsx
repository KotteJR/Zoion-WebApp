'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

type Coord = { id: string; latitude: number; longitude: number; name?: string };

export default function KennelMap({ points, height = 320 }: { points: Coord[]; height?: number }) {
  const coords = useMemo(() => points.filter(p => isFinite(p.latitude) && isFinite(p.longitude)), [points]);
  if (coords.length === 0) return null;

  const center: [number, number] = [coords[0].latitude, coords[0].longitude];

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* @ts-ignore - MapContainer only on client */}
      <MapContainer center={center} zoom={6} style={{ height, width: '100%' }}>
        {/* @ts-ignore */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords.map(k => (
          // @ts-ignore
          <Marker key={k.id} position={[k.latitude, k.longitude]} />
        ))}
      </MapContainer>
    </div>
  );
}


