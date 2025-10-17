import { NextRequest, NextResponse } from 'next/server';
import { PlaceResult, Coordinates } from '@/types';

/**
 * 2点間の距離を計算（ヒュベニの公式）
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const R = 6378137; // 赤道半径
  const e = 0.0818191910428; // 第一離心率

  const radLat1 = toRad(lat1);
  const radLon1 = toRad(lng1);
  const radLat2 = toRad(lat2);
  const radLon2 = toRad(lng2);

  const dLat = radLat1 - radLat2;
  const dLon = radLon1 - radLon2;

  const p = (radLat1 + radLat2) / 2;
  const w = Math.sqrt(1 - e * e * Math.sin(p) * Math.sin(p));
  const m = (R * (1 - e * e)) / (w * w * w);
  const n = R / w;

  const d = Math.sqrt(
    Math.pow(m * dLat, 2) + Math.pow(n * Math.cos(p) * dLon, 2)
  );

  return Math.round(d);
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, radiusKm, keyword } = await request.json();

    if (!lat || !lng || !radiusKm || !keyword) {
      return NextResponse.json(
        { error: '緯度、経度、半径、キーワードが必要です' },
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

    const radiusM = radiusKm * 1000;
    let allResults: any[] = [];
    let nextPageToken: string | null = null;

    // Places APIは最大3ページまで取得可能
    for (let i = 0; i < 3; i++) {
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusM}&keyword=${encodeURIComponent(
        keyword
      )}&language=ja&key=${apiKey}`;

      if (nextPageToken) {
        url += `&pagetoken=${nextPageToken}`;
        // 連続リクエストを避けるための待機
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        return NextResponse.json(
          { error: `Places API Error: ${data.status} - ${data.error_message || ''}` },
          { status: 400 }
        );
      }

      if (data.results) {
        allResults = allResults.concat(data.results);
      }

      nextPageToken = data.next_page_token || null;
      if (!nextPageToken) break;
    }

    // 距離を計算してデータを整形
    const processedResults: PlaceResult[] = allResults.map((place) => {
      const placeLat = place.geometry.location.lat;
      const placeLng = place.geometry.location.lng;
      const distance = calculateDistance(lat, lng, placeLat, placeLng);

      return {
        name: place.name || 'N/A',
        place_id: place.place_id,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        vicinity: place.vicinity,
        geometry: {
          location: {
            lat: placeLat,
            lng: placeLng,
          },
        },
        distance,
      };
    });

    // 距離でソート
    processedResults.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return NextResponse.json({
      results: processedResults,
      count: processedResults.length,
    });
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      { error: '施設情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}
