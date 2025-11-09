/**
 * モックデータ管理
 *
 * 実際のAPIレスポンスをキャプチャーしたJSONファイルを使用
 * データソース: dev-data/captured-responses/ (ENABLE_API_CAPTURE=trueで生成)
 *
 * 更新日: 2025-11-05
 * 対象エリア: 京都市左京区下鴨東本町
 * カテゴリ: ジム
 */

import { AnalysisResult, DualAnalysisResult } from '@/types';

// キャプチャーした実際のAPIレスポンス
import jstatCircleResponse from '@/dev-data/jstat-sample-response-circle.json';
import jstatDriveTimeResponse from '@/dev-data/jstat-sample-response-drivetime.json';
import placesResponse from '@/dev-data/places-sample-response.json';

/**
 * 開発モードフラグ（環境変数で制御）
 */
export const isDevelopmentMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * キャプチャーしたJSONデータをそのままエクスポート
 * 必要に応じて直接使用可能
 */
export const mockJstatCircle = jstatCircleResponse;
export const mockJstatDriveTime = jstatDriveTimeResponse;
export const mockPlaces = placesResponse;

/**
 * 単一モード（円形 or 到達圏）用のモックデータを生成
 */
export function getMockAnalysisResult(): AnalysisResult {
  return {
    address: '日本、〒606-0863 京都府京都市左京区下鴨東本町２６−３',
    coordinates: placesResponse.metadata.center,
    population: {
      totalPopulation: 5489, // jSTAT APIから取得した値
      rawData: jstatCircleResponse, // 完全な生データ
    },
    competitors: placesResponse.results as any[],
    incomeData: {
      municipalityName: '京都市',
      prefectureName: '京都府',
      municipalityCode: '261009',
      dataYear: 2024,
      taxpayerCount: 683942,
      totalIncome: 2450158946,
      averageIncome: 3582,
    },
  };
}

/**
 * 両方モード（円形 + 到達圏）用のモックデータを生成
 */
export function getMockDualAnalysisResult(): DualAnalysisResult {
  return {
    address: '日本、〒606-0863 京都府京都市左京区下鴨東本町２６−３',
    coordinates: placesResponse.metadata.center,
    incomeData: {
      municipalityName: '京都市',
      prefectureName: '京都府',
      municipalityCode: '261009',
      dataYear: 2024,
      taxpayerCount: 683942,
      totalIncome: 2450158946,
      averageIncome: 3582,
    },
    circle: {
      population: {
        totalPopulation: 5489,
        rawData: jstatCircleResponse,
      },
      competitors: placesResponse.results as any[],
      params: {
        radius1: 500,
        radius2: 1000,
        radius3: 2000,
      },
    },
    driveTime: {
      population: {
        totalPopulation: 12489,
        rawData: jstatDriveTimeResponse,
      },
      competitors: placesResponse.results as any[],
      params: {
        time1: 5,
        time2: 10,
        time3: 20,
        speed: 30,
        travelMode: 'car',
      },
    },
  };
}

/**
 * レガシー互換性のため（非推奨）
 * @deprecated getMockAnalysisResult() を使用してください
 */
export const mockAnalysisResult = getMockAnalysisResult();

/**
 * レガシー互換性のため（非推奨）
 * @deprecated getMockDualAnalysisResult() を使用してください
 */
export const mockDualAnalysisResult = getMockDualAnalysisResult();
