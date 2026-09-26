-- ====================================================================
-- Accountera: Phase 4 — Backfill Existing Auth Users into Profiles
-- الغرض: مزامنة كافة الحسابات السابقة التي أنشئت قبل التريجر وإسناد رتبة student لها
-- ====================================================================

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    a.id, 
    a.email, 
    COALESCE(a.raw_user_meta_data->>'full_name', split_part(a.email, '@', 1)), 
    'student'
FROM auth.users a
LEFT JOIN public.profiles p ON a.id = p.id
WHERE p.id IS NULL;

-- استعلام التحقق من كافة الحسابات ورتبها الحالية
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
ORDER BY created_at;
