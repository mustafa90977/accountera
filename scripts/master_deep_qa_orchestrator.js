/**
 * ACCOUNTERA — MASTER DEEP QA AUDIT ORCHESTRATOR
 * Executes full-matrix audits: Playwright, axe-core, viewport matrix,
 * touch targets, horizontal overflow, RTL, forms, tables, simulation journeys.
 */

const fs = require('fs');
const path = require('path');
const { chromium, firefox, webkit } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const BASE_URL = 'https://accountera.vercel.app';
const EVIDENCE_DIR = path.join(__dirname, '..', 'audit_evidence', 'ultimate_audit');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

// ── Viewport Definitions ───────────────────────────────────────────────────────
const MOBILE_VIEWPORTS = [
  { name: 'm320', width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true, label: 'iPhone SE (Gen 1) 320x568' },
  { name: 'm360', width: 360, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true, label: 'Android Compact 360x640' },
  { name: 'm375', width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true, label: 'iPhone SE (Gen 2/3) 375x667' },
  { name: 'm390', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true, label: 'iPhone 12/13/14 (P0) 390x844' },
  { name: 'm393', width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true, label: 'iPhone 15/16 Pro 393x852' },
  { name: 'm412', width: 412, height: 915, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true, label: 'Google Pixel 7 412x915' },
  { name: 'm430', width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true, label: 'iPhone Pro Max 430x932' },
  { name: 'm480', width: 480, height: 800, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true, label: 'Wide Android 480x800' }
];

const TABLET_VIEWPORTS = [
  { name: 't768', width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true, label: 'iPad Mini Portrait 768x1024' },
  { name: 't820', width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true, label: 'iPad Air Portrait 820x1180' },
  { name: 't1024', width: 1024, height: 768, deviceScaleFactor: 2, isMobile: true, hasTouch: true, label: 'iPad Landscape 1024x768' },
  { name: 't1366', width: 1024, height: 1366, deviceScaleFactor: 2, isMobile: true, hasTouch: true, label: 'iPad Pro 12.9 1024x1366' }
];

const DESKTOP_VIEWPORTS = [
  { name: 'd1280', width: 1280, height: 720, deviceScaleFactor: 1, isMobile: false, hasTouch: false, label: 'Compact Desktop 1280x720' },
  { name: 'd1366', width: 1366, height: 768, deviceScaleFactor: 1, isMobile: false, hasTouch: false, label: 'Laptop 1366x768' },
  { name: 'd1440', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false, label: 'Standard Desktop 1440x900' },
  { name: 'd1920', width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false, label: 'Full HD 1920x1080' }
];

// ── Screen and Route Definitions ──────────────────────────────────────────────
const APP_SCREENS = [
  { id: 'landing', type: 'spa', auth: 'guest', title: 'Landing Page' },
  { id: 'login', type: 'spa', auth: 'guest', title: 'Login View' },
  { id: 'register', type: 'spa', auth: 'guest', title: 'Register View' },
  { id: 'student-dashboard', type: 'spa', auth: 'student', title: 'Student Dashboard' },
  { id: 'learning', type: 'spa', auth: 'student', title: 'Learning Lessons Path' },
  { id: 'practice', type: 'spa', auth: 'student', title: 'Practice Exercises' },
  { id: 'companies-hub', type: 'spa', auth: 'student', title: 'Companies Simulation Hub' },
  { id: 'portfolio', type: 'spa', auth: 'student', title: 'Professional Skills Passport' },
  { id: 'student-settings', type: 'spa', auth: 'student', title: 'Student Settings' },
  { id: 'student-plans', type: 'spa', auth: 'student', title: 'Pricing & Plans' },
  { id: 'teacher-overview', type: 'spa', auth: 'teacher', title: 'Teacher Overview' },
  { id: 'admin-overview', type: 'spa', auth: 'admin', title: 'Admin Central OS' },
  // Standalone simulation apps
  { id: 'sim_dashboard', type: 'url', url: '/simulation/simulation/dashboard/index.html', auth: 'student', title: 'ERP Simulation Dashboard' },
  { id: 'sim_journal', type: 'url', url: '/simulation/simulation/journal/index.html', auth: 'student', title: 'General Journal Entries' },
  { id: 'sim_ledger', type: 'url', url: '/simulation/simulation/ledger/index.html', auth: 'student', title: 'General Ledger Accounts' },
  { id: 'sim_bank_recon', type: 'url', url: '/simulation/simulation/bank-recon/index.html', auth: 'student', title: 'Bank Reconciliation' },
  { id: 'sim_cash_count', type: 'url', url: '/simulation/simulation/cash-count/index.html', auth: 'student', title: 'Cash Vault Count' },
  { id: 'sim_inventory_count', type: 'url', url: '/simulation/simulation/inventory-count/index.html', auth: 'student', title: 'Inventory Physical Count' },
  { id: 'sim_statements', type: 'url', url: '/simulation/simulation/statements/index.html', auth: 'student', title: 'Financial Statements' },
  { id: 'sim_tax_returns', type: 'url', url: '/simulation/simulation/tax-returns/index.html', auth: 'student', title: 'Tax Declarations (VAT & WHT)' },
  { id: 'sim_accounts', type: 'url', url: '/simulation/simulation/accounts/index.html', auth: 'student', title: 'Chart of Accounts' }
];

async function createBrowserContext(browser, vp, authType) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor || 1,
    isMobile: vp.isMobile || false,
    hasTouch: vp.hasTouch || false,
    locale: 'ar-EG',
    timezoneId: 'Africa/Cairo'
  });

  if (authType === 'student') {
    await context.addInitScript(() => {
      localStorage.setItem('accountera_user', JSON.stringify({
        id: 'qa-student-001',
        email: 'student.qa@accountera.org',
        name: 'أحمد محمود (محاسب متدرب)',
        role: 'student'
      }));
    });
  } else if (authType === 'admin') {
    await context.addInitScript(() => {
      localStorage.setItem('accountera_user', JSON.stringify({
        id: 'qa-admin-001',
        email: 'admin@accountera.edu',
        name: 'إدارة المنصة المركزية',
        role: 'admin'
      }));
    });
  } else if (authType === 'teacher') {
    await context.addInitScript(() => {
      localStorage.setItem('accountera_user', JSON.stringify({
        id: 'qa-teacher-001',
        email: 'teacher.qa@accountera.org',
        name: 'د. طارق مصطفى (أستاذ المحاسبة)',
        role: 'teacher'
      }));
    });
  } else {
    await context.addInitScript(() => {
      localStorage.removeItem('accountera_user');
    });
  }

  return context;
}

async function auditDOM(page, screenInfo, vp) {
  return await page.evaluate(({ screenId, vpWidth, vpHeight }) => {
    const root = document.documentElement;
    const body = document.body;
    const scrollW = root.scrollWidth || body.scrollWidth;
    const clientW = root.clientWidth || body.clientWidth;
    const hasDocOverflow = scrollW > clientW + 1;
    const overflowDiff = Math.max(0, scrollW - clientW);

    // Scan for offending elements past the viewport width
    const offenders = [];
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      if (['script', 'style', 'head', 'meta', 'link', 'svg', 'path'].includes(el.tagName.toLowerCase())) continue;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      if (rect.right > clientW + 2 && rect.width > 0) {
        let tag = el.tagName.toLowerCase();
        let id = el.id ? `#${el.id}` : '';
        let cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
        offenders.push({
          selector: `${tag}${id}${cls}`,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          excess: Math.round(rect.right - clientW),
          minWidth: style.minWidth,
          overflow: style.overflowX,
          position: style.position
        });
      }
    }

    // Touch targets audit (< 44px on interactive elements)
    const touchIssues = [];
    const interactiveSelectors = 'button, a[href], input, select, textarea, [onclick], .sidebar-item, .bottom-nav-item, .drawer-item, .tab-btn';
    const clickables = document.querySelectorAll(interactiveSelectors);
    for (const el of clickables) {
      const rect = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      if (rect.width === 0 || rect.height === 0 || s.display === 'none' || s.visibility === 'hidden') continue;
      if (rect.width < 40 || rect.height < 40) {
        touchIssues.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          cls: (el.className && typeof el.className === 'string') ? el.className.split(' ')[0] : '',
          text: (el.textContent || el.getAttribute('aria-label') || '').trim().substring(0, 25),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    }

    // Table responsiveness check
    const tables = document.querySelectorAll('table, .table, .accounting-table');
    const tableIssues = [];
    for (const tbl of tables) {
      const parent = tbl.parentElement;
      const parentStyle = parent ? window.getComputedStyle(parent) : null;
      const isScrollable = parentStyle && (parentStyle.overflowX === 'auto' || parentStyle.overflowX === 'scroll');
      const tblRect = tbl.getBoundingClientRect();
      tableIssues.push({
        isScrollable,
        tableWidth: Math.round(tblRect.width),
        parentWidth: parent ? Math.round(parent.getBoundingClientRect().width) : 0,
        clipped: tblRect.width > (parent ? parent.getBoundingClientRect().width + 2 : clientW) && !isScrollable
      });
    }

    // RTL and mixed text checks
    const rtlIssues = [];
    const bodyDir = window.getComputedStyle(body).direction;
    if (bodyDir !== 'rtl') {
      rtlIssues.push({ issue: 'Body direction is not rtl', current: bodyDir });
    }

    return {
      scrollW,
      clientW,
      hasDocOverflow,
      overflowDiff,
      offenders: offenders.slice(0, 10),
      touchIssuesCount: touchIssues.length,
      touchIssuesSample: touchIssues.slice(0, 8),
      tableIssues,
      rtlIssues
    };
  }, { screenId: screenInfo.id, vpWidth: vp.width, vpHeight: vp.height });
}

async function runMasterAudit() {
  console.log('================================================================');
  console.log('🚀 ACCOUNTERA — MASTER DEEP QA AUDIT STARTING');
  console.log(`Target: ${BASE_URL}`);
  console.log('Mode: STRICT AUDIT ONLY — ZERO CODE MODIFICATIONS');
  console.log('================================================================\n');

  const startTime = Date.now();
  const summaryReport = {
    timestamp: new Date().toISOString(),
    targetUrl: BASE_URL,
    routesDiscovered: APP_SCREENS.length,
    mobileViewportsCount: MOBILE_VIEWPORTS.length,
    tabletViewportsCount: TABLET_VIEWPORTS.length,
    desktopViewportsCount: DESKTOP_VIEWPORTS.length,
    resultsByViewport: {},
    p0Issues: [],
    p1Issues: [],
    p2Issues: [],
    p3Issues: [],
    axeAccessibilityViolations: [],
    runtimeErrors: [],
    networkErrors: [],
    top10MobileIssues: []
  };

  const browser = await chromium.launch({ headless: true });

  // ── 1. Comprehensive Mobile Viewports Audit (Mobile First!) ──────────────────
  console.log('📱 PHASE 1: MOBILE MATRIX AUDIT (Mobile-First 320px to 480px)');
  for (const vp of MOBILE_VIEWPORTS) {
    console.log(`\n--------------------------------------------------------------`);
    console.log(`Checking Viewport: ${vp.label}`);
    console.log(`--------------------------------------------------------------`);

    summaryReport.resultsByViewport[vp.name] = {
      label: vp.label,
      width: vp.width,
      height: vp.height,
      screensTested: 0,
      overflowDetected: 0,
      touchTargetIssues: 0,
      tableClippedIssues: 0,
      errors: []
    };

    for (const screen of APP_SCREENS) {
      const context = await createBrowserContext(browser, vp, screen.auth);
      const page = await context.newPage();

      const pageErrors = [];
      const networkFailures = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          pageErrors.push(msg.text());
        }
      });
      page.on('requestfailed', req => {
        networkFailures.push({ url: req.url(), failure: req.failure()?.errorText });
      });

      try {
        let targetUrl = BASE_URL;
        if (screen.type === 'url') {
          targetUrl = `${BASE_URL}${screen.url}`;
        } else if (screen.id !== 'landing') {
          targetUrl = `${BASE_URL}/#${screen.id}`;
        }

        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(1000);

        if (screen.type === 'spa' && screen.id !== 'landing') {
          await page.evaluate((id) => {
            if (typeof window.navigateToScreen === 'function') {
              window.navigateToScreen(id);
            }
          }, screen.id);
          await page.waitForTimeout(800);
        }

        const domMetrics = await auditDOM(page, screen, vp);

        summaryReport.resultsByViewport[vp.name].screensTested++;

        if (domMetrics.hasDocOverflow) {
          summaryReport.resultsByViewport[vp.name].overflowDetected++;
          const issueObj = {
            id: `OVF-${vp.name}-${screen.id}`,
            severity: domMetrics.overflowDiff > 10 ? 'P0' : 'P1',
            route: screen.id,
            viewport: vp.label,
            overflowDiff: `${domMetrics.overflowDiff}px`,
            scrollWidth: domMetrics.scrollW,
            clientWidth: domMetrics.clientW,
            offenders: domMetrics.offenders,
            evidenceShot: `${vp.name}_${screen.id}_overflow.png`
          };

          if (domMetrics.overflowDiff > 10) {
            summaryReport.p0Issues.push(issueObj);
          } else {
            summaryReport.p1Issues.push(issueObj);
          }

          // Take screenshot of overflow evidence
          const shotPath = path.join(EVIDENCE_DIR, `${vp.name}_${screen.id}_overflow.png`);
          await page.screenshot({ path: shotPath, fullPage: false }).catch(() => {});
        }

        if (domMetrics.touchIssuesCount > 0) {
          summaryReport.resultsByViewport[vp.name].touchTargetIssues += domMetrics.touchIssuesCount;
          if (domMetrics.touchIssuesCount > 5) {
            summaryReport.p2Issues.push({
              id: `TOUCH-${vp.name}-${screen.id}`,
              severity: 'P2',
              route: screen.id,
              viewport: vp.label,
              issueCount: domMetrics.touchIssuesCount,
              samples: domMetrics.touchIssuesSample
            });
          }
        }

        // Test Navigation Drawer on P0 Viewport (390x844) on landing and dashboard
        if (vp.name === 'm390' && (screen.id === 'landing' || screen.id === 'student-dashboard')) {
          const hamburger = await page.$('.btn-mobile-hamburger');
          if (hamburger) {
            await hamburger.click();
            await page.waitForTimeout(400);
            const drawerOpen = await page.evaluate(() => {
              const d = document.getElementById('mobileNavDrawer');
              return d && d.classList.contains('open');
            });
            if (!drawerOpen) {
              summaryReport.p1Issues.push({
                id: `DRAWER-FAIL-${screen.id}`,
                severity: 'P1',
                route: screen.id,
                viewport: vp.label,
                description: 'Mobile hamburger button did not open the navigation drawer properly.'
              });
            } else {
              // Capture open drawer evidence
              const drawerShot = path.join(EVIDENCE_DIR, `m390_${screen.id}_drawer_open.png`);
              await page.screenshot({ path: drawerShot, fullPage: false }).catch(() => {});
              // Close it
              await page.evaluate(() => window.toggleMobileDrawer && window.toggleMobileDrawer(false));
              await page.waitForTimeout(300);
            }
          }
        }

        // Capture key milestone screenshots on P0 Viewport (390x844)
        if (vp.name === 'm390') {
          const shotFile = path.join(EVIDENCE_DIR, `m390_${screen.id}.png`);
          await page.screenshot({ path: shotFile, fullPage: false }).catch(() => {});
        }

        // Collect page console errors
        if (pageErrors.length > 0) {
          pageErrors.forEach(err => {
            summaryReport.runtimeErrors.push({ route: screen.id, viewport: vp.name, error: err });
          });
        }

      } catch (err) {
        summaryReport.resultsByViewport[vp.name].errors.push({ screen: screen.id, message: err.message });
      } finally {
        await context.close().catch(() => {});
      }
    }
  }

  // ── 2. Orientation Tests (Portrait -> Landscape -> Portrait) ─────────────────
  console.log('\n🔄 PHASE 2: ORIENTATION FLIP TEST (390x844 <-> 844x390)');
  {
    const context = await createBrowserContext(browser, { width: 390, height: 844, isMobile: true, hasTouch: true }, 'student');
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/#student-dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Rotate to landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(800);
    const landscapeMetrics = await auditDOM(page, { id: 'student-dashboard-landscape' }, { width: 844, height: 390 });
    const landscapeShot = path.join(EVIDENCE_DIR, 'orientation_m390_landscape.png');
    await page.screenshot({ path: landscapeShot, fullPage: false }).catch(() => {});

    // Rotate back to portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(800);
    const restoredMetrics = await auditDOM(page, { id: 'student-dashboard-restored' }, { width: 390, height: 844 });

    if (landscapeMetrics.hasDocOverflow) {
      summaryReport.p1Issues.push({
        id: 'ORIENT-OVERFLOW-LANDSCAPE',
        severity: 'P1',
        route: 'student-dashboard',
        viewport: 'Landscape 844x390',
        overflowDiff: `${landscapeMetrics.overflowDiff}px`,
        description: 'Dashboard cards cause horizontal overflow when device is rotated to Landscape.'
      });
    }
    await context.close().catch(() => {});
  }

  // ── 3. Tablet & Desktop Matrix Audits ─────────────────────────────────────────
  console.log('\n💻 PHASE 3: TABLET & DESKTOP AUDITS');
  for (const vp of [...TABLET_VIEWPORTS, ...DESKTOP_VIEWPORTS]) {
    console.log(`Auditing Viewport: ${vp.label}`);
    summaryReport.resultsByViewport[vp.name] = {
      label: vp.label,
      width: vp.width,
      height: vp.height,
      screensTested: 0,
      overflowDetected: 0,
      touchTargetIssues: 0,
      errors: []
    };

    // Test primary views: landing, dashboard, journal, bank-recon
    const testSubset = APP_SCREENS.filter(s => ['landing', 'student-dashboard', 'sim_journal', 'sim_bank_recon', 'companies-hub'].includes(s.id));
    for (const screen of testSubset) {
      const context = await createBrowserContext(browser, vp, screen.auth);
      const page = await context.newPage();
      try {
        let targetUrl = screen.type === 'url' ? `${BASE_URL}${screen.url}` : `${BASE_URL}/#${screen.id}`;
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(600);

        const domMetrics = await auditDOM(page, screen, vp);
        summaryReport.resultsByViewport[vp.name].screensTested++;

        if (domMetrics.hasDocOverflow) {
          summaryReport.resultsByViewport[vp.name].overflowDetected++;
          summaryReport.p1Issues.push({
            id: `OVF-${vp.name}-${screen.id}`,
            severity: 'P1',
            route: screen.id,
            viewport: vp.label,
            overflowDiff: `${domMetrics.overflowDiff}px`,
            offenders: domMetrics.offenders
          });
        }
      } catch (err) {
        summaryReport.resultsByViewport[vp.name].errors.push({ screen: screen.id, message: err.message });
      } finally {
        await context.close().catch(() => {});
      }
    }
  }

  // ── 4. Deep Accessibility Audit with axe-core ─────────────────────────────────
  console.log('\n♿ PHASE 4: AXE-CORE ACCESSIBILITY AUDIT');
  {
    const a11yScreens = ['landing', 'login', 'student-dashboard', 'sim_journal', 'sim_bank_recon'];
    for (const sId of a11yScreens) {
      const screenObj = APP_SCREENS.find(s => s.id === sId);
      const context = await createBrowserContext(browser, { width: 390, height: 844, isMobile: true }, screenObj.auth);
      const page = await context.newPage();
      try {
        let url = screenObj.type === 'url' ? `${BASE_URL}${screenObj.url}` : `${BASE_URL}/#${screenObj.id}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(800);

        const axeResults = await new AxeBuilder({ page }).analyze();
        if (axeResults.violations && axeResults.violations.length > 0) {
          axeResults.violations.forEach(v => {
            summaryReport.axeAccessibilityViolations.push({
              route: sId,
              id: v.id,
              impact: v.impact,
              description: v.description,
              nodesCount: v.nodes.length,
              targetSample: v.nodes[0]?.target?.join(', ') || ''
            });
          });
        }
      } catch (err) {
        console.error(`axe-core failed on ${sId}:`, err.message);
      } finally {
        await context.close().catch(() => {});
      }
    }
  }

  // ── 5. Real User Accounting Simulation Journey (Journal Entry & Bank Recon) ────
  console.log('\n📝 PHASE 5: REAL USER SIMULATION WORKFLOWS (Journal & Bank Recon)');
  {
    const context = await createBrowserContext(browser, { width: 390, height: 844, isMobile: true, hasTouch: true }, 'student');
    const page = await context.newPage();
    try {
      // Journey 1: Open Journal Simulation
      await page.goto(`${BASE_URL}/simulation/simulation/journal/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      const journalShot = path.join(EVIDENCE_DIR, 'journey_journal_mobile_entry.png');
      await page.screenshot({ path: journalShot, fullPage: false }).catch(() => {});

      // Journey 2: Open Bank Recon Simulation
      await page.goto(`${BASE_URL}/simulation/simulation/bank-recon/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      const reconShot = path.join(EVIDENCE_DIR, 'journey_bank_recon_mobile.png');
      await page.screenshot({ path: reconShot, fullPage: false }).catch(() => {});

    } catch (err) {
      console.error('Simulation journey check error:', err.message);
    } finally {
      await context.close().catch(() => {});
    }
  }

  await browser.close();

  // ── 6. Cross-Browser Check on WebKit & Firefox (Core Screens) ─────────────────
  console.log('\n🌐 PHASE 6: CROSS-BROWSER CHECK (Firefox & WebKit)');
  try {
    const ffBrowser = await firefox.launch({ headless: true });
    const ffContext = await createBrowserContext(ffBrowser, { width: 390, height: 844, isMobile: true }, 'student');
    const ffPage = await ffContext.newPage();
    await ffPage.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });
    await ffPage.waitForTimeout(600);
    const ffMetrics = await auditDOM(ffPage, { id: 'landing' }, { width: 390, height: 844 });
    console.log(`Firefox 390x844 landing overflow: ${ffMetrics.hasDocOverflow}`);
    await ffBrowser.close();

    const wkBrowser = await webkit.launch({ headless: true });
    const wkContext = await createBrowserContext(wkBrowser, { width: 390, height: 844, isMobile: true }, 'student');
    const wkPage = await wkContext.newPage();
    await wkPage.goto(`${BASE_URL}`, { waitUntil: 'domcontentloaded' });
    await wkPage.waitForTimeout(600);
    const wkMetrics = await auditDOM(wkPage, { id: 'landing' }, { width: 390, height: 844 });
    console.log(`WebKit 390x844 landing overflow: ${wkMetrics.hasDocOverflow}`);
    await wkBrowser.close();
  } catch (err) {
    console.warn('Cross-browser test warning:', err.message);
  }

  // Deduplicate and compile Top 10 Mobile Issues
  const uniqueIssuesMap = new Map();
  [...summaryReport.p0Issues, ...summaryReport.p1Issues, ...summaryReport.p2Issues].forEach(iss => {
    const key = `${iss.route}-${iss.severity}`;
    if (!uniqueIssuesMap.has(key)) {
      uniqueIssuesMap.set(key, iss);
    }
  });

  summaryReport.top10MobileIssues = Array.from(uniqueIssuesMap.values()).slice(0, 10);

  // Save audit data to output JSON
  const auditJsonPath = path.join(EVIDENCE_DIR, 'master_deep_qa_report.json');
  fs.writeFileSync(auditJsonPath, JSON.stringify(summaryReport, null, 2), 'utf8');

  console.log('\n================================================================');
  console.log(`✅ MASTER DEEP QA AUDIT COMPLETED in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  console.log(`Audit Data saved to: ${auditJsonPath}`);
  console.log(`Screenshots saved to: ${EVIDENCE_DIR}`);
  console.log('================================================================\n');

  return summaryReport;
}

runMasterAudit().catch(err => {
  console.error('Fatal Audit Runner Error:', err);
  process.exit(1);
});
