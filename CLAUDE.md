# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコードを操作する際のガイダンスを提供します。

# コミュニケーション
ユーザーとのコミュニケーションは日本語で行ってください。

## 重要
このプロジェクトは顧客へのデモ画面の開発です。
データベースを使わずにUIの実装だけを行い、顧客に成果物のイメージをしてもらうためのものです。

## 開発コマンド

- `npm run dev` - Turbopack を使用した開発サーバーの起動
- `npm run build` - Turbopack を使用したプロダクション用ビルド
- `npm run start` - プロダクションサーバーの起動
- `npm run lint` - Biome を使用したリント実行
- `npm run format` - Biome を使用したコードフォーマット
- `npm run check` - Biome チェック（リント + フォーマット）の実行

## プロジェクト構成

これは以下の技術を使用した Next.js 15 の車オークションサイトです：
- **フレームワーク**: Next.js 15 with App Router
- **スタイリング**: テーマ用 CSS 変数を持つ Tailwind CSS v4
- **コンポーネント**: shadcn/ui デザインシステムと Radix UI プリミティブ
- **アイコン**: Lucide React
- **通知**: react-hot-toast
- **コード品質**: Biome（リント・フォーマット）
- **TypeScript**: 完全な TypeScript サポート

## コンポーネント構成

### UI コンポーネント
- 基本となる UI パーツは `src/components/ui/` に配置（button、input、card など）
- shadcn/ui パターンに従い、Radix UI プリミティブを使用
- 一貫したテーマのために CSS 変数を使用

### 共通コンポーネント  
- その他の大きな単位の共通コンポーネントは `src/components/` にまとめる
- UI コンポーネントをより複雑なパターンに組み合わせて使用

## コードスタイル（Biome 設定）

- インデント: 2 スペース
- クォート: ダブルクォート
- セミコロン: 必須
- 末尾カンマ: ES5 スタイル
- 行幅: 100 文字
- インポートの自動整理

## エイリアス

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/components/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`

## テーマシステム

`src/app/globals.css` で定義された CSS カスタムプロパティを使用したテーマ設定。色は shadcn/ui の慣例に従い、セマンティックな命名（primary、secondary、muted など）を使用。

