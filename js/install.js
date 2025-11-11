/**
 * PWAインストール機能
 * beforeinstallpromptイベントを利用してインストールボタンを表示・管理する
 */

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installBtn = null;
        this.init();
    }

    init() {
        // DOMロード完了後に初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.installBtn = document.getElementById('installBtn');

        if (!this.installBtn) {
            return;
        }

        // すでにインストール済みかチェック
        if (this.isInstalled()) {
            return;
        }

        // iOS Safari対応: beforeinstallpromptが使えない場合
        if (this.isIOSSafari() && !this.isInstalled()) {
            // iOS Safariでもインストールボタンを表示
            this.showInstallButton();
        }

        // beforeinstallpromptイベントをリスンする
        window.addEventListener('beforeinstallprompt', (e) => {
            // デフォルトのインストールプロンプトを防止
            e.preventDefault();
            // イベントを保存して後で使用
            this.deferredPrompt = e;
            // インストールボタンを表示
            this.showInstallButton();
        });

        // インストールボタンのクリックイベント
        this.installBtn.addEventListener('click', () => {
            this.handleInstallClick();
        });

        // アプリがインストールされた時のイベント
        window.addEventListener('appinstalled', () => {
            this.handleAppInstalled();
        });
    }

    /**
     * iOS Safariかどうか判定
     */
    isIOSSafari() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
        return isIOS && isSafari;
    }

    /**
     * PWAがすでにインストールされているかチェック
     */
    isInstalled() {
        // スタンドアロンモードで実行されているか
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }

        // iOS Safariのスタンドアロンモード
        if (window.navigator.standalone === true) {
            return true;
        }

        // localStorageでインストール済みフラグをチェック
        if (localStorage.getItem('pwa-installed') === 'true') {
            return true;
        }

        return false;
    }

    /**
     * インストールボタンを表示
     */
    showInstallButton() {
        if (this.installBtn) {
            this.installBtn.style.display = 'flex';
            this.installBtn.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * インストールボタンを非表示
     */
    hideInstallButton() {
        if (this.installBtn) {
            this.installBtn.style.display = 'none';
            this.installBtn.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * インストールボタンクリック時の処理
     */
    async handleInstallClick() {
        // iOS Safari: インストール手順を案内
        if (this.isIOSSafari()) {
            this.showIOSInstallGuide();
            return;
        }

        // 通常のブラウザ: beforeinstallpromptを使用
        if (!this.deferredPrompt) {
            return;
        }

        // インストールプロンプトを表示
        this.deferredPrompt.prompt();

        // ユーザーの選択結果を待つ
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            // ボタンを非表示にする
            this.hideInstallButton();
        }

        // プロンプトは一度しか使えないのでクリア
        this.deferredPrompt = null;
    }

    /**
     * アプリインストール完了時の処理
     */
    handleAppInstalled() {
        // インストールボタンを非表示
        this.hideInstallButton();

        // localStorageにインストール済みフラグを保存
        localStorage.setItem('pwa-installed', 'true');

        // 成功メッセージを表示（オプション）
        this.showInstallSuccessMessage();
    }

    /**
     * インストール成功メッセージを表示
     */
    showInstallSuccessMessage() {
        // シンプルなトースト通知を表示
        const toast = document.createElement('div');
        toast.className = 'install-toast';
        toast.textContent = '✓ アプリがインストールされました！';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        document.body.appendChild(toast);

        // 3秒後に削除
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * iOS Safariでのインストール手順を表示
     */
    showIOSInstallGuide() {
        // すでにモーダルが存在する場合は削除
        const existingModal = document.getElementById('iosInstallModal');
        if (existingModal) {
            existingModal.remove();
        }

        // モーダルを作成
        const modal = document.createElement('div');
        modal.id = 'iosInstallModal';
        modal.className = 'ios-install-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'ios-install-title');

        modal.innerHTML = `
            <div class="ios-install-overlay"></div>
            <div class="ios-install-content">
                <h3 id="ios-install-title">アプリをインストール</h3>
                <p>このサイトをホーム画面に追加して、アプリのように使えます</p>
                <ol class="ios-install-steps">
                    <li>
                        <span class="step-icon">📱</span>
                        <span>画面下部の<strong>共有ボタン</strong> <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: inline; vertical-align: middle;"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg> をタップ
                    </li>
                    <li>
                        <span class="step-icon">➕</span>
                        <span>「<strong>ホーム画面に追加</strong>」を選択</span>
                    </li>
                    <li>
                        <span class="step-icon">✓</span>
                        <span>右上の「<strong>追加</strong>」をタップして完了</span>
                    </li>
                </ol>
                <button class="ios-install-close" aria-label="閉じる">閉じる</button>
            </div>
        `;

        document.body.appendChild(modal);

        // 閉じるボタンとオーバーレイのイベント
        const closeBtn = modal.querySelector('.ios-install-close');
        const overlay = modal.querySelector('.ios-install-overlay');

        const closeModal = () => {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESCキーで閉じる
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // フェードインアニメーション
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// インスタンス化
const pwaInstaller = new PWAInstaller();
