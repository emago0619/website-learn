# 開発初心者向け Webサイト構築ガイド

GitHub、Cursor、CodexCLI、ChatGPTを使って、開発初心者でも効率的にWebサイトの構築・修正ができるようになるための包括的なガイドサイトです。

## 🎯 概要

このプロジェクトは、プログラミング経験が少ない方でも、AIツールを活用して効率的にWebサイトを作成・修正できるようになることを目的としています。

**「いきなりコードを書かない」** というのが基本方針です。まず**ChatGPT**で要件を整理し、**Cursorのプランモード**や**CodexCLI**で実装計画を立ててから、実装に入ります。

## ✨ 主な特徴

### 計画重視型ワークフロー
1. **ChatGPT**で要件定義
2. **CodexCLI**で初期構築（クレジット節約）または **Cursorプランモード**で実装計画
3. **Cursor**で細かい修正と仕上げ

### 包括的な学習内容
- GitHub、Cursor、CodexCLIの基礎から実践まで
- 静的サイトと動的サイトの違い
- Next.js、React、Supabase などモダンな技術の解説
- 様々なデプロイ方法（GitHub Pages、Netlify、Vercel、FTP）
- Cursorの内蔵ブラウザによる効率的な開発

### わかりやすい説明
- 会話形式のQ&A（💭マーク）で理解しやすい
- 実践的な例とステップバイステップの手順
- 初心者でも迷わない丁寧な解説

## 📚 サイト構成

### ページ一覧

1. **ホーム（index.html）**
   - ガイドの概要と対象読者
   - 計画重視型ワークフローの説明
   - 各セクションへのナビゲーション

2. **準備編（pages/setup.html）**
   - GitHubアカウントの作成方法
   - Cursorのインストール手順
   - CodexCLIのインストール手順
   - 初期設定とアカウント連携

3. **基礎知識編（pages/basics.html）**
   - GitとGitHubの基本概念
   - Cursorの特徴とAI機能
   - CodexCLIの役割と基本コマンド
   - 静的サイト vs 動的サイト
   - PHP、React、Next.js、Supabaseの解説
   - データベースが必要な場面
   - 基本的な用語集

4. **実践編（pages/practice.html）**
   - **パート0**: 開発フロー全体像
   - **パート1**: ChatGPTで要件整理
   - **パート2**: CodexCLIで初期構築（クレジット節約術）
   - **パート3**: Cursorプランモードで実装計画（代替手法）
   - **パート4**: 新規Webサイトの作成
   - **パート5**: GitHub Pagesでの公開
   - **パート6**: 既存サイトの修正
   - **パート7**: より高度な機能
   - **パート8**: 様々なデプロイ方法
   - **パート9**: Cursorの内蔵ブラウザの活用

5. **FAQ（pages/faq.html）**
   - よくある質問と回答
   - トラブルシューティング
   - エラーメッセージの対処法
   - 参考リンク集

## 🚀 推奨ワークフロー

### 新規プロジェクト作成の場合
```
1. ChatGPTで要件整理 → requirements.md作成
2. CodexCLI（Cursor Composer）で初期構築（80%完成）
3. Cursorで細かい修正（残り20%）
4. GitHubにプッシュ＆デプロイ
```

### 既存プロジェクト修正の場合
```
1. ChatGPTで要件整理
2. Cursorプランモードで実装計画
3. 計画をレビュー・承認
4. 実装
5. テスト＆デプロイ
```

## 📁 ファイル構造

```
/
├── index.html          # トップページ
├── robots.txt          # クローラー対策
├── css/
│   └── styles.css     # 統一スタイルシート
├── pages/
│   ├── setup.html     # 準備編
│   ├── basics.html    # 基礎知識編
│   ├── practice.html  # 実践編
│   └── faq.html       # FAQ
└── README.md          # このファイル
```

## 💡 特徴的な機能

### クレジット節約術
Cursorのクレジット消費を70-80%削減する方法を紹介：
- CodexCLIで初期構築（80%の骨組み）
- Cursorで細かい修正（残り20%）

### 会話形式の説明
各セクションに「💭 よくある質問」を配置し、初心者でも理解しやすく解説

### 実践的な例
- ChatGPTとの実際の対話例
- Cursorプランモードの具体的な使い方
- requirements.mdの書き方サンプル

## 🛠 技術仕様

- **HTML5 + CSS3**：セマンティックなマークアップ
- **レスポンシブデザイン**：スマホ・タブレット対応
- **純粋な静的サイト**：JavaScriptは最小限
- **SEO対策**：robots.txt + noindexメタタグでクローラー制御

## 🎓 対象読者

- プログラミング経験が少ないが、Webサイトの作成・修正を担当する方
- AIツール（ChatGPT、Cursor）を業務で活用したい方
- 既存のWebサイトを安全に修正したい方
- チームで開発する際の標準的なワークフローを学びたい方

## 📖 使い方

### ローカルで確認
1. `index.html`をブラウザで開く
2. または、Live Serverなどでローカルサーバーを起動

### GitHub Pagesで公開
1. リポジトリをGitHubにプッシュ
2. Settings > Pages から公開設定
3. 数分待つと公開URLが表示される

## 🔒 プライバシー設定

このガイドは学習用として作成されており、以下の対策を実施しています：
- `robots.txt`ですべてのクローラーをブロック
- 各HTMLに`<meta name="robots" content="noindex, nofollow">`を設定

## 📝 ライセンス

このガイドは学習目的で作成されています。自由に使用・改変・共有できます。

## 🔗 参考リンク

- [GitHub公式ドキュメント](https://docs.github.com/ja)
- [Cursor公式サイト](https://cursor.sh)
- [MDN Web Docs](https://developer.mozilla.org/ja/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Supabase公式サイト](https://supabase.com)

## 📅 更新履歴

- **2024年**: 初版リリース
  - 計画重視型ワークフローの導入
  - CodexCLIでのクレジット節約術を追加
  - Next.js、Supabaseの解説を追加
  - 会話形式の説明を各セクションに追加
