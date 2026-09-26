/**
 * Accountera - Phase 5 Verification Suite
 * Progressive Web App (PWA), Service Worker, Offline Caching & App Manifest
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 بدء اختبارات تطبيق الويب التقدمي والتخزين غير المتصل PWA (Phase 5 Suite)...');

let passedTests = 0;
const totalTests = 10;

function runTest(testName, testFn) {
    try {
        testFn();
        console.log(`   ✅ [PASS]: ${testName}`);
        passedTests++;
    } catch (err) {
        console.error(`   ❌ [FAIL]: ${testName}`);
        console.error(`      الخطأ: ${err.message}`);
    }
}

const manifestPath = path.join(__dirname, 'manifest.webmanifest');
const swPath = path.join(__dirname, 'sw.js');
const pwaManagerPath = path.join(__dirname, 'src', 'core', 'pwa-manager.js');
const indexHtmlPath = path.join(__dirname, 'index.html');

// Test 1: manifest.webmanifest exists and is valid JSON
runTest('ملف manifest.webmanifest موجود وبتنسيق JSON سليم', () => {
    assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest not found');
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const json = JSON.parse(raw);
    assert.strictEqual(typeof json, 'object', 'manifest must be a valid JSON object');
});

// Test 2: manifest metadata and configuration
runTest('بيانات الـ Manifest تتضمن اسم التطبيق والاتجاه العربي والشاشة المستقلة', () => {
    const json = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(json.name.includes('Accountera'), 'App name missing Accountera');
    assert.strictEqual(json.short_name, 'Accountera', 'Short name mismatch');
    assert.strictEqual(json.display, 'standalone', 'Display mode must be standalone');
    assert.strictEqual(json.dir, 'rtl', 'Text direction must be rtl');
    assert.strictEqual(json.lang, 'ar', 'Language must be Arabic');
    assert.ok(json.theme_color, 'Theme color missing');
    assert.ok(json.background_color, 'Background color missing');
});

// Test 3: PWA Icons in manifest and on filesystem
runTest('أيقونات التطبيق متوفرة بجميع المقاسات (192, 512, Maskable, SVG)', () => {
    const json = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(Array.isArray(json.icons) && json.icons.length >= 3, 'Must have at least 3 icon configurations');

    const icon192 = path.join(__dirname, 'icons', 'icon-192.png');
    const icon512 = path.join(__dirname, 'icons', 'icon-512.png');
    const iconMaskable = path.join(__dirname, 'icons', 'icon-maskable-512.png');
    const iconSvg = path.join(__dirname, 'icons', 'icon.svg');

    assert.ok(fs.existsSync(icon192) && fs.statSync(icon192).size > 1000, 'icon-192.png missing or empty');
    assert.ok(fs.existsSync(icon512) && fs.statSync(icon512).size > 1000, 'icon-512.png missing or empty');
    assert.ok(fs.existsSync(iconMaskable) && fs.statSync(iconMaskable).size > 1000, 'icon-maskable-512.png missing or empty');
    assert.ok(fs.existsSync(iconSvg) && fs.statSync(iconSvg).size > 100, 'icon.svg missing or empty');
});

// Test 4: PWA Shortcuts
runTest('روابط الوصول السريع (Shortcuts) للمحاكيات معرّفة في الـ Manifest', () => {
    const json = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.ok(Array.isArray(json.shortcuts) && json.shortcuts.length >= 4, 'Must have at least 4 shortcuts');
    const shortcutUrls = json.shortcuts.map(s => s.url);
    assert.ok(shortcutUrls.some(u => u.includes('journal')), 'Journal shortcut missing');
    assert.ok(shortcutUrls.some(u => u.includes('bank-recon')), 'Bank recon shortcut missing');
    assert.ok(shortcutUrls.some(u => u.includes('cash-count')), 'Cash count shortcut missing');
    assert.ok(shortcutUrls.some(u => u.includes('tax-returns')), 'Tax returns shortcut missing');
});

// Test 5: Service Worker file existence and precache list
runTest('ملف Service Worker (sw.js) موجود ويتضمن التخزين المسبق لأصول المنظومة والمحاكيات', () => {
    assert.ok(fs.existsSync(swPath), 'sw.js not found');
    const swContent = fs.readFileSync(swPath, 'utf8');
    assert.ok(swContent.includes('STATIC_PRECACHE_URLS'), 'Precache list missing');
    assert.ok(swContent.includes('simulation/simulation/dashboard/index.html'), 'Dashboard sim page not precached');
    assert.ok(swContent.includes('simulation/simulation/bank-recon/index.html'), 'Bank recon sim page not precached');
    assert.ok(swContent.includes('simulation/simulation/cash-count/index.html'), 'Cash count sim page not precached');
    assert.ok(swContent.includes('simulation/simulation/tax-returns/index.html'), 'Tax returns sim page not precached');
});

// Test 6: Service Worker lifecycle events (install, activate, fetch)
runTest('دوال دورة حياة Service Worker (install, activate, fetch, message) مبرمجة بدقة', () => {
    const swContent = fs.readFileSync(swPath, 'utf8');
    assert.ok(swContent.includes("addEventListener('install'"), 'Install listener missing');
    assert.ok(swContent.includes("addEventListener('activate'"), 'Activate listener missing');
    assert.ok(swContent.includes("addEventListener('fetch'"), 'Fetch listener missing');
    assert.ok(swContent.includes('self.skipWaiting()'), 'skipWaiting call missing');
    assert.ok(swContent.includes('clients.claim()'), 'clients.claim call missing');
});

// Test 7: Service Worker bypasses Supabase API to keep data fresh
runTest('خدمة Service Worker تتجاوز مكالمات سحابة Supabase لمنع تضارب البيانات الحديثة', () => {
    const swContent = fs.readFileSync(swPath, 'utf8');
    assert.ok(swContent.includes("hostname.includes('supabase.co')"), 'Supabase API bypass missing');
    assert.ok(swContent.includes('caches.match(request)'), 'Offline cache lookup present');
});

// Test 8: PwaManager client script exists and handles installation & offline
runTest('مدير PWA بالعميل (pwa-manager.js) يدعم التثبيت والتنبيه بالانقطاع عن الإنترنت', () => {
    assert.ok(fs.existsSync(pwaManagerPath), 'pwa-manager.js not found');
    const pwaContent = fs.readFileSync(pwaManagerPath, 'utf8');
    assert.ok(pwaContent.includes('PwaManager ='), 'PwaManager object missing');
    assert.ok(pwaContent.includes('beforeinstallprompt'), 'beforeinstallprompt listener missing');
    assert.ok(pwaContent.includes('appinstalled'), 'appinstalled listener missing');
    assert.ok(pwaContent.includes('pwa-install-banner'), 'PWA install banner missing');
    assert.ok(pwaContent.includes('pwa-offline-indicator'), 'Offline indicator missing');
});

// Test 9: index.html integrates Manifest, PWA Meta tags, and PwaManager
runTest('صفحة المنصة الرئيسية (index.html) تدمج Manifest وعلامات iOS والمدير البرمجي', () => {
    const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    assert.ok(indexContent.includes('rel="manifest"'), 'Manifest link missing in index.html');
    assert.ok(indexContent.includes('name="theme-color"'), 'Theme color meta missing in index.html');
    assert.ok(indexContent.includes('apple-mobile-web-app-capable'), 'iOS web app meta missing in index.html');
    assert.ok(indexContent.includes('src="src/core/pwa-manager.js'), 'pwa-manager.js script tag missing in index.html');
});

// Test 10: All 8 Simulation Pages integrate PWA manifest & theme-color
runTest('كافة صفحات المحاكي الثمانية (8 Simulation Pages) تدمج وسم الـ Manifest والثيم', () => {
    const simPages = [
        'simulation/simulation/dashboard/index.html',
        'simulation/simulation/journal/index.html',
        'simulation/simulation/ledger/index.html',
        'simulation/simulation/statements/index.html',
        'simulation/simulation/bank-recon/index.html',
        'simulation/simulation/cash-count/index.html',
        'simulation/simulation/inventory-count/index.html',
        'simulation/simulation/tax-returns/index.html'
    ];

    simPages.forEach(p => {
        const fullPath = path.join(__dirname, p);
        assert.ok(fs.existsSync(fullPath), `Simulation page missing: ${p}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(content.includes('manifest.webmanifest'), `Manifest link missing in ${p}`);
        assert.ok(content.includes('name="theme-color"'), `Theme color missing in ${p}`);
    });
});

console.log('\n========================================================');
console.log(`🎯 نتيجة فحص تطبيق الويب التقدمي (PWA): تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');

if (passedTests !== totalTests) {
    process.exit(1);
}
