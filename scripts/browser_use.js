/**
 * Browser Use Cloud API Client
 * Official integration for Accountera workspace
 */

const fs = require('fs');
const path = require('path');

// Load API key from environment or .env file
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

const API_BASE = 'https://api.browser-use.com/api/v4';
const API_BASE_V3 = 'https://api.browser-use.com/api/v3';

class BrowserUseClient {
  constructor(apiKey = getApiKey()) {
    if (!apiKey) {
      throw new Error('BROWSER_USE_API_KEY is not defined in environment or .env file');
    }
    this.apiKey = apiKey;
  }

  get headers() {
    return {
      'Content-Type': 'application/json',
      'X-Browser-Use-API-Key': this.apiKey
    };
  }

  // 1. Run a browsing task on Browser Use Cloud
  async createRun(task, options = {}) {
    const body = {
      task,
      ...options
    };
    const res = await fetch(`${API_BASE}/runs`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use createRun failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 2. Get status / details of a run
  async getRun(runId) {
    const res = await fetch(`${API_BASE}/runs/${runId}`, {
      headers: this.headers
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use getRun failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 3. Stop an ongoing run
  async stopRun(runId) {
    const res = await fetch(`${API_BASE}/runs/${runId}/stop`, {
      method: 'POST',
      headers: this.headers
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use stopRun failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 4. List recent runs
  async listRuns() {
    const res = await fetch(`${API_BASE}/runs`, {
      headers: this.headers
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use listRuns failed (${res.status}): ${err}`);
    }
    return res.json();
  }

  // 5. List browsers (V3)
  async listBrowsers() {
    const res = await fetch(`${API_BASE_V3}/browsers`, {
      headers: this.headers
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Browser Use listBrowsers failed (${res.status}): ${err}`);
    }
    return res.json();
  }
}

module.exports = { BrowserUseClient, getApiKey };

// CLI execution helper
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  const client = new BrowserUseClient();

  (async () => {
    try {
      if (command === 'status') {
        const browsers = await client.listBrowsers();
        const runs = await client.listRuns();
        console.log('✅ الاتصال مع Browser Use ناجح ومفعل 100%!');
        console.log(`📊 عدد المتصفحات السابقة: ${browsers.totalItems || (browsers.items ? browsers.items.length : 0)}`);
        console.log('⚡ أحدث العمليات:');
        console.dir(runs, { depth: 3 });
      } else if (command === 'run') {
        const task = args.slice(1).join(' ') || 'Open accountera.vercel.app and take a screenshot';
        console.log(`🚀 بدء مهمة جديدة على Browser Use Cloud: "${task}"...`);
        const run = await client.createRun(task);
        console.log('✓ تم إنشاء المهمة بنجاح:');
        console.dir(run, { depth: 3 });
      }
    } catch (err) {
      console.error('❌ خطأ في الاتصال مع Browser Use:', err.message);
      process.exit(1);
    }
  })();
}
