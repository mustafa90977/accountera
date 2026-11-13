const path = require('path');
const assert = require('assert');

console.log('🧪 Verifying Data Integrity & Company Operations Fixes...');

// 1. Test DI-03: Duplicate postEntry prevention
const EGYPTIAN_COA = require('../src/core/engine/egyptian-coa.js');
const AccounteraAccountingCore = require('../src/core/engine/accountera-accounting-core.js');
const core = new AccounteraAccountingCore(EGYPTIAN_COA);

const testEntry = {
  id: 'JE-TEST-001',
  txId: 'TRX-TEST-001',
  date: '2026-01-01',
  lines: [
    { lineNum: 1, accountCode: '1101', debit: 100, credit: 0 },
    { lineNum: 2, accountCode: '4101', debit: 0, credit: 100 }
  ]
};

core.postEntry(testEntry);
assert.strictEqual(core.journal.length, 1, 'First post should succeed');
assert.strictEqual(core.ledger['1101'].totalDebit, 100, 'Cash debit should be 100');

let threw = false;
try {
  core.postEntry(testEntry); // duplicate call
} catch (e) {
  threw = true;
  console.log('   ✅ [PASS]: DI-03 caught duplicate postEntry correctly:', e.message);
}
assert.strictEqual(threw, true, 'Duplicate postEntry MUST throw');
assert.strictEqual(core.journal.length, 1, 'Journal should not duplicate entry');
assert.strictEqual(core.ledger['1101'].totalDebit, 100, 'Cash debit balance MUST NOT double to 200');

// 2. Test DI-01 & DI-02: Scoped cache & empty reset
let localStore = {};
global.localStorage = {
  getItem: k => localStore[k] || null,
  setItem: (k, v) => localStore[k] = String(v),
  removeItem: k => delete localStore[k],
  clear: () => localStore = {}
};
global.window = { SupabaseService: null };

const { SimulationService } = require('../src/core/services/learning-service.js');

(async () => {
  // Save company A
  await SimulationService.saveProgress('company-A', {
    journal: [{ id: 'J-A-1', ref: 'INV-A' }],
    ledger: { '1101': { balance: 50 } },
    profile: { id: 'company-A', name: 'Company A' }
  });

  // Save company B
  await SimulationService.saveProgress('company-B', {
    journal: [{ id: 'J-B-1', ref: 'INV-B' }],
    ledger: { '1101': { balance: 200 } },
    profile: { id: 'company-B', name: 'Company B' }
  });

  // Load company A offline - must return company A data, NOT company B!
  const loadedA = await SimulationService.loadProgress('company-A');
  assert.strictEqual(loadedA.state_data.journal[0].id, 'J-A-1', 'Company A must return J-A-1');
  assert.strictEqual(loadedA.state_data.ledger['1101'].balance, 50, 'Company A balance must be 50, not 200');
  console.log('   ✅ [PASS]: DI-01 company cache isolation verified (Company A loaded without pollution from B)');

  // Test DI-02: Reset company A to empty state
  await SimulationService.saveProgress('company-A', {
    journal: [],
    ledger: {},
    profile: { id: 'company-A' }
  });

  const resetA = await SimulationService.loadProgress('company-A');
  assert.strictEqual(resetA.state_data.journal.length, 0, 'Company A journal must be empty after reset');
  console.log('   ✅ [PASS]: DI-02 empty state reset verified (Old entries successfully cleared on empty save)');

  console.log('\n🎯 All Data Integrity & Zero Operations fixes verified successfully 100%!');
})();
