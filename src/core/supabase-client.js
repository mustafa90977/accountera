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
      const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
      const { error } = await this.client
        .from('student_submissions')
        .insert({
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
