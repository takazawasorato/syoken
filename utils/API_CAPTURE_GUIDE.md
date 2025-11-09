# APIレスポンスキャプチャー機能ガイド

## 概要

開発環境で実際のAPIレスポンスをファイルとして保存し、モックデータとして再利用できる機能です。

## メリット

1. **データの正確性**: 実際のAPI構造と完全に一致
2. **メンテナンス性**: API更新時も簡単に最新データを取得
3. **テストの信頼性**: 本番と同じデータ構造でテスト可能
4. **オフライン開発**: API quota節約、ネットワーク不要で開発可能

## セットアップ

### 1. 環境変数を設定

`.env.local`ファイルに以下を追加：

```env
ENABLE_API_CAPTURE=true
```

### 2. 開発サーバーを起動

```bash
npm run dev
```

## 使用方法

### APIレスポンスをキャプチャー

1. キャプチャーモードを有効化（`.env.local`で`ENABLE_API_CAPTURE=true`）
2. アプリケーションで通常通り商圏分析を実行
3. APIが呼ばれると自動的に`dev-data/captured-responses/`にファイルが保存される

### 保存されるファイル

#### jSTAT MAP API
- **ファイル名**: `jstat_circle_response.json` または `jstat_driveTime_response.json`
- **場所**: `dev-data/captured-responses/`
- **内容**: 人口統計データの完全なレスポンス

#### Places API
- **ファイル名**: `places_response.json`
- **場所**: `dev-data/captured-responses/`
- **内容**: 競合施設情報（距離・評価・座標など）

### コンソールログ

キャプチャー成功時にコンソールに出力：

```
[API Capture] Response saved to: /path/to/dev-data/captured-responses/jstat_circle_response.json
[API Capture] Response saved to: /path/to/dev-data/captured-responses/places_response.json
```

## モックデータとして使用

### 1. キャプチャーしたデータを確認

```bash
ls -la dev-data/captured-responses/
```

### 2. モックデータファイルに移動

```bash
# メインのモックデータとして使用する場合
cp dev-data/captured-responses/jstat_circle_response.json dev-data/jstat-sample-response.json
```

### 3. `lib/mockData.ts`を更新

```typescript
import jstatSampleCircleData from '@/dev-data/jstat-sample-response.json';

export const mockAnalysisResult: AnalysisResult = {
  // ...
  population: {
    totalPopulation: 5489,
    rawData: jstatSampleCircleData, // キャプチャーしたデータを使用
    // ...
  }
};
```

### 4. モックモードで実行

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
ENABLE_API_CAPTURE=false  # キャプチャーは無効化
```

## API別のキャプチャー機能

### Stats API (jSTAT MAP)

```typescript
// app/api/stats/route.ts
if (isCaptureModeEnabled()) {
  const filename = `jstat_${rangeType}_response.json`;
  captureApiResponseToJson('jstat_api', data, {
    subdirectory: 'captured-responses',
    customFilename: filename
  });
}
```

**キャプチャーされるデータ**:
- 範囲タイプ（circle / driveTime）
- 人口統計データ（年齢別・性別）
- 産業別データ（事業所数・従業者数）
- 完全なjSTAT MAP APIレスポンス

### Places API

```typescript
// app/api/places/route.ts
if (isCaptureModeEnabled()) {
  captureApiResponseToJson('places_api', responseData, {
    subdirectory: 'captured-responses',
    customFilename: 'places_response.json'
  });
}
```

**キャプチャーされるデータ**:
- 施設名・住所
- 距離・エリア分類
- 評価・レビュー数
- 座標・Place ID
- Google MapsのURL
- メタデータ（検索キーワード、中心座標、タイムスタンプ）

## ユーティリティ関数

### `captureApiResponseToJson()`

JSON形式でレスポンスを保存

```typescript
captureApiResponseToJson(
  'api_name',           // API識別子
  response,             // レスポンスデータ
  {
    subdirectory: 'captured-responses',  // サブディレクトリ
    customFilename: 'custom.json'        // カスタムファイル名
  }
);
```

### `captureApiResponseToCsv()`

CSV形式でデータを保存（フラットなデータ向け）

```typescript
captureApiResponseToCsv(
  'api_name',
  dataArray,            // 配列データ
  {
    subdirectory: 'captured-responses',
    customFilename: 'custom.csv'
  }
);
```

### `isCaptureModeEnabled()`

キャプチャー機能が有効か確認

```typescript
if (isCaptureModeEnabled()) {
  // キャプチャー処理
}
```

### `loadCapturedResponse()`

保存したレスポンスを読み込み

```typescript
const data = loadCapturedResponse('jstat_circle_response.json', 'captured-responses');
```

### `listCapturedFiles()`

利用可能なキャプチャーファイル一覧を取得

```typescript
const files = listCapturedFiles('captured-responses');
console.log(files); // ['jstat_circle_response.json', 'places_response.json', ...]
```

## 実践例

### ワークフロー1: 新しい地域のデータをキャプチャー

1. `.env.local`で`ENABLE_API_CAPTURE=true`を設定
2. アプリで京都市のジムを検索
3. 以下のファイルが生成される：
   - `jstat_circle_response.json`
   - `places_response.json`
4. これらをモックデータとして使用

### ワークフロー2: 複数エリアのデータ収集

```bash
# 1. キャプチャーモードを有効化
echo "ENABLE_API_CAPTURE=true" >> .env.local

# 2. 複数の検索を実行（UI経由）
# - 東京都新宿区のジム
# - 大阪市北区のカフェ
# - 京都市左京区の飲食店

# 3. 生成されたファイルを確認
ls dev-data/captured-responses/

# 4. 必要なものを選んでメインのモックデータにコピー
cp dev-data/captured-responses/jstat_circle_response.json dev-data/mock-kyoto-gym.json
```

### ワークフロー3: CI/CDでのテスト

```yaml
# .github/workflows/test.yml
- name: Run tests with mock data
  env:
    NEXT_PUBLIC_USE_MOCK_DATA: true
    ENABLE_API_CAPTURE: false
  run: npm test
```

## 注意事項

1. **本番環境では無効**: `NODE_ENV=production`では自動的に無効化されます
2. **ファイルサイズ**: jSTAT MAPのレスポンスは200KB程度になることがあります
3. **Git管理**: キャプチャーファイルは`.gitignore`に追加することを推奨
4. **個人情報**: 実際の施設名・住所が含まれるため取り扱いに注意
5. **API quota**: キャプチャーモードでも実際のAPIが呼ばれます

## トラブルシューティング

### ファイルが保存されない

- `ENABLE_API_CAPTURE=true`になっているか確認
- `NODE_ENV=development`か確認
- `dev-data/`ディレクトリの書き込み権限を確認
- コンソールでエラーログを確認

### ファイルが見つからない

```bash
# dev-dataディレクトリを確認
ls -R dev-data/

# 絶対パスで確認
find $(pwd) -name "*.json" | grep captured
```

### モックデータがロードできない

```typescript
// デバッグ用
import { loadCapturedResponse, listCapturedFiles } from '@/utils/captureApiResponse';

console.log('Available files:', listCapturedFiles('captured-responses'));
const data = loadCapturedResponse('jstat_circle_response.json');
console.log('Loaded data:', data);
```

## まとめ

APIレスポンスキャプチャー機能により：

- ✅ 実際のAPIデータを簡単に保存
- ✅ 正確なモックデータを自動生成
- ✅ オフライン開発が可能
- ✅ テストの信頼性向上
- ✅ API quota節約

開発効率が大幅に向上します！
