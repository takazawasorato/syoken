# 商圏分析 Web アプリケーション

## プロジェクト概要

クライアント向けの商圏分析Webアプリケーション。住所と施設カテゴリを入力することで、周辺の人口統計データと競合施設情報を分析し、CSV・スプレッドシート形式で出力する。

## 主要機能

### 1. 入力機能
- 住所入力（Googleオートコンプリート対応）
- 施設カテゴリ選択（例：ジム、コンビニ、飲食店など）
- 分析範囲選択
  - 円形範囲（半径指定: 500m/1000m/2000m）
  - 到達圏範囲（時間指定: 5分/10分/20分、移動手段: 車/徒歩）
  - 両方モード（円形＋到達圏の同時分析）

### 2. データ取得
- **Google Maps Geocoding API**: 住所から緯度経度を取得
- **jSTAT MAP API**: 周辺人口などの統計データを取得（円形範囲・到達圏対応）
- **Google Maps Places API**: 周辺の競合施設情報を取得
- **市区町村所得データ**: 総務省「市町村税課税状況等の調」データ
- **将来人口推計データ**: 国立社会保障・人口問題研究所「日本の地域別将来推計人口（2023年推計）」

### 3. データ出力
- CSV形式でダウンロード
- Excelレポート（リッチレポート機能）
- Googleスプレッドシートへのエクスポート

## 技術スタック

### フロントエンド
- React 19.2.0
- Next.js 15.5.6
- TypeScript
- Tailwind CSS（UI）
- Google Maps JavaScript API

### バックエンド
- Next.js API Routes
- Google APIs（Geocoding, Places, Sheets）
- jSTAT MAP API

### データ処理
- CSV生成: papaparse
- Excel生成: exceljs
- Google Sheets API: googleapis
- 将来人口データ: JSON形式（1,904市区町村、2020-2050年）

## API仕様

### Google Maps APIs
1. **Geocoding API** (`/api/geocoding`)
   - 用途: 住所 → 緯度経度変換
   - 実装: Next.js API Route経由

2. **Places API** (`/api/places`)
   - 用途: 周辺施設検索
   - 実装: Next.js API Route経由、距離計算・エリア分類機能付き

### jSTAT MAP API
- **Population Stats API** (`/api/stats`)
  - 用途: 国勢調査などの統計データ取得
  - 対応: 円形範囲、到達圏（車・徒歩）
  - 実装: jSTAT MAP APIラッパー

### 市区町村データAPI
1. **Income Data API** (`/api/municipal-income`)
   - 用途: 市区町村の所得データ取得
   - データ: 納税義務者数、総所得金額、一人当たり所得

2. **Future Population API** (`/api/future-population`)
   - 用途: 将来人口推計データ取得
   - データ: 2020-2050年の人口推移（5年刻み）

### Export APIs
1. **CSV Export** (クライアントサイド)
   - 用途: 分析結果をCSV形式でダウンロード

2. **Rich Report API** (`/api/export/richreport`)
   - 用途: Excelレポート生成
   - 機能: グラフ、スタイリング、複数シート

3. **Google Sheets API** (`/api/export/sheets`)
   - 用途: Googleスプレッドシートへのエクスポート

## 実装状況

### Phase 1: プロジェクトセットアップ ✅
- [x] Next.js プロジェクト初期化
- [x] 必要なパッケージのインストール
- [x] 環境変数設定（API キー）
- [x] ディレクトリ構造の作成

### Phase 2: データ取得機能 ✅
- [x] Geocoding API 連携実装
- [x] jSTAT MAP API 連携実装（円形・到達圏対応）
- [x] Places API 連携実装
- [x] API レスポンスの型定義
- [x] 市区町村所得データ統合
- [x] 将来人口推計データ統合

### Phase 3: UI実装 ✅
- [x] 住所入力フォーム（オートコンプリート付き）
- [x] 施設カテゴリ選択
- [x] 分析範囲選択（円形/到達圏/両方）
- [x] 検索結果表示（タブ切り替え式）
  - [x] 概要タブ
  - [x] 人口統計タブ（将来人口推計・所得データ・性別分布・年齢別人口）
  - [x] 競合施設タブ
- [x] 両方モード対応（円形＋到達圏の切り替え表示）

### Phase 4: データ出力機能 ✅
- [x] CSVエクスポート機能
- [x] Excelレポート機能（リッチレポート）
- [x] Googleスプレッドシートエクスポート機能

### Phase 5: 追加機能 ✅
- [x] 開発モード（モックデータ）
- [x] エラーハンドリング
- [x] トースト通知
- [x] レスポンシブデザイン
- [x] アクセシビリティ対応

## ディレクトリ構造

```
syoken/
├── app/
│   ├── page.tsx                          # メインページ
│   ├── layout.tsx                        # ルートレイアウト
│   ├── globals.css                       # グローバルスタイル
│   └── api/
│       ├── geocoding/route.ts            # Geocoding API
│       ├── stats/route.ts                # jSTAT MAP API
│       ├── places/route.ts               # Places API
│       ├── municipal-income/route.ts     # 市区町村所得データAPI
│       ├── future-population/route.ts    # 将来人口推計API
│       └── export/
│           ├── sheets/route.ts           # Googleスプレッドシート出力
│           └── richreport/route.ts       # Excelレポート出力
├── components/
│   ├── AnalysisForm.tsx                  # 分析フォーム
│   ├── ResultsDisplay.tsx                # 結果表示（タブ切り替え）
│   ├── FuturePopulationCard.tsx          # 将来人口推計カード
│   └── Toast.tsx                         # トースト通知
├── lib/
│   ├── csvExport.ts                      # CSV出力
│   ├── sheetsExport.ts                   # Googleスプレッドシート出力
│   ├── mockData.ts                       # モックデータ
│   ├── municipalIncome.ts                # 市区町村所得データ処理
│   └── futurePopulation.ts               # 将来人口データ処理
├── types/
│   └── index.ts                          # TypeScript型定義
├── public/
│   └── data/
│       ├── future_population.json        # 将来人口データ（1,904市区町村）
│       ├── future_population.xlsx        # 将来人口データ（基礎集計）
│       └── future_population_5age.xlsx   # 将来人口データ（5歳階級）
├── dev-data/                             # 開発用データ
│   ├── jstat-sample-response-circle.json
│   ├── jstat-sample-response-drivetime.json
│   └── places-sample-response.json
├── docs/                                 # ドキュメント
│   └── FEATURE_POPULATION_TREND.md       # 将来人口推計機能ドキュメント
├── .env.local                            # 環境変数
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── CLAUDE.md                             # プロジェクト概要
```

## 環境変数

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# jSTAT MAP API
JSTAT_API_KEY=your_jstat_api_key
JSTAT_USER_ID=your_jstat_user_email

# Google Sheets API（オプション）
GOOGLE_SHEETS_CREDENTIALS=your_base64_encoded_credentials

# Development Mode
NEXT_PUBLIC_USE_MOCK_DATA=true  # モックデータを使用する場合
ENABLE_API_CAPTURE=false        # APIレスポンスをキャプチャする場合
```

## データフロー

1. ユーザーが住所、施設カテゴリ、分析範囲を入力
2. Geocoding APIで緯度経度を取得
3. 並行して以下を実行:
   - jSTAT MAP APIで周辺人口統計を取得（円形または到達圏）
   - Places APIで周辺競合施設情報を取得
   - 市区町村所得データを取得（Geocoding結果から市区町村を特定）
   - 将来人口推計データを取得（市区町村コードで検索）
4. 取得データを統合・整形
5. 結果をタブ形式で表示（概要/人口統計/競合施設）
6. ユーザーが選択した形式で出力（CSV/Excel/スプレッドシート）

## 出力データ項目

### 基本情報
- 検索住所
- 緯度経度
- 施設カテゴリ
- 分析範囲（円形/到達圏）

### 人口統計データ
- 人口総数
- 年齢別人口（5歳階級）
- 性別人口
- 将来人口推計（2020-2050年）
- 市区町村所得データ
  - 納税義務者数
  - 総所得金額
  - 一人当たり所得

### 競合施設情報
- 施設名
- 住所
- 評価（rating）
- レビュー数
- 距離
- エリア分類（1次/2次/3次）
- Google Mapsリンク

## 参考リソース

### API・データソース
- [Google Maps Platform](https://developers.google.com/maps) - Geocoding, Places API
- [jSTAT MAP](https://jstatmap.e-stat.go.jp/) - 国勢調査データAPI
- [Google Sheets API](https://developers.google.com/sheets/api) - スプレッドシートAPI
- [総務省 市町村税課税状況等の調](https://www.soumu.go.jp/) - 市区町村所得データ
- [国立社会保障・人口問題研究所](https://www.ipss.go.jp/) - 将来人口推計データ

### フレームワーク・ライブラリ
- [Next.js 15](https://nextjs.org/) - React フレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [ExcelJS](https://github.com/exceljs/exceljs) - Excel生成ライブラリ

## 開発環境

### 開発モード
`NEXT_PUBLIC_USE_MOCK_DATA=true` を設定することで、モックデータを使用した開発が可能です。

- API呼び出しなしで動作確認
- 京都市左京区のサンプルデータを表示
- dev-data/ 配下のJSONファイルを使用

### APIレスポンスキャプチャ
`ENABLE_API_CAPTURE=true` を設定することで、実際のAPIレスポンスをファイルに保存できます。

- dev-data/captured-responses/ に保存
- モックデータの更新に使用

## 注意事項

### セキュリティ
- API キーは環境変数で管理し、リポジトリにコミットしないこと
- .env.local は .gitignore に含まれていることを確認
- Google Sheets認証情報はBase64エンコードして保存

### API制限
- Google Maps APIの利用には課金が発生する可能性があります
- jSTAT MAP APIにはレート制限があります
- 本番環境では適切なエラーハンドリングとリトライ処理を実装すること

### データ更新
- 将来人口推計データは2023年推計版を使用
- 市区町村所得データは最新年度のデータに更新可能
- データファイルは public/data/ に配置
