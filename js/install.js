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
            console.warn('インストールボタンが見つかりません');
            return;
        }

        // すでにインストール済みかチェック
        if (this.isInstalled()) {
            console.log('PWAは既にインストール済みです');
            return;
        }

        // beforeinstallpromptイベントをリスンする
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt イベント発火');
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
            console.log('PWAがインストールされました');
            this.handleAppInstalled();
        });
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
        if (!this.deferredPrompt) {
            console.log('インストールプロンプトが利用できません');
            return;
        }

        // インストールプロンプトを表示
        this.deferredPrompt.prompt();

        // ユーザーの選択結果を待つ
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`ユーザーの選択: ${outcome}`);

        if (outcome === 'accepted') {
            console.log('ユーザーがインストールを承認しました');
            // ボタンを非表示にする
            this.hideInstallButton();
        } else {
            console.log('ユーザーがインストールを拒否しました');
            // 拒否された場合もボタンは残しておく（再試行可能）
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
}

// インスタンス化
const pwaInstaller = new PWAInstaller();
