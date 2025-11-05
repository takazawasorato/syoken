import Papa from 'papaparse';
import { ExportData } from '@/types';

/**
 * 分析データをCSV形式に変換してダウンロード
 */
export function exportToCSV(data: ExportData, filename: string = 'analysis_result.csv') {
  // 基本情報
  const basicInfoRows = [
    ['基本情報', ''],
    ['住所', data.basicInfo.address],
    ['緯度', data.basicInfo.latitude],
    ['経度', data.basicInfo.longitude],
    ['カテゴリ', data.basicInfo.category],
    ['検索半径(km)', data.basicInfo.radius],
    [''],
  ];

  // 人口統計情報
  const populationRows = [
    ['人口統計情報', ''],
    ['総人口', data.population.totalPopulation],
    [''],
  ];

  // 年齢別人口
  if (data.population.ageGroups) {
    populationRows.push(['年齢別人口', '総数', '男性', '女性']);
    Object.entries(data.population.ageGroups).forEach(([age, counts]) => {
      populationRows.push([age, counts.total, counts.male, counts.female]);
    });
    populationRows.push(['']);
  }

  // 産業別従業者数
  if (data.population.industries) {
    populationRows.push(['産業別従業者数', '事業所数', '従業者数']);
    Object.entries(data.population.industries).forEach(([industry, counts]) => {
      populationRows.push([industry, counts.establishments, counts.employees]);
    });
    populationRows.push(['']);
  }

  // 競合施設情報
  const competitorRows = [
    ['競合施設情報', '', '', '', '', ''],
    ['施設名', '住所', '距離(m)', '評価', '評価数', 'Place ID'],
  ];

  data.competitors.forEach((competitor) => {
    competitorRows.push([
      competitor.name,
      competitor.address || '',
      competitor.distance.toString(),
      competitor.rating?.toString() || '',
      competitor.userRatingsTotal?.toString() || '',
      competitor.placeId,
    ]);
  });

  // 全データを結合
  const allRows = [...basicInfoRows, ...populationRows, ...competitorRows];

  // CSVに変換
  const csv = Papa.unparse(allRows, {
    header: false,
  });

  // ダウンロード
  downloadCSV(csv, filename);
}

/**
 * CSV文字列をファイルとしてダウンロード
 */
function downloadCSV(csvContent: string, filename: string) {
  // BOMを追加してExcelで文字化けしないようにする
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
