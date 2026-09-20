import asyncio
import os
import sys
import json
from browser_use_sdk import AsyncBrowserUse
from playwright.async_api import async_playwright

API_KEY = os.environ.get("BROWSER_USE_API_KEY", "bu_Z6afUdLRDkrYMnIyRqQiQaQfpabEEmg6Kj8qGAXxZQo")

# سجل تجميع أخطاء الموقع
audit_results = {
    "console_errors": [],
    "page_errors": [],
    "network_failures": [],
    "screen_audits": []
}

async def audit_page(page, url_or_action_name, action_fn=None):
    print(f"\n🔍 فحص الشاشة: [{url_or_action_name}]...")
    screen_info = {
        "screen": url_or_action_name,
        "title": "",
        "status": "PASS",
        "errors": []
    }
    
    current_console_errors = []
    current_network_errors = []

    def on_console(msg):
        if msg.type in ["error"]:
            err_text = f"[Console {msg.type}] {msg.text} (Location: {msg.location})"
            current_console_errors.append(err_text)
            audit_results["console_errors"].append({"screen": url_or_action_name, "error": err_text})

    def on_page_error(exc):
        err_text = f"[Page Uncaught Error] {str(exc)}"
        screen_info["errors"].append(err_text)
        audit_results["page_errors"].append({"screen": url_or_action_name, "error": err_text})

    def on_req_failed(req):
        # تجاهل طلبات التتبع أو الفشل غير المؤثر إذا وجد
        failed_text = f"[404 / Request Failed] {req.method} {req.url} -> {req.failure}"
        current_network_errors.append(failed_text)
        audit_results["network_failures"].append({"screen": url_or_action_name, "error": failed_text})

    page.on("console", on_console)
    page.on("pageerror", on_page_error)
    page.on("requestfailed", on_req_failed)

    try:
        if action_fn:
            await action_fn(page)
        else:
            await page.goto(url_or_action_name, wait_until="networkidle", timeout=25000)
            
        await page.wait_for_timeout(2000)
        screen_info["title"] = await page.title()

        if current_console_errors or current_network_errors or screen_info["errors"]:
            screen_info["status"] = "ISSUES_FOUND"
            print(f"⚠️ وُجدت ملاحظات في [{url_or_action_name}]:")
            for ce in current_console_errors:
                print(f"   🔴 {ce}")
            for ne in current_network_errors:
                print(f"   🟠 {ne}")
        else:
            print(f"✅ [{url_or_action_name}] نظيفة تماماً بدون أي أخطاء برمجية أو شبكية.")

    except Exception as e:
        screen_info["status"] = "FAIL"
        screen_info["errors"].append(str(e))
        print(f"❌ فشل فحص الشاشة [{url_or_action_name}]: {e}")

    audit_results["screen_audits"].append(screen_info)
    # إزالة المستمعين لتجنب التكرار بين الصفحات
    page.remove_listener("console", on_console)
    page.remove_listener("pageerror", on_page_error)
    page.remove_listener("requestfailed", on_req_failed)

async def main():
    print("🚀 بدء الفحص الشامل واكتشاف أخطاء الموقع عبر Browser Use Cloud...")
    async with AsyncBrowserUse(api_key=API_KEY) as client:
        browser = await client.browsers.create(
            proxy_country_code="us",
            timeout=15,
        )

        try:
            print(f"📺 لمتابعة الفحص المباشر لحظة بلحظة: {browser.live_url}")
            
            async with async_playwright() as p:
                pw_browser = await p.chromium.connect_over_cdp(browser.cdp_url)
                context = pw_browser.contexts[0] if pw_browser.contexts else await pw_browser.new_context()
                page = context.pages[0] if context.pages else await context.new_page()

                # ضبط حجم الشاشة لمطابقة شاشات اللابتوب القياسية
                await page.set_viewport_size({"width": 1280, "height": 800})

                # 1. فحص الصفحة الرئيسية
                await audit_page(page, "https://accountera.vercel.app")

                # 2. فحص لوحة الطالب (Student Dashboard)
                async def goto_student_dash(pg):
                    await pg.evaluate("window.navigateToScreen('student-dashboard')")
                await audit_page(page, "لوحة الطالب (Student Dashboard)", goto_student_dash)

                # 3. فحص المسار التعليمي (Lesson 1)
                async def goto_lesson1(pg):
                    await pg.evaluate("window.navigateToScreen('lesson-1')")
                await audit_page(page, "المسار التعليمي (درس 1)", goto_lesson1)

                # 4. فحص الأمثلة المحلولة والتمارين
                async def goto_ex1(pg):
                    await pg.evaluate("window.navigateToScreen('ex-1')")
                await audit_page(page, "الأمثلة المحلولة (Example 1)", goto_ex1)

                # 5. فحص بيئة الشركات (Companies Hub)
                async def goto_companies(pg):
                    await pg.evaluate("window.navigateToScreen('companies-hub')")
                await audit_page(page, "دليل ومجمع الشركات", goto_companies)

                # 6. فحص لوحة الإدارة (Admin Dashboard)
                async def goto_admin(pg):
                    await pg.evaluate("window.navigateToScreen('admin-overview')")
                await audit_page(page, "لوحة الإدارة الشاملة (Admin)", goto_admin)

                # 7. فحص لوحة المعلم (Teacher Dashboard)
                async def goto_teacher(pg):
                    await pg.evaluate("window.navigateToScreen('teacher-overview')")
                await audit_page(page, "لوحة المعلم الأكاديمي", goto_teacher)

                # 8. فحص محاكي دفتر اليومية
                await audit_page(page, "https://accountera.vercel.app/simulation/simulation/journal/index.html")

                # 9. فحص دفتر الأستاذ والميزان
                await audit_page(page, "https://accountera.vercel.app/simulation/simulation/ledger/index.html")

                # 10. فحص مذكرة التسوية البنكية
                await audit_page(page, "https://accountera.vercel.app/simulation/simulation/bank-recon/index.html")

                # 11. فحص القوائم المالية وتقارير الختام
                await audit_page(page, "https://accountera.vercel.app/simulation/simulation/statements/index.html")

                # 12. فحص لوحة المحاكي العامة (Dashboard)
                await audit_page(page, "https://accountera.vercel.app/simulation/simulation/dashboard/index.html")

                # حفظ تقرير الفحص الكامل بصيغة JSON
                with open("audit_report.json", "w", encoding="utf-8") as f:
                    json.dump(audit_results, f, ensure_ascii=False, indent=2)
                
                print("\n========================================================")
                print("📊 ملخص نتائج تدقيق الموقع واكتشاف الأخطاء:")
                print(f"• أخطاء Console البرمجية: {len(audit_results['console_errors'])}")
                print(f"• أخطاء Runtime غير المعالجة: {len(audit_results['page_errors'])}")
                print(f"• الطلبات الشبكية الفاشلة (404s): {len(audit_results['network_failures'])}")
                print(f"• إجمالي الشاشات التي تم تدقيقها: {len(audit_results['screen_audits'])}")
                print("========================================================")

        finally:
            await client.browsers.stop(browser.id)
            print("🛑 تم إغلاق الجلسة السحابية بنجاح.")

if __name__ == "__main__":
    asyncio.run(main())
