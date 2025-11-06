# 🚀 Phase 3以降の実装ガイド

このドキュメントは、Phase 1・2で実装された機能を超えて、さらにサイトをリッチでモダンにするための実装ガイドです。

---

## 📋 実装済み機能（Phase 1 & 2）

### Phase 1 ✅
- ✅ CSS変数システム（完全なデザインシステム）
- ✅ ヘッダーのガラスモーフィズム化
- ✅ ヒーローセクションのグラデーション背景とアニメーション
- ✅ カードコンポーネントの3Dホバー効果
- ✅ スクロールプログレスバー

### Phase 2 ✅
- ✅ ダークモード機能（LocalStorage対応）
- ✅ スクロールアニメーション（Intersection Observer）
- ✅ コードブロックのグラデーション背景改善
- ✅ ボタンのシャインエフェクト
- ✅ レスポンシブデザイン最適化

---

## 🎯 Phase 3: 検索機能とナビゲーション強化

### 3.1 モーダル検索機能

全ページのコンテンツを検索できるモーダル検索を実装します。

#### HTML追加（全ページの`</body>`直前）

```html
<!-- 検索モーダル -->
<div class="search-modal" id="searchModal">
  <div class="search-modal-overlay" id="searchOverlay"></div>
  <div class="search-modal-content">
    <div class="search-input-wrapper">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="検索したいキーワードを入力... (Cmd+K / Ctrl+K)"
        id="searchInput"
        autocomplete="off"
      >
      <kbd class="search-shortcut">ESC</kbd>
    </div>

    <div class="search-results" id="searchResults">
      <div class="search-empty">
        <p>キーワードを入力して検索開始</p>
      </div>
    </div>

    <div class="search-footer">
      <div class="search-tips">
        <span><kbd>↑</kbd><kbd>↓</kbd> で移動</span>
        <span><kbd>Enter</kbd> で選択</span>
        <span><kbd>ESC</kbd> で閉じる</span>
      </div>
    </div>
  </div>
</div>
```

#### CSS追加（`styles.css`）

```css
/* ============================================
   検索モーダル
   ============================================ */
.search-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.search-modal.active {
  display: flex;
}

.search-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.search-modal-content {
  position: relative;
  width: 90%;
  max-width: 600px;
  background: var(--bg-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.search-icon {
  color: var(--text-light);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--text-lg);
  color: var(--text-color);
  font-family: var(--font-body);
}

.search-input::placeholder {
  color: var(--text-light);
}

.search-shortcut {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-family: var(--font-code);
  color: var(--text-light);
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: var(--space-2);
}

.search-empty {
  padding: var(--space-12);
  text-align: center;
  color: var(--text-light);
}

.search-result-item {
  display: flex;
  flex-direction: column;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-color);
  transition: background 0.2s;
  cursor: pointer;
}

.search-result-item:hover,
.search-result-item.selected {
  background: var(--bg-light);
}

.result-title {
  font-weight: var(--font-medium);
  margin-bottom: var(--space-1);
}

.result-title mark {
  background: var(--primary-100);
  color: var(--primary-600);
  padding: 0 0.2em;
  border-radius: 2px;
}

.result-url {
  font-size: var(--text-sm);
  color: var(--text-light);
}

.result-excerpt {
  font-size: var(--text-sm);
  color: var(--text-light);
  margin-top: var(--space-2);
  line-height: var(--leading-relaxed);
}

.search-footer {
  padding: var(--space-3) var(--space-6);
  border-top: 1px solid var(--border-color);
  background: var(--bg-light);
}

.search-tips {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-xs);
  color: var(--text-light);
}

.search-tips kbd {
  display: inline-block;
  padding: 0.2em 0.4em;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: var(--font-code);
}
```

#### JavaScript追加（`js/search.js` 新規作成）

```javascript
// ============================================
// 検索機能
// ============================================
class SearchEngine {
  constructor() {
    this.searchData = [];
    this.modal = document.getElementById('searchModal');
    this.overlay = document.getElementById('searchOverlay');
    this.input = document.getElementById('searchInput');
    this.results = document.getElementById('searchResults');
    this.selectedIndex = -1;

    this.init();
  }

  init() {
    // 検索データの構築
    this.buildSearchIndex();

    // イベントリスナーの設定
    this.setupEventListeners();
  }

  buildSearchIndex() {
    // 現在のページのセクションを取得
    const sections = document.querySelectorAll('section');
    const currentPage = window.location.pathname;

    sections.forEach(section => {
      const heading = section.querySelector('h2');
      if (heading) {
        const content = Array.from(section.querySelectorAll('p, li'))
          .map(el => el.textContent)
          .join(' ')
          .substring(0, 200);

        this.searchData.push({
          title: heading.textContent,
          url: currentPage + '#' + section.id,
          content: content,
          element: section
        });
      }
    });

    // 他のページの情報を追加（静的に定義）
    const pages = [
      {
        title: 'ホーム',
        url: '/index.html',
        content: '開発初心者向けWebサイト構築ガイド ChatGPT Cursor GitHub'
      },
      {
        title: '準備編',
        url: '/pages/setup.html',
        content: 'GitHubアカウント作成 Cursorインストール 環境構築'
      },
      {
        title: '基礎知識編',
        url: '/pages/basics.html',
        content: 'Git GitHub 基礎知識 用語集 技術解説'
      },
      {
        title: '実践編',
        url: '/pages/practice.html',
        content: 'プランモード 実装 デプロイ 実践的な開発'
      },
      {
        title: 'FAQ',
        url: '/pages/faq.html',
        content: 'よくある質問 トラブルシューティング エラー対処'
      }
    ];

    this.searchData.push(...pages);
  }

  setupEventListeners() {
    // Cmd+K / Ctrl+K で検索を開く
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openModal();
      }

      // ESC で閉じる
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }

      // 矢印キーで選択移動
      if (this.modal.classList.contains('active')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectNext();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectPrevious();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.navigateToSelected();
        }
      }
    });

    // オーバーレイクリックで閉じる
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeModal());
    }

    // 入力時に検索実行
    if (this.input) {
      this.input.addEventListener('input', (e) => {
        this.performSearch(e.target.value);
      });
    }
  }

  performSearch(query) {
    if (query.length < 2) {
      this.displayEmpty();
      return;
    }

    const results = this.searchData.filter(item => {
      const searchText = (item.title + ' ' + item.content).toLowerCase();
      return searchText.includes(query.toLowerCase());
    }).slice(0, 10);

    this.displayResults(results, query);
  }

  displayEmpty() {
    this.results.innerHTML = `
      <div class="search-empty">
        <p>キーワードを入力して検索開始</p>
      </div>
    `;
  }

  displayResults(results, query) {
    if (results.length === 0) {
      this.results.innerHTML = `
        <div class="search-empty">
          <p>「${query}」に一致する結果が見つかりませんでした</p>
        </div>
      `;
      return;
    }

    const html = results.map((result, index) => {
      const highlightedTitle = this.highlight(result.title, query);
      const excerpt = result.content.substring(0, 100) + '...';
      const highlightedExcerpt = this.highlight(excerpt, query);

      return `
        <a href="${result.url}" class="search-result-item" data-index="${index}">
          <div class="result-title">${highlightedTitle}</div>
          <div class="result-url">${result.url}</div>
          <div class="result-excerpt">${highlightedExcerpt}</div>
        </a>
      `;
    }).join('');

    this.results.innerHTML = html;
    this.selectedIndex = -1;
  }

  highlight(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  selectNext() {
    const items = this.results.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    if (this.selectedIndex < items.length - 1) {
      this.selectedIndex++;
    } else {
      this.selectedIndex = 0;
    }

    this.updateSelection(items);
  }

  selectPrevious() {
    const items = this.results.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else {
      this.selectedIndex = items.length - 1;
    }

    this.updateSelection(items);
  }

  updateSelection(items) {
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  navigateToSelected() {
    const selected = this.results.querySelector('.search-result-item.selected');
    if (selected) {
      window.location.href = selected.getAttribute('href');
    }
  }

  openModal() {
    this.modal.classList.add('active');
    this.input.focus();
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.input.value = '';
    this.displayEmpty();
  }
}

// 検索エンジンを初期化
document.addEventListener('DOMContentLoaded', function() {
  new SearchEngine();
});
```

#### HTMLに追加（全ページの`<head>`内）

```html
<script src="/js/search.js" defer></script>
```

---

## 🎨 Phase 4: 目次ナビゲーション（Table of Contents）

### 4.1 サイドバー目次の実装

長いページに自動生成される目次を追加します。

#### HTML追加（長いページの`<main>`内の最初）

```html
<aside class="toc-sidebar" id="tocSidebar">
  <div class="toc-header">
    <h3>目次</h3>
    <button class="toc-collapse" id="tocCollapse" aria-label="目次を折りたたむ">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </button>
  </div>

  <nav class="toc-nav" id="tocNav">
    <!-- JavaScriptで自動生成 -->
  </nav>
</aside>
```

#### CSS追加

```css
/* ============================================
   目次サイドバー
   ============================================ */
.toc-sidebar {
  position: fixed;
  top: 120px;
  right: 20px;
  width: 280px;
  max-height: calc(100vh - 200px);
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  z-index: 100;
  transition: transform 0.3s ease;
}

.toc-sidebar.collapsed {
  transform: translateX(calc(100% + 40px));
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-color);
}

.toc-header h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin: 0;
}

.toc-collapse {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.toc-collapse:hover {
  background: var(--bg-color);
  color: var(--text-color);
}

.toc-nav {
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  margin: var(--space-1) 0;
}

.toc-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--text-light);
  text-decoration: none;
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  position: relative;
}

.toc-link:hover {
  background: var(--bg-color);
  color: var(--text-color);
}

.toc-item.active .toc-link {
  color: var(--primary-color);
  background: var(--primary-50);
  font-weight: var(--font-medium);
}

.toc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-light);
  transition: all 0.2s;
}

.toc-item.active .toc-dot {
  background: var(--primary-color);
  transform: scale(1.5);
}

.toc-sublist {
  list-style: none;
  margin-left: var(--space-6);
  padding: 0;
}

/* レスポンシブ: タブレット以下で非表示 */
@media (max-width: 1280px) {
  .toc-sidebar {
    display: none;
  }
}
```

#### JavaScript追加（`js/toc.js` 新規作成）

```javascript
// ============================================
// 目次（Table of Contents）
// ============================================
class TableOfContents {
  constructor() {
    this.sidebar = document.getElementById('tocSidebar');
    this.nav = document.getElementById('tocNav');
    this.collapseBtn = document.getElementById('tocCollapse');

    if (!this.sidebar || !this.nav) return;

    this.headings = [];
    this.init();
  }

  init() {
    this.generateTOC();
    this.setupObserver();
    this.setupCollapseButton();
  }

  generateTOC() {
    // h2とh3を取得
    const headings = document.querySelectorAll('main h2, main h3');

    if (headings.length === 0) {
      this.sidebar.style.display = 'none';
      return;
    }

    let html = '<ul class="toc-list">';
    let currentH2 = null;

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      this.headings.push({ id, element: heading });

      if (heading.tagName === 'H2') {
        if (currentH2) {
          html += '</ul></li>';
        }
        html += `
          <li class="toc-item" data-id="${id}">
            <a href="#${id}" class="toc-link">
              <span class="toc-dot"></span>
              <span>${heading.textContent}</span>
            </a>
            <ul class="toc-sublist">
        `;
        currentH2 = id;
      } else if (heading.tagName === 'H3') {
        html += `
          <li class="toc-item" data-id="${id}">
            <a href="#${id}" class="toc-link">
              <span>${heading.textContent}</span>
            </a>
          </li>
        `;
      }
    });

    if (currentH2) {
      html += '</ul></li>';
    }
    html += '</ul>';

    this.nav.innerHTML = html;

    // リンククリック時のスムーズスクロール
    this.nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupObserver() {
    const options = {
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveItem(entry.target.id);
        }
      });
    }, options);

    this.headings.forEach(({ element }) => {
      observer.observe(element);
    });
  }

  setActiveItem(id) {
    const items = this.nav.querySelectorAll('.toc-item');
    items.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-id') === id) {
        item.classList.add('active');
      }
    });
  }

  setupCollapseButton() {
    if (!this.collapseBtn) return;

    this.collapseBtn.addEventListener('click', () => {
      this.sidebar.classList.toggle('collapsed');
    });
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  new TableOfContents();
});
```

---

## 🎭 Phase 5: SVGイラストレーションとビジュアル強化

### 5.1 ヒーローセクション用のSVGイラスト

モダンな3DイラストやアニメーションSVGを追加します。

#### ブラウザウィンドウのイラスト

```html
<div class="hero-illustration">
  <svg class="browser-illustration" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="browserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>

      <filter id="shadow">
        <feDropShadow dx="0" dy="10" stdDeviation="20" flood-opacity="0.3"/>
      </filter>
    </defs>

    <!-- ブラウザウィンドウ -->
    <g filter="url(#shadow)">
      <rect x="50" y="50" width="700" height="500" rx="10" fill="#ffffff" opacity="0.95"/>
      <rect x="50" y="50" width="700" height="40" rx="10" fill="url(#browserGrad)"/>

      <!-- ドットボタン -->
      <circle cx="70" cy="70" r="6" fill="#ff5f57">
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="90" cy="70" r="6" fill="#ffbd2e">
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" begin="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="110" cy="70" r="6" fill="#28ca42">
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" begin="1s" repeatCount="indefinite"/>
      </circle>

      <!-- コンテンツ領域 -->
      <rect x="70" y="110" width="660" height="30" rx="5" fill="#e0e7ff">
        <animate attributeName="width" values="660;600;660" dur="4s" repeatCount="indefinite"/>
      </rect>
      <rect x="70" y="160" width="400" height="15" rx="3" fill="#c7d2fe"/>
      <rect x="70" y="185" width="500" height="15" rx="3" fill="#c7d2fe"/>
      <rect x="70" y="210" width="450" height="15" rx="3" fill="#c7d2fe"/>

      <!-- カード -->
      <g class="card-group">
        <rect x="70" y="250" width="200" height="150" rx="8" fill="#fff" stroke="#e0e7ff" stroke-width="2">
          <animate attributeName="y" values="250;240;250" dur="3s" repeatCount="indefinite"/>
        </rect>
        <rect x="290" y="250" width="200" height="150" rx="8" fill="#fff" stroke="#e0e7ff" stroke-width="2">
          <animate attributeName="y" values="250;240;250" dur="3s" begin="0.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="510" y="250" width="200" height="150" rx="8" fill="#fff" stroke="#e0e7ff" stroke-width="2">
          <animate attributeName="y" values="250;240;250" dur="3s" begin="1s" repeatCount="indefinite"/>
        </rect>
      </g>
    </g>
  </svg>
</div>
```

#### CSS

```css
.hero-illustration {
  position: relative;
  max-width: 600px;
  margin: var(--space-12) auto;
}

.browser-illustration {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
}
```

---

## ⚡ Phase 6: パフォーマンス最適化とプログレッシブWeb App化

### 6.1 Service Worker実装

オフライン対応とキャッシュ戦略を実装します。

#### `sw.js`（ルートディレクトリ）

```javascript
const CACHE_NAME = 'website-learn-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/setup.html',
  '/pages/basics.html',
  '/pages/practice.html',
  '/pages/faq.html',
  '/css/styles.css',
  '/js/menu.js',
  '/js/search.js',
  '/js/toc.js'
];

// インストール
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// フェッチ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// アクティベート（古いキャッシュ削除）
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

#### Service Worker登録（全HTMLの`<head>`内）

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}
</script>
```

### 6.2 manifest.json

```json
{
  "name": "Webサイト構築ガイド",
  "short_name": "構築ガイド",
  "description": "開発初心者向けWebサイト構築ガイド",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

HTMLに追加:
```html
<link rel="manifest" href="/manifest.json">
```

---

## 🎨 Phase 7: 高度なアニメーションとインタラクション

### 7.1 パララックススクロール

```javascript
// js/parallax.js
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const scrolled = window.pageYOffset;

    this.elements.forEach(element => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParallaxEffect();
});
```

使用方法:
```html
<div data-parallax="0.3">
  <!-- パララックス効果を適用する要素 -->
</div>
```

### 7.2 スクロール駆動アニメーション

```css
/* CSS Scroll-Driven Animations（最新ブラウザ） */
@supports (animation-timeline: scroll()) {
  .scroll-reveal {
    animation: reveal linear;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

---

## 📊 Phase 8: アナリティクスとA/Bテスト

### 8.1 カスタムイベントトラッキング

```javascript
// js/analytics.js
class AnalyticsTracker {
  constructor() {
    this.events = [];
    this.init();
  }

  init() {
    // ボタンクリックトラッキング
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.trackEvent('button_click', {
          label: e.target.textContent,
          url: e.target.href
        });
      });
    });

    // スクロール深度トラッキング
    this.trackScrollDepth();
  }

  trackEvent(eventName, data) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data: data
    };

    this.events.push(event);
    console.log('Event tracked:', event);

    // ここで実際のアナリティクスサービスに送信
    // 例: Google Analytics, Plausible, etc.
  }

  trackScrollDepth() {
    const milestones = [25, 50, 75, 100];
    const tracked = new Set();

    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          this.trackEvent('scroll_depth', { percent: milestone });
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AnalyticsTracker();
});
```

---

## 🔧 実装の優先順位

### すぐに実装すべき（高優先度）
1. ✨ 検索機能（Phase 3.1）- ユーザビリティ大幅向上
2. 📑 目次ナビゲーション（Phase 4.1）- 長いページの可読性向上
3. 🎨 SVGイラスト（Phase 5.1）- ビジュアルの魅力向上

### 中期的に実装（中優先度）
4. ⚡ Service Worker（Phase 6.1）- オフライン対応
5. 📱 PWA化（Phase 6.2）- モバイル体験向上
6. 🎬 パララックス（Phase 7.1）- インタラクティブ性向上

### 長期的に検討（低優先度）
7. 📊 アナリティクス（Phase 8.1）- データドリブンな改善
8. 🧪 A/Bテスト - 最適化のための実験

---

## 📝 各機能の想定工数

| 機能 | 工数 | 難易度 |
|------|------|--------|
| 検索機能 | 4-6時間 | 中 |
| 目次ナビゲーション | 2-3時間 | 易 |
| SVGイラスト | 3-5時間 | 中 |
| Service Worker | 2-4時間 | 中 |
| PWA化 | 1-2時間 | 易 |
| パララックス | 2-3時間 | 易 |
| アナリティクス | 3-4時間 | 中 |

---

## ✅ 実装チェックリスト

各機能を実装する際は、以下をチェックしてください：

- [ ] 機能が正しく動作するか
- [ ] レスポンシブデザインに対応しているか
- [ ] ダークモードで適切に表示されるか
- [ ] パフォーマンスに悪影響がないか
- [ ] アクセシビリティに配慮しているか
- [ ] ブラウザ互換性を確認したか

---

## 🎓 参考リソース

### デザインインスピレーション
- [Dribbble](https://dribbble.com/) - UIデザインのトレンド
- [Awwwards](https://www.awwwards.com/) - 受賞サイトギャラリー
- [CodePen](https://codepen.io/) - インタラクティブなデモ

### ライブラリとツール
- [Prism.js](https://prismjs.com/) - シンタックスハイライト
- [Fuse.js](https://fusejs.io/) - 高度な検索機能
- [Lottie](https://airbnb.design/lottie/) - アニメーション
- [ScrollReveal](https://scrollrevealjs.org/) - スクロールアニメーション

---

このドキュメントは随時更新されます。新しいアイデアや改善案があれば追加していきましょう！
