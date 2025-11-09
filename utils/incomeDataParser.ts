import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import { MunicipalIncomeData } from '@/types';

/**
 * 所得データのキャッシュ
 */
let incomeDataCache: Map<string, MunicipalIncomeData> | null = null;

/**
 * CSVファイルを読み込んでパースする（UTF-8）
 */
function parseIncomeCSV(filePath: string, skipRows: number = 4): any[] {
  const csvFilePath = path.join(process.cwd(), filePath);
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');

  const result = Papa.parse(csvContent, {
    header: false,
    skipEmptyLines: true,
  });

  // 最初の数行（説明文）をスキップ
  return result.data.slice(skipRows);
}

/**
 * 所得データを読み込んでキャッシュする
 */
export function loadIncomeData(): Map<string, MunicipalIncomeData> {
  if (incomeDataCache) {
    return incomeDataCache;
  }

  try {
    // municipal_income_2024.csv: 令和6年度市町村別所得データ
    const incomeData = parseIncomeCSV('public/data/municipal_income_2024.csv');

    const incomeMap = new Map<string, MunicipalIncomeData>();

    // カンマを除去して数値に変換
    const parseNumber = (str: string): number | null => {
      if (!str || str.trim() === '') return null;
      const num = parseFloat(str.replace(/,/g, '').replace(/\s/g, ''));
      return isNaN(num) ? null : num;
    };

    // データをパース
    // CSV構造: 年度, 団体コード, 都道府県名, 団体名, 表側, 所得割の納税義務者数, 総所得金額等, ...
    for (const row of incomeData) {
      if (!row || row.length < 7) continue;

      const year = parseNumber(row[0] as string);
      const municipalityCode = (row[1] as string)?.trim();
      const prefectureName = (row[2] as string)?.trim();
      const municipalityName = (row[3] as string)?.trim();
      const category = (row[4] as string)?.trim(); // 市町村民税 or 道府県民税
      const taxpayerCount = parseNumber(row[5] as string);
      const totalIncome = parseNumber(row[6] as string);

      // 市町村民税のデータのみを使用（道府県民税は除外）
      if (category !== '市町村民税') continue;
      if (!municipalityName || !municipalityCode) continue;

      // 一人当たり所得を計算
      const averageIncome = taxpayerCount && totalIncome && taxpayerCount > 0
        ? Math.round(totalIncome / taxpayerCount)
        : null;

      const data: MunicipalIncomeData = {
        municipalityName: municipalityName,
        prefectureName: prefectureName || '',
        municipalityCode: municipalityCode,
        dataYear: year || 2024,
        taxpayerCount: taxpayerCount,
        totalIncome: totalIncome,
        averageIncome: averageIncome,
      };

      // 市区町村名と市区町村コードの両方でマッピング
      incomeMap.set(municipalityName, data);
      incomeMap.set(municipalityCode, data);

      // 都道府県名 + 市区町村名の組み合わせでも検索できるようにする
      const fullName = `${prefectureName} ${municipalityName}`;
      incomeMap.set(fullName, data);

      // スペースなしバージョンも追加（検索しやすくするため）
      const nameWithoutSpace = municipalityName.replace(/\s/g, '');
      incomeMap.set(nameWithoutSpace, data);

      const fullNameWithoutSpace = fullName.replace(/\s/g, '');
      incomeMap.set(fullNameWithoutSpace, data);
    }

    incomeDataCache = incomeMap;
    console.log(`所得データを読み込みました: ${incomeData.filter(r => r[4] === '市町村民税').length}件の市区町村`);

    return incomeMap;
  } catch (error) {
    console.error('所得データの読み込みに失敗しました:', error);
    incomeDataCache = new Map();
    return incomeDataCache;
  }
}

/**
 * 市区町村名から所得データを取得
 * @param searchKey 市区町村名または市区町村コード（例: "東京都 千代田区", "131016"）
 */
export function getMunicipalIncomeData(searchKey: string): MunicipalIncomeData | null {
  const incomeData = loadIncomeData();

  // そのまま検索
  let result = incomeData.get(searchKey);
  if (result) return result;

  // スペースなしで検索
  const keyWithoutSpace = searchKey.replace(/\s/g, '');
  result = incomeData.get(keyWithoutSpace);
  if (result) return result;

  // 部分一致検索（市区町村名の後半部分のみで検索）
  for (const [key, value] of incomeData.entries()) {
    if (key.includes(searchKey) || searchKey.includes(key)) {
      return value;
    }
  }

  return null;
}

/**
 * 住所文字列から市区町村名を抽出
 * @param address 住所文字列（例: "東京都千代田区丸の内1-1-1"）
 * @returns 市区町村名（例: "千代田区"）または null
 */
export function extractMunicipalityName(address: string): string | null {
  // 都道府県 + 市区町村のパターンマッチング
  const patterns = [
    // 政令指定都市の区（例: 北海道札幌市中央区）
    /^.+[都道府県](.+市)(.+区)/,
    // 東京都特別区（23区）
    /^東京都(.+区)/,
    // 市町村
    /^.+[都道府県](.+[市町村])/,
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      // 政令指定都市の区の場合は市名を返す（例: "札幌市"）
      if (match[1] && match[2]) {
        return match[1]; // 市名のみ
      }
      // その他の場合は市区町村名を返す
      return match[1];
    }
  }

  return null;
}
