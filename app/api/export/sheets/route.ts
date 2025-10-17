import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { ExportData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const exportData: ExportData = await request.json();

    // Google Sheets APIの認証情報を取得
    const credentialsBase64 = process.env.GOOGLE_SHEETS_CREDENTIALS;
    if (!credentialsBase64) {
      return NextResponse.json(
        { error: 'Google Sheets APIの認証情報が設定されていません' },
        { status: 500 }
      );
    }

    // Base64デコード
    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
    const credentials = JSON.parse(credentialsJson);

    // JWT認証
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 新しいスプレッドシートを作成
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `商圏分析結果_${new Date().toISOString().split('T')[0]}`,
        },
        sheets: [
          { properties: { title: '基本情報' } },
          { properties: { title: '人口統計' } },
          { properties: { title: '競合施設' } },
        ],
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('スプレッドシートの作成に失敗しました');
    }

    // データを準備
    const basicInfoData = [
      ['項目', '値'],
      ['住所', exportData.basicInfo.address],
      ['緯度', exportData.basicInfo.latitude],
      ['経度', exportData.basicInfo.longitude],
      ['カテゴリ', exportData.basicInfo.category],
      ['検索半径(km)', exportData.basicInfo.radius],
      ['総人口', exportData.population.totalPopulation],
    ];

    const populationData: any[][] = [['年齢層', '総数', '男性', '女性']];
    if (exportData.population.ageGroups) {
      Object.entries(exportData.population.ageGroups).forEach(([age, counts]) => {
        populationData.push([age, counts.total, counts.male, counts.female]);
      });
    }

    // 産業データを追加
    if (exportData.population.industries) {
      populationData.push([]);
      populationData.push(['産業分類', '事業所数', '従業者数']);
      Object.entries(exportData.population.industries).forEach(([industry, counts]) => {
        populationData.push([industry, counts.establishments, counts.employees]);
      });
    }

    const competitorData: any[][] = [
      ['施設名', '住所', '距離(m)', '評価', '評価数', 'Place ID'],
    ];
    exportData.competitors.forEach((competitor) => {
      competitorData.push([
        competitor.name,
        competitor.address || '',
        competitor.distance,
        competitor.rating || '',
        competitor.userRatingsTotal || '',
        competitor.placeId,
      ]);
    });

    // データを書き込み
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        data: [
          {
            range: '基本情報!A1',
            values: basicInfoData,
          },
          {
            range: '人口統計!A1',
            values: populationData,
          },
          {
            range: '競合施設!A1',
            values: competitorData,
          },
        ],
        valueInputOption: 'RAW',
      },
    });

    // スプレッドシートのURLを返す
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    return NextResponse.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
    });
  } catch (error) {
    console.error('Google Sheets export error:', error);
    return NextResponse.json(
      {
        error: 'スプレッドシートへのエクスポートに失敗しました',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
