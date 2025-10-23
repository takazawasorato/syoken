# 開発モードガイド

## 概要

このアプリケーションには、API呼び出しを行わずにUIをテストできる**開発モード**が実装されています。

## 開発モードの有効化

### 1. 環境変数の設定

`.env.local` ファイルで以下の設定を変更：

```env
# Development Mode - モックデータを使用する場合はtrueに設定
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### 2. 開発サーバーの再起動

```bash
npm run dev
```

画面上部に「🔧 開発モード」のバッジが表示されます。

## モックデータの内容

### 📍 基本情報
- **住所**: 東京都新宿区戸山１丁目
- **座標**: 35.7009591, 139.7192526
- **施設カテゴリ**: ジム
- **範囲**: 円形（500m/1000m/2000m）

### 👥 人口統計データ
- **総人口**: 71,631人
- **年齢別人口**: 16区分（0～4歳から75歳以上）
- **産業別データ**: 10業種
- **データ元**: jSTAT MAP API（令和2年国勢調査）

### 🏢 競合施設データ（7件）

#### 1次エリア（500m以内）: 2件
1. ANYTIME FITNESS 渋谷店 - 150m
2. ゴールドジム 渋谷東京 - 420m

#### 2次エリア（1000m以内）: 2件
3. エニタイムフィットネス 渋谷宮益坂店 - 750m
4. ティップネス 渋谷店 - 980m

#### 3次エリア（2000m以内）: 3件
5. セントラルスポーツ 渋谷店 - 1,250m
6. RIZAP 渋谷店 - 1,540m
7. コナミスポーツクラブ 渋谷 - 1,880m

## モックデータの構造

### ファイル構成
```
lib/
├── mockData.ts                           # メインのモックデータ
├── mockData.backup.ts                     # バックアップ
├── jstat-sample-response-drivetime.json  # jSTAT MAP APIレスポンス（到達圏）
└── jstat-sample-response.json            # jSTAT MAP APIレスポンス（円形）
```

### データ型定義
```typescript
export interface AnalysisResult {
  address: string;
  coordinates: Coordinates;
  population: PopulationData;
  competitors: PlaceResult[];
}
```

## 開発モードでテストできる機能

### ✅ UI/UXのテスト
- [x] 分析フォームの入力
- [x] 範囲タイプの切り替え（円形/到達圏）
- [x] パラメータ調整（スライダー）
- [x] 結果の表示
- [x] エリア別施設表示
- [x] CSVエクスポート
- [x] Excelレポート生成
- [x] Googleスプレッドシートエクスポート

### ✅ レスポンシブデザイン
- [x] デスクトップ表示
- [x] タブレット表示
- [x] モバイル表示

### ✅ エラーハンドリング
開発モードでは常に成功レスポンスを返すため、エラーケースのテストは本番モードで行う必要があります。

## モックデータのカスタマイズ

### 新しいサンプルデータの追加

`lib/mockData.ts` を編集して、異なるシナリオのデータを追加できます：

```typescript
// 例: カフェの分析データ
export const mockCafeAnalysisResult: AnalysisResult = {
  address: '東京都渋谷区神南1-1-1',
  // ... カフェのデータ
};
```

### 複数のモックデータセットの切り替え

`lib/mockData.ts` で、環境変数や条件分岐を使って異なるデータを返すことができます：

```typescript
const scenario = process.env.NEXT_PUBLIC_MOCK_SCENARIO || 'gym';

export const mockAnalysisResult =
  scenario === 'cafe' ? mockCafeAnalysisResult :
  scenario === 'gym' ? mockGymAnalysisResult :
  defaultMockData;
```

## API呼び出しのシミュレーション

開発モードでも、以下の遅延を追加してリアルなAPI体験を再現：

```typescript
// app/page.tsx:34
await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒の遅延
```

この遅延時間を調整することで、ローディング状態のUIをテストできます。

## 本番モードへの切り替え

### 1. 環境変数の変更

```env
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### 2. API認証情報の確認

以下の環境変数が設定されていることを確認：

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
JSTAT_API_KEY=your_jstat_api_key
JSTAT_USER_ID=your_jstat_user_id
```

### 3. 開発サーバーの再起動

```bash
npm run dev
```

「🔧 開発モード」バッジが消えていれば、本番モードで動作しています。

## トラブルシューティング

### モックデータが表示されない

**確認事項:**
1. `.env.local` で `NEXT_PUBLIC_USE_MOCK_DATA=true` になっているか
2. 開発サーバーを再起動したか
3. ブラウザのキャッシュをクリアしたか

### 開発モードバッジが表示されない

環境変数は `NEXT_PUBLIC_` プレフィックスが必須です。プレフィックスがない場合、クライアントサイドで読み込めません。

### jSTATデータが正しく表示されない

`lib/jstat-sample-response-drivetime.json` ファイルが存在し、有効なJSONであることを確認してください。

## ベストプラクティス

### 開発時
- ✅ モックデータを使用して素早くUI開発
- ✅ 異なるデータパターンをテスト
- ✅ エッジケース（施設0件、大量データなど）を想定

### 本番リリース前
- ✅ 本番モードで全機能をテスト
- ✅ API制限を考慮したテスト
- ✅ エラーハンドリングの確認

## 参考情報

### モックデータの元データ
- **jSTAT MAP API**: 令和2年国勢調査
- **範囲**: 東京都新宿区（到達圏: 5分/10分/20分, 30km/h）
- **取得日時**: 2025-10-18 16:21:47

### 関連ファイル
- `lib/mockData.ts` - メインのモックデータ
- `lib/mockData.backup.ts` - バックアップ
- `app/page.tsx` - 開発モードの判定ロジック
- `.env.local` - 環境変数設定

---

**最終更新**: 2025-10-18
