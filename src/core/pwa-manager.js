/**
 * Accountera PWA Manager
 * Manages Service Worker lifecycle, installation prompts, and offline connectivity state.
 */

const PwaManager = {
  deferredPrompt: null,
  isAppInstalled: false,

  init() {
    this.purgeOldCaches();
    this.checkStandaloneMode();
    this.registerServiceWorker();
    this.setupInstallPromptListener();
    this.setupNetworkStatusListeners();
    this.renderInstallButtonInHeader();
  },

  purgeOldCaches() {
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          if (key !== 'accountera-pwa-v3') {
            console.log(`[PWA] Purging outdated cache: ${key}`);
            caches.delete(key);
          }
        });
      }).catch(() => {});
    }
  },

  checkStandaloneMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true ||
                         document.referrer.includes('android-app://');
    this.isAppInstalled = isStandalone;
    if (isStandalone) {
      document.body.classList.add('pwa-standalone');
    }
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((registration) => {
            console.log('⚡ Accountera PWA: Service Worker registered successfully', registration.scope);

            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    this.showUpdateBanner();
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.warn('⚠️ Accountera PWA: Service Worker registration failed', error);
          });
      });
    }
  },

  setupInstallPromptListener() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
      const installBtn = document.getElementById('pwaInstallBtn');
      if (installBtn) installBtn.style.display = 'inline-flex';
    });

    window.addEventListener('appinstalled', () => {
      this.isAppInstalled = true;
      this.deferredPrompt = null;
      this.hideInstallBanner();
      const installBtn = document.getElementById('pwaInstallBtn');
      if (installBtn) installBtn.style.display = 'none';

      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('🎉 شكراً لك! تم تثبيت تطبيق أكونتيرا بنجاح على جهازك.', 'success');
      }
    });
  },

  async promptInstall() {
    if (!this.deferredPrompt) {
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('التطبيق مثبت بالفعل أو أن متصفحك يدعم التثبيت من قائمة الخيارات.', 'info');
      }
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }
    this.deferredPrompt = null;
    this.hideInstallBanner();
  },

  showInstallBanner() {
    if (this.isAppInstalled) return;
    if (sessionStorage.getItem('accountera_pwa_dismissed') === 'true') return;

    let banner = document.getElementById('pwa-install-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pwa-install-banner';
      banner.className = 'pwa-install-banner';
      banner.innerHTML = `
        <div class="pwa-banner-content">
          <div class="pwa-banner-info">
            <div class="pwa-banner-icon">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#10B981"/>
                <path d="M12 28V15C12 13.8954 12.8954 13 14 13C15.1046 13 16 13.8954 16 15V28" stroke="#FFFFFF" stroke-width="2"/>
                <path d="M24 28V15C24 13.8954 24.8954 13 26 13C27.1046 13 28 13.8954 28 15V28" stroke="#FFFFFF" stroke-width="2"/>
                <path d="M14 20H26" stroke="#FFFFFF" stroke-width="2"/>
              </svg>
            </div>
            <div>
              <strong style="display:block; font-size:0.86rem; color:var(--text-primary);">تثبيت منصة أكونتيرا على جهازك</strong>
              <span style="font-size:0.75rem; color:var(--text-secondary);">استخدم المحاكي بسرعة فائقة حتى في وضع عدم الاتصال بالإنترنت</span>
            </div>
          </div>
          <div class="pwa-banner-actions">
            <button type="button" class="btn-workspace-action btn-workspace-primary" style="padding:5px 14px; font-size:0.8rem;" onclick="PwaManager.promptInstall()">
              تثبيت التطبيق الآن
            </button>
            <button type="button" class="btn-workspace-action" style="padding:5px 10px; font-size:0.8rem;" onclick="PwaManager.dismissInstallBanner()">
              لاحقاً
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(banner);
    }
    banner.style.display = 'block';
  },

  dismissInstallBanner() {
    sessionStorage.setItem('accountera_pwa_dismissed', 'true');
    this.hideInstallBanner();
  },

  hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.style.display = 'none';
  },

  showUpdateBanner() {
    let updateBanner = document.getElementById('pwa-update-banner');
    if (!updateBanner) {
      updateBanner = document.createElement('div');
      updateBanner.id = 'pwa-update-banner';
      updateBanner.className = 'pwa-update-banner';
      updateBanner.innerHTML = `
        <div style="background:var(--primary); color:white; padding:8px 16px; text-align:center; font-size:0.82rem; font-weight:700; display:flex; justify-content:center; align-items:center; gap:12px; z-index:9999; position:fixed; top:0; left:0; right:0; box-shadow:var(--shadow-md);">
          <span>🚀 يتوفر تحديث جديد ومحاكيات جديدة لمنصة أكونتيرا!</span>
          <button type="button" onclick="window.location.reload()" style="background:white; color:var(--primary); border:none; border-radius:6px; padding:3px 10px; font-weight:800; font-size:0.78rem; cursor:pointer;">
            تحديث فوري
          </button>
        </div>
      `;
      document.body.appendChild(updateBanner);
    }
  },

  setupNetworkStatusListeners() {
    const updateOnlineStatus = () => {
      let toast = document.getElementById('pwa-offline-indicator');
      if (!navigator.onLine) {
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'pwa-offline-indicator';
          toast.style.cssText = 'position:fixed; bottom:70px; right:20px; z-index:9999; background:rgba(220, 38, 38, 0.95); color:white; padding:8px 16px; border-radius:12px; font-size:0.8rem; font-weight:700; display:flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(0,0,0,0.25); backdrop-filter:blur(8px);';
          toast.innerHTML = '<span>⚡</span> <span>أنت تعمل حالياً دون اتصال بالإنترنت (Offline Mode)</span>';
          document.body.appendChild(toast);
        }
        toast.style.display = 'flex';
      } else {
        if (toast) {
          toast.style.display = 'none';
        }
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  },

  renderInstallButtonInHeader() {
    const topbarRight = document.querySelector('.topbar-right');
    if (topbarRight && !document.getElementById('pwaInstallBtn') && !this.isAppInstalled) {
      const btn = document.createElement('button');
      btn.id = 'pwaInstallBtn';
      btn.className = 'btn-workspace-action';
      btn.style.cssText = 'display:none; padding:4px 10px; font-size:0.78rem; gap:6px; border-color:var(--primary); color:var(--primary); font-weight:700;';
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>تثبيت التطبيق</span>
      `;
      btn.onclick = () => this.promptInstall();
      topbarRight.prepend(btn);
    }
  }
};

window.PwaManager = PwaManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PwaManager.init());
} else {
  PwaManager.init();
}
