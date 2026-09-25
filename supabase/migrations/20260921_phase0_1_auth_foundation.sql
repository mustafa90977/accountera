-- ====================================================================
-- Migration: Phase 0.1 — Authentication & Backend Security Foundation
-- File: supabase/migrations/20260921_phase0_1_auth_foundation.sql
-- Date: 2026-09-21
-- ====================================================================

-- 1. التأكد من وجود جدول profiles وهيكليته
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. دوال الفحص الأمني (Security Definer Helpers لمنع حلقة RLS المفرغة)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. مشغّل قاعدة البيانات لإنشاء الملف الشخصي تلقائياً برتبة 'student' فقط
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'student' -- الحساب يُنشأ دائماً كطالب، لا يُقبل أي دور من العميل
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. مشغّل حماية الدور (يمنع أي مستخدم عادي من ترقية دوره إلى admin أو teacher عبر UPDATE)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ====================================================================
-- 5. تحديث سياسات RLS المحكمة (Safe & Secure RLS)
-- ====================================================================

-- أ) جدول public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_staff());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ب) جدول public.companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Admins/Teachers can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Admins/Teachers can update companies" ON public.companies;
DROP POLICY IF EXISTS "companies_select_all" ON public.companies;
DROP POLICY IF EXISTS "companies_admin_insert" ON public.companies;
DROP POLICY IF EXISTS "companies_admin_update" ON public.companies;
DROP POLICY IF EXISTS "companies_admin_delete" ON public.companies;

-- متاح للجميع للقراءة لعدم كسر واجهة تصفح الشركات للمستخدمين والزوار
CREATE POLICY "companies_select_all" ON public.companies
  FOR SELECT TO public
  USING (true);

-- التعديل والإضافة والحذف محصور بالمدير فقط
CREATE POLICY "companies_admin_insert" ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "companies_admin_update" ON public.companies
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "companies_admin_delete" ON public.companies
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ج) جدول public.student_submissions
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "Users can view submissions" ON public.student_submissions;
DROP POLICY IF EXISTS "submissions_insert_own" ON public.student_submissions;
DROP POLICY IF EXISTS "submissions_select_own_or_staff" ON public.student_submissions;

CREATE POLICY "submissions_insert_own" ON public.student_submissions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "submissions_select_own_or_staff" ON public.student_submissions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff());

-- د) جدول public.subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Subscriptions viewable by user" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select_own_or_admin" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_admin_manage" ON public.subscriptions;

CREATE POLICY "subscriptions_select_own_or_admin" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "subscriptions_admin_manage" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. منح الصلاحيات الصريحة (Grants)
GRANT SELECT ON public.companies TO anon, authenticated;
GRANT SELECT, UPDATE(display_name, full_name, updated_at) ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.student_submissions TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
