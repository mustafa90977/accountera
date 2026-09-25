-- ====================================================================
-- Migration: Phase 0.2 — MVP Learning Persistence
-- File: supabase/migrations/20260921_phase0_2_mvp_persistence.sql
-- Date: 2026-09-21
-- ====================================================================

-- 1. جدول تقدم الدروس التأسيسية
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lesson_progress_select_own" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_insert_own" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_update_own" ON public.lesson_progress;

CREATE POLICY "lesson_progress_select_own" ON public.lesson_progress
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "lesson_progress_insert_own" ON public.lesson_progress
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_progress_update_own" ON public.lesson_progress
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. جدول محاولات حل التمارين المستقلة
CREATE TABLE IF NOT EXISTS public.practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL,
    exercise_type TEXT NOT NULL DEFAULT 'independent_practice',
    score INTEGER NOT NULL DEFAULT 0,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    answer_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "practice_attempts_select_own" ON public.practice_attempts;
DROP POLICY IF EXISTS "practice_attempts_insert_own" ON public.practice_attempts;

CREATE POLICY "practice_attempts_select_own" ON public.practice_attempts
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "practice_attempts_insert_own" ON public.practice_attempts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 3. جدول تقدم وحالة محاكاة الشركات
CREATE TABLE IF NOT EXISTS public.simulation_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL,
    current_operation TEXT,
    completed_operations INTEGER DEFAULT 0,
    score NUMERIC(5,2) DEFAULT 0,
    status TEXT DEFAULT 'in_progress',
    state_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_company UNIQUE (user_id, company_id)
);

ALTER TABLE public.simulation_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "simulation_progress_select_own" ON public.simulation_progress;
DROP POLICY IF EXISTS "simulation_progress_insert_own" ON public.simulation_progress;
DROP POLICY IF EXISTS "simulation_progress_update_own" ON public.simulation_progress;

CREATE POLICY "simulation_progress_select_own" ON public.simulation_progress
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "simulation_progress_insert_own" ON public.simulation_progress
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "simulation_progress_update_own" ON public.simulation_progress
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. منح الصلاحيات الصريحة لدور authenticated
GRANT SELECT, INSERT, UPDATE ON public.lesson_progress TO authenticated;
GRANT SELECT, INSERT ON public.practice_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.simulation_progress TO authenticated;
