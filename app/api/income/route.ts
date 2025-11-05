import { NextRequest, NextResponse } from 'next/server';
import { getMunicipalIncomeData, extractMunicipalityName } from '@/utils/incomeDataParser';

/**
 * 市区町村の所得データを取得するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, municipalityName } = body;

    if (!address && !municipalityName) {
      return NextResponse.json(
        { error: '住所または市区町村名が必要です' },
        { status: 400 }
      );
    }

    // 住所から市区町村名を抽出
    let targetMunicipality = municipalityName;
    if (!targetMunicipality && address) {
      targetMunicipality = extractMunicipalityName(address);
    }

    if (!targetMunicipality) {
      return NextResponse.json(
        {
          error: '市区町村名を抽出できませんでした',
          address: address
        },
        { status: 400 }
      );
    }

    console.log('所得データ検索:', targetMunicipality);

    // 所得データを取得
    const incomeData = getMunicipalIncomeData(targetMunicipality);

    if (!incomeData) {
      return NextResponse.json(
        {
          error: '該当する市区町村の所得データが見つかりませんでした',
          municipalityName: targetMunicipality
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: incomeData,
    });
  } catch (error) {
    console.error('所得データ取得API error:', error);
    return NextResponse.json(
      { error: '所得データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
