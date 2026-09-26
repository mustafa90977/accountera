const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.join(__dirname, '..', 'audit_evidence');
const BASE_URL = 'https://accountera.vercel.app';

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'm320', width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'm360', width: 360, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'm375', width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'm390', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { name: 'm412', width: 412, height: 915, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true },
  { name: 't768', width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'd1280', width: 1280, height: 720, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
];

const SCREENS = [
  { id: 'student-dashboard', type: 'spa' },
  { id: 'companies-hub', type: 'spa' },
  { id: 'learning', type: 'spa' },
  { id: 'practice', type: 'spa' },
  { id: 'student-plans', type: 'spa' },
  { id: 'student-settings', type: 'spa' },
  { id: 'portfolio', type: 'spa' },
  { id: 'sim_dashboard', type: 'url', url: '/simulation/simulation/dashboard/index.html' },
  { id: 'sim_journal', type: 'url', url: '/simulation/simulation/journal/index.html' },
  { id: 'sim_ledger', type: 'url', url: '/simulation/simulation/ledger/index.html' },
  { id: 'sim_statements', type: 'url', url: '/simulation/simulation/statements/index.html' },
  { id: 'sim_bank_recon', type: 'url', url: '/simulation/simulation/bank-recon/index.html' },
  { id: 'sim_cash_count', type: 'url', url: '/simulation/simulation/cash-count/index.html' },
  { id: 'sim_inventory_count', type: 'url', url: '/simulation/simulation/inventory-count/index.html' },
  { id: 'sim_tax_returns', type: 'url', url: '/simulation/simulation/tax-returns/index.html' }
];

async function run() {
  console.log('🚀 Starting Authenticated Student & Simulation Deep QA Audit...');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

  const auditReport = {
    timestamp: new Date().toISOString(),
    viewportsTested: VIEWPORTS.map(v => `${v.name} (${v.width}x${v.height})`),
    screensTested: SCREENS.map(s => s.id),
    findings: []
  };

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`Auditing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      locale: 'ar-EG'
    });

    // Seed mock student login in localStorage
    await context.addInitScript(() => {
      localStorage.setItem('accountera_user', JSON.stringify({
        id: 'qa-student-001',
        email: 'qa.student@accountera.org',
        name: 'أحمد محمود (محاسب متدرب)',
        role: 'student'
      }));
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.toString());
    });

    for (const screen of SCREENS) {
      consoleErrors.length = 0;
      let targetUrl = BASE_URL;

      if (screen.type === 'url') {
        targetUrl = BASE_URL + screen.url;
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 25000 }).catch(async () => {
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        });
      } else {
        // SPA screen navigation
        if (!page.url().includes('vercel.app')) {
          await page.goto(BASE_URL + '/#', { waitUntil: 'networkidle' });
        }
        await page.evaluate((sId) => {
          if (typeof window.navigateToScreen === 'function') {
            window.navigateToScreen(sId);
          }
        }, screen.id);
      }

      await page.waitForTimeout(1200); // Wait for transition / re-render

      // Evaluate page metrics
      const metrics = await page.evaluate((vpWidth) => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body ? document.body.scrollWidth : 0;
        const maxScroll = Math.max(docWidth, bodyWidth);
        const hasOverflow = maxScroll > winWidth + 1;

        let overflowingElements = [];
        if (hasOverflow) {
          const all = document.querySelectorAll('*');
          all.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > winWidth + 1 || r.width > winWidth + 1) {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : '';
              const cls = (el.className && typeof el.className === 'string')
                ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                : '';
              overflowingElements.push({
                selector: `${tag}${id}${cls}`,
                width: Math.round(r.width),
                right: Math.round(r.right),
                text: (el.innerText || '').slice(0, 40).trim()
              });
            }
          });
        }

        // Small touch targets (< 44px)
        let smallTargets = [];
        const interactive = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
        interactive.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44)) {
            const tag = el.tagName.toLowerCase();
            const id = el.id ? `#${el.id}` : '';
            const cls = (el.className && typeof el.className === 'string')
              ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
              : '';
            smallTargets.push({
              selector: `${tag}${id}${cls}`,
              width: Math.round(r.width),
              height: Math.round(r.height),
              text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').slice(0, 30).trim()
            });
          }
        });

        // Visible text & header/nav state
        const h1 = document.querySelector('h1, h2')?.innerText?.slice(0, 50);
        const isBottomNavVisible = !!document.querySelector('.bottom-nav');
        const isSidebarVisible = !document.getElementById('appSidebar')?.classList.contains('landing-hidden') &&
          document.getElementById('appSidebar')?.style.display !== 'none';

        return {
          winWidth,
          maxScroll,
          hasOverflow,
          diff: maxScroll - winWidth,
          overflowingElements: overflowingElements.slice(0, 8),
          smallTargetsCount: smallTargets.length,
          smallTargetsSample: smallTargets.slice(0, 8),
          h1,
          isBottomNavVisible,
          isSidebarVisible
        };
      }, vp.width);

      const ssName = `auth_${screen.id}_${vp.name}.png`;
      const ssPath = path.join(EVIDENCE_DIR, ssName);
      
      // Save screenshot for 320, 390, 1280 or when there is overflow
      if (vp.width === 320 || vp.width === 390 || vp.width === 1280 || metrics.hasOverflow) {
        await page.screenshot({ path: ssPath, fullPage: false });
      }

      const finding = {
        viewport: vp.name,
        dimensions: `${vp.width}x${vp.height}`,
        screen: screen.id,
        h1: metrics.h1,
        hasOverflow: metrics.hasOverflow,
        overflowPx: metrics.diff,
        overflowingElements: metrics.overflowingElements,
        smallTargetsCount: metrics.smallTargetsCount,
        smallTargetsSample: metrics.smallTargetsSample,
        consoleErrors: [...consoleErrors],
        isBottomNavVisible: metrics.isBottomNavVisible,
        isSidebarVisible: metrics.isSidebarVisible,
        screenshot: ssName
      };

      auditReport.findings.push(finding);

      const statusBadge = metrics.hasOverflow ? `❌ OVERFLOW (+${metrics.diff}px)` : `✅ OK`;
      const touchBadge = `⚠️ ${metrics.smallTargetsCount} small targets`;
      const errBadge = consoleErrors.length > 0 ? `🚨 ${consoleErrors.length} errors` : `✅ 0 errors`;

      console.log(`[${vp.name.padEnd(5)}] ${screen.id.padEnd(22)} | ${statusBadge.padEnd(20)} | ${touchBadge.padEnd(22)} | ${errBadge}`);
    }

    await context.close();
  }

  await browser.close();

  const outPath = path.join(EVIDENCE_DIR, 'auth_audit_results.json');
  fs.writeFileSync(outPath, JSON.stringify(auditReport, null, 2), 'utf8');
  console.log(`\n🎉 Authenticated Audit Finished! Results saved to: ${outPath}`);
}

run().catch(err => {
  console.error('Fatal error during authenticated audit:', err);
  process.exit(1);
});
