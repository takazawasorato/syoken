/**
 * APIレスポンスキャプチャーユーティリティ
 * 開発環境でAPIレスポンスをファイルとして保存し、モックデータとして使用できるようにする
 */

import fs from 'fs';
import path from 'path';

/**
 * APIレスポンスをJSON形式でファイルに保存
 * 開発環境でのみ動作
 */
export function captureApiResponseToJson(
  apiName: string,
  response: any,
  options?: {
    subdirectory?: string; // dev-data内のサブディレクトリ
    customFilename?: string; // カスタムファイル名
  }
): string | null {
  // 開発環境でのみ実行
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // キャプチャー機能の有効化フラグ（環境変数で制御）
  if (process.env.ENABLE_API_CAPTURE !== 'true') {
    return null;
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = options?.customFilename || `${apiName}_${timestamp}.json`;

    // 保存先ディレクトリ
    const baseDir = path.join(process.cwd(), 'dev-data');
    const targetDir = options?.subdirectory
      ? path.join(baseDir, options.subdirectory)
      : baseDir;

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filepath = path.join(targetDir, filename);

    // JSONファイルとして保存
    fs.writeFileSync(
      filepath,
      JSON.stringify(response, null, 2),
      'utf-8'
    );

    console.log(`[API Capture] Response saved to: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error('[API Capture] Failed to save response:', error);
    return null;
  }
}

/**
 * APIレスポンスをCSV形式でファイルに保存
 * 主にフラットなデータ構造（競合施設リストなど）に使用
 */
export function captureApiResponseToCsv(
  apiName: string,
  data: any[],
  options?: {
    subdirectory?: string;
    customFilename?: string;
  }
): string | null {
  // 開発環境でのみ実行
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // キャプチャー機能の有効化フラグ
  if (process.env.ENABLE_API_CAPTURE !== 'true') {
    return null;
  }

  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[API Capture] Data is empty or not an array');
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = options?.customFilename || `${apiName}_${timestamp}.csv`;

    // 保存先ディレクトリ
    const baseDir = path.join(process.cwd(), 'dev-data');
    const targetDir = options?.subdirectory
      ? path.join(baseDir, options.subdirectory)
      : baseDir;

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filepath = path.join(targetDir, filename);

    // CSVヘッダーを作成（最初のオブジェクトのキーから）
    const headers = Object.keys(data[0]);
    const csvHeader = headers.join(',');

    // CSVデータ行を作成
    const csvRows = data.map(item => {
      return headers.map(header => {
        const value = item[header];
        // 値がオブジェクトまたは配列の場合はJSON文字列化
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // 文字列の場合はダブルクォートでエスケープ
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');

    // CSVファイルとして保存
    fs.writeFileSync(filepath, csvContent, 'utf-8');

    console.log(`[API Capture] CSV saved to: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error('[API Capture] Failed to save CSV:', error);
    return null;
  }
}

/**
 * キャプチャーされたレスポンスをロード
 */
export function loadCapturedResponse(filename: string, subdirectory?: string): any {
  try {
    const baseDir = path.join(process.cwd(), 'dev-data');
    const targetDir = subdirectory
      ? path.join(baseDir, subdirectory)
      : baseDir;

    const filepath = path.join(targetDir, filename);

    if (!fs.existsSync(filepath)) {
      console.warn(`[API Capture] File not found: ${filepath}`);
      return null;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('[API Capture] Failed to load response:', error);
    return null;
  }
}

/**
 * 利用可能なキャプチャーファイル一覧を取得
 */
export function listCapturedFiles(subdirectory?: string): string[] {
  try {
    const baseDir = path.join(process.cwd(), 'dev-data');
    const targetDir = subdirectory
      ? path.join(baseDir, subdirectory)
      : baseDir;

    if (!fs.existsSync(targetDir)) {
      return [];
    }

    return fs.readdirSync(targetDir)
      .filter(file => file.endsWith('.json') || file.endsWith('.csv'))
      .sort()
      .reverse(); // 新しい順
  } catch (error) {
    console.error('[API Capture] Failed to list files:', error);
    return [];
  }
}

/**
 * キャプチャー機能が有効かどうかを確認
 */
export function isCaptureModeEnabled(): boolean {
  return process.env.NODE_ENV === 'development' &&
         process.env.ENABLE_API_CAPTURE === 'true';
}
