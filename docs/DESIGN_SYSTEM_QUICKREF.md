# Design System クイックリファレンス

デザインシステムを使用する開発者向けのクイックリファレンスガイド。

## コンポーネントのインポート

```tsx
import { Button, Card, Input, Select, Slider, Badge, Toast, Tabs, Spinner, EmptyState, ErrorState } from '@/components/ui';
import { colors, spacing, shadows, typography } from '@/lib/designTokens';
```

## コンポーネントチートシート

### Button
```tsx
<Button variant="primary|secondary|outline|ghost|danger|success"
        size="sm|md|lg"
        loading={boolean}
        iconLeft={<Icon />}
        iconRight={<Icon />}
        fullWidth>
  Click Me
</Button>
```

### Input
```tsx
<Input label="Address"
       placeholder="Enter..."
       error="Error message"
       success="Success message"
       helperText="Helper text"
       icon={<Icon />}
       iconPosition="left|right"
       inputSize="sm|md|lg"
       fullWidth
       required />
```

### Select
```tsx
<Select label="Category"
        options={[
          { value: 'val', label: 'Label', icon: '🎨' }
        ]}
        value={value}
        onChange={handler}
        selectSize="sm|md|lg"
        fullWidth
        required />
```

### Slider
```tsx
<Slider label="Radius"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={handler}
        unit="m"
        color="blue|green|purple|red|yellow"
        showLabels />
```

### Card
```tsx
<Card variant="default|gradient|outlined|elevated" hoverable>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Badge
```tsx
<Badge variant="default|success|warning|error|info|primary|secondary|custom"
       size="sm|md|lg"
       customColor="#hex"
       dot>
  Label
</Badge>
```

### Toast
```tsx
<Toast type="success|error|warning|info"
       message="Message text"
       onClose={handler}
       duration={5000}
       position="top-right|top-left|bottom-right|bottom-left|top-center|bottom-center" />
```

### Tabs
```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1" label="Tab 1" icon={<Icon />} isActive={activeTab === 'tab1'} onClick={setActiveTab} />
  <Tab value="tab2" label="Tab 2" isActive={activeTab === 'tab2'} onClick={setActiveTab} />
</Tabs>

<TabPanel value="tab1" activeValue={activeTab}>
  Content 1
</TabPanel>
```

### Spinner
```tsx
<Spinner variant="default|dots|pulse"
         size="sm|md|lg"
         color="blue|green|purple|red|white|gray" />
```

### EmptyState
```tsx
<EmptyState icon={<Icon />}
            title="No Results"
            description="Description text"
            action={<Button>Action</Button>} />
```

### ErrorState
```tsx
<ErrorState title="Error Title"
            message="Error message"
            onRetry={handler}
            onDismiss={handler} />
```

## デザイントークン

### カラー
```tsx
// 使用法
colors.primary[500]    // #3B82F6
colors.success[600]    // #16A34A
colors.semantic.male   // #3B82F6

// ヘルパー
getColor('primary.500')
```

### スペーシング
```tsx
spacing[4]   // 1rem (16px)
spacing[6]   // 1.5rem (24px)
spacing[8]   // 2rem (32px)

// ヘルパー
getSpacing(4)
```

### タイポグラフィ
```tsx
typography.fontSize.lg       // 1.125rem
typography.fontWeight.bold   // 700
typography.lineHeight.relaxed // 1.625
```

### シャドウ
```tsx
shadows.sm   // Small shadow
shadows.lg   // Large shadow
shadows.xl   // Extra large

// ヘルパー
getShadow('lg')
```

### ボーダー半径
```tsx
borderRadius.lg    // 0.5rem
borderRadius.xl    // 0.75rem
borderRadius.full  // 9999px
```

### アニメーション
```tsx
animations.duration[300]  // 300ms
animations.easing.out     // cubic-bezier
```

## 一般的なパターン

### バリデーション付きフォーム
```tsx
<form onSubmit={handleSubmit}>
  <Input
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={emailError}
    required
    fullWidth
  />
  <Button variant="primary" type="submit" loading={isLoading} fullWidth>
    Submit
  </Button>
</form>
```

### アクション付きカード
```tsx
<Card hoverable>
  <Card.Header>
    <h3>Title</h3>
    <Badge variant="success">New</Badge>
  </Card.Header>
  <Card.Body>
    <p>Content here</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

### 通知システム
```tsx
const [toast, setToast] = useState(null);

{toast && (
  <Toast
    type={toast.type}
    message={toast.message}
    onClose={() => setToast(null)}
  />
)}

// トーストを表示
setToast({ type: 'success', message: 'Saved!' });
```

### ローディング状態
```tsx
{isLoading ? (
  <div className="flex justify-center p-8">
    <Spinner size="lg" />
  </div>
) : (
  <Content />
)}
```

### 空の状態
```tsx
{items.length === 0 ? (
  <EmptyState
    icon={<InboxIcon />}
    title="No items"
    description="Add your first item"
    action={<Button onClick={handleAdd}>Add Item</Button>}
  />
) : (
  <ItemList items={items} />
)}
```

### エラーハンドリング
```tsx
{error && (
  <ErrorState
    title="Failed to load"
    message={error.message}
    onRetry={handleRetry}
    onDismiss={() => setError(null)}
  />
)}
```

## Tailwindクラス（デザイントークンに対応）

### カラー
- `text-blue-600` = `colors.primary[600]`
- `bg-green-500` = `colors.success[500]`
- `border-red-300` = `colors.error[300]`

### スペーシング
- `p-4` = `spacing[4]` (16px)
- `mt-6` = `spacing[6]` (24px)
- `gap-8` = `spacing[8]` (32px)

### タイポグラフィ
- `text-lg` = `typography.fontSize.lg`
- `font-bold` = `typography.fontWeight.bold`
- `leading-relaxed` = `typography.lineHeight.relaxed`

### シャドウ
- `shadow-lg` = `shadows.lg`
- `shadow-xl` = `shadows.xl`

### ボーダー半径
- `rounded-lg` = `borderRadius.lg`
- `rounded-xl` = `borderRadius.xl`
- `rounded-full` = `borderRadius.full`

## レスポンシブデザイン

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  // モバイル: 1列
  // タブレット (768px+): 2列
  // デスクトップ (1024px+): 3列
</div>
```

## アクセシビリティチェックリスト

- ✅ セマンティックなHTML要素を使用
- ✅ 必要に応じてARIAラベルを追加
- ✅ キーボードナビゲーションが機能することを確認
- ✅ カラーコントラストを確認（最低4.5:1）
- ✅ 画像にaltテキストを追加
- ✅ 動的なコンテンツに`aria-live`を使用
- ✅ フォーカスインジケーターを提供
- ✅ スクリーンリーダーでテスト

## パフォーマンスのヒント

- ✅ 高コストなコンポーネントに`memo()`を使用
- ✅ `useCallback()`でコールバックをメモ化
- ✅ `useMemo()`で計算値をメモ化
- ✅ レンダリング内のインライン関数定義を避ける
- ✅ リストで適切なkeyプロパティを使用

## リソース

- 📚 完全なドキュメント: `/DESIGN_SYSTEM.md`
- 🎨 ライブ例: `/design-system` ページ
- 🔄 マイグレーションガイド: `/DESIGN_SYSTEM_MIGRATION.md`
- 📊 サマリー: `/DESIGN_SYSTEM_SUMMARY.md`

## ヘルプが必要ですか？

1. コンポーネントショーケースを確認: `http://localhost:3000/design-system`
2. ドキュメントを確認: `/DESIGN_SYSTEM.md`
3. コンポーネントファイルのTypeScript型を確認
4. コードベースの既存の使用例を確認

---

**プロのヒント**: 開発中はこのファイルを2つ目のタブで開いておいてください！
