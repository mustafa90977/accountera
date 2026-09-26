const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 3899;
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
  console.log(`🚀 Verification Server listening on http://127.0.0.1:${PORT}`);
  const browser = await chromium.launch({ headless: true });
  
  const viewports = [
    { name: 'm320', width: 320, height: 568 },
    { name: 'm360', width: 360, height: 640 },
    { name: 'm390', width: 390, height: 844 },
    { name: 'm412', width: 412, height: 915 }
  ];

  const screens = ['landing', 'student-dashboard', 'companies-hub', 'learning', 'practice', 'student-plans', 'student-settings'];

  let allPassed = true;

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true });
    await context.addInitScript(() => {
      localStorage.setItem('accountera_user', JSON.stringify({ id: '1', role: 'student', name: 'أحمد محمود' }));
    });
    const page = await context.newPage();

    for (const s of screens) {
      await page.goto(`http://127.0.0.1:${PORT}/#${s}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        return {
          scrollW: root.scrollWidth,
          clientW: root.clientWidth,
          hasOverflow: root.scrollWidth > root.clientWidth + 1,
          diff: root.scrollWidth - root.clientWidth
        };
      });

      if (metrics.hasOverflow) {
        console.error(`❌ OVERFLOW on ${s} at ${vp.name}: scrollW=${metrics.scrollW} > clientW=${metrics.clientW} (diff: +${metrics.diff}px)`);
        allPassed = false;
      } else {
        console.log(`✅ ${s} at ${vp.name}: PERFECT (${metrics.scrollW}px === ${metrics.clientW}px, 0 overflow)`);
      }
    }

    // Test Hamburger Click on P0 Viewport (m390)
    if (vp.name === 'm390') {
      console.log('\n--- Testing Hamburger Trigger & Drawer Open/Close on m390 ---');
      await page.evaluate(() => {
        if (window.AuthService) {
          window.AuthService.currentUser = { id: 'qa-1', role: 'student', name: 'أحمد محمود', email: 'mu9tafamohamed@gmail.com' };
        }
        window.navigateToScreen('student-dashboard');
      });
      await page.waitForTimeout(600);

      try {
        const btn = await page.waitForSelector('.btn-mobile-hamburger', { state: 'visible', timeout: 4000 });
        await btn.click({ timeout: 2000 });
        await page.waitForTimeout(400);

        const isOpen = await page.evaluate(() => {
          const d = document.getElementById('mobileNavDrawer');
          return d && d.classList.contains('open') && window.getComputedStyle(d).visibility === 'visible';
        });

        if (isOpen) {
          console.log('✅ Hamburger click successfully opened the drawer without pointer interception!');
        } else {
          console.error('❌ Drawer did not open properly.');
          allPassed = false;
        }

        // Close drawer
        await page.evaluate(() => window.toggleMobileDrawer && window.toggleMobileDrawer(false));
        await page.waitForTimeout(400);

        const isClosed = await page.evaluate(() => {
          const d = document.getElementById('mobileNavDrawer');
          return d && !d.classList.contains('open') && window.getComputedStyle(d).visibility === 'hidden';
        });

        if (isClosed) {
          console.log('✅ Drawer closed cleanly and reset visibility: hidden!');
        } else {
          console.error('❌ Drawer did not close to hidden state.');
          allPassed = false;
        }

      } catch (err) {
        console.error('❌ Hamburger interaction failed:', err.message);
        allPassed = false;
      }
    }

    await context.close();
  }

  await browser.close();
  server.close();

  if (allPassed) {
    console.log('\n🎉 ALL MOBILE CHECKS PASSED 100%! ZERO HORIZONTAL OVERFLOW & PERFECT HAMBURGER HIT-TEST!');
    process.exit(0);
  } else {
    console.error('\n⚠️ Some issues remained.');
    process.exit(1);
  }
});
