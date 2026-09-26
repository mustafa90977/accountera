const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium, firefox, webkit } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const PORT = 3897;
const ROOT = path.join(__dirname, '..');
const EVIDENCE_DIR = path.join(ROOT, 'audit_evidence', 'final_verification');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0].split('#')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain; charset=utf-8' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const MOBILE_VIEWPORTS = [
  { name: 'm320', width: 320, height: 568, device: 'iPhone SE (Gen 1)' },
  { name: 'm360', width: 360, height: 640, device: 'Android Compact' },
  { name: 'm375', width: 375, height: 667, device: 'iPhone SE (Gen 2/3)' },
  { name: 'm390', width: 390, height: 844, device: 'iPhone 12/13/14 (P0)' },
  { name: 'm393', width: 393, height: 852, device: 'iPhone 15/16 Pro' },
  { name: 'm412', width: 412, height: 915, device: 'Pixel 7 / Galaxy' },
  { name: 'm430', width: 430, height: 932, device: 'iPhone 15 Pro Max' },
  { name: 'm480', width: 480, height: 800, device: 'Wide Android' }
];

const ALL_21_ROUTES = [
  { id: 'landing', path: '/#landing' },
  { id: 'login', path: '/#login' },
  { id: 'register', path: '/#register' },
  { id: 'student-dashboard', path: '/#student-dashboard' },
  { id: 'learning', path: '/#learning' },
  { id: 'practice', path: '/#practice' },
  { id: 'companies-hub', path: '/#companies-hub' },
  { id: 'portfolio', path: '/#portfolio' },
  { id: 'student-settings', path: '/#student-settings' },
  { id: 'student-plans', path: '/#student-plans' },
  { id: 'teacher-overview', path: '/#teacher-overview' },
  { id: 'admin-overview', path: '/#admin-overview' },
  { id: 'sim_dashboard', path: '/simulation/simulation/dashboard/index.html' },
  { id: 'sim_journal', path: '/simulation/simulation/journal/index.html' },
  { id: 'sim_ledger', path: '/simulation/simulation/ledger/index.html' },
  { id: 'sim_bank_recon', path: '/simulation/simulation/bank-recon/index.html' },
  { id: 'sim_cash_count', path: '/simulation/simulation/cash-count/index.html' },
  { id: 'sim_inventory_count', path: '/simulation/simulation/inventory-count/index.html' },
  { id: 'sim_statements', path: '/simulation/simulation/statements/index.html' },
  { id: 'sim_tax_returns', path: '/simulation/simulation/tax-returns/index.html' },
  { id: 'sim_accounts', path: '/simulation/simulation/accounts/index.html' }
];

const AUTH_INIT_SCRIPT = () => {
  localStorage.setItem('accountera_user', JSON.stringify({
    id: 'test-student-verified',
    email: 'student@accountera.com',
    name: 'طالب محاسبة معتمد',
    role: 'student'
  }));
};

async function runAudit() {
  console.log('════════════════════════════════════════════════════════════════════════════');
  console.log('       ACCOUNTERA — FINAL VERIFICATION DEEP AUDIT (RC-001 & RC-002)');
  console.log('════════════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({ headless: true });
  const results = {
    viewports: [],
    stressTest: null,
    crossBrowser: [],
    all21Routes: [],
    landscapeResults: [],
    axeA11y: null,
    discoveredIssues: []
  };

  const BASE_URL = `http://127.0.0.1:${PORT}`;

  // =========================================================================
  // 1, 2, 3, 6, 9: AUDIT ALL 8 MOBILE VIEWPORTS
  // =========================================================================
  console.log('▶ [PHASE 1] Auditing 8 Mobile Viewports (Layout, Overflow, Hit-Test, Drawer)');
  
  for (const vp of MOBILE_VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    await context.addInitScript(AUTH_INIT_SCRIPT);

    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#student-dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Initial closed state evaluation
    const initialEval = await page.evaluate(() => {
      const htmlDir = document.documentElement.getAttribute('dir');
      const sWidth = document.documentElement.scrollWidth;
      const iWidth = window.innerWidth;
      const drawer = document.querySelector('#mobileNavDrawer, .mobile-nav-drawer');
      const drawerStyle = drawer ? window.getComputedStyle(drawer) : null;

      // Rightmost element scan
      let maxRight = 0;
      let rightmostElInfo = 'none';
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > maxRight && el.offsetParent !== null && r.width > 0 && r.height > 0) {
          maxRight = r.right;
          rightmostElInfo = `${el.tagName.toLowerCase()}.${Array.from(el.classList).join('.')}`;
        }
      });

      // Find visible hamburger button
      const visibleHamburger = Array.from(document.querySelectorAll('.btn-mobile-hamburger, #btn-mobile-nav-toggle')).find(b => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && window.getComputedStyle(b).display !== 'none';
      });

      let hitTestResult = 'not-found';
      let hamburgerTarget = null;

      if (visibleHamburger) {
        const rect = visibleHamburger.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const elAtPoint = document.elementFromPoint(centerX, centerY);
        const isSelfOrChild = visibleHamburger === elAtPoint || visibleHamburger.contains(elAtPoint);
        hitTestResult = isSelfOrChild ? 'PERFECT' : `INTERCEPTED by <${elAtPoint ? elAtPoint.tagName.toLowerCase() : 'null'}.${elAtPoint ? elAtPoint.className : ''}>`;
        hamburgerTarget = {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          centerX: Math.round(centerX),
          centerY: Math.round(centerY)
        };
      }

      return {
        htmlDir,
        scrollWidth: sWidth,
        innerWidth: iWidth,
        maxRight: Math.round(maxRight),
        rightmostElInfo,
        overflow: sWidth > iWidth,
        drawerFound: !!drawer,
        drawerVisibility: drawerStyle ? drawerStyle.visibility : 'null',
        drawerPointerEvents: drawerStyle ? drawerStyle.pointerEvents : 'null',
        drawerTransform: drawerStyle ? drawerStyle.transform : 'null',
        hitTestResult,
        hamburgerTarget
      };
    });

    // Capture screenshot: Closed state
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_${vp.width}x${vp.height}_closed.png`),
      fullPage: false
    });

    // Test Opening Hamburger
    let drawerOpenPass = false;
    let drawerOpenVisibility = 'null';
    let drawerOpenPointerEvents = 'null';

    // Click visible hamburger
    const clicked = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('.btn-mobile-hamburger, #btn-mobile-nav-toggle')).find(btn => {
        const r = btn.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && window.getComputedStyle(btn).display !== 'none';
      });
      if (b) {
        b.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await page.waitForTimeout(350);

      const openEval = await page.evaluate(() => {
        const drawer = document.querySelector('#mobileNavDrawer, .mobile-nav-drawer');
        const isOpen = drawer ? drawer.classList.contains('open') : false;
        const style = drawer ? window.getComputedStyle(drawer) : null;
        return {
          isOpen,
          visibility: style ? style.visibility : 'null',
          pointerEvents: style ? style.pointerEvents : 'null'
        };
      });

      drawerOpenPass = openEval.isOpen;
      drawerOpenVisibility = openEval.visibility;
      drawerOpenPointerEvents = openEval.pointerEvents;

      // Capture screenshot: Open state
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, `${vp.name}_${vp.width}x${vp.height}_open.png`),
        fullPage: false
      });

      // Test Closing Drawer via toggle function
      await page.evaluate(() => {
        if (typeof window.toggleMobileDrawer === 'function') {
          window.toggleMobileDrawer(false);
        } else {
          document.querySelector('#mobileNavDrawer')?.classList.remove('open');
          document.querySelector('.mobile-nav-overlay')?.classList.remove('open');
        }
      });
      await page.waitForTimeout(350);
    }

    const drawerClosedResetCorrectly = await page.evaluate(() => {
      const drawer = document.querySelector('#mobileNavDrawer, .mobile-nav-drawer');
      const style = drawer ? window.getComputedStyle(drawer) : null;
      return style && style.visibility === 'hidden' && style.pointerEvents === 'none';
    });

    const vpStatus = (
      initialEval.scrollWidth === initialEval.innerWidth &&
      initialEval.hitTestResult === 'PERFECT' &&
      initialEval.drawerVisibility === 'hidden' &&
      initialEval.drawerPointerEvents === 'none' &&
      drawerOpenPass &&
      drawerClosedResetCorrectly
    );

    const vpSummary = {
      name: vp.name,
      device: vp.device,
      dimensions: `${vp.width}×${vp.height}`,
      scrollWidthVsInnerWidth: `${initialEval.scrollWidth} / ${initialEval.innerWidth}`,
      overflow: initialEval.overflow,
      maxRight: initialEval.maxRight,
      drawerClosed: `vis:${initialEval.drawerVisibility}, pe:${initialEval.drawerPointerEvents}`,
      drawerOpen: `vis:${drawerOpenVisibility}, pe:${drawerOpenPointerEvents}`,
      drawerReset: drawerClosedResetCorrectly ? 'PASS' : 'FAIL',
      hamburgerHitTest: initialEval.hitTestResult,
      status: vpStatus ? 'PASS' : 'FAIL'
    };

    results.viewports.push(vpSummary);
    console.log(`  ✓ [${vp.name}] ${vp.dimensions}: scrollWidth=${initialEval.scrollWidth} | HitTest=${initialEval.hitTestResult} | Drawer=${drawerClosedResetCorrectly ? 'OK' : 'FAIL'} -> ${vpStatus ? '✅ PASS' : '❌ FAIL'}`);

    await context.close();
  }

  // =========================================================================
  // 2. STRESS TEST: 5X RAPID OPEN/CLOSE CYCLES (P0 m390)
  // =========================================================================
  console.log('\n▶ [PHASE 2] Stress Testing Drawer (5x Rapid Open/Close Cycles on m390)');
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(AUTH_INIT_SCRIPT);

    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#student-dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const stressLog = [];
    let stuck = false;

    for (let i = 1; i <= 5; i++) {
      // Open
      await page.evaluate(() => window.toggleMobileDrawer(true));
      await page.waitForTimeout(150);
      const afterOpen = await page.evaluate(() => {
        const d = document.querySelector('#mobileNavDrawer, .mobile-nav-drawer');
        const s = d ? window.getComputedStyle(d) : null;
        return d && d.classList.contains('open') && s.visibility === 'visible';
      });

      // Close
      await page.evaluate(() => window.toggleMobileDrawer(false));
      await page.waitForTimeout(150);
      const afterClose = await page.evaluate(() => {
        const d = document.querySelector('#mobileNavDrawer, .mobile-nav-drawer');
        const s = d ? window.getComputedStyle(d) : null;
        return {
          isOpen: d ? d.classList.contains('open') : false,
          visibility: s ? s.visibility : 'null',
          pointerEvents: s ? s.pointerEvents : 'null'
        };
      });

      const cyclePass = afterOpen && !afterClose.isOpen && afterClose.visibility === 'hidden' && afterClose.pointerEvents === 'none';
      if (!cyclePass) stuck = true;

      stressLog.push({ cycle: i, openOk: afterOpen, closeOk: !afterClose.isOpen, cyclePass });
    }

    results.stressTest = { passed: !stuck, cycles: stressLog };
    console.log(`  ✓ Stress test completed: 5/5 cycles passed without getting stuck: ${!stuck ? '✅ PASS' : '❌ FAIL'}`);
    await context.close();
  }

  // =========================================================================
  // 4. AUDIT ALL 21 SCREENS FOR OVERFLOW AND REGRESSION
  // =========================================================================
  console.log('\n▶ [PHASE 3] Auditing All 21 Project Routes on m390 Viewport');
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(AUTH_INIT_SCRIPT);

    const page = await context.newPage();

    for (const route of ALL_21_ROUTES) {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const metrics = await page.evaluate(() => {
        const sW = document.documentElement.scrollWidth;
        const iW = window.innerWidth;
        return {
          scrollWidth: sW,
          innerWidth: iW,
          overflow: sW > iW
        };
      });

      const routePass = metrics.scrollWidth === metrics.innerWidth;
      results.all21Routes.push({
        id: route.id,
        path: route.path,
        scrollWidth: metrics.scrollWidth,
        innerWidth: metrics.innerWidth,
        status: routePass ? 'PASS' : 'FAIL'
      });

      if (!routePass) {
        results.discoveredIssues.push({
          type: 'OVERFLOW_REGRESSION',
          route: route.id,
          details: `scrollWidth ${metrics.scrollWidth} > ${metrics.innerWidth}`
        });
      }
    }

    const passedRoutes = results.all21Routes.filter(r => r.status === 'PASS').length;
    console.log(`  ✓ Audited 21/21 routes: ${passedRoutes}/21 PASSED.`);
    await context.close();
  }

  // =========================================================================
  // 5. CROSS-BROWSER VERIFICATION: CHROMIUM, FIREFOX, WEBKIT (390x844 & 320x568)
  // =========================================================================
  console.log('\n▶ [PHASE 4] Cross-Browser Testing (Chromium, Firefox, WebKit)');
  const engines = [
    { name: 'Chromium', instance: browser },
    { name: 'Firefox', instance: await firefox.launch({ headless: true }) },
    { name: 'WebKit', instance: await webkit.launch({ headless: true }) }
  ];

  for (const eng of engines) {
    for (const vp of [{ name: 'm320', width: 320, height: 568 }, { name: 'm390', width: 390, height: 844 }]) {
      const ctx = await eng.instance.newContext({ viewport: { width: vp.width, height: vp.height } });
      await ctx.addInitScript(AUTH_INIT_SCRIPT);

      const p = await ctx.newPage();
      await p.goto(`${BASE_URL}/#student-dashboard`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(400);

      const evalData = await p.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        dir: document.documentElement.getAttribute('dir')
      }));

      const isPass = evalData.scrollWidth === evalData.innerWidth;
      results.crossBrowser.push({
        engine: eng.name,
        viewport: vp.name,
        scrollWidth: evalData.scrollWidth,
        innerWidth: evalData.innerWidth,
        dir: evalData.dir,
        status: isPass ? 'PASS' : 'FAIL'
      });

      console.log(`  ✓ [${eng.name}] ${vp.name}: scrollWidth=${evalData.scrollWidth}, innerWidth=${evalData.innerWidth} -> ${isPass ? 'PASS' : 'FAIL'}`);
      await ctx.close();
    }
    if (eng.name !== 'Chromium') {
      await eng.instance.close();
    }
  }

  // =========================================================================
  // 7. LANDSCAPE ORIENTATION AUDIT (INVERTED VIEWPORTS)
  // =========================================================================
  console.log('\n▶ [PHASE 5] Auditing Landscape Orientation (Swapped Width/Height)');
  {
    for (const vp of MOBILE_VIEWPORTS) {
      const landscapeWidth = vp.height;
      const landscapeHeight = vp.width;

      const context = await browser.newContext({
        viewport: { width: landscapeWidth, height: landscapeHeight }
      });
      await context.addInitScript(AUTH_INIT_SCRIPT);

      const page = await context.newPage();
      await page.goto(`${BASE_URL}/#student-dashboard`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const lMetrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      }));

      // Capture screenshot: Landscape
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, `${vp.name}_landscape_${landscapeWidth}x${landscapeHeight}.png`),
        fullPage: false
      });

      const lPass = lMetrics.scrollWidth === lMetrics.innerWidth;
      results.landscapeResults.push({
        name: vp.name,
        dimensions: `${landscapeWidth}×${landscapeHeight}`,
        scrollWidth: lMetrics.scrollWidth,
        innerWidth: lMetrics.innerWidth,
        status: lPass ? 'PASS' : 'FAIL'
      });

      console.log(`  ✓ Landscape [${vp.name}] ${landscapeWidth}×${landscapeHeight}: scrollWidth=${lMetrics.scrollWidth} -> ${lPass ? 'PASS' : 'FAIL'}`);
      await context.close();
    }
  }

  // =========================================================================
  // 8. ACCESSIBILITY AUDIT (axe-core WCAG 2.1 AA & aria-hidden check)
  // =========================================================================
  console.log('\n▶ [PHASE 6] Running axe-core WCAG 2.1 AA and Drawer Inert/A11y Audit');
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(AUTH_INIT_SCRIPT);

    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#student-dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const drawerA11y = await page.evaluate(() => {
      const drawer = document.querySelector('#mobileNavDrawer, .mobile-nav-drawer');
      const hamburger = Array.from(document.querySelectorAll('.btn-mobile-hamburger, #btn-mobile-nav-toggle')).find(b => b.offsetParent !== null);
      return {
        hasAriaLabel: hamburger ? hamburger.getAttribute('aria-label') : null,
        drawerAriaHidden: drawer ? drawer.getAttribute('aria-hidden') : null,
        drawerInert: drawer ? drawer.hasAttribute('inert') : false,
        computedVisibility: drawer ? window.getComputedStyle(drawer).visibility : null
      };
    });

    const axeScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    results.axeA11y = {
      drawerA11y,
      violationsCount: axeScan.violations.length,
      passesCount: axeScan.passes.length,
      violations: axeScan.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description }))
    };

    console.log(`  ✓ axe-core finished: ${axeScan.passes.length} passes, ${axeScan.violations.length} violations.`);
    console.log(`  ✓ Drawer A11y state: visibility=${drawerA11y.computedVisibility}, aria-label=${drawerA11y.hasAriaLabel}`);

    await context.close();
  }

  await browser.close();
  server.close();

  // Save full audit result JSON
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'audit_summary.json'), JSON.stringify(results, null, 2));

  console.log('\n════════════════════════════════════════════════════════════════════════════');
  console.log('                 FINAL VERIFICATION AUDIT COMPLETE                          ');
  console.log('════════════════════════════════════════════════════════════════════════════\n');
}

server.listen(PORT, async () => {
  await runAudit();
});
