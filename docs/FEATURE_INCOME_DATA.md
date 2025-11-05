# 市区町村所得データ表示機能

## 概要

商圏分析アプリに、入力地点の市区町村の所得水準を表示する機能を追加しました。

**実装日**: 2025-11-06
**データソース**: 総務省「市町村税課税状況等の調」令和6年度（2024年度）

---

## 機能仕様

### 表示される情報

| 項目 | 説明 | 単位 |
|------|------|------|
| **市区町村名** | 都道府県名 + 市区町村名 | - |
| **データ年度** | データの年度 | 年 |
| **納税義務者数** | 所得割の納税義務者数 | 人 |
| **総所得金額** | 総所得金額等 | 億円 |
| **一人当たり所得** | 納税義務者一人当たりの平均所得 | 千円 |

### データ例

```
市区町村所得データ                      2024年度
京都府 京都市

納税義務者数    総所得金額      一人当たり所得
683,942 人     2,450.2 億円    3,582 千円

※出典: 総務省「市町村税課税状況等の調」
```

---

## 実装内容

### 1. データ取得・変換

#### 1.1 データソース
- **ファイル**: `J51-24-b.xlsx` (令和6年度 第11表市町村別データ)
- **取得元**: 総務省 市町村税課税状況等の調
- **カバー範囲**: 全国1,700以上の市区町村

#### 1.2 データ変換
```bash
# Excelファイル → CSV変換
node scripts/convertNewDataToCSV.js

# 出力先
public/data/municipal_income_2024.csv
```

#### 1.3 CSV構造
```csv
年度,団体コード,都道府県名,団体名,表側,所得割の納税義務者数,総所得金額等,...
2024,011002,北海道,札幌市,市町村民税,874563,3051212018,...
```

### 2. バックエンド実装

#### 2.1 型定義 (`types/index.ts`)
```typescript
export interface MunicipalIncomeData {
  municipalityName: string;  // 市区町村名（例: "札幌市"）
  prefectureName: string;    // 都道府県名（例: "北海道"）
  municipalityCode: string;  // 市区町村コード（団体コード）
  dataYear: number;          // データ年度（例: 2024）
  taxpayerCount: number | null;      // 所得割の納税義務者数（人）
  totalIncome: number | null;        // 総所得金額等（千円）
  averageIncome: number | null;      // 一人当たり所得（千円） - 計算値
}
```

#### 2.2 データパーサー (`utils/incomeDataParser.ts`)

**主要機能**:
- CSVファイルの読み込み・パース
- 市区町村名による検索（複数パターン対応）
- 住所文字列から市区町村名の抽出

**検索パターン**:
```typescript
// 以下の形式で検索可能
- 市区町村名のみ: "札幌市"
- 都道府県+市区町村: "北海道 札幌市"
- スペースなし: "北海道札幌市"
- 市区町村コード: "011002"
```

#### 2.3 API エンドポイント (`app/api/income/route.ts`)

**エンドポイント**: `POST /api/income`

**リクエスト**:
```json
{
  "address": "北海道札幌市中央区"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "municipalityName": "札幌市",
    "prefectureName": "北海道",
    "municipalityCode": "011002",
    "dataYear": 2024,
    "taxpayerCount": 874563,
    "totalIncome": 3051212018,
    "averageIncome": 3489
  }
}
```

### 3. フロントエンド実装

#### 3.1 API呼び出し統合 (`app/page.tsx`)

geocoding API呼び出し後、所得データAPIを並行して呼び出し:

```typescript
// 所得データを取得（エラーは無視して続行）
let incomeData = null;
try {
  const incomeResponse = await fetch('/api/income', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: data.address }),
  });
  if (incomeResponse.ok) {
    const incomeResult = await incomeResponse.json();
    incomeData = incomeResult.data;
  }
} catch (error) {
  console.warn('所得データの取得に失敗しました:', error);
}
```

#### 3.2 UI表示 (`components/ResultsDisplay.tsx`)

**表示位置**:
- 「両方モード」切り替えUIの直後
- サマリーカード（総人口・競合施設・カテゴリ）の直前

**デザイン**:
- オレンジ色のグラデーション背景
- 3カラムレイアウト（納税義務者数・総所得金額・一人当たり所得）
- レスポンシブ対応

#### 3.3 モックデータ対応 (`lib/mockData.ts`)

開発モード用のモックデータに所得データを追加:

```typescript
incomeData: {
  municipalityName: '京都市',
  prefectureName: '京都府',
  municipalityCode: '261009',
  dataYear: 2024,
  taxpayerCount: 683942,
  totalIncome: 2450158946,
  averageIncome: 3582,
}
```

---

## ファイル構成

```
syoken/
├── public/data/
│   ├── municipal_income_2024.csv         # 変換後のCSVデータ
│   └── J51-24-b.xlsx                     # 元データ（Excel）
├── app/api/income/
│   └── route.ts                          # 所得データAPI
├── utils/
│   └── incomeDataParser.ts               # データパーサー
├── types/
│   └── index.ts                          # 型定義（MunicipalIncomeData）
├── scripts/
│   ├── convertNewDataToCSV.js            # Excel→CSV変換スクリプト
│   └── analyzeNewData.js                 # データ構造分析スクリプト
├── components/
│   └── ResultsDisplay.tsx                # UI表示コンポーネント
├── lib/
│   └── mockData.ts                       # モックデータ
└── docs/
    └── FEATURE_INCOME_DATA.md            # このドキュメント
```

---

## 使用方法

### 本番モード（実際のAPI使用）

1. `.env.local` で `NEXT_PUBLIC_USE_MOCK_DATA=false` に設定（またはこの行を削除）
2. アプリを起動: `npm run dev`
3. 住所を入力して分析を実行
4. 所得データが自動的に表示される

### 開発モード（モックデータ使用）

1. `.env.local` で `NEXT_PUBLIC_USE_MOCK_DATA=true` に設定
2. アプリを起動: `npm run dev`
3. 住所を入力して分析を実行
4. 京都市のモックデータが表示される

---

## データ更新方法

### 新しい年度のデータに更新する場合

1. **データ取得**
   ```
   総務省「市町村税課税状況等の調」の最新データ（Excelファイル）をダウンロード
   https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/ichiran09.html
   ```

2. **ファイル配置**
   ```bash
   # Excelファイルを配置
   mv 新しいファイル.xlsx public/data/J51-24-b.xlsx
   ```

3. **CSV変換**
   ```bash
   node scripts/convertNewDataToCSV.js
   ```

4. **動作確認**
   ```bash
   # APIテスト
   curl -X POST http://localhost:3000/api/income \
     -H "Content-Type: application/json" \
     -d '{"address": "東京都千代田区"}'
   ```

---

## トラブルシューティング

### 所得データが表示されない

**原因1: 市区町村名が抽出できない**
- 住所の形式を確認（都道府県+市区町村を含む完全な住所）
- ブラウザの開発者ツールでConsoleログを確認

**原因2: データが見つからない**
- 入力した市区町村がデータに含まれているか確認
- CSVファイルが正しく配置されているか確認: `public/data/municipal_income_2024.csv`

**原因3: モックデータが表示されない**
- `lib/mockData.ts` に `incomeData` が追加されているか確認
- ブラウザをハードリロード（Ctrl+Shift+R）

### APIエラー

```bash
# データパーサーのテスト
node -e "
const { getMunicipalIncomeData } = require('./utils/incomeDataParser.ts');
console.log(getMunicipalIncomeData('札幌市'));
"
```

---

## データの詳細

### 課税対象所得とは

- **定義**: 各種所得控除後の課税標準となる所得金額
- **対象**: 所得割の納税義務者（個人住民税を支払う人）
- **除外**: 非課税世帯、所得が一定額以下の世帯

### 一人当たり所得の計算

```typescript
averageIncome = totalIncome / taxpayerCount
```

- 単位: 千円
- 注意: 納税義務者ベースのため、実際の住民全体の平均よりも高めの値となる

---

## 参考リンク

- [総務省 市町村税課税状況等の調](https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/ichiran09.html)
- [総務省 地方税に関する統計等](https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/czei_shiryo_ichiran.html)
- [e-Stat 政府統計の総合窓口](https://www.e-stat.go.jp/)

---

## 今後の拡張案

1. **年次推移の表示**: 過去5年分のデータを取得して推移グラフを表示
2. **全国順位の表示**: 同じ都道府県内や全国での所得順位を表示
3. **産業別所得**: 産業別の所得データがある場合は追加表示
4. **世帯数データ**: 納税義務者数だけでなく世帯数も表示
5. **CSVエクスポート**: 所得データもCSV出力に含める

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-11-06 | 1.0.0 | 初版リリース・令和6年度データ対応 |
