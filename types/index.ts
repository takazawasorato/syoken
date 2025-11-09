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
  url?: string; // 施設のURL（Google Maps URL）
  website?: string; // 公式ウェブサイト
  area?: 1 | 2 | 3; // エリア分類（1次/2次/3次）
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

// 市区町村の所得データの型
export interface MunicipalIncomeData {
  municipalityName: string;  // 市区町村名（例: "札幌市"）
  prefectureName: string;    // 都道府県名（例: "北海道"）
  municipalityCode: string;  // 市区町村コード（団体コード）
  dataYear: number;          // データ年度（例: 2024）
  taxpayerCount: number | null;      // 所得割の納税義務者数（人）
  totalIncome: number | null;        // 総所得金額等（千円）
  averageIncome: number | null;      // 一人当たり所得（千円） - 計算値
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
  incomeData?: MunicipalIncomeData | null;  // 市区町村の所得データ
}

// 「両方」モード用の分析結果の型
export interface DualAnalysisResult {
  address: string;
  coordinates: Coordinates;
  incomeData?: MunicipalIncomeData | null;  // 市区町村の所得データ
  circle: {
    population: PopulationData;
    competitors: PlaceResult[];
    params: {
      radius1: number;
      radius2: number;
      radius3: number;
    };
  };
  driveTime: {
    population: PopulationData;
    competitors: PlaceResult[];
    params: {
      time1: number;
      time2: number;
      time3: number;
      speed: number;
      travelMode: string;
    };
  };
}

// CSVエクスポート用のデータ型
export interface ExportData {
  basicInfo: {
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    radius?: number;
    rangeType?: 'circle' | 'driveTime';
    rangeDescription?: string;
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
