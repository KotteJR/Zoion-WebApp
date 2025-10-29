import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOOGLE_MAPS_API_KEY' }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&region=se&key=${apiKey}`; // region bias Sweden

    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();

    if (json.status !== 'OK' || !json.results?.[0]) {
      return NextResponse.json({ error: 'Geocoding failed', status: json.status }, { status: 400 });
    }

    const loc = json.results[0].geometry.location; // { lat, lng }
    return NextResponse.json({ latitude: loc.lat, longitude: loc.lng });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


