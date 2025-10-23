# Design System - 商圏分析アプリケーション

## 概要

このデザインシステムは、商圏分析アプリケーションで一貫性があり、アクセシブルで、スケーラブルなユーザーインターフェースを構築するための、包括的なデザイントークン、コンポーネント、ガイドラインのセットを提供します。

## デザイン原則

### 1. ユーザー中心のデザイン
- 明確さと使いやすさを優先
- すべてのユーザーアクションに対して明確なフィードバックを提供
- 初心者と経験豊富なユーザーの両方に対応したデザイン

### 2. 一貫性
- すべてのコンポーネントで一貫したパターンを使用
- 統一されたデザイントークンによる視覚的な調和を維持
- 予測可能なインタラクションパターンを適用

### 3. アクセシビリティ
- WCAG 2.1 AA準拠を最低限とする
- セマンティックなHTML要素
- キーボードナビゲーションのサポート
- スクリーンリーダーとの互換性
- 十分なカラーコントラスト比

### 4. パフォーマンス
- メモ化によるReactレンダリングの最適化
- 再レンダリングの最小化
- 効率的なアニメーションとトランジション

### 5. スケーラビリティ
- モジュラーコンポーネントアーキテクチャ
- 新しいバリアントの追加が容易
- デザイントークンベースのスタイリング

---

## デザイントークン

### カラーパレット

#### プライマリカラー
```typescript
primary-50:  '#EFF6FF'  // Very light blue
primary-100: '#DBEAFE'  // Light blue
primary-200: '#BFDBFE'  // Lighter blue
primary-300: '#93C5FD'  // Light blue
primary-400: '#60A5FA'  // Medium blue
primary-500: '#3B82F6'  // Base blue (brand primary)
primary-600: '#2563EB'  // Dark blue
primary-700: '#1D4ED8'  // Darker blue
primary-800: '#1E40AF'  // Very dark blue
primary-900: '#1E3A8A'  // Deepest blue
```

#### セカンダリカラー
```typescript
secondary-50:  '#F5F3FF'  // Very light indigo
secondary-100: '#EDE9FE'  // Light indigo
secondary-200: '#DDD6FE'  // Lighter indigo
secondary-300: '#C4B5FD'  // Light indigo
secondary-400: '#A78BFA'  // Medium indigo
secondary-500: '#8B5CF6'  // Base indigo
secondary-600: '#7C3AED'  // Dark indigo (brand secondary)
secondary-700: '#6D28D9'  // Darker indigo
secondary-800: '#5B21B6'  // Very dark indigo
secondary-900: '#4C1D95'  // Deepest indigo
```

#### アクセントカラー
```typescript
// Success (Green)
success-50:  '#F0FDF4'
success-100: '#DCFCE7'
success-500: '#22C55E'
success-600: '#16A34A'
success-700: '#15803D'

// Warning (Yellow/Amber)
warning-50:  '#FFFBEB'
warning-100: '#FEF3C7'
warning-500: '#F59E0B'
warning-600: '#D97706'
warning-700: '#B45309'

// Error (Red)
error-50:  '#FEF2F2'
error-100: '#FEE2E2'
error-500: '#EF4444'
error-600: '#DC2626'
error-700: '#B91C1C'

// Info (Blue)
info-50:  '#EFF6FF'
info-100: '#DBEAFE'
info-500: '#3B82F6'
info-600: '#2563EB'
info-700: '#1D4ED8'
```

#### ニュートラルカラー（グレー）
```typescript
gray-50:  '#F9FAFB'  // Background light
gray-100: '#F3F4F6'  // Background
gray-200: '#E5E7EB'  // Border light
gray-300: '#D1D5DB'  // Border
gray-400: '#9CA3AF'  // Icon inactive
gray-500: '#6B7280'  // Text secondary
gray-600: '#4B5563'  // Text primary
gray-700: '#374151'  // Text heading
gray-800: '#1F2937'  // Text strong
gray-900: '#111827'  // Text black
```

#### セマンティックカラー
```typescript
// Gender-specific
male:   '#3B82F6'  // Blue
female: '#EC4899'  // Pink

// Area-specific
area1-primary:   '#3B82F6'  // Blue (1st area)
area2-primary:   '#10B981'  // Green (2nd area)
area3-primary:   '#F59E0B'  // Amber (3rd area)

// Range type colors
circle:     '#3B82F6'  // Blue
driveTime:  '#10B981'  // Green
```

### タイポグラフィ

#### フォントファミリー
```css
font-sans: system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif
font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace
```

#### フォントサイズ
```typescript
text-xs:   '0.75rem'   // 12px
text-sm:   '0.875rem'  // 14px
text-base: '1rem'      // 16px (default)
text-lg:   '1.125rem'  // 18px
text-xl:   '1.25rem'   // 20px
text-2xl:  '1.5rem'    // 24px
text-3xl:  '1.875rem'  // 30px
text-4xl:  '2.25rem'   // 36px
text-5xl:  '3rem'      // 48px
```

#### フォントウェイト
```typescript
font-normal:     400
font-medium:     500
font-semibold:   600
font-bold:       700
font-extrabold:  800
```

#### 行の高さ
```typescript
leading-tight:   1.25
leading-snug:    1.375
leading-normal:  1.5
leading-relaxed: 1.625
leading-loose:   2
```

### スペーシング

8pxベースのグリッドシステムを使用：

```typescript
spacing-0:  '0px'
spacing-1:  '0.25rem'  // 4px
spacing-2:  '0.5rem'   // 8px
spacing-3:  '0.75rem'  // 12px
spacing-4:  '1rem'     // 16px
spacing-5:  '1.25rem'  // 20px
spacing-6:  '1.5rem'   // 24px
spacing-8:  '2rem'     // 32px
spacing-10: '2.5rem'   // 40px
spacing-12: '3rem'     // 48px
spacing-16: '4rem'     // 64px
spacing-20: '5rem'     // 80px
```

### シャドウ

```typescript
shadow-sm:   '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
shadow-md:   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
shadow-lg:   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
shadow-xl:   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
shadow-2xl:  '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
shadow-inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
```

### ボーダー半径

```typescript
rounded-none: '0px'
rounded-sm:   '0.125rem'  // 2px
rounded-md:   '0.375rem'  // 6px
rounded-lg:   '0.5rem'    // 8px
rounded-xl:   '0.75rem'   // 12px
rounded-2xl:  '1rem'      // 16px
rounded-3xl:  '1.5rem'    // 24px
rounded-full: '9999px'    // Circle
```

### アニメーション

#### 継続時間
```typescript
duration-75:   '75ms'
duration-100:  '100ms'
duration-150:  '150ms'
duration-200:  '200ms'
duration-300:  '300ms'
duration-500:  '500ms'
duration-700:  '700ms'
duration-1000: '1000ms'
```

#### タイミング関数（イージング）
```typescript
ease-linear:     'linear'
ease-in:         'cubic-bezier(0.4, 0, 1, 1)'
ease-out:        'cubic-bezier(0, 0, 0.2, 1)'
ease-in-out:     'cubic-bezier(0.4, 0, 0.2, 1)'
ease-bounce:     'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
```

### ブレークポイント

```typescript
sm:  '640px'   // Small devices (mobile landscape)
md:  '768px'   // Medium devices (tablets)
lg:  '1024px'  // Large devices (desktop)
xl:  '1280px'  // Extra large devices (large desktop)
2xl: '1536px'  // 2X Extra large devices
```

---

## コンポーネントライブラリ

### 1. Button コンポーネント

さまざまなスタイルと状態を持つ多目的ボタン。

**バリアント:**
- `primary` - メインのCall-to-Actionボタン
- `secondary` - セカンダリアクション
- `outline` - 控えめな強調のためのアウトラインボタン
- `ghost` - 最小限のスタイリング、テキストのみのボタン
- `danger` - 破壊的なアクション

**サイズ:**
- `sm` - 小
- `md` - 中（デフォルト）
- `lg` - 大

**状態:**
- デフォルト
- ホバー
- アクティブ
- 無効
- ローディング

**使用例:**
```tsx
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>
```

### 2. Card コンポーネント

関連するコンテンツをグループ化するためのコンテナコンポーネント。

**バリアント:**
- `default` - シャドウ付きの標準的な白いカード
- `gradient` - グラデーション背景のカード
- `outlined` - ボーダーのみのカード

**使用例:**
```tsx
<Card variant="gradient" className="p-6">
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### 3. Input コンポーネント

検証状態を持つフォーム入力。

**バリアント:**
- `text` - 標準テキスト入力
- `email` - メール入力
- `password` - パスワード入力
- `number` - 数値入力

**状態:**
- デフォルト
- フォーカス
- エラー
- 無効
- 成功

**使用例:**
```tsx
<Input
  label="Address"
  placeholder="Enter your address"
  error={error}
  icon={<LocationIcon />}
  required
/>
```

### 4. Select コンポーネント

カスタムドロップダウン選択コンポーネント。

**機能:**
- カスタムスタイリング
- アイコンサポート
- キーボードナビゲーション
- ARIA準拠

**使用例:**
```tsx
<Select
  label="Category"
  options={categoryOptions}
  value={selectedCategory}
  onChange={handleChange}
/>
```

### 5. Slider コンポーネント

数値入力用のレンジスライダー。

**機能:**
- ビジュアルプログレスバー
- 最小/最大ラベル
- カスタムスタイリング
- アクセシブル

**使用例:**
```tsx
<Slider
  label="Radius"
  min={100}
  max={5000}
  step={100}
  value={radius}
  onChange={setRadius}
  unit="m"
/>
```

### 6. Badge コンポーネント

小さなステータスインジケーター。

**バリアント:**
- `default` - グレーのバッジ
- `success` - グリーンのバッジ
- `warning` - イエローのバッジ
- `error` - レッドのバッジ
- `info` - ブルーのバッジ
- `custom` - カスタムカラー

**使用例:**
```tsx
<Badge variant="success">Active</Badge>
```

### 7. Toast コンポーネント

通知メッセージコンポーネント。

**タイプ:**
- `success` - 成功通知
- `error` - エラー通知
- `warning` - 警告通知
- `info` - 情報通知

**機能:**
- 自動消去
- 手動消去
- アイコンサポート
- スライドインアニメーション

**使用例:**
```tsx
<Toast type="success" message="Analysis completed!" onClose={handleClose} />
```

### 8. Tabs コンポーネント

タブナビゲーションコンポーネント。

**機能:**
- アクティブ状態インジケーター
- キーボードナビゲーション
- ARIA準拠
- アイコンサポート

**使用例:**
```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="overview" label="Overview" icon={<ChartIcon />} />
  <Tab value="data" label="Data" />
</Tabs>
```

### 9. Table コンポーネント

ソート機能とスタイリングを備えたデータテーブル。

**機能:**
- ストライプ行
- ホバー状態
- ソート可能な列
- レスポンシブ

**使用例:**
```tsx
<Table
  columns={columns}
  data={data}
  sortable
  striped
/>
```

### 10. Spinner コンポーネント

ローディングスピナーインジケーター。

**バリアント:**
- `default` - 標準スピナー
- `dots` - ドットアニメーション
- `pulse` - パルスアニメーション

**サイズ:**
- `sm` - 小
- `md` - 中
- `lg` - 大

**使用例:**
```tsx
<Spinner size="lg" variant="default" />
```

### 11. EmptyState コンポーネント

空のデータ状態のためのプレースホルダー。

**機能:**
- アイコンサポート
- タイトルと説明
- オプションのアクションボタン

**使用例:**
```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No results"
  description="Start analysis to see results"
  action={<Button>Start Analysis</Button>}
/>
```

### 12. ErrorState コンポーネント

エラー表示コンポーネント。

**機能:**
- エラーアイコン
- タイトルとメッセージ
- 再試行アクション
- 閉じることができる

**使用例:**
```tsx
<ErrorState
  title="Error occurred"
  message={errorMessage}
  onRetry={handleRetry}
  onDismiss={handleDismiss}
/>
```

---

## アクセシビリティガイドライン

### 1. カラーコントラスト
- 背景上のテキスト：最低4.5:1の比率
- 大きなテキスト（18pt以上）：最低3:1の比率
- インタラクティブ要素：最低3:1の比率

### 2. キーボードナビゲーション
- すべてのインタラクティブ要素がキーボードでアクセス可能でなければならない
- 見やすいフォーカスインジケーターが必要
- 論理的なタブ順序
- ナビゲーション用のスキップリンク

### 3. スクリーンリーダーサポート
- セマンティックなHTML要素を使用
- 必要に応じてARIAラベルを提供
- 動的なコンテンツには`aria-live`を使用
- 画像に`alt`テキストを含める

### 4. フォーム
- すべてのフォーム入力にラベルを付ける
- 明確なエラーメッセージを提供
- 適切な入力タイプを使用
- 役立つプレースホルダーテキストを含める

### 5. インタラクティブ要素
- 最小タッチターゲットサイズ：44x44px
- 明確なホバー/フォーカス状態
- アクションに対する視覚的フィードバック
- 処理中は無効化

---

## 使用ガイドライン

### コンポーネントインポートパターン
```tsx
import { Button, Card, Input } from '@/components/ui';
```

### デザイントークンインポートパターン
```tsx
import { colors, spacing, shadows } from '@/lib/designTokens';
```

### カスタムスタイリング
カスタムスタイルでコンポーネントを拡張する場合：
```tsx
<Button className="custom-class">
  Click me
</Button>
```

### コンポジションパターン
シンプルなコンポーネントを組み合わせて複雑なUIを構築：
```tsx
<Card>
  <Card.Header>
    <h3>Title</h3>
    <Badge variant="success">New</Badge>
  </Card.Header>
  <Card.Body>
    <p>Content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

---

## ベストプラクティス

### 1. コンポーネント開発
- コンポーネントを小さく集中させる
- 型安全性のためにTypeScriptを使用
- JSDocコメントを追加
- パフォーマンスのためにメモ化を使用
- アクセシブルなマークアップを記述

### 2. スタイリング
- ハードコーディングされた値よりもデザイントークンを使用
- Tailwindユーティリティクラスを優先
- カスタムCSSを最小限に保つ
- 一貫した命名規則を使用

### 3. 状態管理
- 可能な限りコンポーネント状態をローカルに保つ
- 必要に応じて状態を持ち上げる
- 親とのコミュニケーションにはコールバックを使用
- プロップドリリングを避ける

### 4. パフォーマンス
- 高コストなコンポーネントをメモ化
- 不要な再レンダリングを避ける
- 画像とアセットを最適化
- 適切な場所で遅延読み込みを使用

### 5. テスト
- コンポーネントのバリアントをテスト
- アクセシビリティ機能をテスト
- キーボードナビゲーションをテスト
- エラー状態をテスト

---

## マイグレーションガイド

### 既存コンポーネントのマイグレーション

1. **ハードコーディングされたスタイルを特定**
   - インラインスタイルとTailwindクラスを見つける
   - デザイントークンにマッピング

2. **デザインシステムコンポーネントで置き換え**
   - カスタムコンポーネントをデザインシステムの同等物と交換
   - 新しいAPIに合わせてpropsを更新

3. **インポートを更新**
   - 新しいコンポーネントライブラリへのインポートパスを変更
   - 必要に応じてデザイントークンをインポート

4. **徹底的にテスト**
   - ビジュアルリグレッションテスト
   - アクセシビリティテスト
   - 機能テスト

### マイグレーション例

**変更前:**
```tsx
<button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
  Submit
</button>
```

**変更後:**
```tsx
<Button variant="primary" size="md">
  Submit
</Button>
```

---

## メンテナンスと更新

### 新しいコンポーネントの追加
1. `/components/ui/`にコンポーネントを作成
2. TypeScript型を追加
3. JSDocコメントを追加
4. indexからエクスポート
5. このガイドでドキュメント化
6. 使用例を追加

### デザイントークンの更新
1. `/lib/designTokens.ts`を更新
2. このドキュメントを更新
3. 影響を受けるコンポーネントをテスト
4. バージョン番号を更新

### バージョン履歴
- v1.0.0 (2025-10-22) - 初回デザインシステムリリース

---

## リソース

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## サポート

デザインシステムに関する質問や貢献については：
1. このドキュメントを確認
2. 既存のコンポーネントのパターンを確認
3. 確立された規約に従う
4. 既存のコードとの一貫性を維持
