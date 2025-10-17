import { NextRequest, NextResponse } from 'next/server';
import { GeocodingResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: '住所が指定されていません' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps APIキーが設定されていません' },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}&language=ja`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: `Geocoding API Error: ${data.status} - ${data.error_message || ''}` },
        { status: 400 }
      );
    }

    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: '該当する住所が見つかりませんでした' },
        { status: 404 }
      );
    }

    const result: GeocodingResult = {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng,
      formatted_address: data.results[0].formatted_address,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { error: '住所の変換に失敗しました' },
      { status: 500 }
    );
  }
}
