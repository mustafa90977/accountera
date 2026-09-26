-- ====================================================================
-- Accountera: Phase 1 — Auth Foundation & Admin Initialization
-- الغرض: تجهيز جدول الحسابات، دوال الصلاحيات، وحماية الرتب، وربط حساب الأدمن
-- ====================================================================

-- 1. التأكد من وجود جدول profiles وهيكليته الصحيحة
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. دالة فحص رتبة مدير النظام (is_admin)
-- تعمل بـ SECURITY DEFINER لتجاوز حلقة RLS المفرغة والتحقق بأعلى كفاءة
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. دالة فحص طاقم التدريس والإدارة (is_staff)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. مشغّل قاعدة البيانات التلقائي (Trigger) لإنشاء بروفايل عند تسجيل أي مستخدم جديد
-- يضمن أن أي تسجيل دخول جديد يأخذ رتبة student تلقائياً
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'student'
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

-- 5. تريجر حماية عمود الرتبة (منع المستخدمين العاديين من ترقية أنفسهم عبر UPDATE)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      NEW.role := OLD.role; -- إحباط أي تعديل للرتبة إذا لم يكن المنفّذ أدمين
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

-- 6. تفعيل RLS وتطبيق سياسات جدول profiles المصححة
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;

-- سياسة القراءة: المستخدم يقرأ بياناته، والإدارة/المعلمون يقرأون الجميع
CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_staff());

-- سياسة التعديل المصححة: المستخدم يعدل حسابه، والأدمن يستطيع تعديل أي حساب (لإدارة المستخدمين)
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- 7. الصلاحيات المصححة (تم حذف display_name غير الموجود لتفادي خطأ المايجريشن)
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, updated_at, role) ON public.profiles TO authenticated;

-- 8. مزامنة حساب الأدمن الحقيقي فوراً من auth.users إلى profiles برتبة admin
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'مصطفى محمد'), 
    'admin'
FROM auth.users
WHERE LOWER(email) = 'mu9tafamohamed@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', updated_at = NOW();

-- 9. استعلام التحقق النهائي (يعرض النتيجة مباشرة في لوحة Supabase للتأكد)
SELECT id, email, full_name, role, created_at, updated_at 
FROM public.profiles 
WHERE LOWER(email) = 'mu9tafamohamed@gmail.com';
