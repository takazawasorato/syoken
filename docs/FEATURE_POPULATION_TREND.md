# 人口動向（時系列）表示機能

## 概要

商圏分析アプリに、入力地点の市区町村の人口推移を時系列で表示する機能を追加します。
過去から現在、および将来推計までの人口動態を可視化し、商圏の将来性を判断する材料を提供します。

**実装予定日**: 2025-11-09
**データソース**:
- e-Stat API（総務省統計局）
- 国勢調査データ（時系列）
- 国立社会保障・人口問題研究所の将来推計人口

---

## 機能仕様

### 表示される情報

| カテゴリ | 項目 | 説明 | 期間 |
|---------|------|------|------|
| **過去データ** | 総人口 | 国勢調査による実測値 | 1995年〜2020年（5年ごと） |
| | 年齢3区分人口 | 0-14歳、15-64歳、65歳以上 | 同上 |
| | 人口増減率 | 前回調査比の増減率 | 同上 |
| **将来推計** | 推計人口 | 将来人口推計 | 2025年〜2045年（5年ごと） |
| | 高齢化率 | 65歳以上人口の割合 | 同上 |
| **トレンド分析** | 成長率 | 年平均人口増減率 | 算出 |
| | ピーク年 | 人口が最大だった年 | 算出 |

### データ表示イメージ

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
人口動向分析                    京都府 京都市
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 人口推移グラフ（1995-2045年）

[折れ線グラフ]
  1,500千人 ┤                  ●
           │              ●       ●
  1,400千人 ┤          ●           ●
           │      ●                 ●
  1,300千人 ┤  ●                     ●
           └──┬──┬──┬──┬──┬──┬──┬──┬──┬──
            1995 2000 2005 2010 2015 2020 2025 2030 2035 2040 2045
            ←──── 実績値 ────→ ←─── 推計値 ───→

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
主要指標

2020年人口    ピーク年      増減率(10年)   高齢化率
1,463千人    2010年        -2.3%          29.2%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

年齢3区分人口の推移

年度    0-14歳    15-64歳    65歳以上   総人口
2000    201千人    982千人    281千人   1,464千人
2005    193千人    946千人    324千人   1,463千人
2010    183千人    907千人    377千人   1,467千人
2015    173千人    867千人    421千人   1,461千人
2020    162千人    837千人    464千人   1,463千人

※データ出典: 総務省統計局 国勢調査
```

---

## 実装計画

### Phase 1: データソース調査・選定

#### 1.1 e-Stat API調査
- [ ] APIキー取得（e-Statユーザー登録）
- [ ] 国勢調査の時系列データID特定
- [ ] APIレスポンス形式確認
- [ ] レート制限確認

#### 1.2 代替データソースの検討
- [ ] 静的CSVファイルの使用（e-Stat統計表ダウンロード）
- [ ] 内閣府の地域経済分析システム（RESAS）API調査
- [ ] 国立社会保障・人口問題研究所の推計データ

### Phase 2: バックエンド実装

#### 2.1 型定義 (`types/index.ts`)
```typescript
// 人口動向データの型
export interface PopulationTrendData {
  municipalityName: string;
  prefectureName: string;
  municipalityCode: string;
  dataSource: string; // "e-Stat" | "IPSS" | "CSV"

  // 時系列データ
  timeSeries: PopulationTimePoint[];

  // トレンド指標
  trends: {
    peakYear: number;
    peakPopulation: number;
    currentGrowthRate: number; // 直近10年の年平均増減率
    agingRate2020: number; // 2020年高齢化率
    projectedAgingRate2045: number; // 2045年推計高齢化率
  };
}

export interface PopulationTimePoint {
  year: number;
  totalPopulation: number;
  ageGroups: {
    age0to14: number;
    age15to64: number;
    age65plus: number;
  };
  changeRate?: number; // 前回調査比増減率（%）
  isProjected: boolean; // true = 推計値, false = 実績値
}
```

#### 2.2 データ取得モジュール (`lib/populationTrend.ts`)

**方式A: e-Stat API使用**
```typescript
export async function getPopulationTrendFromAPI(
  municipalityCode: string
): Promise<PopulationTrendData>
```

**方式B: 静的CSVファイル使用**
```typescript
export function getPopulationTrendFromCSV(
  municipalityCode: string
): PopulationTrendData
```

#### 2.3 APIエンドポイント (`app/api/population-trend/route.ts`)

**エンドポイント**: `POST /api/population-trend`

**リクエスト**:
```json
{
  "address": "京都府京都市中央区"
}
```

または

```json
{
  "municipalityCode": "261009"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "municipalityName": "京都市",
    "prefectureName": "京都府",
    "municipalityCode": "261009",
    "dataSource": "e-Stat",
    "timeSeries": [
      {
        "year": 1995,
        "totalPopulation": 1463822,
        "ageGroups": {
          "age0to14": 223456,
          "age15to64": 982341,
          "age65plus": 258025
        },
        "isProjected": false
      },
      // ... 2000, 2005, 2010, 2015, 2020
      {
        "year": 2025,
        "totalPopulation": 1445000,
        "ageGroups": {
          "age0to14": 155000,
          "age15to64": 820000,
          "age65plus": 470000
        },
        "isProjected": true
      }
      // ... 2030, 2035, 2040, 2045
    ],
    "trends": {
      "peakYear": 2010,
      "peakPopulation": 1467000,
      "currentGrowthRate": -0.23,
      "agingRate2020": 29.2,
      "projectedAgingRate2045": 38.5
    }
  }
}
```

### Phase 3: フロントエンド実装

#### 3.1 コンポーネント設計

**新規コンポーネント**:
- `components/PopulationTrendChart.tsx` - 折れ線グラフ表示
- `components/PopulationTrendTable.tsx` - 年次テーブル表示
- `components/PopulationTrendSummary.tsx` - サマリーカード

#### 3.2 グラフライブラリ選定

候補:
1. **Recharts** (推奨)
   - React向け、宣言的
   - レスポンシブ対応
   - 軽量

2. **Chart.js + react-chartjs-2**
   - 豊富な機能
   - カスタマイズ性高い

3. **Nivo**
   - モダンなデザイン
   - アニメーション豊富

#### 3.3 UI配置

**表示位置**:
- 所得データカードの直後
- または、専用タブ「人口動向」を追加

**デザイン**:
- ブルー系のグラデーション背景（所得データとの差別化）
- 折れ線グラフ + サマリーカード + 詳細テーブルの3段構成

#### 3.4 既存コンポーネントへの統合

`app/page.tsx`:
```typescript
// 人口動向データを取得
let populationTrend = null;
try {
  const trendResponse = await fetch('/api/population-trend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: data.address }),
  });
  if (trendResponse.ok) {
    const trendResult = await trendResponse.json();
    populationTrend = trendResult.data;
  }
} catch (error) {
  console.warn('人口動向データの取得に失敗:', error);
}
```

`components/ResultsDisplay.tsx`:
```typescript
{result.populationTrend && (
  <div className="mt-6">
    <PopulationTrendSummary data={result.populationTrend} />
    <PopulationTrendChart data={result.populationTrend} />
    <PopulationTrendTable data={result.populationTrend} />
  </div>
)}
```

### Phase 4: データ準備

#### 4.1 e-Stat APIキー取得
1. https://www.e-stat.go.jp/api/ でユーザー登録
2. アプリケーションID発行
3. `.env.local` に設定

#### 4.2 統計表ID特定
- 国勢調査 時系列データ
- 市区町村別人口
- 年齢3区分別人口

#### 4.3 静的データ準備（フォールバック用）
- e-Statから主要市区町村のCSVダウンロード
- `public/data/population_trend_timeseries.csv` として配置

### Phase 5: テスト・最適化

- [ ] APIレスポンスのバリデーション
- [ ] エラーハンドリング（データなし、API障害）
- [ ] ローディング状態の表示
- [ ] モックデータの作成（開発用）
- [ ] パフォーマンス最適化（キャッシング）

---

## データソース詳細

### 1. e-Stat API

**メリット**:
- 最新データが自動取得可能
- 全国全市区町村をカバー
- 公式データソース

**デメリット**:
- APIキー取得が必要
- レート制限あり
- 将来推計データは別ソース

**実装方法**:
```typescript
// 1. 統計表リスト取得
GET /rest/3.0/app/getStatsList?appId={appId}&surveyYears=2020

// 2. メタ情報取得
GET /rest/3.0/app/getMetaInfo?appId={appId}&statsDataId={dataId}

// 3. データ取得
GET /rest/3.0/app/getStatsData?appId={appId}&statsDataId={dataId}&cdArea={code}
```

### 2. 静的CSVファイル

**メリット**:
- APIキー不要
- レスポンス高速
- オフライン動作可能

**デメリット**:
- データ更新が手動
- ファイルサイズ大
- 将来推計は別途取得

**ファイル構造**:
```csv
年度,団体コード,都道府県名,市区町村名,総人口,0-14歳,15-64歳,65歳以上,推計フラグ
2020,011002,北海道,札幌市,1973395,221456,1205678,546261,0
2025,011002,北海道,札幌市,1950000,205000,1180000,565000,1
...
```

### 3. 将来推計データ

**ソース**: 国立社会保障・人口問題研究所
- 「日本の地域別将来推計人口」
- 5年ごとの推計（2025年〜2045年）
- 市区町村別データあり

**取得方法**:
- Excelファイルダウンロード → CSV変換
- `public/data/population_projection.csv` として配置

---

## 技術スタック

### 新規パッケージ

```bash
npm install recharts
npm install date-fns  # 日付フォーマット用
```

### 環境変数

`.env.local`:
```env
# e-Stat API
ESTAT_API_KEY=your_estat_api_key_here

# データソース選択
POPULATION_TREND_DATA_SOURCE=api  # "api" | "csv"
```

---

## ファイル構成

```
syoken-population/
├── app/api/population-trend/
│   └── route.ts                       # 人口動向API
├── components/
│   ├── PopulationTrendChart.tsx       # グラフコンポーネント
│   ├── PopulationTrendTable.tsx       # テーブルコンポーネント
│   └── PopulationTrendSummary.tsx     # サマリーカード
├── lib/
│   ├── populationTrend.ts             # データ取得ロジック
│   └── populationTrendParser.ts       # CSVパーサー
├── public/data/
│   ├── population_trend_timeseries.csv  # 実績データ（CSV）
│   └── population_projection.csv        # 推計データ（CSV）
├── types/
│   └── index.ts                       # 型定義追加
├── utils/
│   └── estatApi.ts                    # e-Stat API クライアント
└── docs/
    └── FEATURE_POPULATION_TREND.md    # このドキュメント
```

---

## 実装順序

### Step 1: 基盤準備（1-2時間）
1. 型定義追加
2. e-Stat APIキー取得
3. 環境変数設定
4. Rechartsインストール

### Step 2: データ取得実装（2-3時間）
1. 静的CSVファイル準備
2. CSVパーサー実装
3. e-Stat APIクライアント実装（オプション）
4. APIエンドポイント実装

### Step 3: UI実装（3-4時間）
1. サマリーカードコンポーネント
2. グラフコンポーネント（Recharts）
3. テーブルコンポーネント
4. ResultsDisplayへの統合

### Step 4: テスト・調整（1-2時間）
1. モックデータ作成
2. エラーハンドリング
3. レスポンシブ対応確認
4. パフォーマンス確認

**総見積もり時間**: 7-11時間

---

## データ取得の優先順位

### Phase 1（MVP）: 静的CSVファイル
- 主要市区町村（100-200自治体）のデータのみ
- 2000年〜2020年の実績データ
- 手動更新

### Phase 2（拡張）: e-Stat API統合
- 全市区町村対応
- 自動更新
- キャッシング実装

### Phase 3（完全版）: 将来推計追加
- 2025年〜2045年推計データ
- トレンド分析機能
- 比較機能（全国平均、都道府県平均）

---

## UI/UXの考慮点

### 1. データがない場合の表示
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ℹ️  人口動向データ

この地域の人口動向データは現在利用できません。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. ローディング状態
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ 人口動向データを取得中...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. グラフのレスポンシブ対応
- デスクトップ: 横長グラフ
- タブレット: 正方形グラフ
- モバイル: 縦長グラフ + スクロール可能テーブル

### 4. カラーコーディング
- 実績値: 青色の実線
- 推計値: 青色の点線
- ピーク年: 赤色のマーカー
- 減少トレンド: オレンジ色の背景
- 増加トレンド: 緑色の背景

---

## 参考資料

### データソース
- [e-Stat API仕様](https://www.e-stat.go.jp/api/api-info/e-stat-manual2-1)
- [国勢調査 時系列データ](https://www.e-stat.go.jp/stat-search/files?tstat=000001011777)
- [国立社会保障・人口問題研究所](https://www.ipss.go.jp/)
- [地域別将来推計人口](https://www.ipss.go.jp/pp-shicyoson/j/shicyoson18/t-page.asp)

### 技術参考
- [Recharts Documentation](https://recharts.org/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Papaparse (CSV Parser)](https://www.papaparse.com/)

---

## 今後の拡張案

1. **地域比較機能**: 全国平均・都道府県平均との比較グラフ
2. **将来推計の複数シナリオ**: 高位・中位・低位推計の表示
3. **自然増減・社会増減の分析**: 出生・死亡・転入・転出の内訳
4. **年齢ピラミッド**: 特定年次の人口ピラミッド表示
5. **エクスポート機能**: グラフ画像・PDFダウンロード
6. **アラート機能**: 急激な人口減少地域への警告表示

---

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-11-09 | 0.1.0 | 初版作成・機能設計 |
