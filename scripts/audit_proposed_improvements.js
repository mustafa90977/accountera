const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 3898;
const ROOT = path.join(__dirname, '..');

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

server.listen(PORT, async () => {
  console.log(`🚀 Audit Server running on http://127.0.0.1:${PORT}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3
  });
  const page = await context.newPage();

  const report = {
    numericInputs: { total: 0, missingInputMode: 0, details: [] },
    touchTargets: { total: 0, sub44px: 0, sub36px: 0, examples: [] },
    tables: { totalTables: 0, tablesNeedingScroll: 0, details: [] },
    safeArea: { hasSafeAreaCss: false, filesChecked: [] },
    viewportMeta: { tagContent: '', allowsZoom: false }
  };

  // 1. Inspect Viewport Meta in index.html
  const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const metaMatch = indexHtml.match(/<meta\s+name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
  report.viewportMeta.tagContent = metaMatch ? metaMatch[1] : 'Not Found';
  report.viewportMeta.allowsZoom = !metaMatch || (!metaMatch[1].includes('user-scalable=no') && !metaMatch[1].includes('maximum-scale=1'));

  // 2. Inspect Safe Area CSS in stylesheets
  const cssDir = path.join(__dirname, '..', 'css');
  const cssFiles = ['layout/app-shell.css', 'layout/topbar.css', 'layout/bottom-nav.css'];
  let foundSafeArea = true;
  for (const f of cssFiles) {
    const fullPath = path.join(cssDir, f);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      report.safeArea.filesChecked.push(f);
      if (!content.includes('safe-area-inset') && !content.includes('--safe-')) {
        foundSafeArea = false;
      }
    }
  }
  report.safeArea.hasSafeAreaCss = foundSafeArea;

  // 3. Inspect Live DOM via Playwright on key routes
  const routes = [
    '/#journal-entry',
    '/#dashboard',
    '/#balance-sheet',
    '/simulation/simulation/journal/index.html',
    '/simulation/simulation/bank-recon/index.html',
    '/simulation/simulation/dashboard/index.html'
  ];

  for (const route of routes) {
    await page.goto(`http://127.0.0.1:${PORT}` + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Analyze Inputs
    const inputMetrics = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])'));
      return inputs.map(inp => ({
        id: inp.id || inp.name || inp.placeholder || 'unnamed',
        type: inp.type,
        inputMode: inp.getAttribute('inputmode'),
        placeholder: inp.placeholder,
        isAmountOrNumber: (inp.id + inp.name + inp.placeholder + inp.className).match(/(amount|debit|credit|مدين|دائن|مبلغ|رصيد|price|cost|tax|نسبة|قيمة)/i) !== null
      }));
    });

    for (const inp of inputMetrics) {
      report.numericInputs.total++;
      if (inp.isAmountOrNumber && !inp.inputMode) {
        report.numericInputs.missingInputMode++;
        if (report.numericInputs.details.length < 8) {
          report.numericInputs.details.push(inp);
        }
      }
    }

    // Analyze Clickable Touch Targets
    const touchMetrics = await page.evaluate(() => {
      const clickables = Array.from(document.querySelectorAll('button, a, [role="button"], .btn, .chip, .tab-btn, .bottom-nav-item'));
      return clickables.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
      }).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || el.getAttribute('aria-label') || el.className).trim().substring(0, 30),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          classes: el.className
        };
      });
    });

    for (const target of touchMetrics) {
      report.touchTargets.total++;
      if (target.height < 44 || target.width < 44) {
        report.touchTargets.sub44px++;
        if (target.height < 36 || target.width < 36) {
          report.touchTargets.sub36px++;
        }
        if (report.touchTargets.examples.length < 8) {
          report.touchTargets.examples.push(target);
        }
      }
    }
  }

  await browser.close();
  server.close();

  console.log(JSON.stringify(report, null, 2));
});
