import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { generateReportFileName, encodeFileName } from '@/utils/fileNameGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { basicInfo, population, competitors, rawData, circle, driveTime } = body;

    console.log('richreport API called');
    console.log('rangeType:', basicInfo.rangeType);
    console.log('circle exists:', !!circle);
    console.log('driveTime exists:', !!driveTime);

    // Excelワークブックを作成
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Market Analysis App';
    workbook.created = new Date();

    // 両方モードの場合
    if (basicInfo.rangeType === 'both' && circle && driveTime) {
      console.log('Creating dual report (both circle and driveTime)...');
      await createDualReport(workbook, basicInfo, circle, driveTime);
    }
    // rawDataがある場合は、jSTAT MAP APIの完全なデータを使用
    else if (rawData?.GET_SUMMARY) {
      console.log('Creating enhanced report...');
      await createEnhancedReport(workbook, basicInfo, rawData, competitors);
    } else {
      console.log('Creating basic report...');
      // フォールバック: 簡易レポート
      await createBasicReport(workbook, basicInfo, population, competitors);
    }

    // Excelファイルをバッファとして生成
    const buffer = await workbook.xlsx.writeBuffer();

    // ファイル名を生成（新しい命名規則を使用）
    const filename = generateReportFileName({
      rangeType: basicInfo.rangeType,
      category: basicInfo.category,
      address: basicInfo.address
    });
    const encodedFilename = encodeFileName(filename);

    // レスポンスを返す
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error) {
    console.error('Excel generation error:', error);
    return NextResponse.json(
      { error: 'レポートの生成に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * 両方モード用のレポート作成
 */
async function createDualReport(
  workbook: ExcelJS.Workbook,
  basicInfo: any,
  circle: any,
  driveTime: any
) {
  // サマリーシート
  const summarySheet = workbook.addWorksheet('サマリー');

  const summaryData = [
    ['商圏分析レポート（両方モード）'],
    [],
    ['検索住所', basicInfo.address],
    ['緯度', basicInfo.latitude],
    ['経度', basicInfo.longitude],
    ['施設カテゴリ', basicInfo.category],
    [],
    ['■ 円形範囲設定'],
    ['1次エリア', `${circle.rangeParams.radius1}m`],
    ['2次エリア', `${circle.rangeParams.radius2}m`],
    ['3次エリア', `${circle.rangeParams.radius3}m`],
    [],
    ['■ 到達圏設定'],
    ['1次エリア', `${driveTime.rangeParams.time1}分`],
    ['2次エリア', `${driveTime.rangeParams.time2}分`],
    ['3次エリア', `${driveTime.rangeParams.time3}分`],
    ['平均時速', `${driveTime.rangeParams.speed}km/h`],
    ['移動手段', driveTime.rangeParams.travelMode === 'car' ? '車' : '徒歩'],
    [],
    ['■ データ概要'],
    ['', '円形範囲', '到達圏'],
    ['総人口', circle.population.totalPopulation, driveTime.population.totalPopulation],
    ['競合施設数', circle.competitors.length, driveTime.competitors.length],
  ];

  summaryData.forEach((row, index) => {
    summarySheet.addRow(row);
    if (index === 0) {
      summarySheet.getRow(index + 1).font = { size: 16, bold: true };
    } else if ([7, 12, 19].includes(index)) {
      summarySheet.getRow(index + 1).font = { bold: true, size: 12 };
    }
  });

  summarySheet.columns = [
    { width: 20 },
    { width: 20 },
    { width: 20 }
  ];

  // 円形範囲のデータ
  if (circle.rawData?.GET_SUMMARY) {
    await createEnhancedReport(workbook,
      { ...basicInfo, rangeParams: circle.rangeParams, rangeDescription: circle.rangeDescription },
      circle.rawData,
      circle.competitors,
      '円形_'
    );
  } else {
    await createBasicReport(workbook,
      { ...basicInfo, radius: circle.rangeParams.radius3 / 1000 },
      circle.population,
      circle.competitors,
      '円形_'
    );
  }

  // 到達圏のデータ
  if (driveTime.rawData?.GET_SUMMARY) {
    await createEnhancedReport(workbook,
      { ...basicInfo, rangeParams: driveTime.rangeParams, rangeDescription: driveTime.rangeDescription },
      driveTime.rawData,
      driveTime.competitors,
      '到達圏_'
    );
  } else {
    await createBasicReport(workbook,
      { ...basicInfo, radius: (driveTime.rangeParams.time3 * driveTime.rangeParams.speed) / 60 },
      driveTime.population,
      driveTime.competitors,
      '到達圏_'
    );
  }
}

/**
 * jSTAT MAP APIの完全なデータを使用した充実したレポート
 */
async function createEnhancedReport(
  workbook: ExcelJS.Workbook,
  basicInfo: any,
  rawData: any,
  competitors: any[],
  sheetPrefix: string = ''
) {
  const params = rawData.GET_SUMMARY.PARAMETER;
  const rangeType = params.RANGE_TYPE;
  const dataset = rawData.GET_SUMMARY.DATASET_INF[0];
  const tables = dataset.TABLE_INF;

  // エリア設定の決定
  let areaConfigs: Array<{ code: string; name: string }>;
  let noteText: string;

  console.log('createEnhancedReport: params =', JSON.stringify(params, null, 2));
  console.log('createEnhancedReport: basicInfo =', JSON.stringify(basicInfo, null, 2));

  // basicInfoからrangeParamsを取得（フロントエンドから送信された実際のパラメータ）
  const rangeParams = basicInfo.rangeParams || {};

  if (rangeType === 'driveTime') {
    // フロントエンドから送信されたパラメータを優先的に使用
    const time1 = rangeParams.time1 || 5;
    const time2 = rangeParams.time2 || 10;
    const time3 = rangeParams.time3 || 20;
    const speed = rangeParams.speed || params.SPEED || 30;

    console.log(`driveTime mode: time1=${time1}, time2=${time2}, time3=${time3}, speed=${speed}`);

    areaConfigs = [
      { code: 'R001', name: `1次エリア(${time1}分)` },
      { code: 'R002', name: `2次エリア(${time2}分)` },
      { code: 'R003', name: `3次エリア(${time3}分)` },
      { code: 'R010', name: rawData.GET_SUMMARY.POSITION_INF.CITY || '市区町村' },
      { code: 'R100', name: rawData.GET_SUMMARY.POSITION_INF.PREFECTURE || '都道府県' }
    ];
    noteText = `※1次エリア=${time1}分, 2次エリア=${time2}分, 3次エリア=${time3}分 (${speed}km/h), ${areaConfigs[3].name}, ${areaConfigs[4].name}`;
  } else {
    // フロントエンドから送信されたパラメータを優先的に使用
    const radius1 = rangeParams.radius1 || 500;
    const radius2 = rangeParams.radius2 || 1000;
    const radius3 = rangeParams.radius3 || 2000;

    console.log(`circle mode: radius1=${radius1}, radius2=${radius2}, radius3=${radius3}`);

    areaConfigs = [
      { code: 'R001', name: `1次エリア(${radius1 / 1000}km)` },
      { code: 'R002', name: `2次エリア(${radius2 / 1000}km)` },
      { code: 'R003', name: `3次エリア(${radius3 / 1000}km)` },
      { code: 'R010', name: rawData.GET_SUMMARY.POSITION_INF.CITY || '市区町村' },
      { code: 'R100', name: rawData.GET_SUMMARY.POSITION_INF.PREFECTURE || '都道府県' }
    ];
    noteText = `※1次エリア=${radius1 / 1000}km, 2次エリア=${radius2 / 1000}km, 3次エリア=${radius3 / 1000}km, ${areaConfigs[3].name}, ${areaConfigs[4].name}`;
  }

  console.log('areaConfigs =', areaConfigs);

  // 1. サマリーシート
  const summarySheet = workbook.addWorksheet(sheetPrefix ? `${sheetPrefix}サマリー` : 'サマリー');

  let rangeDisplay: string;
  if (rangeType === 'driveTime') {
    const timeParams = params.TIME;
    const timeList = Array.isArray(timeParams)
      ? timeParams.map((t: any) => t.$).join('分, ') + '分'
      : timeParams.$ + '分';
    rangeDisplay = `到達圏 ${timeList} (${params.SPEED}km/h)`;
  } else {
    const radiusParams = params.RADIUS;
    const radiusDisplay = Array.isArray(radiusParams)
      ? radiusParams.map((r: any) => r.$).join('m, ') + 'm'
      : radiusParams.$ + 'm';
    rangeDisplay = `半径 ${radiusDisplay}`;
  }

  const summaryData = [
    ['jSTAT MAP API 商圏分析レポート'],
    [],
    ['場所', `${rawData.GET_SUMMARY.POSITION_INF.PREFECTURE} ${rawData.GET_SUMMARY.POSITION_INF.CITY} ${rawData.GET_SUMMARY.POSITION_INF.BLOCK}`],
    ['検索住所', basicInfo.address],
    ['検索範囲', rangeDisplay],
    ['取得日時', rawData.GET_SUMMARY.RESULT.DATE],
    [],
    ['テーブル一覧'],
    ['No', 'テーブル名', '統計名', '統計種別', 'データ件数'],
  ];

  tables.forEach((table: any, index: number) => {
    summaryData.push([
      index + 1,
      table.TITLE,
      table.STATISTICS_NAME,
      table.STAT_KIND,
      table.DATA_INF.VALUE.length
    ]);
  });

  summaryData.push([]);
  summaryData.push(['総テーブル数', tables.length]);
  const totalDataPoints = tables.reduce((sum: number, t: any) => sum + t.DATA_INF.VALUE.length, 0);
  summaryData.push(['総データポイント数', totalDataPoints]);

  summaryData.forEach((row, index) => {
    summarySheet.addRow(row);
    if (index === 0) {
      summarySheet.getRow(index + 1).font = { size: 16, bold: true };
    } else if (index === 7) {
      summarySheet.getRow(index + 1).font = { bold: true };
    }
  });

  summarySheet.columns = [
    { width: 5 },
    { width: 40 },
    { width: 30 },
    { width: 15 },
    { width: 12 }
  ];

  // 2. 基本情報シート
  const basicSheet = workbook.addWorksheet(sheetPrefix ? `${sheetPrefix}基本情報` : '基本情報');

  let rangeInfo: [string, string];
  if (rangeType === 'driveTime') {
    const timeParams = params.TIME;
    const timeList = Array.isArray(timeParams)
      ? timeParams.map((t: any) => t.$).join('分, ') + '分'
      : timeParams.$ + '分';
    rangeInfo = ['到達圏(分)', `${timeList} (${params.SPEED}km/h, ${params.TRAVEL_MODE})`];
  } else {
    const radiusParams = params.RADIUS;
    const radiiList = Array.isArray(radiusParams)
      ? radiusParams.map((r: any) => r.$).join('m, ') + 'm'
      : radiusParams.$ + 'm';
    rangeInfo = ['半径(m)', radiiList];
  }

  const basicInfoData = [
    ['項目', '値'],
    ['ステータス', rawData.GET_SUMMARY.RESULT.STATUS],
    ['メッセージ', rawData.GET_SUMMARY.RESULT.ERROR_MSG],
    ['取得日時', rawData.GET_SUMMARY.RESULT.DATE],
    [],
    ['検索住所', basicInfo.address],
    ['緯度', params.LATITUDE],
    ['経度', params.LONGITUDE],
    ['範囲タイプ', rangeType],
    rangeInfo,
    [],
    ['都道府県', rawData.GET_SUMMARY.POSITION_INF.PREFECTURE],
    ['市区町村', rawData.GET_SUMMARY.POSITION_INF.CITY],
    ['町丁字', rawData.GET_SUMMARY.POSITION_INF.BLOCK],
  ];

  basicInfoData.forEach((row) => basicSheet.addRow(row));
  basicSheet.getRow(1).font = { bold: true };
  basicSheet.columns = [{ width: 20 }, { width: 50 }];

  // 3. 主要データシート
  await createMainDataSheet(workbook, rawData, areaConfigs, noteText, sheetPrefix);

  // 4. 競合施設シート
  if (competitors && competitors.length > 0) {
    await createCompetitorsSheet(workbook, competitors, sheetPrefix);
  }

  // 5. 各テーブルの詳細シート（両方モードの場合はsheetPrefixを付与して重複を避ける）
  tables.forEach((table: any, index: number) => {
    const tableNum = index + 1;
    const baseSheetName = `T${tableNum.toString().padStart(2, '0')}_${table.TITLE.substring(0, 20)}`;
    const sheetName = (sheetPrefix + baseSheetName).replace(/[:\\\/\[\]\*\?]/g, '');

    createTableSheet(workbook, table, sheetName);
  });
}

/**
 * 主要データシートの作成
 */
async function createMainDataSheet(
  workbook: ExcelJS.Workbook,
  rawData: any,
  areaConfigs: Array<{ code: string; name: string }>,
  noteText: string,
  sheetPrefix: string = ''
) {
  const mainSheet = workbook.addWorksheet(sheetPrefix ? `${sheetPrefix}主要データ` : '主要データ');

  const tables = rawData.GET_SUMMARY.DATASET_INF[0].TABLE_INF;

  // データ抽出用のヘルパー関数
  function getValue(tableIndex: number, areaCode: string, catCode: string, valueCode: string): number {
    const table = tables[tableIndex];
    const value = table.DATA_INF.VALUE.find((v: any) => {
      return v['@cat11'] === areaCode && v[catCode] === valueCode;
    });

    // デバッグ: 2次・3次エリアのデータが見つからない場合にログ出力
    if (!value && (areaCode === 'R002' || areaCode === 'R003')) {
      console.log(`getValue: No data found for area=${areaCode}, table=${tableIndex}, catCode=${catCode}, valueCode=${valueCode}`);
      console.log(`  Available area codes in table:`,
        [...new Set(table.DATA_INF.VALUE.map((v: any) => v['@cat11']))].join(', '));
    }

    return value ? parseInt(value.$) : 0;
  }

  // ヘッダー行を作成
  function createHeaders(): string[] {
    return areaConfigs.map(a => a.name);
  }

  const mainData: any[][] = [
    ['jSTAT MAP データ比較（全集計範囲）'],
    [],
    [noteText],
    [],
  ];

  // 1. 男女別人口
  mainData.push(['■ 男女別人口']);
  mainData.push(['区分', '', ...createHeaders()]);

  const genderCodes = [
    { code: '1200', name: '男女計' },
    { code: '1201', name: '男' },
    { code: '1202', name: '女' }
  ];

  genderCodes.forEach(({ code, name }) => {
    const row: any[] = [name, ''];
    areaConfigs.forEach(area => {
      row.push(getValue(0, area.code, '@cat12', code));
    });
    mainData.push(row);
  });

  // 2. 年齢別人口（5歳階級）
  const table12AgeCodes = [
    { code: '3301', name: '4歳以下' },
    { code: '3302', name: '5～9歳' },
    { code: '3303', name: '10～14歳' },
    { code: '3304', name: '15～19歳' },
    { code: '3305', name: '20～24歳' },
    { code: '3306', name: '25～29歳' },
    { code: '3307', name: '30～34歳' },
    { code: '3308', name: '35～39歳' },
    { code: '3309', name: '40～44歳' },
    { code: '3310', name: '45～49歳' },
    { code: '3311', name: '50～54歳' },
    { code: '3312', name: '55～59歳' },
    { code: '3313', name: '60～64歳' },
    { code: '3314', name: '65～69歳' },
    { code: '3315', name: '70～74歳' },
    { code: '3316', name: '75歳以上' },
  ];

  mainData.push([]);
  mainData.push(['■ 年齢別人口（5歳階級）男女計']);
  mainData.push(['年齢層', '', ...createHeaders()]);

  table12AgeCodes.forEach(({ code, name }) => {
    const row: any[] = [name, ''];
    areaConfigs.forEach(area => {
      const table12 = tables[11];
      const value = table12.DATA_INF.VALUE.find((v: any) =>
        v['@cat31'] === area.code && v['@cat32'] === '3200' && v['@cat33'] === code
      );
      row.push(value ? parseInt(value.$) : 0);
    });
    mainData.push(row);
  });

  mainData.push([]);
  mainData.push(['■ 年齢別人口（5歳階級）男性']);
  mainData.push(['年齢層', '', ...createHeaders()]);

  table12AgeCodes.forEach(({ code, name }) => {
    const row: any[] = [name, ''];
    areaConfigs.forEach(area => {
      const table12 = tables[11];
      const value = table12.DATA_INF.VALUE.find((v: any) =>
        v['@cat31'] === area.code && v['@cat32'] === '3201' && v['@cat33'] === code
      );
      row.push(value ? parseInt(value.$) : 0);
    });
    mainData.push(row);
  });

  mainData.push([]);
  mainData.push(['■ 年齢別人口（5歳階級）女性']);
  mainData.push(['年齢層', '', ...createHeaders()]);

  table12AgeCodes.forEach(({ code, name }) => {
    const row: any[] = [name, ''];
    areaConfigs.forEach(area => {
      const table12 = tables[11];
      const value = table12.DATA_INF.VALUE.find((v: any) =>
        v['@cat31'] === area.code && v['@cat32'] === '3202' && v['@cat33'] === code
      );
      row.push(value ? parseInt(value.$) : 0);
    });
    mainData.push(row);
  });

  // 3. 世帯データ
  mainData.push([]);
  mainData.push(['■ 世帯人員別']);
  mainData.push(['区分', '', ...createHeaders()]);

  const householdCodes = [
    { code: '1500', name: '一般世帯' },
    { code: '1501', name: '単身世帯' },
    { code: '1502', name: '２人以上世帯' },
  ];

  householdCodes.forEach(({ code, name }) => {
    const row: any[] = [name, ''];
    areaConfigs.forEach(area => {
      row.push(getValue(3, area.code, '@cat15', code));
    });
    mainData.push(row);
  });

  // 4. 産業別データ
  mainData.push([]);
  mainData.push(['■ 産業別データ（事業所数）']);
  mainData.push(['産業', '', ...createHeaders()]);

  const industryCodes = [
    { code: '4200', name: '総数(公務除く)' },
    { code: '4201', name: '第１次産業' },
    { code: '4202', name: '第２次産業' },
    { code: '4203', name: '第３次産業' },
  ];

  industryCodes.forEach(({ code, name }) => {
    const row: any[] = [name, ''];
    areaConfigs.forEach(area => {
      const table13 = tables[12];
      const value = table13.DATA_INF.VALUE.find((v: any) =>
        v['@cat41'] === area.code &&
        (v['@cat42'] === code || v['@cat43'] === code || v['@cat44'] === code) &&
        v['@tab'] === '1'
      );
      row.push(value ? parseInt(value.$) : 0);
    });
    mainData.push(row);
  });

  mainData.push([]);
  mainData.push(['■ 産業別データ（従業者数）']);
  mainData.push(['産業', '', ...createHeaders()]);

  industryCodes.forEach(({ code, name }) => {
    const row: any[] = [name, ''];
    areaConfigs.forEach(area => {
      const table13 = tables[12];
      const value = table13.DATA_INF.VALUE.find((v: any) =>
        v['@cat41'] === area.code &&
        (v['@cat42'] === code || v['@cat43'] === code || v['@cat44'] === code) &&
        v['@tab'] === '2'
      );
      row.push(value ? parseInt(value.$) : 0);
    });
    mainData.push(row);
  });

  // データを追加
  mainData.forEach((row, index) => {
    const excelRow = mainSheet.addRow(row);

    // 見出し行のスタイル
    if (row[0]?.toString().startsWith('■')) {
      excelRow.font = { bold: true, size: 12 };
      excelRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    }

    // 数値セルのフォーマット
    excelRow.eachCell((cell, colNumber) => {
      if (colNumber > 2 && typeof cell.value === 'number') {
        cell.numFmt = '#,##0';
      }
    });
  });

  // 列幅設定
  mainSheet.columns = [
    { width: 25 },
    { width: 10 },
    ...areaConfigs.map(() => ({ width: 18 }))
  ];
}

/**
 * 競合施設シートの作成
 */
async function createCompetitorsSheet(workbook: ExcelJS.Workbook, competitors: any[], sheetPrefix: string = '') {
  const competitorsSheet = workbook.addWorksheet(sheetPrefix ? `${sheetPrefix}競合施設` : '競合施設');

  // ヘッダー
  const headerRow = competitorsSheet.addRow([
    '順位', 'エリア', '施設名', '住所', '距離(m)', '評価', 'レビュー数', 'URL', 'Place ID'
  ]);

  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // データ行
  competitors.forEach((comp, index) => {
    const areaText = comp.area ? `${comp.area}次` : '-';
    const row = competitorsSheet.addRow([
      index + 1,
      areaText,
      comp.name,
      comp.vicinity || '-',
      comp.distance,
      comp.rating || '-',
      comp.user_ratings_total || 0,
      comp.url || '',
      comp.place_id
    ]);

    // 数値フォーマット
    row.getCell(5).numFmt = '#,##0'; // 距離
    row.getCell(6).numFmt = '0.0';   // 評価
    row.getCell(7).numFmt = '#,##0'; // レビュー数

    // URLをハイパーリンクに
    if (comp.url) {
      row.getCell(8).value = {
        text: 'Google Maps',
        hyperlink: comp.url
      };
      row.getCell(8).font = { color: { argb: 'FF0000FF' }, underline: true };
    }
  });

  // 列幅設定
  competitorsSheet.columns = [
    { width: 6 },   // 順位
    { width: 8 },   // エリア
    { width: 35 },  // 施設名
    { width: 45 },  // 住所
    { width: 12 },  // 距離
    { width: 8 },   // 評価
    { width: 12 },  // レビュー数
    { width: 20 },  // URL
    { width: 35 }   // Place ID
  ];
}

/**
 * テーブル詳細シートの作成
 */
function createTableSheet(workbook: ExcelJS.Workbook, table: any, sheetName: string) {
  const sheet = workbook.addWorksheet(sheetName);

  // テーブル情報
  sheet.addRow(['統計名', table.STATISTICS_NAME]);
  sheet.addRow(['統計種別', table.STAT_KIND]);
  sheet.addRow(['テーブル名', table.TITLE]);
  sheet.addRow([]);

  // 分類情報を抽出
  const classifications: any = {};
  const classNames: any = {};
  const classOrder: string[] = [];

  table.CLASS_INF.CLASS_OBJ.forEach((classObj: any) => {
    const catId = classObj['@id'];
    const catName = classObj['@name'];
    classNames[catId] = catName;
    classOrder.push(catId);

    classifications[catId] = {};
    if (classObj.CLASS) {
      classObj.CLASS.forEach((item: any) => {
        classifications[catId][item['@code']] = item['@name'];
      });
    }
  });

  // ヘッダー行
  const columnHeaders = [...classOrder.map(id => classNames[id]), '値', '単位'];
  const headerRow = sheet.addRow(columnHeaders);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // データ行
  const values = table.DATA_INF.VALUE;
  values.forEach((value: any) => {
    const row: any[] = [];

    // 各分類の値
    classOrder.forEach(catId => {
      const attrName = `@${catId}`;
      if (value[attrName]) {
        const code = value[attrName];
        row.push(classifications[catId][code] || code);
      } else {
        row.push('');
      }
    });

    // 値と単位
    const numValue = parseFloat(value.$);
    row.push(isNaN(numValue) ? value.$ : numValue);
    row.push(value['@unit'] || '');

    const excelRow = sheet.addRow(row);

    // 数値フォーマット
    const valueCell = excelRow.getCell(classOrder.length + 1);
    if (typeof valueCell.value === 'number') {
      valueCell.numFmt = '#,##0';
    }
  });

  // 列幅を自動調整
  const colWidths = columnHeaders.map((header) => {
    const maxWidth = Math.min(header.length + 2, 50);
    return { width: maxWidth };
  });
  sheet.columns = colWidths;
}

/**
 * フォールバック: 簡易レポート（rawDataがない場合）
 */
async function createBasicReport(
  workbook: ExcelJS.Workbook,
  basicInfo: any,
  population: any,
  competitors: any[],
  sheetPrefix: string = ''
) {
  // 基本分析シート
  const basicSheet = workbook.addWorksheet(sheetPrefix ? `${sheetPrefix}基本分析` : '基本分析');
  basicSheet.getCell('C2').value = `調査地点　${basicInfo.address}　エリア範囲　半径${basicInfo.radius}km`;
  basicSheet.getCell('C2').font = { bold: true };

  // 年齢別人口シート
  const ageSheet = workbook.addWorksheet(sheetPrefix ? `${sheetPrefix}年齢別人口` : '年齢別人口');

  // ヘッダー行
  ageSheet.getCell('C2').value = 'データ名';
  ageSheet.getCell('E2').value = '対象エリア';
  ageSheet.mergeCells('C2:D2');

  // スタイル設定
  ['C2', 'E2'].forEach(cell => {
    ageSheet.getCell(cell).font = { bold: true };
    ageSheet.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    ageSheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
    ageSheet.getCell(cell).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // 総人口
  ageSheet.getCell('C3').value = '総人口';
  ageSheet.getCell('E3').value = population.totalPopulation;
  ageSheet.getCell('E3').numFmt = '#,##0';

  // 年齢別人口データ
  if (population.ageGroups) {
    const ageGroupsArray = Object.entries(population.ageGroups).map(([ageRange, counts]: [string, any]) => ({
      ageRange,
      ...counts
    }));

    // 年齢別人口ヘッダー
    ageSheet.getCell('C4').value = '年齢別人口（総人口）';
    ageSheet.mergeCells('C4:D4');

    let row = 4;
    ageGroupsArray.forEach((group) => {
      row++;
      ageSheet.getCell(`D${row}`).value = group.ageRange;
      ageSheet.getCell(`E${row}`).value = group.total;
      ageSheet.getCell(`E${row}`).numFmt = '#,##0';
    });

    // 男性人口セクション
    row += 2;
    ageSheet.getCell(`C${row}`).value = '男性総人口';
    ageSheet.getCell(`E${row}`).value = ageGroupsArray.reduce((sum, g) => sum + g.male, 0);
    ageSheet.getCell(`E${row}`).numFmt = '#,##0';

    row++;
    ageSheet.getCell(`C${row}`).value = '年齢別人口（男性人口）';
    ageSheet.mergeCells(`C${row}:D${row}`);

    ageGroupsArray.forEach((group) => {
      row++;
      ageSheet.getCell(`D${row}`).value = group.ageRange;
      ageSheet.getCell(`E${row}`).value = group.male;
      ageSheet.getCell(`E${row}`).numFmt = '#,##0';
    });

    // 女性人口セクション
    row += 2;
    ageSheet.getCell(`C${row}`).value = '女性総人口';
    ageSheet.getCell(`E${row}`).value = ageGroupsArray.reduce((sum, g) => sum + g.female, 0);
    ageSheet.getCell(`E${row}`).numFmt = '#,##0';

    row++;
    ageSheet.getCell(`C${row}`).value = '年齢別人口（女性人口）';
    ageSheet.mergeCells(`C${row}:D${row}`);

    ageGroupsArray.forEach((group) => {
      row++;
      ageSheet.getCell(`D${row}`).value = group.ageRange;
      ageSheet.getCell(`E${row}`).value = group.female;
      ageSheet.getCell(`E${row}`).numFmt = '#,##0';
    });
  }

  // 列幅の設定
  ageSheet.getColumn('C').width = 30;
  ageSheet.getColumn('D').width = 20;
  ageSheet.getColumn('E').width = 15;

  // 経済センサスシート
  if (population.industries) {
    const economicSheet = workbook.addWorksheet(sheetPrefix ? `${sheetPrefix}経済センサス` : '経済センサス');
    const industriesArray = Object.entries(population.industries).map(([name, data]: [string, any]) => ({
      name,
      ...data
    }));

    economicSheet.getCell('C3').value = 'データ名';
    economicSheet.getCell('F3').value = '対象エリア';
    economicSheet.mergeCells('C3:E3');

    ['C3', 'F3'].forEach(cell => {
      economicSheet.getCell(cell).font = { bold: true };
      economicSheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      economicSheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // 全産業事業所数
    const totalEstablishments = industriesArray.reduce((sum, i) => sum + i.establishments, 0);
    economicSheet.getCell('C4').value = '全産業事業所数';
    economicSheet.getCell('F4').value = totalEstablishments;
    economicSheet.getCell('F4').numFmt = '#,##0';

    // 全産業従業者数
    const totalEmployees = industriesArray.reduce((sum, i) => sum + i.employees, 0);
    economicSheet.getCell('C9').value = '全産業従業者数';
    economicSheet.getCell('F9').value = totalEmployees;
    economicSheet.getCell('F9').numFmt = '#,##0';

    // 産業別内訳（事業所数）
    let ecoRow = 19;
    economicSheet.getCell(`C${ecoRow}`).value = 'データ名';
    economicSheet.getCell(`F${ecoRow}`).value = '対象エリア';

    ecoRow++;
    economicSheet.getCell(`C${ecoRow}`).value = '産業別内訳（事業所数）';
    economicSheet.mergeCells(`C${ecoRow}:E${ecoRow}`);

    industriesArray.forEach((industry) => {
      ecoRow++;
      economicSheet.getCell(`D${ecoRow}`).value = industry.name;
      economicSheet.getCell(`F${ecoRow}`).value = industry.establishments;
      economicSheet.getCell(`F${ecoRow}`).numFmt = '#,##0';
    });

    // 産業別内訳（従業者数）
    ecoRow += 2;
    economicSheet.getCell(`C${ecoRow}`).value = 'データ名';
    economicSheet.getCell(`F${ecoRow}`).value = '対象エリア';

    ecoRow++;
    economicSheet.getCell(`C${ecoRow}`).value = '産業別内訳（従業者数）';
    economicSheet.mergeCells(`C${ecoRow}:E${ecoRow}`);

    industriesArray.forEach((industry) => {
      ecoRow++;
      economicSheet.getCell(`D${ecoRow}`).value = industry.name;
      economicSheet.getCell(`F${ecoRow}`).value = industry.employees;
      economicSheet.getCell(`F${ecoRow}`).numFmt = '#,##0';
    });

    // 列幅の設定
    economicSheet.getColumn('C').width = 30;
    economicSheet.getColumn('D').width = 35;
    economicSheet.getColumn('F').width = 15;
  }

  // 競合施設シート
  if (competitors && competitors.length > 0) {
    await createCompetitorsSheet(workbook, competitors, sheetPrefix);
  }
}
