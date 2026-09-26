const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.join(__dirname, '..', 'audit_evidence');
const BASE_URL = 'https://accountera.vercel.app';

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

// 14 target viewports from mobile (320px) to full desktop (1920px)
const VIEWPORTS = [
  { name: 'mobile_320_se1', width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'mobile_360_android', width: 360, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'mobile_375_iphone8', width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'mobile_390_iphone14', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { name: 'mobile_393_iphone15pro', width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { name: 'mobile_412_samsung21', width: 412, height: 915, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true },
  { name: 'mobile_430_iphone14promax', width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { name: 'mobile_480_wide', width: 480, height: 800, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true },
  { name: 'tablet_768_ipad', width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'tablet_820_ipadair', width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'tablet_1024_ipadpro', width: 1024, height: 1366, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
  { name: 'desktop_1280_hd', width: 1280, height: 720, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: 'desktop_1440_mac', width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false, hasTouch: false },
  { name: 'desktop_1920_fhd', width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
];

// Target Routes / Pages
const ROUTES = [
  { id: 'landing', path: '/#' },
  { id: 'companies_hub', path: '/#companies-hub' },
  { id: 'student_dashboard', path: '/#student-dashboard' },
  { id: 'learning', path: '/#learning' },
  { id: 'practice', path: '/#practice' },
  { id: 'student_settings', path: '/#student-settings' },
  { id: 'student_plans', path: '/#student-plans' },
  { id: 'portfolio', path: '/#portfolio' },
  { id: 'sim_dashboard', path: '/simulation/simulation/dashboard/index.html' },
  { id: 'sim_journal', path: '/simulation/simulation/journal/index.html' },
  { id: 'sim_ledger', path: '/simulation/simulation/ledger/index.html' },
  { id: 'sim_statements', path: '/simulation/simulation/statements/index.html' },
  { id: 'sim_bank_recon', path: '/simulation/simulation/bank-recon/index.html' },
  { id: 'sim_cash_count', path: '/simulation/simulation/cash-count/index.html' },
  { id: 'sim_inventory_count', path: '/simulation/simulation/inventory-count/index.html' },
  { id: 'sim_tax_returns', path: '/simulation/simulation/tax-returns/index.html' }
];

async function inspectPage(page, route, vp) {
  const auditResult = {
    route: route.id,
    path: route.path,
    viewport: vp.name,
    viewportDimensions: `${vp.width}x${vp.height}`,
    overflow: {
      hasHorizontalScroll: false,
      scrollWidth: 0,
      clientWidth: 0,
      diff: 0,
      offendingElements: []
    },
    touchTargets: {
      smallTargetsCount: 0,
      violations: []
    },
    consoleErrors: [],
    consoleWarnings: [],
    pageErrors: []
  };

  // Evaluate overflow and offending elements
  const metrics = await page.evaluate((vpWidth) => {
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    const bodyWidth = document.body ? document.body.scrollWidth : 0;
    const maxScroll = Math.max(docWidth, bodyWidth);
    const hasOverflow = maxScroll > winWidth + 1;

    let offending = [];
    if (hasOverflow) {
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 1 || rect.width > winWidth + 1) {
          // get unique selector or identifier
          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : '';
          const cls = el.className && typeof el.className === 'string' 
            ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}` 
            : '';
          const text = (el.innerText || '').slice(0, 40).replace(/\n/g, ' ');
          offending.push({
            selector: `${tag}${id}${cls}`,
            rect: {
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            },
            textPreview: text
          });
          if (offending.length >= 10) break;
        }
      }
    }

    // Touch targets (< 44px on mobile)
    let smallTargets = [];
    const interactive = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    interactive.forEach(el => {
      const rect = el.getBoundingClientRect();
      // visible elements only
      if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string'
          ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
          : '';
        const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').slice(0, 30).trim();
        smallTargets.push({
          selector: `${tag}${id}${cls}`,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          text
        });
      }
    });

    return {
      docWidth,
      winWidth,
      maxScroll,
      hasOverflow,
      diff: maxScroll - winWidth,
      offending,
      smallTargets: smallTargets.slice(0, 15),
      totalSmallTargets: smallTargets.length
    };
  }, vp.width);

  auditResult.overflow.hasHorizontalScroll = metrics.hasOverflow;
  auditResult.overflow.scrollWidth = metrics.maxScroll;
  auditResult.overflow.clientWidth = metrics.winWidth;
  auditResult.overflow.diff = metrics.diff;
  auditResult.overflow.offendingElements = metrics.offending;

  auditResult.touchTargets.smallTargetsCount = metrics.totalSmallTargets;
  auditResult.touchTargets.violations = metrics.smallTargets;

  return auditResult;
}

async function runAudit() {
  console.log('🚀 Starting Extreme Full-Site QA Audit on Accountera...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const fullAuditReport = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    routesAudited: ROUTES.length,
    viewportsAudited: VIEWPORTS.length,
    results: []
  };

  // Run focused audit:
  // We'll test key mobile viewports (320, 375, 390, 412), tablet (768, 1024), and desktop (1280, 1920) across all routes
  const primaryViewports = [
    VIEWPORTS.find(v => v.width === 320),
    VIEWPORTS.find(v => v.width === 375),
    VIEWPORTS.find(v => v.width === 390),
    VIEWPORTS.find(v => v.width === 412),
    VIEWPORTS.find(v => v.width === 768),
    VIEWPORTS.find(v => v.width === 1024),
    VIEWPORTS.find(v => v.width === 1280),
    VIEWPORTS.find(v => v.width === 1920)
  ];

  for (const vp of primaryViewports) {
    console.log(`\n======================================================`);
    console.log(`📱 Auditing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      locale: 'ar-EG',
      timezoneId: 'Africa/Cairo'
    });

    const page = await context.newPage();
    const consoleLogs = [];
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') consoleErrors.push(text);
      else if (type === 'warn') consoleLogs.push(text);
    });

    page.on('pageerror', err => {
      pageErrors.push(err.toString());
    });

    for (const route of ROUTES) {
      const targetUrl = `${BASE_URL}${route.path}`;
      try {
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 25000 }).catch(async () => {
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        });
        await page.waitForTimeout(1000); // Allow any layout calculations / GSAP / render passes

        const res = await inspectPage(page, route, vp);
        res.consoleErrors = [...consoleErrors];
        res.pageErrors = [...pageErrors];
        consoleErrors.length = 0; // reset for next route
        pageErrors.length = 0;

        // Screenshot capture for key checkpoints or any overflow
        const ssFilename = `${route.id}_${vp.name}.png`;
        const ssPath = path.join(EVIDENCE_DIR, ssFilename);
        
        // Take screenshot on mobile 320, 390 and desktop 1280 or whenever there is an overflow
        if (vp.width === 320 || vp.width === 390 || vp.width === 1280 || res.overflow.hasHorizontalScroll) {
          await page.screenshot({ path: ssPath, fullPage: false });
          res.screenshot = ssFilename;
        }

        const overflowBadge = res.overflow.hasHorizontalScroll 
          ? `❌ OVERFLOW (+${res.overflow.diff}px)` 
          : '✅ OK';
        const touchBadge = res.touchTargets.smallTargetsCount > 0 
          ? `⚠️ ${res.touchTargets.smallTargetsCount} small targets` 
          : '✅ Touch OK';
        const errBadge = res.pageErrors.length > 0 || res.consoleErrors.length > 0 
          ? `🚨 Errors (${res.pageErrors.length} fatal, ${res.consoleErrors.length} console)` 
          : '✅ No errors';

        console.log(`[${vp.name}] ${route.id.padEnd(20)} | ${overflowBadge} | ${touchBadge} | ${errBadge}`);
        fullAuditReport.results.push(res);
      } catch (e) {
        console.error(`[${vp.name}] Failed to audit ${route.id}: ${e.message}`);
        fullAuditReport.results.push({
          route: route.id,
          viewport: vp.name,
          error: e.message
        });
      }
    }

    await context.close();
  }

  await browser.close();

  const reportJsonPath = path.join(EVIDENCE_DIR, 'audit_raw_results.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(fullAuditReport, null, 2), 'utf8');
  console.log(`\n🎉 Audit Completed! Raw results saved to: ${reportJsonPath}`);
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
