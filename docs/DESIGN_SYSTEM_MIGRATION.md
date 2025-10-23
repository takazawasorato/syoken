# Design System マイグレーションガイド

このガイドは、既存のコンポーネントを新しいデザインシステムを使用するようにマイグレーションするための、ステップバイステップの手順を提供します。

## 概要

デザインシステムは以下を提供します：
- **デザイントークン** (`/lib/designTokens.ts`) - カラー、タイポグラフィ、スペーシングなど
- **UIコンポーネント** (`/components/ui/`) - 再利用可能でアクセシブルなコンポーネント
- **ドキュメント** (`/DESIGN_SYSTEM.md`) - 完全なコンポーネントリファレンス
- **ショーケース** (`/app/design-system/page.tsx`) - インタラクティブな例

## マイグレーション手順

### 1. デザインシステムコンポーネントのインポート

**変更前:**
```tsx
// カスタムインラインスタイル
<button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
  Submit
</button>
```

**変更後:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">
  Submit
</Button>
```

### 2. フォーム要素の置き換え

#### 入力フィールド

**変更前:**
```tsx
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">
    Address <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:border-blue-500"
    placeholder="Enter address"
  />
</div>
```

**変更後:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Address"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  placeholder="Enter address"
  required
  fullWidth
  icon={<LocationIcon />}
/>
```

#### ドロップダウン選択

**変更前:**
```tsx
<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full px-4 py-3 border-2 rounded-lg"
>
  <option value="gym">Gym</option>
  <option value="cafe">Cafe</option>
</select>
```

**変更後:**
```tsx
import { Select } from '@/components/ui';

<Select
  label="Category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: 'gym', label: 'Gym', icon: '🏋️' },
    { value: 'cafe', label: 'Cafe', icon: '☕' },
  ]}
  fullWidth
/>
```

#### レンジスライダー

**変更前:**
```tsx
<div className="space-y-1">
  <div className="flex justify-between">
    <label>Radius</label>
    <span>{radius}m</span>
  </div>
  <input
    type="range"
    min={100}
    max={5000}
    value={radius}
    onChange={(e) => setRadius(parseInt(e.target.value))}
    className="w-full"
  />
</div>
```

**変更後:**
```tsx
import { Slider } from '@/components/ui';

<Slider
  label="Radius"
  min={100}
  max={5000}
  value={radius}
  onChange={(e) => setRadius(parseInt(e.target.value))}
  unit="m"
  color="blue"
/>
```

### 3. カードの置き換え

**変更前:**
```tsx
<div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <p>Content goes here</p>
</div>
```

**変更後:**
```tsx
import { Card } from '@/components/ui';

<Card variant="default">
  <Card.Header>
    <h2 className="text-2xl font-bold">Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Content goes here</p>
  </Card.Body>
</Card>
```

### 4. バッジの置き換え

**変更前:**
```tsx
<span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
  Active
</span>
```

**変更後:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Active</Badge>
```

### 5. ローディングスピナーの置き換え

**変更前:**
```tsx
<div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600" />
```

**変更後:**
```tsx
import { Spinner } from '@/components/ui';

<Spinner size="lg" variant="default" color="blue" />
```

### 6. トースト通知の置き換え

**変更前:**
```tsx
{toast && (
  <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg">
    {toast.message}
    <button onClick={() => setToast(null)}>×</button>
  </div>
)}
```

**変更後:**
```tsx
import { Toast } from '@/components/ui';

{toast && (
  <Toast
    type="success"
    message={toast.message}
    onClose={() => setToast(null)}
    duration={5000}
  />
)}
```

### 7. 空の状態の置き換え

**変更前:**
```tsx
{!result && (
  <div className="bg-white p-12 rounded-2xl text-center">
    <div className="w-20 h-20 bg-blue-100 rounded-full mb-6 mx-auto" />
    <h3 className="text-xl font-semibold text-gray-700">No results</h3>
    <p className="text-gray-500">Start analysis to see results</p>
  </div>
)}
```

**変更後:**
```tsx
import { EmptyState } from '@/components/ui';

{!result && (
  <EmptyState
    icon={<AnalysisIcon />}
    title="No results"
    description="Start analysis to see results"
  />
)}
```

### 8. エラー状態の置き換え

**変更前:**
```tsx
{error && (
  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-red-800">Error</h3>
    <p className="text-sm text-red-700">{error}</p>
    <button onClick={() => setError(null)}>Dismiss</button>
  </div>
)}
```

**変更後:**
```tsx
import { ErrorState } from '@/components/ui';

{error && (
  <ErrorState
    title="Error occurred"
    message={error}
    onDismiss={() => setError(null)}
    onRetry={handleRetry}
  />
)}
```

### 9. デザイントークンの使用

**変更前:**
```tsx
<div style={{ color: '#3B82F6', padding: '24px' }}>
  Content
</div>
```

**変更後:**
```tsx
import { colors, spacing } from '@/lib/designTokens';

<div style={{ color: colors.primary[500], padding: spacing[6] }}>
  Content
</div>
```

または、デザイントークンに対応するTailwindクラスを使用：
```tsx
<div className="text-blue-600 p-6">
  Content
</div>
```

## コンポーネント固有のマイグレーション

### AnalysisForm.tsx

フォームはすでに良い構造を持っています。主な変更点：
1. 再利用可能なスライダーコンポーネントを抽出
2. 一貫したスタイリングでデザインシステムのSliderコンポーネントを使用
3. 既存のアクセシビリティ機能を維持

### ResultsDisplay.tsx

主な変更点：
1. エリアインジケーターにBadgeコンポーネントを使用
2. ナビゲーションにTabsコンポーネントを使用（すでに類似）
3. エクスポートアクションにButtonコンポーネントを使用
4. カスタムチャート（BarChart、PieChart）はドメイン固有なので維持

### page.tsx（メイン）

主な変更点：
1. 通知にToastコンポーネントを使用
2. 空の結果にEmptyStateコンポーネントを使用
3. エラーにErrorStateコンポーネントを使用
4. ローディング状態にSpinnerコンポーネントを使用

## マイグレーション後のテスト

### 1. ビジュアルテスト
- 変更前/変更後のスクリーンショットを比較
- すべてのコンポーネントバリアントを確認
- レスポンシブレイアウトをテスト
- ホバー/フォーカス状態を確認

### 2. アクセシビリティテスト
- キーボードナビゲーションが機能する
- スクリーンリーダーとの互換性
- ARIAラベルが存在する
- カラーコントラストがWCAG AAを満たす

### 3. 機能テスト
- フォーム送信が機能する
- 状態が正しく更新される
- イベントが適切に発火する
- コンソールエラーがない

### 4. パフォーマンステスト
- 不要な再レンダリングがない
- メモ化が機能する
- 読み込み時間が許容範囲内

## 一般的な問題と解決策

### 問題: コンポーネントが正しくスタイル設定されない
**解決策:** `@/components/ui`からインポートしていて、相対パスからインポートしていないことを確認してください。

### 問題: TypeScriptエラー
**解決策:** コンポーネントのProps型をインポート: `import { ButtonProps } from '@/components/ui';`

### 問題: カスタムスタイルが適用されない
**解決策:** `className`プロパティを使用して、コンポーネントスタイルと一緒にカスタムスタイルを追加します。

### 問題: アニメーションが機能しない
**解決策:** Tailwindのアニメーションクラスが利用可能であることを確認してください。`tailwind.config.js`を確認してください。

## 段階的なマイグレーション戦略

すべてを一度にマイグレーションする必要はありません：

1. **フェーズ1**: デザインシステムコンポーネントを使用して新機能から始める
2. **フェーズ2**: トラフィックの多いページをマイグレーション
3. **フェーズ3**: 残りのページをマイグレーション
4. **フェーズ4**: 古いカスタムコンポーネントを削除

## マイグレーション後のメリット

### 開発者向け
- プリビルドされたコンポーネントによる開発の高速化
- 保守するコードの削減
- コンポーネント間で一貫したAPI
- より良いTypeScriptサポート
- 組み込みのアクセシビリティ

### ユーザー向け
- 一貫したユーザーエクスペリエンス
- より良いアクセシビリティ
- 改善されたパフォーマンス
- より洗練されたUI

### デザイン向け
- 単一の信頼できる情報源
- グローバルな変更が容易
- スケーラブルなデザインパターン
- 生きたドキュメント

## ヘルプの取得

1. コンポーネントドキュメントは`/DESIGN_SYSTEM.md`を確認
2. ライブ例は`/app/design-system/page.tsx`を表示
3. `/components/ui/`のコンポーネントソースコードを確認
4. 利用可能なpropsについてはTypeScript型を確認

## 次のステップ

1. デザインシステムドキュメントを確認
2. コンポーネントショーケースページを探索
3. 一度に1つのコンポーネントずつマイグレーションを開始
4. 各マイグレーション後に徹底的にテスト
5. 作成したカスタムパターンをドキュメント化

---

**質問がありますか？** メインのデザインシステムドキュメントを参照するか、`/design-system`のインタラクティブなショーケースを探索してください。
