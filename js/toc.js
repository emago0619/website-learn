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
