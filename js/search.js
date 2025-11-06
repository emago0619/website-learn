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
