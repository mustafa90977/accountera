-- Phase 6 Migration: Centralized Plans Catalog in Supabase
-- Accountera Platform Dynamic Plans Infrastructure

-- 1. Create public.plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  period TEXT DEFAULT 'شهر واحد',
  duration_days INTEGER NOT NULL DEFAULT 0,
  badge TEXT DEFAULT '',
  icon TEXT DEFAULT 'package',
  color TEXT DEFAULT '#10B981',
  max_lessons INTEGER DEFAULT 999,
  max_companies INTEGER DEFAULT 999,
  max_exercises INTEGER DEFAULT 999,
  allow_audit BOOLEAN DEFAULT false,
  allow_excel_cycle BOOLEAN DEFAULT false,
  allow_interview_sim BOOLEAN DEFAULT false,
  allow_skills_passport BOOLEAN DEFAULT false,
  allow_linkedin_share BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "plans_select_all" ON public.plans;
CREATE POLICY "plans_select_all" ON public.plans
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "plans_insert_admin" ON public.plans;
CREATE POLICY "plans_insert_admin" ON public.plans
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "plans_update_admin" ON public.plans;
CREATE POLICY "plans_update_admin" ON public.plans
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "plans_delete_admin" ON public.plans;
CREATE POLICY "plans_delete_admin" ON public.plans
  FOR DELETE
  USING (public.is_admin());

-- 4. Seed initial official plans
INSERT INTO public.plans (
  id, name, price, period, duration_days, badge, icon, color,
  max_lessons, max_companies, max_exercises,
  allow_audit, allow_excel_cycle, allow_interview_sim, allow_skills_passport, allow_linkedin_share,
  features, is_active
) VALUES
(
  'free',
  'الباقة التأسيسية (Free)',
  0,
  'مجاناً مدى الحياة',
  0,
  'تأسيسي',
  'book-open',
  '#10B981',
  3, 1, 5,
  false, false, false, false, false,
  '["الوصول للدروس الـ 3 الأولى", "حل الأمثلة المحلولة الأساسية", "محاكاة شركة تجارية واحدة", "دعم وضع الموبايل الكامل"]'::jsonb,
  true
),
(
  'pro',
  'المحاسب المحترف (Pro)',
  299,
  'شهر واحد',
  30,
  'الأكثر طلباً',
  'briefcase',
  '#3B82F6',
  999, 5, 26,
  true, true, true, true, true,
  '["فتح كافة الدروس التأسيسية (100%)", "محاكاة كاملة لكافة الشركات والقطاعات", "وضع المراجع الخارجي واكتشاف الأخطاء", "جناح الإكسل المحاسبي المتقدم", "جواز الكفاءة المهنية والشهادات", "مشاركة الاعتماد المهني مباشرة على LinkedIn"]'::jsonb,
  true
),
(
  'vip',
  'خبير النمذجة (VIP Master)',
  599,
  'سنة كاملة',
  365,
  'النخبة',
  'sparkle',
  '#8B5CF6',
  999, 999, 999,
  true, true, true, true, true,
  '["وصول كامل لكافة الشركات والمستندات", "تصدير التقارير المالية والقوائم", "أولوية مراجعة القيود المحاسبية", "شهادة إتمام معتمدة برقم تحقق", "محاكي المقابلات الشخصية الفنية للتوظيف", "تصدير واستيراد ملفات القيود لبرامج ERP", "شهادة خبرة رقمية موثقة برمز QR", "مشاركة الاعتماد وسجل الكفاءات على LinkedIn"]'::jsonb,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  duration_days = EXCLUDED.duration_days,
  badge = EXCLUDED.badge,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  max_lessons = EXCLUDED.max_lessons,
  max_companies = EXCLUDED.max_companies,
  max_exercises = EXCLUDED.max_exercises,
  allow_audit = EXCLUDED.allow_audit,
  allow_excel_cycle = EXCLUDED.allow_excel_cycle,
  allow_interview_sim = EXCLUDED.allow_interview_sim,
  allow_skills_passport = EXCLUDED.allow_skills_passport,
  allow_linkedin_share = EXCLUDED.allow_linkedin_share,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 5. Delete test pending subscription requested by user (Step 3)
DELETE FROM public.subscriptions WHERE id = '512e967a-531f-45f7-8d5d-9182b9975d47';
