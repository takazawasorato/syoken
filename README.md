# 商圏分析 Web アプリケーション

クライアント向けの商圏分析Webアプリケーション。住所と施設カテゴリを入力することで、周辺の人口統計データと競合施設情報を分析し、CSV・スプレッドシート形式で出力できます。

## 主要機能

- **住所から緯度経度を取得** (Google Maps Geocoding API)
- **周辺人口統計データの取得** (jSTAT MAP API)
- **競合施設情報の取得** (Google Maps Places API)
- **CSV形式でのデータエクスポート**
- **Googleスプレッドシートへのデータエクスポート**

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データ処理**: papaparse (CSV), googleapis (Google Sheets)
- **APIs**: Google Maps API, jSTAT MAP API

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` を `.env.local` にコピーして、以下の環境変数を設定してください。

```bash
cp .env.local.example .env.local
```

`.env.local` ファイルを編集:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# jSTAT MAP API Credentials
JSTAT_API_KEY=your_jstat_api_key_here
JSTAT_USER_ID=your_jstat_user_id_here

# Google Sheets API (サービスアカウントのJSON credentialsをBase64エンコードして設定)
GOOGLE_SHEETS_CREDENTIALS=your_base64_encoded_credentials_here
```

### 3. API キーの取得方法

#### Google Maps API

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. 以下のAPIを有効化:
   - Geocoding API
   - Places API
4. 認証情報からAPIキーを作成
5. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` に設定

#### jSTAT MAP API

1. [jSTAT MAP](https://jstatmap.e-stat.go.jp/) にアクセス
2. アカウント登録
3. APIキーとユーザーIDを取得
4. `JSTAT_API_KEY` と `JSTAT_USER_ID` に設定

#### Google Sheets API

1. Google Cloud Consoleでサービスアカウントを作成
2. Google Sheets APIを有効化
3. サービスアカウントのJSONキーをダウンロード
4. JSONファイルをBase64エンコード:

```bash
cat credentials.json | base64
```

5. エンコードされた文字列を `GOOGLE_SHEETS_CREDENTIALS` に設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## プロジェクト構成

```
syoken/
├── app/
│   ├── api/
│   │   ├── geocoding/
│   │   │   └── route.ts       # Geocoding API
│   │   ├── stats/
│   │   │   └── route.ts       # jSTAT MAP API
│   │   ├── places/
│   │   │   └── route.ts       # Places API
│   │   └── export/
│   │       └── sheets/
│   │           └── route.ts   # Googleスプレッドシート出力
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # メインページ
├── components/
│   ├── AnalysisForm.tsx       # 入力フォーム
│   └── ResultsDisplay.tsx     # 結果表示
├── lib/
│   └── csvExport.ts           # CSV出力機能
├── types/
│   └── index.ts               # TypeScript型定義
└── package.json
```

## 使い方

1. **住所を入力**: 分析したい地点の住所を入力
2. **施設カテゴリを選択**: 競合として検索したい施設タイプを選択（例：ジム、カフェ）
3. **検索半径を設定**: 0.5km〜5kmの範囲でスライダーで設定
4. **分析を開始**: ボタンをクリックして分析を実行
5. **結果を確認**: 人口統計データと競合施設情報が表示されます
6. **エクスポート**: CSVダウンロードまたはGoogleスプレッドシートへ出力

## データ出力項目

### 基本情報
- 住所
- 緯度・経度
- カテゴリ
- 検索半径

### 人口統計データ
- 総人口
- 年齢別人口（男女別）
- 産業別従業者数

### 競合施設情報
- 施設名
- 住所
- 距離（メートル）
- 評価
- レビュー数
- Place ID

## ビルド

本番環境用のビルド:

```bash
npm run build
npm start
```

## 注意事項

- Google Maps APIの利用には課金が発生する可能性があります
- API キーは環境変数で管理し、リポジトリにコミットしないでください
- レート制限に注意してAPI呼び出しを行ってください
- `.env.local` ファイルは `.gitignore` に含まれています

## ライセンス

ISC

## 参考

- [Google Maps Platform](https://developers.google.com/maps)
- [jSTAT MAP](https://jstatmap.e-stat.go.jp/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Next.js Documentation](https://nextjs.org/docs)
