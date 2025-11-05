# モックデータ仕様書

## 概要

実際のAPIレスポンスをキャプチャーしたJSONファイルを使用したモックデータシステム。
手動でダミーデータを書く必要はなく、キャプチャー機能で簡単に更新できます。

## アーキテクチャ

```
dev-data/
├── captured-responses/        # APIキャプチャー（一時保存）
│   ├── jstat_circle_response.json
│   ├── jstat_driveTime_response.json
│   └── places_response.json
├── jstat-sample-response-circle.json      # メインのモックデータ
├── jstat-sample-response-drivetime.json   # メインのモックデータ
└── places-sample-response.json            # メインのモックデータ

lib/
└── mockData.ts               # JSONを読み込んで関数で提供
```

## モックデータの有効化

`.env.local`ファイルで以下の環境変数を設定：

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## 提供されるモックデータ

### 1. `mockAnalysisResult` - 基本分析結果

**対象エリア**: 京都市左京区下鴨東本町
**分析タイプ**: 円形範囲 (500m / 1000m / 2000m)
**カテゴリ**: ジム

**含まれるデータ**:
- 住所と座標情報
- 人口統計データ
  - 総人口: 5,489人
  - 年齢別人口（16階層）
  - 産業別データ（10業種）
- jSTAT MAP APIの生データ
- 競合施設情報（4件）
  - カーブス 京都下鴨（280m）
  - フィットネスクラブ コ・ス・パ 北山（850m）
  - ゴールドジム 京都二条（1,520m）
  - エニタイムフィットネス 京都出町柳店（620m）

### 2. `mockDualAnalysisResult` - 両方モード分析結果

**対象エリア**: 京都市左京区下鴨東本町
**分析タイプ**: 円形 + 到達圏（両方モード）

**円形範囲データ**:
- 範囲設定: 500m / 1000m / 2000m
- 総人口: 5,489人
- 競合施設: 2件

**到達圏データ**:
- 時間設定: 5分 / 10分 / 20分（車、30km/h）
- 総人口: 12,489人
- 競合施設: 3件

## 使用方法

### パターン1: 関数で取得（推奨）

```typescript
import { getMockAnalysisResult, getMockDualAnalysisResult } from '@/lib/mockData';

// 単一モード
const singleResult = getMockAnalysisResult();

// 両方モード
const dualResult = getMockDualAnalysisResult();
```

### パターン2: JSONを直接使用

```typescript
import { mockJstatCircle, mockJstatDriveTime, mockPlaces } from '@/lib/mockData';

// 生のJSONデータを直接使用
console.log(mockJstatCircle.GET_SUMMARY);
console.log(mockPlaces.results);
```

### パターン3: 開発モードフラグで分岐

```typescript
import { isDevelopmentMode, getMockAnalysisResult } from '@/lib/mockData';

if (isDevelopmentMode) {
  // モックデータを使用
  return getMockAnalysisResult();
} else {
  // 実際のAPIを呼び出す
  return await fetchRealData();
}
```

## データソース

- **人口統計データ**: jSTAT MAP API実データに基づく
- **JSONファイル**: `/dev-data/jstat-sample-response.json`
- **競合施設**: 京都市左京区周辺の実在ジムを参考

## 更新履歴

### 2025-11-05 (v2)
- **重要**: `app/page.tsx` のモックモードを本番モードと同じ構造に統一
- モックモードで `rangeType` パラメータを正しく処理するように改善
- 「両方」モードでも正しいExcelレポートが生成されるように修正
- モックと本番で同じデータ構造を使用することで一貫性を確保

### 2025-11-05 (v1)
- 京都市左京区のデータに更新
- 両方モード (`DualAnalysisResult`) 対応
- `jstat-sample-response-drivetime.json` への依存を削除
- 欠損ファイルエラーを修正
- 最新のAPI構造に合わせて更新

### 2024-10-18
- 初期バージョン（東京都新宿区のデータ）

## 注意事項

1. モックデータは開発・テスト目的のみで使用してください
2. 本番環境では必ず `NEXT_PUBLIC_USE_MOCK_DATA=false` に設定してください
3. 競合施設のPlace IDはサンプル用のダミーIDです
4. 実際のAPI呼び出しとレスポンス構造が同じになるように設計されています
