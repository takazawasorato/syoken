import { NextRequest, NextResponse } from 'next/server';
import { JStatResponse, PopulationData } from '@/types';
import { captureApiResponseToJson, isCaptureModeEnabled } from '@/utils/captureApiResponse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, rangeType, radius1, radius2, radius3, time1, time2, time3, speed, travelMode } = body;

    if (!lat || !lng || !rangeType) {
      return NextResponse.json(
        { error: '緯度、経度、範囲タイプが必要です' },
        { status: 400 }
      );
    }

    const apiKey = process.env.JSTAT_API_KEY;
    const userId = process.env.JSTAT_USER_ID;

    if (!apiKey || !userId) {
      return NextResponse.json(
        { error: 'jSTAT MAP APIの認証情報が設定されていません' },
        { status: 500 }
      );
    }

    // jSTAT MAP APIの基本パラメータを構築
    const params = new URLSearchParams({
      category: 'richReport',
      func: 'getSummary',
      userid: userId,
      key: apiKey,
      lat: lat.toString(),
      lng: lng.toString(),
      output: 'json',
      rangeType: rangeType,
    });

    // 範囲タイプに応じてパラメータを追加
    if (rangeType === 'circle') {
      // 3つの半径を設定（デフォルト: 500m, 1000m, 2000m）
      const r1 = radius1 || 500;
      const r2 = radius2 || 1000;
      const r3 = radius3 || 2000;
      // カンマ区切りで3つの半径を指定（jstat.jsの実装に従う）
      params.append('radius', `${r1},${r2},${r3}`);
    } else if (rangeType === 'driveTime') {
      // 3つの到達時間を設定（デフォルト: 5分, 10分, 20分）
      const t1 = time1 || 5;
      const t2 = time2 || 10;
      const t3 = time3 || 20;
      // カンマ区切りで3つの時間を指定（jstat.jsの実装に従う）
      params.append('time', `${t1},${t2},${t3}`);
      params.append('speed', (speed || 30).toString());
      params.append('travelMode', travelMode || 'car');
    }

    const url = `https://jstatmap.e-stat.go.jp/statmap/api/1.00?${params.toString()}`;

    console.log('jSTAT MAP API URL:', url);

    const response = await fetch(url);
    const data: JStatResponse = await response.json();

    console.log('jSTAT MAP API Response - Available areas:',
      data.GET_SUMMARY?.DATASET_INF?.[0]?.TABLE_INF?.[0]?.CLASS_INF?.CLASS_OBJ
        ?.find((c: any) => c['@name']?.includes('集計範囲'))
        ?.CLASS?.map((c: any) => `${c['@code']}:${c['@name']}`) || 'N/A'
    );

    // APIレスポンスをキャプチャー（開発環境のみ）
    if (isCaptureModeEnabled()) {
      const filename = `jstat_${rangeType}_response.json`;
      captureApiResponseToJson('jstat_api', data, {
        subdirectory: 'captured-responses',
        customFilename: filename
      });
    }

    // エラーチェック
    if (
      !data.GET_SUMMARY ||
      !data.GET_SUMMARY.RESULT ||
      data.GET_SUMMARY.RESULT.STATUS !== 0
    ) {
      return NextResponse.json(
        {
          error: `jSTAT MAP API Error: ${
            data.GET_SUMMARY?.RESULT?.ERROR_MSG || '予期しないエラー'
          }`,
        },
        { status: 400 }
      );
    }

    // レスポンスデータを整形
    const populationData = parseJStatData(data);

    return NextResponse.json({
      ...populationData,
      rawData: data, // 生データも返す（デバッグ用）
    });
  } catch (error) {
    console.error('jSTAT MAP API error:', error);
    return NextResponse.json(
      { error: '人口統計データの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * jSTAT MAP APIのレスポンスをパースして人口データを抽出
 */
function parseJStatData(data: JStatResponse): PopulationData {
  let totalPopulation = 0;
  const ageGroups: PopulationData['ageGroups'] = {};
  const industries: PopulationData['industries'] = {};

  if (!data.GET_SUMMARY.DATASET_INF || data.GET_SUMMARY.DATASET_INF.length === 0) {
    return { totalPopulation, ageGroups, industries };
  }

  const tableInf = data.GET_SUMMARY.DATASET_INF[0].TABLE_INF;

  tableInf.forEach((table) => {
    const title = table.TITLE;

    // 年齢・男女別人口のテーブルを処理
    if (title.includes('年齢') && title.includes('男女')) {
      const { classMappings, areaCatId, ageCatId, sexCatId } = getClassifications(table);

      if (!areaCatId || !ageCatId || !sexCatId) return;

      table.DATA_INF.VALUE.forEach((value) => {
        const areaCode = value[`@${areaCatId}`];
        const ageCode = value[`@${ageCatId}`];
        const sexCode = value[`@${sexCatId}`];

        if (!areaCode || !ageCode || !sexCode) return;

        const ageName = classMappings[ageCatId]?.map[ageCode];
        const sexName = classMappings[sexCatId]?.map[sexCode];

        if (!ageName || !sexName) return;

        const val = parseInt(value.$, 10);

        if (!ageGroups[ageName]) {
          ageGroups[ageName] = { total: 0, male: 0, female: 0 };
        }

        if (sexName === '男女計') {
          ageGroups[ageName].total += val;
          totalPopulation += val;
        } else if (sexName === '男') {
          ageGroups[ageName].male += val;
        } else if (sexName === '女') {
          ageGroups[ageName].female += val;
        }
      });
    }

    // 産業別従業者数のテーブルを処理
    if (title.includes('産業別')) {
      const { classMappings, areaCatId, industryCatId, itemCatId } =
        getClassifications(table);

      if (!areaCatId || !industryCatId || !itemCatId) return;

      table.DATA_INF.VALUE.forEach((value) => {
        const industryCode = value[`@${industryCatId}`];
        const itemCode = value[`@${itemCatId}`];

        if (!industryCode || !itemCode) return;

        const industryName = classMappings[industryCatId]?.map[industryCode];
        const itemName = classMappings[itemCatId]?.map[itemCode];

        if (!industryName || !itemName) return;

        const val = parseInt(value.$, 10);

        if (!industries[industryName]) {
          industries[industryName] = { establishments: 0, employees: 0 };
        }

        if (itemName.includes('事業所数')) {
          industries[industryName].establishments += val;
        } else if (itemName.includes('従業者数')) {
          industries[industryName].employees += val;
        }
      });
    }
  });

  return {
    totalPopulation,
    ageGroups,
    industries,
  };
}

/**
 * テーブル定義から分類IDとマッピング情報を抽出
 */
function getClassifications(table: any) {
  const classMappings: any = {};
  const result: any = {};

  table.CLASS_INF.CLASS_OBJ.forEach((c: any) => {
    const catId = c['@id'];
    const catName = c['@name'];

    if (catName.includes('年齢')) result.ageCatId = catId;
    if (catName.includes('男女')) result.sexCatId = catId;
    if (catName.includes('集計範囲')) result.areaCatId = catId;
    if (catName.includes('産業')) result.industryCatId = catId;
    if (catName.includes('項目')) result.itemCatId = catId;

    const codeToName: any = {};
    if (c.CLASS) {
      c.CLASS.forEach((item: any) => {
        codeToName[item['@code']] = item['@name'];
      });
    }
    classMappings[catId] = { map: codeToName };
  });

  result.classMappings = classMappings;
  return result;
}
