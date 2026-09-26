const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'm320', width: 320, height: 640 },
    { name: 'm360', width: 360, height: 740 },
    { name: 'm390', width: 390, height: 844 },
    { name: 'm412', width: 412, height: 915 }
  ];
  
  const routes = ['/', '/#dashboard', '/#journal-entry', '/#balance-sheet', '/#general-ledger'];
  let totalErrors = 0;

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    
    for (const route of routes) {
      await page.goto('https://accountera.vercel.app' + route, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(500);
      
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      const overflow = metrics.scrollWidth > metrics.clientWidth;
      console.log(`[${vp.name}] ${route} -> scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth} ${overflow ? '❌ FAIL' : '✅ PASS'}`);
      if (overflow) totalErrors++;
    }

    // Test hamburger
    await page.goto('https://accountera.vercel.app/#dashboard', { waitUntil: 'networkidle' });
    const hamburger = page.locator('#btn-mobile-nav-toggle');
    const isVisible = await hamburger.isVisible();
    if (isVisible) {
      await hamburger.click();
      await page.waitForTimeout(400);
      const drawerOpen = await page.evaluate(() => document.querySelector('#mobile-nav-drawer')?.classList.contains('open'));
      console.log(`[${vp.name}] Hamburger Click -> Drawer Open: ${drawerOpen ? '✅ PASS' : '❌ FAIL'}`);
      if (!drawerOpen) totalErrors++;
    }
    
    await context.close();
  }

  await browser.close();
  console.log('\n==============================');
  console.log(`Live Production Result: ${totalErrors === 0 ? 'ALL CHECKS PASSED (100%)' : totalErrors + ' ERRORS FOUND'}`);
  process.exit(totalErrors === 0 ? 0 : 1);
})();
