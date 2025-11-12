// ============================================
// ハンバーガーメニューの制御（アクセシビリティ対応）
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        // メニューの開閉
        function toggleMenu() {
            const isOpen = navMenu.classList.contains('active');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // アクセシビリティ: aria-expanded属性を更新
            hamburger.setAttribute('aria-expanded', !isOpen);
            hamburger.setAttribute('aria-label', !isOpen ? 'メニューを閉じる' : 'メニューを開く');

            // アクセシビリティ: メニュー開閉をスクリーンリーダーに通知
            announceToScreenReader(!isOpen ? 'メニューを開きました' : 'メニューを閉じました');

            // メニューを開いた時の処理
            if (!isOpen) {
                // メニュー内のスクロールを有効にし、body のスクロールを無効にする
                document.body.style.overflow = 'hidden';

                // 最初のリンクにフォーカスを移動
                const firstLink = navMenu.querySelector('a');
                if (firstLink) {
                    // DOM更新とCSSアニメーションの完了を待つため100ms遅延
                    setTimeout(() => firstLink.focus(), 100);
                }
            } else {
                // メニューを閉じた時、body のスクロールを戻す
                document.body.style.overflow = '';
            }
        }

        hamburger.addEventListener('click', toggleMenu);

        // アクセシビリティ: Escキーでメニューを閉じる
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'メニューを開く');
                hamburger.focus(); // フォーカスをハンバーガーボタンに戻す
                document.body.style.overflow = ''; // bodyのスクロールを戻す
                announceToScreenReader('メニューを閉じました');
            }
        });

        // メニュー項目をクリックしたらメニューを閉じる
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'メニューを開く');
                document.body.style.overflow = ''; // bodyのスクロールを戻す
            });
        });

        // メニュー外をクリックしたらメニューを閉じる
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'メニューを開く');
                document.body.style.overflow = ''; // bodyのスクロールを戻す
            }
        });
    }
});

// ============================================
// ダークモード切り替え
// ============================================
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateToggleButton();

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateToggleButton();
        this.animateTransition();

        // アクセシビリティ: テーマ変更をスクリーンリーダーに通知
        const themeText = this.theme === 'dark' ? 'ダークモード' : 'ライトモード';
        announceToScreenReader(`${themeText}に切り替えました`);
    }

    animateTransition() {
        document.documentElement.classList.add('theme-transitioning');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 300);
    }

    updateToggleButton() {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        const themeToggle = document.getElementById('themeToggle');

        if (sunIcon && moonIcon) {
            if (this.theme === 'dark') {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
        }

        // アクセシビリティ: aria-pressed属性を更新
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', this.theme === 'dark' ? 'true' : 'false');
            themeToggle.setAttribute('aria-label', this.theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替');
        }
    }
}

// ダークモードマネージャーを初期化
document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
});

// ============================================
// スクロールプログレスバー（アクセシビリティ対応）
// ============================================
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    scrollProgress.style.width = scrolled + '%';

    // アクセシビリティ: aria-valuenow属性を更新
    scrollProgress.setAttribute('aria-valuenow', Math.round(scrolled));
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// ナビゲーションのスクロール検出
// ============================================
function handleNavScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll);

// ============================================
// スクロールアニメーション（Intersection Observer）
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // セクションにフェードインアニメーションを適用
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.classList.add('fade-up');
        section.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(section);

        // すでにビューポート内にある要素は即座に表示
        if (section.getBoundingClientRect().top < window.innerHeight) {
            section.classList.add('animate-in');
        }
    });

    // カードにもアニメーションを適用
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.add('fade-up');
        card.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(card);

        // すでにビューポート内にある要素は即座に表示
        if (card.getBoundingClientRect().top < window.innerHeight) {
            card.classList.add('animate-in');
        }
    });
});

// ============================================
// スムーズスクロール（アクセシビリティ対応）
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            e.preventDefault();

            const targetId = href;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // prefers-reduced-motionを尊重
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                // アクセシビリティ: ターゲット要素にフォーカスを移動
                // tabindex="-1"の要素もフォーカス可能にする
                targetElement.focus();

                // フォーカスできなかった場合の対策
                if (document.activeElement !== targetElement) {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            }
        });
    });
});

// ============================================
// アクセシビリティ: ライブリージョンアナウンサー
// ============================================
function announceToScreenReader(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (!announcer) return;

    // 既存のメッセージをクリア
    announcer.textContent = '';

    // スクリーンリーダーが確実に読み上げるため100ms遅延してから新しいメッセージを設定
    setTimeout(() => {
        announcer.textContent = message;
    }, 100);

    // 次の通知のため3秒後にメッセージをクリア
    setTimeout(() => {
        announcer.textContent = '';
    }, 3000);
}

// ============================================
// アクセシビリティ: フォーカス管理
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // スキップリンクのフォーカス管理
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.focus();
                // フォーカスできなかった場合の対策
                if (document.activeElement !== target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            }
        });
    }

    // フォーカス可視化の強化（キーボードユーザー向け）
    let isUsingKeyboard = false;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            isUsingKeyboard = true;
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        isUsingKeyboard = false;
        document.body.classList.remove('keyboard-nav');
    });
});
