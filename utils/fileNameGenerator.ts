/**
 * Excelレポートのファイル名を生成するユーティリティ関数
 */

interface FileNameParams {
  rangeType: 'circle' | 'driveTime' | 'both';
  category?: string;
  address: string;
}

/**
 * 商圏分析レポートのファイル名を生成
 * 形式: 商圏分析レポート_{分析タイプ}_{住所概要}_{日時}.xlsx
 */
export function generateReportFileName(params: FileNameParams): string {
  const typeMap: Record<string, string> = {
    circle: '円形',
    driveTime: '到達圏',
    both: '両方'
  };

  const rangeTypeText = typeMap[params.rangeType] || params.rangeType;
  const addressShort = extractShortAddress(params.address);
  const timestamp = formatTimestamp();

  // カテゴリがある場合は含める
  const categoryPart = params.category ? `_${params.category}` : '';

  return `商圏分析レポート_${rangeTypeText}${categoryPart}_${addressShort}_${timestamp}.xlsx`;
}

/**
 * 住所から市区町村レベルの概要を抽出
 */
function extractShortAddress(fullAddress: string): string {
  // 例: 「日本、〒606-0863 京都府京都市左京区下鴨東本町２６−３」
  // → 「京都市左京区下鴨東本町」

  let cleaned = fullAddress
    // 「日本、」を削除
    .replace(/^日本[、,]\s*/, '')
    // 郵便番号を削除
    .replace(/〒[\d-]+\s*/g, '')
    // 都道府県名を削除（「東京都」「大阪府」「京都府」「北海道」「〜県」）
    .replace(/(東京都|大阪府|京都府|北海道|[^\s]+県)\s*/g, '')
    // 番地以降を削除（数字-数字のパターン、または丁目以降の数字）
    .replace(/[０-９0-9]+[-−][０-９0-9]+.*$/, '')
    .replace(/[０-９0-9]+丁目.*$/, '')
    // 全角数字と半角数字の後に続く文字を削除
    .replace(/[０-９0-9]+.*$/, '')
    // スペースを削除
    .replace(/\s+/g, '')
    // 特殊文字を削除（ファイル名に使えない文字）
    .replace(/[/\\:*?"<>|]/g, '');

  // 最大20文字に制限
  if (cleaned.length > 20) {
    cleaned = cleaned.substring(0, 20);
  }

  // 空の場合はデフォルト値
  return cleaned || '地点';
}

/**
 * タイムスタンプをフォーマット（YYYYMMDD_HHMMSS形式）
 */
function formatTimestamp(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/**
 * ファイル名をURLエンコード（ダウンロード用）
 */
export function encodeFileName(fileName: string): string {
  return encodeURIComponent(fileName);
}
