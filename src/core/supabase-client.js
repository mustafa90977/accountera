/**
 * supabase-client.js — عميل وقناة الاتصال بـ Supabase لمزامنة المنصة والمحاكي
 */

const SUPABASE_CONFIG = {
  url: 'https://febtyvnwhjjnvalzwyov.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnR5dm53aGpqbnZhbHp3eW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDA1MjksImV4cCI6MjEwNTMxNjUyOX0.bB_S0mrsno2ZatF6VdpN1krpyV9op3-A1L1scWXOBgE'
};

const SupabaseService = {
  client: null,

  init() {
    if (typeof window.supabase !== 'undefined') {
      this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('[Supabase] Connected to remote instance:', SUPABASE_CONFIG.url);
      this.syncInitialData();
    } else {
      console.warn('[Supabase] SDK not loaded globally. Operating in offline/localStorage mode.');
    }
  },

  // جلب الشركات من قاعدة البيانات وتحديث التخزين المحلي
  async getCompanies() {
    if (!this.client) {
      const local = localStorage.getItem('acc_admin_companies');
      return local ? JSON.parse(local) : null;
    }

    try {
      const { data, error } = await this.client
        .from('companies')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        localStorage.setItem('acc_admin_companies', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching companies from Supabase:', err);
      const local = localStorage.getItem('acc_admin_companies');
      return local ? JSON.parse(local) : null;
    }
  },

  // حفظ/تحديث شركة في قاعدة البيانات السحابية
  async saveCompany(company) {
    if (!this.client) return;

    try {
      const { data, error } = await this.client
        .from('companies')
        .upsert({
          id: company.id,
          name: company.name,
          sector: company.sector,
          badge: company.badge,
          icon: company.icon,
          role: company.role,
          description: company.description,
          month: company.month,
          transactions: company.transactions || [],
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('✅ Company synced with Supabase cloud:', company.name);
    } catch (err) {
      console.error('Error syncing company to Supabase:', err);
    }
  },

  // حذف شركة من قاعدة البيانات السحابية
  async deleteCompany(companyId) {
    if (!this.client || !companyId) return;

    try {
      const { error } = await this.client
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
      console.log('✅ Company deleted from Supabase cloud:', companyId);
    } catch (err) {
      console.error('Error deleting company from Supabase:', err);
    }
  },

  // حفظ تسليم الطالب للقيود والنتائج من المحاكي
  async submitStudentWork({ companyId, studentJournal, score, totalTasks, completedTasks, isBalanced }) {
    if (!this.client) return;

    try {
      let authUserId = null;
      if (this.client.auth) {
        const { data: { session } } = await this.client.auth.getSession();
        if (session && session.user) {
          authUserId = session.user.id;
        }
      }

      if (!authUserId) {
        console.warn('[Supabase] Submission not synced to cloud: User is not authenticated.');
        return;
      }

      const { error } = await this.client
        .from('student_submissions')
        .insert({
          user_id: authUserId,
          company_id: companyId,
          student_journal: studentJournal,
          score: score,
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          is_balanced: isBalanced
        });

      if (error) throw error;
      console.log('✅ Student submission stored in Supabase.');
    } catch (err) {
      console.error('Error storing submission in Supabase:', err);
    }
  },

  // جلب الاشتراك النشط للمستخدم (حيث status = 'active' والوقت لم ينتهِ بعد)
  async getUserActiveSubscription(userId) {
    if (!this.client || !userId) return null;
    try {
      const now = new Date().toISOString();
      const { data, error } = await this.client
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order('activated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('[Supabase] Error fetching active subscription:', error);
        return null;
      }
      return (data && data.length > 0) ? data[0] : null;
    } catch (err) {
      console.error('[Supabase] getUserActiveSubscription exception:', err);
      return null;
    }
  },

  // جلب الطلب المعلق للمستخدم إن وجد
  async getUserPendingSubscription(userId) {
    if (!this.client || !userId) return null;
    try {
      const { data, error } = await this.client
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false })
        .limit(1);

      if (error) return null;
      return (data && data.length > 0) ? data[0] : null;
    } catch (err) {
      return null;
    }
  },

  // إرسال طلب اشتراك / ترقية جديد بحالة pending فقط
  async requestSubscription(planId) {
    if (!this.client) throw new Error('عميل Supabase غير متصل');
    
    // جلب معرف المستخدم الحالي من الجلسة
    let authUserId = null;
    if (this.client.auth) {
      const { data: { session } } = await this.client.auth.getSession();
      if (session && session.user) {
        authUserId = session.user.id;
      }
    }

    if (!authUserId) {
      throw new Error('يجب تسجيل الدخول أولاً لإرسال طلب الترقية.');
    }

    // التحقق أولاً من عدم وجود طلب معلق مسبقاً
    const pending = await this.getUserPendingSubscription(authUserId);
    if (pending) {
      throw new Error('لديك بالفعل طلب ترقية معلق قيد المراجعة لدى الإدارة.');
    }

    const { data, error } = await this.client
      .from('subscriptions')
      .insert({
        user_id: authUserId,
        plan_id: planId,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error requesting subscription:', error);
      throw error;
    }

    console.log('✅ Subscription request created with pending status:', data);
    return data;
  },

  // جلب كافة طلبات الترقية المعلقة (متاح لمدير النظام Admin فقط عبر RLS)
  async getPendingSubscriptions() {
    if (!this.client) return [];
    try {
      const { data, error } = await this.client
        .from('subscriptions')
        .select(`
          id,
          user_id,
          plan_id,
          status,
          requested_at,
          expires_at,
          profiles:user_id (
            id,
            email,
            full_name,
            role
          )
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[Supabase] getPendingSubscriptions error:', err);
      return [];
    }
  },

  // اعتماد وتفعيل اشتراك الطالب من قبل الأدمن
  async approveSubscription(subscriptionId, durationDays = 30) {
    if (!this.client) throw new Error('عميل Supabase غير متصل');

    let adminId = null;
    if (this.client.auth) {
      const { data: { session } } = await this.client.auth.getSession();
      if (session && session.user) {
        adminId = session.user.id;
      }
    }

    const now = new Date();
    const expiresAt = durationDays > 0 
      ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await this.client
      .from('subscriptions')
      .update({
        status: 'active',
        activated_at: now.toISOString(),
        activated_by: adminId,
        expires_at: expiresAt
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Subscription approved successfully:', data);
    return data;
  },

  // رفض طلب ترقية الطالب
  async rejectSubscription(subscriptionId) {
    if (!this.client) throw new Error('عميل Supabase غير متصل');

    const { data, error } = await this.client
      .from('subscriptions')
      .update({
        status: 'rejected'
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    console.log('✅ Subscription rejected successfully:', data);
    return data;
  },

  // مزامنة الشركات الافتراضية لأول مرة إذا كانت قاعدة البيانات فارغة
  async syncInitialData() {
    try {
      const companies = await this.getCompanies();
      if (!companies || companies.length === 0) {
        if (typeof DEFAULT_ADMIN_COMPANIES !== 'undefined' && DEFAULT_ADMIN_COMPANIES.length > 0) {
          console.log('[Supabase] Initializing cloud database with default companies...');
          for (const comp of DEFAULT_ADMIN_COMPANIES) {
            await this.saveCompany(comp);
          }
        }
      }
    } catch (e) {
      console.warn('Initial sync completed with fallback.');
    }
  }
};

if (typeof window !== 'undefined') {
  window.SupabaseService = SupabaseService;
}
