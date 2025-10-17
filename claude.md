# 商圏分析 Web アプリケーション

## プロジェクト概要

クライアント向けの商圏分析Webアプリケーション。住所と施設カテゴリを入力することで、周辺の人口統計データと競合施設情報を分析し、CSV・スプレッドシート形式で出力する。

## 主要機能

### 1. 入力機能
- 住所入力
- 施設カテゴリ選択（例：ジム、コンビニ、飲食店など）

### 2. データ取得
- **Google Maps Geocoding API**: 住所から緯度経度を取得
- **jSTAT MAP API**: 周辺人口などの統計データを取得（jstat.jsを参考）
- **Google Maps Places API**: 周辺の競合施設情報を取得

### 3. データ出力
- CSV形式でダウンロード
- Googleスプレッドシートへのエクスポート

## 技術スタック

### フロントエンド
- React / Next.js
- TypeScript
- Tailwind CSS（UI）
- Google Maps JavaScript API

### バックエンド
- Next.js API Routes / Node.js
- Google APIs（Geocoding, Places, Sheets）
- jSTAT MAP API

### データ処理
- CSV生成: papaparse / csv-writer
- Google Sheets API: googleapis

## API仕様

### Google Maps APIs
1. **Geocoding API**
   - 用途: 住所 → 緯度経度変換
   - エンドポイント: `https://maps.googleapis.com/maps/api/geocode/json`

2. **Places API**
   - 用途: 周辺施設検索
   - エンドポイント: `https://maps.googleapis.com/maps/api/place/nearbysearch/json`

### jSTAT MAP API
- 用途: 国勢調査などの統計データ取得
- 参考: jstat.js実装

### Google Sheets API
- 用途: スプレッドシートへのデータ書き込み

## 実装計画

### Phase 1: プロジェクトセットアップ
- [ ] Next.js プロジェクト初期化
- [ ] 必要なパッケージのインストール
- [ ] 環境変数設定（API キー）
- [ ] ディレクトリ構造の作成

### Phase 2: データ取得機能
- [ ] Geocoding API 連携実装
- [ ] jSTAT MAP API 連携実装
- [ ] Places API 連携実装
- [ ] API レスポンスの型定義

### Phase 3: UI実装
- [ ] 住所入力フォーム
- [ ] 施設カテゴリ選択
- [ ] 検索結果表示
- [ ] 地図表示（オプション）

### Phase 4: データ出力機能
- [ ] CSVエクスポート機能
- [ ] Googleスプレッドシートエクスポート機能
- [ ] ダウンロード機能

### Phase 5: テストとデプロイ
- [ ] APIテスト
- [ ] UI/UXテスト
- [ ] エラーハンドリング
- [ ] デプロイ準備

## ディレクトリ構造（予定）

```
syoken/
├── src/
│   ├── app/
│   │   ├── page.tsx          # メインページ
│   │   └── api/
│   │       ├── geocoding.ts  # Geocoding API
│   │       ├── stats.ts      # jSTAT MAP API
│   │       ├── places.ts     # Places API
│   │       └── export.ts     # スプレッドシート出力
│   ├── components/
│   │   ├── AddressInput.tsx
│   │   ├── CategorySelect.tsx
│   │   ├── ResultsTable.tsx
│   │   └── ExportButtons.tsx
│   ├── lib/
│   │   ├── googleMaps.ts
│   │   ├── jstatMap.ts
│   │   ├── csvExport.ts
│   │   └── sheetsExport.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── helpers.ts
├── public/
├── .env.local
├── package.json
├── tsconfig.json
└── claude.md
```

## 環境変数

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_SHEETS_CREDENTIALS=your_credentials_json
JSTAT_API_KEY=your_jstat_api_key (if required)
```

## データフロー

1. ユーザーが住所と施設カテゴリを入力
2. Geocoding APIで緯度経度を取得
3. 並行して以下を実行:
   - jSTAT MAP APIで周辺人口統計を取得
   - Places APIで周辺施設情報を取得
4. 取得データを統合・整形
5. ユーザーが選択した形式（CSV/スプレッドシート）で出力

## 出力データ項目（案）

### 基本情報
- 検索住所
- 緯度経度
- 施設カテゴリ

### 統計データ
- 人口総数
- 年齢別人口
- 世帯数
- その他jSTAT MAPから取得可能なデータ

### 競合施設情報
- 施設名
- 住所
- 評価（rating）
- 距離
- 営業時間
- 電話番号

## 参考リソース

- [Google Maps Platform](https://developers.google.com/maps)
- [jSTAT MAP](https://jstatmap.e-stat.go.jp/)
- [jstat.js](https://github.com/...)
- [Google Sheets API](https://developers.google.com/sheets/api)

## 注意事項

- Google Maps APIの利用には課金が発生する可能性があります
- API キーは環境変数で管理し、リポジトリにコミットしないこと
- レート制限に注意してAPI呼び出しを実装すること
