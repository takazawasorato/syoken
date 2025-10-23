# 商圏分析 Web アプリケーション

クライアント向けの商圏分析Webアプリケーション。住所と施設カテゴリを入力することで、周辺の人口統計データと競合施設情報を分析し、レポートとして出力できます。

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 目次

- [機能](#-機能)
- [技術スタック](#-技術スタック)
- [環境構築](#-環境構築)
- [使い方](#-使い方)
- [API設定](#-api設定)
- [開発モード](#-開発モード)
- [エクスポート機能](#-エクスポート機能)
- [デザインシステム](#-デザインシステム)
- [ディレクトリ構造](#-ディレクトリ構造)

---

## 🚀 機能

### 主要機能

1. **住所検索と地理情報取得**
   - Google Maps Geocoding APIによる住所の緯度経度変換
   - 高精度な位置情報の取得

2. **商圏範囲設定**
   - **円形範囲**: 直線距離ベースの商圏設定（500m～5km）
   - **到達圏**: 移動時間ベースの商圏設定（車・徒歩・自転車）

3. **人口統計データ分析**
   - jSTAT MAP APIによる国勢調査データ取得
   - 年齢別・性別人口の詳細分析
   - 世帯数などの統計情報

4. **競合施設分析**
   - Google Places APIによる周辺施設検索
   - 距離別のエリア分類（1次・2次・3次エリア）
   - 施設の評価・レビュー数・詳細情報

5. **データ可視化**
   - インタラクティブなチャート表示
   - エリア別の統計グラフ
   - タブ形式の見やすいデータ表示

6. **多様なエクスポート機能**
   - CSV形式でのダウンロード
   - Excelレポート（グラフ・表付き）
   - Googleスプレッドシートへの直接出力

---

## 🛠 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| [Next.js](https://nextjs.org/) | 15.5.6 | Reactフレームワーク |
| [React](https://react.dev/) | 19.2.0 | UIライブラリ |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | 型安全な開発 |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.14 | ユーティリティファーストCSS |

### バックエンド

| 技術 | 用途 |
|------|------|
| Next.js API Routes | サーバーサイドAPI |
| Node.js | ランタイム環境 |

### データ処理・エクスポート

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| [PapaParse](https://www.papaparse.com/) | 5.5.3 | CSV生成・解析 |
| [ExcelJS](https://github.com/exceljs/exceljs) | 4.4.0 | Excel生成 |
| [googleapis](https://github.com/googleapis/google-api-nodejs-client) | 164.0.0 | Google API連携 |
| [axios](https://axios-http.com/) | 1.12.2 | HTTP通信 |

### 外部API

| API | 用途 |
|-----|------|
| Google Maps Geocoding API | 住所 → 緯度経度変換 |
| Google Maps Places API | 周辺施設検索 |
| jSTAT MAP API | 国勢調査統計データ |
| Google Sheets API | スプレッドシート書き込み |

### デザインシステム

- デジタル庁デザインシステムの原則を採用
- アクセシビリティ重視（WCAG 2.1 AA準拠）
- レスポンシブデザイン

---

## 💻 環境構築

### 必要な環境

- Node.js 18.x 以上
- npm または yarn
- Google Cloud Platform アカウント（API利用のため）

### インストール

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd syoken
```

2. **依存パッケージのインストール**
```bash
npm install
```

3. **環境変数の設定**

`.env.local.example`を`.env.local`にコピーして編集:

```bash
cp .env.local.example .env.local
```

`.env.local`に以下を設定:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Google Sheets API (サービスアカウントのJSON)
GOOGLE_SHEETS_CREDENTIALS='{
  "type": "service_account",
  "project_id": "...",
  "private_key": "...",
  ...
}'

# jSTAT MAP API (必要に応じて)
JSTAT_API_KEY=your_jstat_api_key

# 開発モード (モックデータ使用)
NEXT_PUBLIC_USE_MOCK_DATA=false
```

4. **開発サーバーの起動**
```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

---

## 📖 使い方

### 基本的な使用手順

#### 1. 住所の入力
- 分析したい場所の住所を入力
- 例: 「東京都渋谷区道玄坂1-1-1」

#### 2. 施設カテゴリの選択
以下のカテゴリから選択:
- ジム
- フィットネスクラブ
- コンビニ
- カフェ
- レストラン
- 美容院
- 歯科医院
- 薬局

#### 3. 商圏範囲の設定

**円形範囲の場合:**
- 1次エリア: 100m～1,000m
- 2次エリア: 500m～2,000m
- 3次エリア: 1,000m～5,000m

**到達圏の場合:**
- 1次エリア: 1～10分
- 2次エリア: 5～20分
- 3次エリア: 10～40分
- 平均時速: 20～60km/h
- 移動手段: 車 / 徒歩 / 自転車

#### 4. 分析の実行
「分析を開始」ボタンをクリック

#### 5. 結果の確認
3つのタブで結果を確認:
- **概要**: 基本情報とエリア別競合施設数
- **人口統計**: 性別・年齢別人口の詳細データ
- **競合施設**: エリア別の施設一覧と詳細情報

#### 6. データのエクスポート
- **CSVダウンロード**: シンプルなデータ形式
- **Excelレポート**: グラフ付きの詳細レポート
- **スプレッドシート**: Google Sheetsに直接出力

---

## 🔑 API設定

### Google Cloud Platform の設定

#### 1. プロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成

#### 2. APIの有効化
以下のAPIを有効化:
- Maps JavaScript API
- Geocoding API
- Places API
- Google Sheets API

#### 3. APIキーの作成
1. 「認証情報」→「認証情報を作成」→「APIキー」
2. APIキーの制限を設定（推奨）:
   - アプリケーションの制限: HTTPリファラー
   - API の制限: 上記の4つのAPIのみ

#### 4. Google Sheets API の設定
1. サービスアカウントの作成
2. JSON キーファイルをダウンロード
3. `.env.local`の`GOOGLE_SHEETS_CREDENTIALS`に設定

### jSTAT MAP API の設定

1. [jSTAT MAP](https://jstatmap.e-stat.go.jp/) でアカウント作成
2. APIキーを取得
3. `.env.local`に設定（必要に応じて）

---

## 🧪 開発モード

### モックデータの使用

APIクォータの消費を避けるため、開発時はモックデータを使用できます。

**設定方法:**

`.env.local`に追加:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

または、`lib/mockData.ts`で直接設定:
```typescript
export const isDevelopmentMode = true;
```

**モックデータの特徴:**
- 実際のAPIを呼び出さない
- 即座に結果が返る
- リアルなサンプルデータ
- UI/UXのテストに最適

---

## 📊 エクスポート機能

### 1. CSVダウンロード

**特徴:**
- 軽量なファイルサイズ
- Excelやスプレッドシートで開ける
- データの再利用が容易

**含まれるデータ:**
- 基本情報（住所、座標、カテゴリ）
- 人口統計データ
- 競合施設一覧

### 2. Excelレポート

**特徴:**
- グラフ付きの詳細レポート
- 複数シートで構造化
- 視覚的にわかりやすい
- プレゼンテーションに最適

**シート構成:**
- サマリーシート: 概要とグラフ
- 人口統計シート: 詳細な統計データ
- 競合施設シート: 施設リストとマップリンク
- 生データシート: jSTAT MAP APIの元データ

### 3. Googleスプレッドシート

**特徴:**
- クラウドで即座に共有可能
- リアルタイム共同編集
- 自動的に新しいシートを作成
- ブラウザで開く

**権限設定:**
サービスアカウントのメールアドレスに共有権限を付与

---

## 🎨 デザインシステム

このアプリケーションは、[デジタル庁デザインシステム](https://github.com/digital-go-jp/design-system-example-components-react)の原則を参考にしています。

### デザイン原則

1. **一貫性**: 統一されたデザイントークン
2. **シンプルさ**: クリーンで機能的なUI
3. **アクセシビリティ**: WCAG 2.1 AA準拠
4. **レスポンシブ**: すべてのデバイスに対応

### 主要な特徴

- 政府系サービスに適した信頼性の高いカラーパレット
- 日本語に最適化されたタイポグラフィ
- キーボードナビゲーション完全対応
- スクリーンリーダー対応
- 明確なフォーカス表示

詳細は [DESIGN.md](./docs/DESIGN.md) を参照してください。

---

## 📁 ディレクトリ構造

```
syoken/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # メインページ
│   ├── globals.css               # グローバルスタイル（デザイントークン）
│   ├── layout.tsx                # レイアウトコンポーネント
│   ├── design-system/            # デザインシステム参照ページ
│   └── api/                      # API Routes
│       ├── geocoding/            # Geocoding API
│       │   └── route.ts
│       ├── stats/                # jSTAT MAP API
│       │   └── route.ts
│       ├── places/               # Places API
│       │   └── route.ts
│       └── export/               # エクスポート機能
│           ├── sheets/           # Google Sheets
│           │   └── route.ts
│           └── richreport/       # Excel レポート
│               └── route.ts
├── components/                   # Reactコンポーネント
│   ├── AnalysisForm.tsx         # 分析フォーム
│   ├── ResultsDisplay.tsx       # 結果表示
│   └── ui/                      # UIコンポーネント
├── lib/                          # ユーティリティ
│   ├── csvExport.ts             # CSV生成
│   ├── mockData.ts              # モックデータ
│   ├── sheetsExport.ts          # Sheets連携
│   └── designTokens.ts          # デザイントークン定義
├── types/                        # TypeScript型定義
│   └── index.ts
├── docs/                         # ドキュメント（Git管理）
│   ├── DESIGN.md                # デザインシステムガイド
│   ├── DESIGN_SYSTEM*.md        # デザイン詳細ドキュメント
│   ├── DEVELOPMENT.md           # 開発ガイド
│   └── QUICKSTART_DEV_MODE.md   # クイックスタート
├── dev-data/                     # 開発用データ（Git管理外）
│   ├── jstat-sample-*.json      # jSTAT MAP サンプルレスポンス
│   └── *.xlsx                   # テスト用エクスポートファイル
├── sample/                       # サンプルスクリプト
│   └── jstat.js                 # jSTAT MAP API使用例
├── public/                       # 静的ファイル
├── .env.local.example           # 環境変数のサンプル
├── .env.local                   # 環境変数（Git管理外）
├── package.json                 # 依存関係
├── tsconfig.json                # TypeScript設定
├── claude.md                    # プロジェクト仕様（Claude Code用）
└── README.md                    # このファイル
```

---

## 🚀 デプロイ

### Vercel へのデプロイ（推奨）

1. [Vercel](https://vercel.com/) でアカウント作成
2. リポジトリを接続
3. 環境変数を設定
4. デプロイ実行

### その他のプラットフォーム

- **Netlify**: Next.js対応
- **AWS Amplify**: フルマネージド
- **Google Cloud Run**: コンテナベース
- **自前サーバー**: `npm run build` + `npm start`

---

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# リント実行
npm run lint
```

### コード品質

- TypeScriptによる型安全性
- ESLintによるコード品質チェック
- Prettierによるコードフォーマット（推奨）

---

## 📝 今後の改善予定

- [ ] 地図表示機能の追加
- [ ] 過去の分析履歴保存
- [ ] PDFレポート生成
- [ ] 複数地点の比較分析
- [ ] カスタムカテゴリの追加
- [ ] APIレート制限の最適化
- [ ] ユーザー認証機能

---

## 注意事項

- Google Maps APIの利用には課金が発生する可能性があります
- API キーは環境変数で管理し、リポジトリにコミットしないでください
- レート制限に注意してAPI呼び出しを行ってください
- `.env.local` ファイルは `.gitignore` に含まれています

---

## 📄 ライセンス

ISC

---

## 🙏 謝辞

- [デジタル庁デザインシステム](https://github.com/digital-go-jp/design-system-example-components-react) - UIデザインの参考
- [Google Maps Platform](https://developers.google.com/maps) - 地理情報API
- [jSTAT MAP](https://jstatmap.e-stat.go.jp/) - 統計データAPI
- [Next.js](https://nextjs.org/) - フレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク

---

**Built with ❤️ using Next.js, React, and TypeScript**
