# デザインシステムガイド

## 概要

このアプリケーションは、デジタル庁デザインシステムの原則を参考にした、モダンでアクセシブルなUIデザインを採用しています。

## デザイン原則

### 1. 一貫性 (Consistency)
- 統一されたデザイントークン（色、スペーシング、タイポグラフィ）の使用
- 全体で共通のUIコンポーネントパターンを採用
- 予測可能なユーザー体験

### 2. シンプルさ (Simplicity)
- 過度な装飾を避け、機能性を重視
- 明確な視覚的階層
- クリーンで読みやすいインターフェース

### 3. アクセシビリティ (Accessibility)
- WCAG 2.1 AA準拠を目指したコントラスト比
- キーボードナビゲーション完全対応
- スクリーンリーダー対応
- ARIA属性による支援技術のサポート

### 4. レスポンシブ (Responsive)
- モバイルファーストアプローチ
- すべてのデバイスサイズに対応
- タッチフレンドリーなUI要素

---

## カラーパレット

### プライマリカラー (Primary)
政府系サービスに適した信頼性の高いブルー系統

```css
--color-primary-50: #eff6ff;   /* 最も明るい */
--color-primary-100: #dbeafe;
--color-primary-500: #3b82f6;  /* ベースカラー */
--color-primary-600: #2563eb;  /* 主に使用 */
--color-primary-700: #1d4ed8;
--color-primary-950: #172554;  /* 最も暗い */
```

**使用例:**
- プライマリボタン
- リンク
- アクティブ状態
- フォーカスリング

### セマンティックカラー

#### Success (成功)
```css
--color-success-500: #22c55e;
--color-success-600: #16a34a;
```
- 成功メッセージ
- 完了状態
- ポジティブなアクション

#### Warning (警告)
```css
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
```
- 注意喚起
- 開発モード表示
- 重要な通知

#### Error (エラー)
```css
--color-error-500: #ef4444;
--color-error-600: #dc2626;
```
- エラーメッセージ
- バリデーションエラー
- 削除などの破壊的アクション

#### Info (情報)
```css
--color-info-500: #3b82f6;
--color-info-600: #2563eb;
```
- 情報メッセージ
- ヘルプテキスト
- 通知

### グレースケール
```css
--color-gray-50: #f9fafb;    /* 背景 */
--color-gray-100: #f3f4f6;
--color-gray-300: #d1d5db;   /* ボーダー */
--color-gray-500: #6b7280;   /* 補助テキスト */
--color-gray-700: #374151;   /* 見出し */
--color-gray-900: #111827;   /* 本文 */
```

---

## タイポグラフィ

### フォントファミリー
```css
--font-family-sans: ui-sans-serif, system-ui, -apple-system,
  "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN",
  "Noto Sans JP", Meiryo, sans-serif;
```

日本語と英語の両方に最適化されたシステムフォントスタック

### フォントサイズ
```css
--font-size-xs: 0.75rem;     /* 12px - 補足情報 */
--font-size-sm: 0.875rem;    /* 14px - キャプション */
--font-size-base: 1rem;      /* 16px - 本文 */
--font-size-lg: 1.125rem;    /* 18px - 強調テキスト */
--font-size-xl: 1.25rem;     /* 20px - 小見出し */
--font-size-2xl: 1.5rem;     /* 24px - セクション見出し */
--font-size-3xl: 1.875rem;   /* 30px - ページタイトル */
--font-size-4xl: 2.25rem;    /* 36px - 大見出し */
```

### フォントウェイト
```css
--font-weight-normal: 400;    /* 本文 */
--font-weight-medium: 500;    /* 強調 */
--font-weight-semibold: 600;  /* 見出し */
--font-weight-bold: 700;      /* 重要な見出し */
```

### 行の高さ
```css
--line-height-tight: 1.25;    /* 見出し */
--line-height-normal: 1.5;    /* 本文 */
--line-height-relaxed: 1.75;  /* 読みやすさ重視 */
```

---

## スペーシングシステム

8px基準のスペーシングシステム（一部4px単位）

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

**使用ガイドライン:**
- コンポーネント内のパディング: `spacing-4` (16px)
- カード間のマージン: `spacing-6` (24px)
- セクション間のマージン: `spacing-8` (32px)
- 大きなセクション区切り: `spacing-12` (48px)

---

## UIコンポーネント

### ボタン

#### Primary Button
```html
<button class="btn-primary">分析を開始</button>
```

**スタイル:**
- 背景: `--color-primary-600`
- テキスト: 白
- ホバー: `--color-primary-700`
- アクティブ: `--color-primary-800`
- シャドウ: `--shadow-sm`

**使用場面:**
- メインアクション
- フォーム送信
- 重要な操作

#### Secondary Button
```html
<button class="btn-secondary">キャンセル</button>
```

**スタイル:**
- 背景: 白
- ボーダー: `--color-primary-600`
- テキスト: `--color-primary-700`
- ホバー: `--color-primary-50` 背景

**使用場面:**
- サブアクション
- キャンセル操作
- 追加オプション

### インプットフィールド

```html
<input type="text" class="input-field" placeholder="住所を入力">
```

**特徴:**
- ボーダー: 2px solid `--color-gray-300`
- フォーカス時: ボーダー `--color-primary-500` + シャドウ
- エラー時: ボーダー `--color-error-500`
- ホバー: ボーダー `--color-gray-400`

### カード

```html
<div class="card">
  <!-- コンテンツ -->
</div>
```

**スタイル:**
- 背景: 白
- ボーダー: 1px solid `--color-gray-200`
- 角丸: `--border-radius-lg` (16px)
- シャドウ: `--shadow-base`
- パディング: `--spacing-6` (24px)

---

## シャドウシステム

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

**使用ガイドライン:**
- `shadow-sm`: ボタン、小さなカード
- `shadow-base`: 標準的なカード
- `shadow-md`: 強調したいカード
- `shadow-lg`: モーダル、ドロップダウン

---

## ボーダー半径

```css
--border-radius-sm: 0.25rem;   /* 4px - 小要素 */
--border-radius-base: 0.5rem;  /* 8px - 標準 */
--border-radius-md: 0.75rem;   /* 12px - 中要素 */
--border-radius-lg: 1rem;      /* 16px - カード */
--border-radius-xl: 1.5rem;    /* 24px - 大きなカード */
--border-radius-full: 9999px;  /* 円形 */
```

---

## アニメーション

### トランジション時間
```css
--transition-fast: 150ms;    /* ホバー効果 */
--transition-base: 200ms;    /* 標準的な遷移 */
--transition-slow: 300ms;    /* ページ遷移 */
--transition-slower: 500ms;  /* 大きな変化 */
```

### アニメーション

#### Fade In
```css
.animate-fade-in {
  animation: fade-in 300ms ease-out;
}
```

**使用例:**
- コンテンツの表示
- モーダルの出現

#### Slide In Right
```css
.animate-slide-in-right {
  animation: slide-in-right 200ms ease-out;
}
```

**使用例:**
- トースト通知
- サイドパネル

---

## アクセシビリティ機能

### フォーカス表示
```css
*:focus-visible {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### スクリーンリーダー専用コンテンツ
```html
<span class="sr-only">スクリーンリーダー用の説明</span>
```

### ARIA属性の使用
- `role`: 要素の役割を明示
- `aria-label`: アクセシブルな名前を提供
- `aria-describedby`: 追加説明の関連付け
- `aria-invalid`: フォームエラー状態
- `aria-hidden`: 装飾的要素の非表示

---

## レスポンシブデザイン

### ブレークポイント
```css
/* モバイル: デフォルト */
/* タブレット: 768px */
@media (min-width: 768px) { }

/* デスクトップ: 1024px */
@media (min-width: 1024px) { }

/* 大画面: 1280px */
@media (min-width: 1280px) { }
```

### グリッドレイアウト
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- カード -->
</div>
```

---

## ベストプラクティス

### 1. デザイントークンの使用
❌ **避ける:**
```css
color: #3b82f6;
```

✅ **推奨:**
```css
color: var(--color-primary-500);
/* または */
class="text-primary-500"
```

### 2. セマンティックな色の使用
状況に応じて適切な色を選択:
- 成功 → `success`
- エラー → `error`
- 警告 → `warning`
- 情報 → `info` または `primary`

### 3. アクセシビリティの考慮
- 十分なコントラスト比（4.5:1以上）
- フォーカス可能な要素には明確なフォーカス表示
- 色だけに依存しない情報提供
- 適切な代替テキスト

### 4. 一貫性の維持
- 共通コンポーネントクラス（`.btn-primary`、`.card`など）を活用
- カスタムスタイルは最小限に
- デザイントークンに基づいた値を使用

---

## 参考リンク

- [デジタル庁デザインシステム](https://github.com/digital-go-jp/design-system-example-components-react)
- [WCAG 2.1 ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

---

## 更新履歴

- **2025-10-23**: デジタル庁デザインシステムを参考にした初版作成
  - デザイントークンの定義
  - 共通コンポーネントスタイルの実装
  - アクセシビリティ機能の強化
