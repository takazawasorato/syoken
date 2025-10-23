import { AnalysisResult } from '@/types';
import jstatSampleData from './jstat-sample-response-drivetime.json';

// サンプルデータ: 東京都新宿区戸山一丁目のジム分析結果（半径1km）
// 実際のjSTAT MAPデータ（RichReport_1758909913053.xlsx）に基づく
export const mockAnalysisResult: AnalysisResult = {
  address: '日本、〒162-0052 東京都新宿区戸山１丁目',
  coordinates: {
    lat: 35.7009591,
    lng: 139.7192526,
  },
  population: {
    totalPopulation: 71631,
    rawData: jstatSampleData, // jSTAT MAP APIの生データ
    ageGroups: [
      { ageRange: '0～4歳', total: 2223, male: 1133, female: 1090 },
      { ageRange: '5～9歳', total: 2037, male: 1044, female: 993 },
      { ageRange: '10～14歳', total: 1837, male: 933, female: 904 },
      { ageRange: '15～19歳', total: 2089, male: 1056, female: 1033 },
      { ageRange: '20～24歳', total: 5032, male: 2366, female: 2666 },
      { ageRange: '25～29歳', total: 5603, male: 2802, female: 2801 },
      { ageRange: '30～34歳', total: 5150, male: 2568, female: 2582 },
      { ageRange: '35～39歳', total: 5060, male: 2674, female: 2386 },
      { ageRange: '40～44歳', total: 5207, male: 2757, female: 2450 },
      { ageRange: '45～49歳', total: 5341, male: 2829, female: 2512 },
      { ageRange: '50～54歳', total: 4616, male: 2430, female: 2186 },
      { ageRange: '55～59歳', total: 3721, male: 1961, female: 1760 },
      { ageRange: '60～64歳', total: 2931, male: 1521, female: 1410 },
      { ageRange: '65～69歳', total: 2914, male: 1411, female: 1503 },
      { ageRange: '70～74歳', total: 3640, male: 1618, female: 2022 },
      { ageRange: '75歳以上', total: 7747, male: 2889, female: 4858 },
    ],
    industries: [
      { name: 'M 宿泊業，飲食サービス業', establishments: 357, employees: 3052 },
      { name: 'I 卸売業，小売業', establishments: 545, employees: 6254 },
      { name: 'G 情報通信業', establishments: 206, employees: 7038 },
      { name: 'P 医療，福祉', establishments: 256, employees: 7851 },
      { name: 'O 教育，学習支援業', establishments: 105, employees: 10118 },
      { name: 'K 不動産業，物品賃貸業', establishments: 357, employees: 1500 },
      { name: 'L 学術研究，専門・技術サービス業', establishments: 260, employees: 6483 },
      { name: 'R サービス業（他に分類されないもの）', establishments: 251, employees: 4651 },
      { name: 'N 生活関連サービス業，娯楽業', establishments: 171, employees: 986 },
      { name: 'D 建設業', establishments: 137, employees: 1857 },
    ],
  },
  competitors: [
    {
      name: 'ANYTIME FITNESS 渋谷店',
      vicinity: '東京都渋谷区道玄坂1-2-3',
      distance: 150,
      rating: 4.2,
      user_ratings_total: 156,
      place_id: 'ChIJN1t_tDeWpGsSamplePlaceId001',
      geometry: { location: { lat: 35.6590, lng: 139.6990 } },
      url: 'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeWpGsSamplePlaceId001',
      area: 1,
    },
    {
      name: 'ゴールドジム 渋谷東京',
      vicinity: '東京都渋谷区渋谷1-23-16',
      distance: 420,
      rating: 4.5,
      user_ratings_total: 342,
      place_id: 'ChIJN1t_tDeWpGsSamplePlaceId002',
      geometry: { location: { lat: 35.6620, lng: 139.7010 } },
      url: 'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeWpGsSamplePlaceId002',
      area: 1,
    },
    {
      name: 'エニタイムフィットネス 渋谷宮益坂店',
      vicinity: '東京都渋谷区渋谷1-8-3',
      distance: 750,
      rating: 4.1,
      user_ratings_total: 89,
      place_id: 'ChIJN1t_tDeWpGsSamplePlaceId003',
      geometry: { location: { lat: 35.6630, lng: 139.7020 } },
      url: 'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeWpGsSamplePlaceId003',
      area: 2,
    },
    {
      name: 'ティップネス 渋谷店',
      vicinity: '東京都渋谷区道玄坂2-6-17',
      distance: 980,
      rating: 3.9,
      user_ratings_total: 234,
      place_id: 'ChIJN1t_tDeWpGsSamplePlaceId004',
      geometry: { location: { lat: 35.6570, lng: 139.6970 } },
      url: 'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeWpGsSamplePlaceId004',
      area: 2,
    },
    {
      name: 'セントラルスポーツ 渋谷店',
      vicinity: '東京都渋谷区宇田川町36-1',
      distance: 1250,
      rating: 4.0,
      user_ratings_total: 178,
      place_id: 'ChIJN1t_tDeWpGsSamplePlaceId005',
      geometry: { location: { lat: 35.6610, lng: 139.6980 } },
      url: 'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeWpGsSamplePlaceId005',
      area: 3,
    },
    {
      name: 'RIZAP 渋谷店',
      vicinity: '東京都渋谷区渋谷3-17-4',
      distance: 1540,
      rating: 4.6,
      user_ratings_total: 67,
      place_id: 'ChIJN1t_tDeWpGsSamplePlaceId006',
      geometry: { location: { lat: 35.6640, lng: 139.7030 } },
      url: 'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeWpGsSamplePlaceId006',
      area: 3,
    },
    {
      name: 'コナミスポーツクラブ 渋谷',
      vicinity: '東京都渋谷区道玄坂2-23-12',
      distance: 1880,
      rating: 3.8,
      user_ratings_total: 145,
      place_id: 'ChIJN1t_tDeWpGsSamplePlaceId007',
      geometry: { location: { lat: 35.6560, lng: 139.6960 } },
      url: 'https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeWpGsSamplePlaceId007',
      area: 3,
    },
  ],
};

// 開発モードフラグ（環境変数で制御）
export const isDevelopmentMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// モックデータを返すヘルパー関数
export const getMockAnalysisResult = (
  address?: string,
  category?: string,
  radiusKm?: number
): AnalysisResult => {
  // 入力パラメータに応じてカスタマイズも可能
  return {
    ...mockAnalysisResult,
    // 必要に応じてここでカテゴリ等を変更
  };
};
