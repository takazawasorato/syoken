// 緯度経度の型定義
export interface Coordinates {
  lat: number;
  lng: number;
}

// Google Geocoding APIのレスポンス型
export interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address: string;
}

// Google Places APIのレスポンス型
export interface PlaceResult {
  name: string;
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  geometry: {
    location: Coordinates;
  };
  distance?: number; // メートル単位の距離（計算後に追加）
}

// jSTAT MAP APIのレスポンス型
export interface JStatResponse {
  GET_SUMMARY: {
    RESULT: {
      STATUS: number;
      ERROR_MSG?: string;
    };
    DATASET_INF: Array<{
      TABLE_INF: JStatTable[];
    }>;
  };
}

export interface JStatTable {
  TITLE: string;
  CLASS_INF: {
    CLASS_OBJ: JStatClassObject[];
  };
  DATA_INF: {
    VALUE: JStatValue[];
  };
}

export interface JStatClassObject {
  '@id': string;
  '@name': string;
  CLASS?: Array<{
    '@code': string;
    '@name': string;
    '@radius'?: string;
    '@range'?: string;
  }>;
}

export interface JStatValue {
  $: string; // 値
  '@unit'?: string;
  [key: string]: string | undefined; // 動的なカテゴリID用
}

// 人口統計データの型
export interface PopulationData {
  totalPopulation: number;
  ageGroups?: {
    [key: string]: {
      total: number;
      male: number;
      female: number;
    };
  };
  industries?: {
    [key: string]: {
      establishments: number;
      employees: number;
    };
  };
  rawData?: any; // jSTAT MAPの生データ
}

// 分析リクエストの型
export interface AnalysisRequest {
  address: string;
  category: string;
  radiusKm: number;
}

// 分析結果の型
export interface AnalysisResult {
  address: string;
  coordinates: Coordinates;
  population: PopulationData;
  competitors: PlaceResult[];
}

// CSVエクスポート用のデータ型
export interface ExportData {
  basicInfo: {
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    radius: number;
  };
  population: PopulationData;
  competitors: Array<{
    name: string;
    address: string;
    distance: number;
    rating?: number;
    userRatingsTotal?: number;
    placeId: string;
  }>;
}
