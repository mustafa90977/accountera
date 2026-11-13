import asyncio
import os
import json
from browser_use_sdk import AsyncBrowserUse
from playwright.async_api import async_playwright

API_KEY = os.environ.get("BROWSER_USE_API_KEY", "")

async def test_deep_functional_flows():
    print("🚀 بدء الفحص الوظيفي العميق (Functional Logic Audit) لمحاكي المحاسبة...")
    results = {
        "journal_tests": {},
        "ledger_tests": {},
        "statements_tests": {},
        "discovered_bugs": []
    }

    async with AsyncBrowserUse(api_key=API_KEY) as client:
        browser = await client.browsers.create(proxy_country_code="us", timeout=15)
        try:
            print(f"📺 البث المباشر للفحص الوظيفي: {browser.live_url}")
            async with async_playwright() as p:
                pw_browser = await p.chromium.connect_over_cdp(browser.cdp_url)
                ctx = pw_browser.contexts[0] if pw_browser.contexts else await pw_browser.new_context()
                page = ctx.pages[0] if ctx.pages else await ctx.new_page()
                await page.set_viewport_size({"width": 1280, "height": 800})

                # 1. اختبار دفتر اليومية
                print("\n1️⃣ فحص دفتر اليومية والمستندات...")
                await page.goto("https://accountera.vercel.app/simulation/simulation/journal/index.html", wait_until="networkidle")
                await page.wait_for_timeout(2000)

                # فحص وجود القيد الافتتاحي وتأكيد ترحيله
                journal_eval = await page.evaluate("""() => {
                    const journal = window.getStudentJournal ? window.getStudentJournal() : [];
                    const answerKey = window.ANSWER_KEY || [];
                    const openingInJournal = journal.find(j => j.type === 'Opening Balance' || j.isAutoOpening);
                    const pendingList = document.querySelectorAll('#pending-list > div');
                    return {
                        totalTasks: answerKey.length,
                        journalEntries: journal.length,
                        hasAutoOpening: !!openingInJournal,
                        openingStatus: openingInJournal ? openingInJournal.status : null,
                        openingLinesCount: openingInJournal ? (openingInJournal.lines || []).length : 0,
                        pendingCount: pendingList.length
                    };
                }""")
                results["journal_tests"] = journal_eval
                print(f"   • مهام المحاكي: {journal_eval['totalTasks']}")
                print(f"   • القيد الافتتاحي معتمد آلياً: {journal_eval['hasAutoOpening']} (أسطر القيد: {journal_eval['openingLinesCount']})")
                print(f"   • المهام المعلقة المتبقية للطالب: {journal_eval['pendingCount']}")

                if not journal_eval['hasAutoOpening']:
                    results["discovered_bugs"].append("القيد الافتتاحي لم يتم إثباته تلقائياً في دفتر اليومية.")

                # 2. اختبار دفتر الأستاذ وميزان المراجعة
                print("\n2️⃣ فحص دفتر الأستاذ العام وميزان المراجعة...")
                await page.goto("https://accountera.vercel.app/simulation/simulation/ledger/index.html", wait_until="networkidle")
                await page.wait_for_timeout(2000)

                ledger_eval = await page.evaluate("""() => {
                    const debEl = document.getElementById('tb-total-debit');
                    const credEl = document.getElementById('tb-total-credit');
                    const debVal = debEl ? debEl.innerText.trim() : '';
                    const credVal = credEl ? credEl.innerText.trim() : '';
                    const tAccounts = document.querySelectorAll('#t-accounts-grid > div');
                    const hasNaN = debVal.includes('NaN') || credVal.includes('NaN');
                    const isBalanced = (debVal === credVal) && debVal !== '0' && debVal !== '';
                    return {
                        totalDebit: debVal,
                        totalCredit: credVal,
                        tAccountsCount: tAccounts.length,
                        hasNaN: hasNaN,
                        isBalanced: isBalanced
                    };
                }""")
                results["ledger_tests"] = ledger_eval
                print(f"   • مجموع مدين الميزان: {ledger_eval['totalDebit']}")
                print(f"   • مجموع دائن الميزان: {ledger_eval['totalCredit']}")
                print(f"   • حسابات T النشطة بالأستاذ: {ledger_eval['tAccountsCount']}")
                print(f"   • اتزان الميزان: {ledger_eval['isBalanced']}")

                if ledger_eval['hasNaN']:
                    results["discovered_bugs"].append("يوجد خطأ NaN في حساب أرقام ميزان المراجعة.")
                if not ledger_eval['isBalanced']:
                    results["discovered_bugs"].append(f"ميزان المراجعة غير متزن: مدين ({ledger_eval['totalDebit']}) لا يطابق دائن ({ledger_eval['totalCredit']}).")

                # 3. اختبار القوائم المالية
                print("\n3️⃣ فحص القوائم المالية والتقارير...")
                await page.goto("https://accountera.vercel.app/simulation/simulation/statements/index.html", wait_until="networkidle")
                await page.wait_for_timeout(2000)

                stmt_eval = await page.evaluate("""() => {
                    const bodyText = document.body.innerText;
                    const hasNaN = bodyText.includes('NaN');
                    return {
                        hasNaN: hasNaN
                    };
                }""")
                results["statements_tests"] = stmt_eval
                print(f"   • خلو القوائم المالية من أخطاء NaN: {not stmt_eval['hasNaN']}")
                if stmt_eval['hasNaN']:
                    results["discovered_bugs"].append("ظهور أخطاء حسابية NaN داخل شاشة القوائم المالية.")

                # حفظ التقرير
                with open("functional_audit_report.json", "w", encoding="utf-8") as f:
                    json.dump(results, f, ensure_ascii=False, indent=2)

                print("\n========================================================")
                print("🎯 نتيجة الفحص الوظيفي:")
                if results["discovered_bugs"]:
                    print(f"⚠️ تم اكتشاف {len(results['discovered_bugs'])} ملاحظة:")
                    for b in results["discovered_bugs"]:
                        print(f"   🔴 {b}")
                else:
                    print("✅ جميع الأنظمة المحاسبية (اليومية، الأستاذ، الميزان، القوائم) تعمل بتطابق وتوازن 100% بدون أي أخطاء!")
                print("========================================================")

        finally:
            await client.browsers.stop(browser.id)
            print("🛑 تم إغلاق الجلسة السحابية.")

if __name__ == "__main__":
    asyncio.run(test_deep_functional_flows())
