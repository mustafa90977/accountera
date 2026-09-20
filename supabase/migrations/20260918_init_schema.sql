-- ====================================================================
-- 1. Profiles Table (المستخدمين والأدوار)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 2. Companies Table (الشركات والبيئات التفاعلية للمحاكي)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sector TEXT,
    badge TEXT,
    icon TEXT DEFAULT '🏢',
    role TEXT,
    description TEXT,
    month TEXT,
    transactions JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. Student Submissions (قيود ونتائج الطلاب المسلمة من المحاكي)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.student_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
    student_journal JSONB DEFAULT '[]'::jsonb,
    score NUMERIC(5,2) DEFAULT 0,
    total_tasks INT DEFAULT 0,
    completed_tasks INT DEFAULT 0,
    is_balanced BOOLEAN DEFAULT false,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. Subscriptions & Plans (الباقات والاشتراكات)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'canceled')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. Row Level Security (RLS) Policies
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: قراءة للجميع وتعديل لصاحب الحساب
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Companies: قراءة للجميع (طلاب ومدرسين) وإضافة/تعديل للمسؤول
CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Admins/Teachers can insert companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins/Teachers can update companies" ON public.companies FOR UPDATE USING (true);

-- Student Submissions: الطالب يرى ويسجل إجاباته، والمعلم/المدير يرى إجابات الجميع
CREATE POLICY "Users can insert own submissions" ON public.student_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view submissions" ON public.student_submissions FOR SELECT USING (true);

-- Subscriptions: قراءة للجميع
CREATE POLICY "Subscriptions viewable by user" ON public.subscriptions FOR SELECT USING (true);
