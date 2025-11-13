import { NextRequest, NextResponse } from 'next/server';
import {
  getFuturePopulationByCode,
  getFuturePopulationByName,
  getFuturePopulationFromGeocodingResult,
} from '@/lib/futurePopulation';

/**
 * 将来人口データ取得API
 *
 * POST /api/future-population
 *
 * Request Body:
 * - { municipalityCode: string } - 市区町村コード（5桁）
 * - { municipalityName: string, prefectureName?: string } - 市区町村名と都道府県名
 * - { geocodingResult: any } - Geocoding APIのレスポンス
 *
 * Response:
 * - { success: true, data: FuturePopulationData }
 * - { success: false, error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let futurePopulationData = null;

    // 1. 市区町村コードが指定されている場合
    if (body.municipalityCode) {
      futurePopulationData = getFuturePopulationByCode(body.municipalityCode);
    }
    // 2. 市区町村名が指定されている場合
    else if (body.municipalityName) {
      futurePopulationData = getFuturePopulationByName(
        body.municipalityName,
        body.prefectureName
      );
    }
    // 3. Geocoding APIの結果が渡されている場合
    else if (body.geocodingResult) {
      futurePopulationData = getFuturePopulationFromGeocodingResult(body.geocodingResult);
    }
    // 4. 何も指定されていない場合はエラー
    else {
      return NextResponse.json(
        {
          success: false,
          error:
            'municipalityCode, municipalityName, または geocodingResult のいずれかを指定してください',
        },
        { status: 400 }
      );
    }

    // データが見つからない場合
    if (!futurePopulationData) {
      return NextResponse.json(
        {
          success: false,
          error: '指定された市区町村の将来人口データが見つかりませんでした',
        },
        { status: 404 }
      );
    }

    // 成功レスポンス
    return NextResponse.json({
      success: true,
      data: futurePopulationData,
    });
  } catch (error) {
    console.error('Future population API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '将来人口データの取得に失敗しました',
      },
      { status: 500 }
    );
  }
}
