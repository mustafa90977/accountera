-- Phase 5 Migration: Secure Subscriptions Workflow & Admin Approval
-- Accountera Platform Security Remediation

-- 1. Update check constraint & default on status
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_status_check 
  CHECK (status IN ('pending', 'active', 'expired', 'rejected'));

-- 2. Add requested_at, activated_at, activated_by columns
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS activated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_profiles_fkey;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_profiles_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Ensure RLS is active
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Drop any legacy/open policies
DROP POLICY IF EXISTS "Subscriptions viewable by user" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_delete" ON public.subscriptions;

-- 5. RLS Policies:
-- SELECT: Users can only see their own subscriptions; Admins can see all.
CREATE POLICY "subscriptions_select" ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- INSERT: Authenticated users can ONLY insert 'pending' requests for themselves; Admins can insert directly.
CREATE POLICY "subscriptions_insert" ON public.subscriptions
  FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id AND status = 'pending')
    OR public.is_admin()
  );

-- UPDATE: Only Admins can approve/reject/modify subscriptions.
CREATE POLICY "subscriptions_update" ON public.subscriptions
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- DELETE: Only Admins can delete subscriptions.
CREATE POLICY "subscriptions_delete" ON public.subscriptions
  FOR DELETE
  USING (public.is_admin());
