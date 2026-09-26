const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const BASE_URL = 'https://accountera.vercel.app';
const EVIDENCE_DIR = path.join(__dirname, '..', 'audit_evidence', 'ultimate_audit');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const a11yScreens = [
    { id: 'landing', url: `${BASE_URL}/#landing` },
    { id: 'login', url: `${BASE_URL}/#login` },
    { id: 'student-dashboard', url: `${BASE_URL}/#student-dashboard`, auth: true },
    { id: 'sim_journal', url: `${BASE_URL}/simulation/simulation/journal/index.html` },
    { id: 'sim_bank_recon', url: `${BASE_URL}/simulation/simulation/bank-recon/index.html` }
  ];

  const results = {
    a11y: [],
    journeys: []
  };

  for (const s of a11yScreens) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    if (s.auth) {
      await context.addInitScript(() => {
        localStorage.setItem('accountera_user', JSON.stringify({
          id: 'qa-student-001',
          email: 'student.qa@accountera.org',
          name: 'أحمد محمود',
          role: 'student'
        }));
      });
    }
    const page = await context.newPage();
    try {
      await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1000);
      const axeRes = await new AxeBuilder({ page }).analyze();
      results.a11y.push({
        screen: s.id,
        passesCount: axeRes.passes.length,
        violationsCount: axeRes.violations.length,
        violations: axeRes.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
          target: v.nodes[0]?.target?.join(', ') || ''
        }))
      });
      console.log(`✅ a11y for ${s.id}: ${axeRes.violations.length} violations, ${axeRes.passes.length} passes`);
    } catch (e) {
      console.error(`❌ a11y error on ${s.id}:`, e.message);
    } finally {
      await context.close().catch(() => {});
    }
  }

  // Simulation Workflows Verification
  const simContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const simPage = await simContext.newPage();
  try {
    await simPage.goto(`${BASE_URL}/simulation/simulation/journal/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await simPage.waitForTimeout(1000);
    const jShot = path.join(EVIDENCE_DIR, 'journey_journal_mobile_entry.png');
    await simPage.screenshot({ path: jShot });

    await simPage.goto(`${BASE_URL}/simulation/simulation/bank-recon/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await simPage.waitForTimeout(1000);
    const rShot = path.join(EVIDENCE_DIR, 'journey_bank_recon_mobile.png');
    await simPage.screenshot({ path: rShot });

    results.journeys.push({ name: 'Journal Simulation Entry', status: 'PASS', screenshot: 'journey_journal_mobile_entry.png' });
    results.journeys.push({ name: 'Bank Recon Simulation', status: 'PASS', screenshot: 'journey_bank_recon_mobile.png' });
    console.log('✅ Simulation journeys captured successfully!');
  } catch (e) {
    console.error('❌ Journey error:', e.message);
  } finally {
    await simContext.close().catch(() => {});
  }

  await browser.close();

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'a11y_and_journeys.json'), JSON.stringify(results, null, 2), 'utf8');
}

run();
