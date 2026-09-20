import asyncio
import os
import sys
from browser_use_sdk import AsyncBrowserUse
from playwright.async_api import async_playwright

API_KEY = os.environ.get("BROWSER_USE_API_KEY", "bu_Z6afUdLRDkrYMnIyRqQiQaQfpabEEmg6Kj8qGAXxZQo")

async def main():
    print("🚀 جاري الاتصال بخوادم Browser Use وإنشاء الجلسة السحابية...")
    
    async with AsyncBrowserUse(api_key=API_KEY) as client:
        # إنشاء المتصفح السحابي بمهلة مناسبة
        browser = await client.browsers.create(
            proxy_country_code="us",
            timeout=10,
        )
        
        try:
            print("\n========================================================")
            print("✅ تم إنشاء المتصفح السحابي بنجاح!")
            print(f"🆔 معرف الجلسة: {browser.id}")
            print(f"🔗 رابط CDP: {browser.cdp_url}")
            print("\n📺 افتح رابط المشاهدة المباشرة الآن في متصفحك:")
            print(f"👉 {browser.live_url}")
            print("========================================================\n")

            print("🌐 جاري التحكم بالمتصفح عبر Playwright وفتح منصة Accountera...")
            async with async_playwright() as p:
                pw_browser = await p.chromium.connect_over_cdp(browser.cdp_url)
                context = pw_browser.contexts[0] if pw_browser.contexts else await pw_browser.new_context()
                page = context.pages[0] if context.pages else await context.new_page()

                # الانتقال للمنصة ومحاكي القيود
                target_url = "https://accountera.vercel.app"
                print(f"⏳ جاري تحميل {target_url}...")
                await page.goto(target_url, wait_until="networkidle", timeout=30000)
                
                title = await page.title()
                print(f"✓ تم فتح الصفحة بنجاح: {title}")

                # التقاط صورة وحفظها محلياً
                await page.screenshot(path="accountera_cloud_preview.png")
                print("📸 تم التقاط وحفظ صورة الشاشة في accountera_cloud_preview.png")

                # توجيه المتصفح السحابي إلى شاشة قيود اليومية في المحاكي
                journal_url = "https://accountera.vercel.app/simulation/simulation/journal/index.html"
                print(f"⏳ جاري فتح شاشة قيود اليومية بالمحاكي: {journal_url}...")
                await page.goto(journal_url, wait_until="networkidle", timeout=30000)
                print("✓ تم فتح شاشة قيود اليومية بالمحاكي!")

                # إبقاء المتصفح نشطاً لمدة 60 ثانية ليتمكن المستخدم من مشاهدة البث الحي والتفاعل
                print("\n👀 المتصفح السحابي نشط الآن على البث الحي. يمكنك المشاهدة أو التفاعل من الرابط أعلاه.")
                print("⏳ سيستمر المتصفح لمدة 60 ثانية قبل الإغلاق التلقائي...")
                await asyncio.sleep(60)

        except Exception as e:
            print(f"❌ خطأ أثناء الاتصال: {e}")
        finally:
            print("\n🛑 جاري إيقاف الجلسة السحابية في Browser Use لعدم استهلاك الرصيد...")
            await client.browsers.stop(browser.id)
            print("✓ تم إيقاف المتصفح بنجاح.")

if __name__ == "__main__":
    asyncio.run(main())
