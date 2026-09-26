/**
 * Browser Use Cloud Integration for Accountera
 * Uses official `browser-use-sdk` & API v4 (Recommended)
 */

const fs = require('fs');
const path = require('path');
const { BrowserUse } = require('browser-use-sdk');

function getApiKey() {
  if (process.env.BROWSER_USE_API_KEY) {
    return process.env.BROWSER_USE_API_KEY.trim();
  }
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('BROWSER_USE_API_KEY=')) {
        return trimmed.replace('BROWSER_USE_API_KEY=', '').trim();
      }
    }
  }
  return null;
}

const API_V4_BASE = 'https://api.browser-use.com/api/v4';

class BrowserUseService {
  constructor(apiKey = getApiKey()) {
    if (!apiKey) {
      throw new Error('BROWSER_USE_API_KEY not found in environment or .env');
    }
    this.apiKey = apiKey;
    this.sdk = new BrowserUse({ apiKey: this.apiKey });
  }

  // 1. Get Account & Balance Info (GET /api/v2/billing/account)
  async getAccount() {
    return await this.sdk.billing.account();
  }

  // 2. Run an Agent Task via API v4
  async runTask(task, options = {}) {
    const payload = {
      task,
      ...options
    };
    const res = await fetch(`${API_V4_BASE}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Browser-Use-API-Key': this.apiKey
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use runTask failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 3. Get run status (API v4)
  async getRun(runId) {
    const res = await fetch(`${API_V4_BASE}/runs/${runId}`, {
      headers: { 'X-Browser-Use-API-Key': this.apiKey }
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use getRun failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 4. Stop a run (API v4)
  async stopRun(runId) {
    const res = await fetch(`${API_V4_BASE}/runs/${runId}/stop`, {
      method: 'POST',
      headers: { 'X-Browser-Use-API-Key': this.apiKey }
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use stopRun failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 5. Create Standalone Browser (API v4)
  async createBrowser(options = {}) {
    const res = await fetch(`${API_V4_BASE}/browsers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Browser-Use-API-Key': this.apiKey
      },
      body: JSON.stringify(options)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use createBrowser failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 6. Stop Standalone Browser properly to refund unused time and stop billing
  // Trap prevention: client.close() does NOT stop billing; PATCH with {"action":"stop"} is required.
  async stopBrowser(browserSessionId) {
    const res = await fetch(`${API_V4_BASE}/browsers/${browserSessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Browser-Use-API-Key': this.apiKey
      },
      body: JSON.stringify({ action: 'stop' })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use stopBrowser failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 7. List existing browsers
  async listBrowsers() {
    return await this.sdk.browsers.list();
  }
}

module.exports = { BrowserUseService, getApiKey };

// CLI Runner
if (require.main === module) {
  (async () => {
    try {
      const service = new BrowserUseService();
      const args = process.argv.slice(2);
      const command = args[0] || 'status';

      if (command === 'status') {
        const account = await service.getAccount();
        console.log('========================================================');
        console.log('✅ تم التحقق والاتصال مع Browser Use Cloud بنجاح:');
        console.log(`   - اسم المشروع: ${account.name}`);
        console.log(`   - رصيد الحساب المتاح: $${account.totalCreditsBalanceUsd.toFixed(2)} USD`);
        console.log(`   - أقصى جلسات متزامنة: ${account.concurrentSessionLimit}`);
        console.log(`   - الجلسات النشطة حالياً: ${account.activeSessionCount}`);
        console.log(`   - معرف المشروع: ${account.projectId}`);
        console.log('========================================================');
      } else if (command === 'run') {
        const goal = args.slice(1).join(' ') || 'Open accountera.vercel.app and verify the mobile layout';
        console.log(`🚀 جاري إطلاق مهمة V4 جديدة: "${goal}"...`);
        const result = await service.runTask(goal);
        console.log('✓ تم تسجيل المهمة بنجاح على Browser Use Cloud:');
        console.dir(result, { depth: 3 });
      }
    } catch (e) {
      console.error('❌ خطأ:', e.message);
      process.exit(1);
    }
  })();
}
