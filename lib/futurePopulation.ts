import fs from 'fs';
import path from 'path';
import { FuturePopulationData, FuturePopulationJsonData } from '@/types';

// JSONデータをキャッシュ（サーバーサイドでのみ使用）
let cachedData: FuturePopulationJsonData | null = null;

/**
 * 将来人口データのJSONファイルを読み込む
 */
export function loadFuturePopulationData(): FuturePopulationJsonData {
  if (cachedData) {
    return cachedData;
  }

  const jsonPath = path.join(process.cwd(), 'public', 'data', 'future_population.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  cachedData = JSON.parse(jsonData);

  return cachedData;
}

/**
 * 市区町村コードから将来人口データを取得
 * @param municipalityCode 5桁の市区町村コード（例: "01100"）
 * @returns 将来人口データ、見つからない場合はnull
 */
export function getFuturePopulationByCode(
  municipalityCode: string
): FuturePopulationData | null {
  const data = loadFuturePopulationData();

  // コードを5桁に正規化
  const normalizedCode = municipalityCode.padStart(5, '0');

  return data.municipalities[normalizedCode] || null;
}

/**
 * 市区町村名から将来人口データを取得（部分一致検索）
 * @param municipalityName 市区町村名（例: "札幌市"、"千代田区"）
 * @param prefectureName 都道府県名（オプション、曖昧さ回避用）
 * @returns 将来人口データ、見つからない場合はnull
 */
export function getFuturePopulationByName(
  municipalityName: string,
  prefectureName?: string
): FuturePopulationData | null {
  const data = loadFuturePopulationData();

  // 全市区町村を検索
  const municipalities = Object.values(data.municipalities);

  // 都道府県名が指定されている場合は絞り込み
  const filtered = prefectureName
    ? municipalities.filter((m) => m.prefecture === prefectureName)
    : municipalities;

  // 市区町村名で検索（完全一致優先）
  let result = filtered.find((m) => m.name === municipalityName);

  // 完全一致がない場合は部分一致で検索
  if (!result) {
    result = filtered.find((m) => m.name.includes(municipalityName));
  }

  return result || null;
}

/**
 * 住所から市区町村コードを抽出
 * Google Geocoding APIのaddress_componentsから市区町村コードを取得
 *
 * 注意: Geocoding APIは必ずしも市区町村コードを返さないため、
 * この関数は市区町村名を使った検索にフォールバックする
 *
 * @param addressComponents Geocoding APIのaddress_components
 * @returns 市区町村コード（5桁）、取得できない場合はnull
 */
export function extractMunicipalityCodeFromAddressComponents(
  addressComponents: any[]
): string | null {
  // address_componentsから市区町村レベルのコンポーネントを探す
  // locality: 市区町村レベル
  // administrative_area_level_2: 郡や政令市の区レベル

  for (const component of addressComponents) {
    const types = component.types || [];

    // localityまたはadministrative_area_level_2を探す
    if (types.includes('locality') || types.includes('administrative_area_level_2')) {
      // long_nameに市区町村名が含まれる
      // ただし、Geocoding APIは日本の市区町村コードを直接提供しないため、
      // 名前ベースの検索を行う必要がある
      return null; // コード抽出は困難なのでnullを返す
    }
  }

  return null;
}

/**
 * 住所から市区町村名と都道府県名を抽出
 * @param addressComponents Geocoding APIのaddress_components
 * @returns { municipalityName, prefectureName }
 */
export function extractLocationInfo(addressComponents: any[]): {
  municipalityName: string | null;
  prefectureName: string | null;
} {
  let municipalityName: string | null = null;
  let prefectureName: string | null = null;

  for (const component of addressComponents) {
    const types = component.types || [];

    // 市区町村名を取得
    if (types.includes('locality') || types.includes('administrative_area_level_2')) {
      municipalityName = component.long_name;
    }

    // 都道府県名を取得
    if (types.includes('administrative_area_level_1')) {
      prefectureName = component.long_name;
    }
  }

  return { municipalityName, prefectureName };
}

/**
 * Geocoding APIの結果から将来人口データを取得
 * @param geocodingResult Geocoding APIのレスポンス
 * @returns 将来人口データ、見つからない場合はnull
 */
export function getFuturePopulationFromGeocodingResult(
  geocodingResult: any
): FuturePopulationData | null {
  if (!geocodingResult.address_components) {
    return null;
  }

  const { municipalityName, prefectureName } = extractLocationInfo(
    geocodingResult.address_components
  );

  if (!municipalityName) {
    return null;
  }

  return getFuturePopulationByName(municipalityName, prefectureName || undefined);
}
