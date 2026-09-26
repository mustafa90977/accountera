-- ====================================================================
-- Accountera: Phase 3 — Secure Student Submissions RLS
-- الغرض: حماية خصوصية درجات وإجابات الطلاب، وإتاحتها فقط للطالب نفسه والمعلم/المدير
-- ====================================================================

-- 1. التأكد من تفعيل RLS على جدول تسليمات الطلاب
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- 2. إزالة السياسات القديمة والمفتوحة
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "Users can view submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "submissions_insert_own" ON public.student_submissions;
DROP POLICY IF EXISTS "submissions_select_own_or_staff" ON public.student_submissions;
DROP POLICY IF EXISTS "submissions_admin_delete" ON public.student_submissions;

-- 3. سياسة الإدراج: الطالب يملك صلاحية حفظ إجاباته هو فقط (auth.uid() = user_id)
CREATE POLICY "submissions_insert_own" ON public.student_submissions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. سياسة القراءة: الطالب يرى تسليماته فقط، بينما المعلم (teacher) والمدير (admin) يريان تسليمات الجميع
CREATE POLICY "submissions_select_own_or_staff" ON public.student_submissions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff());

-- 5. سياسة الحذف: محصورة بمدير النظام (is_admin)
CREATE POLICY "submissions_admin_delete" ON public.student_submissions
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 6. ضبط الصلاحيات الصريحة
GRANT SELECT, INSERT ON public.student_submissions TO authenticated;

-- 7. استعلام التحقق من السياسات المفعلة (يعرض السياسات الـ 3 الجديدة في لوحة النتائج)
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'student_submissions'
ORDER BY cmd;
