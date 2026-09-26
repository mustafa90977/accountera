-- ====================================================================
-- Accountera: Phase 2 — Secure Companies Table RLS
-- الغرض: تأمين جدول الشركات وإغلاق ثغرة الحذف والتعديل المفتوحة للعامة
-- ====================================================================

-- 1. التأكد من تفعيل RLS على جدول الشركات
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 2. إزالة كافة السياسات القديمة والمفتوحة
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Admins/Teachers can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins/Teachers can update companies" ON public.companies;
DROP POLICY IF EXISTS "companies_select_all" ON public.companies;
DROP POLICY IF EXISTS "companies_admin_insert" ON public.companies;
DROP POLICY IF EXISTS "companies_admin_update" ON public.companies;
DROP POLICY IF EXISTS "companies_admin_delete" ON public.companies;

-- 3. سياسة القراءة: متاحة للجميع (طلاب، زوار، ومعلمون) لتصفح بيئات المحاكاة دون انقطاع
CREATE POLICY "companies_select_all" ON public.companies
  FOR SELECT TO public
  USING (true);

-- 4. سياسة الإضافة: محصورة فقط بمدير النظام المعتمد (is_admin)
CREATE POLICY "companies_admin_insert" ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- 5. سياسة التعديل: محصورة فقط بمدير النظام المعتمد (is_admin)
CREATE POLICY "companies_admin_update" ON public.companies
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. سياسة الحذف: محصورة فقط بمدير النظام المعتمد (is_admin)
CREATE POLICY "companies_admin_delete" ON public.companies
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 7. ضبط الصلاحيات الصريحة
GRANT SELECT ON public.companies TO anon, authenticated;

-- 8. استعلام التحقق من السياسات المفعلة (يعرض السياسات الـ 4 الجديدة في لوحة النتائج)
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'companies'
ORDER BY cmd;
