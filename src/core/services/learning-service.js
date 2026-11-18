/**
 * learning-service.js — طبقة الخدمات السحابية للتعلم والتمارين والمحاكاة (Accountera MVP Persistence Services)
 * تدير:
 * 1. ProgressService: تتبع إتمام الدروس التأسيسية ومزامنتها سحابياً ومحلياً.
 * 2. PracticeService: تسجيل محاولات حل التمارين المستقلة والأمثلة.
 * 3. SimulationService: حفظ واستعادة حالة دفاتر اليومية والأستاذ ومحاكي الشركات.
 * 4. MigrationService: ترحيل آمن وتلقائي لإنجازات الطالب المحلية السابقة عند تسجيل الدخول.
 */

// =========================================================================
// 1. خدمة تقدم الدروس (ProgressService)
// =========================================================================
const ProgressService = {
  completedLessons: new Set(),
  isLoaded: false,

  getAuthUserId() {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    return (user && !user.isDevTest) ? user.id : null;
  },

  async fetchUserProgress() {
    this.completedLessons.clear();

    // 1. تحميل الكاش المحلي أولاً لتفادي بطء الواجهة
    try {
      const local = localStorage.getItem('acc_completed_lessons');
      if (local) {
        JSON.parse(local).forEach(id => this.completedLessons.add(id));
      }
    } catch (e) {}

    // 2. التحقق من السحابة إذا كان المستخدم مصادقاً
    const client = window.SupabaseService?.client;
    const userId = this.getAuthUserId();

    if (client && userId) {
      try {
        const { data, error } = await client
          .from('lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', userId);

        if (!error && Array.isArray(data)) {
          data.forEach(item => {
            if (item.completed) this.completedLessons.add(item.lesson_id);
          });
          // تحديث الكاش المحلي
          localStorage.setItem('acc_completed_lessons', JSON.stringify(Array.from(this.completedLessons)));
        }
      } catch (err) {
        console.warn('[ProgressService] Cloud fetch failed, using local cache:', err);
      }
    }

    this.isLoaded = true;
    return Array.from(this.completedLessons);
  },

  async completeLesson(lessonId) {
    if (!lessonId) return;
    this.completedLessons.add(lessonId);

    // تحديث الكاش المحلي فوراً
    try {
      localStorage.setItem('acc_completed_lessons', JSON.stringify(Array.from(this.completedLessons)));
    } catch (e) {}

    // المزامنة مع السحابة
    const client = window.SupabaseService?.client;
    const userId = this.getAuthUserId();

    if (client && userId) {
      try {
        const { error } = await client
          .from('lesson_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,lesson_id' });

        if (error) throw error;
        console.log(`[ProgressService] ✅ Lesson "${lessonId}" marked completed in cloud.`);
      } catch (err) {
        console.error('[ProgressService] Cloud sync error for lesson completion:', err);
      }
    }

    // إشعار لوحة الطالب للتحديث
    if (typeof ExcelStudentDashboard !== 'undefined' && typeof ExcelStudentDashboard.refresh === 'function') {
      ExcelStudentDashboard.refresh();
    }
  },

  isLessonCompleted(lessonId) {
    if (!this.isLoaded) {
      try {
        const local = localStorage.getItem('acc_completed_lessons');
        if (local) {
          JSON.parse(local).forEach(id => this.completedLessons.add(id));
        }
      } catch(e) {}
    }
    return this.completedLessons.has(lessonId);
  },

  getCompletedCount() {
    return this.completedLessons.size;
  }
};

// =========================================================================
// 2. خدمة محاولات التمارين (PracticeService)
// =========================================================================
const PracticeService = {
  getAuthUserId() {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    return (user && !user.isDevTest) ? user.id : null;
  },

  async recordAttempt(exerciseIdOrObj, exerciseType = 'independent_practice', score = 0, isCorrect = false, answerData = {}) {
    let exerciseId = exerciseIdOrObj;
    if (typeof exerciseIdOrObj === 'object' && exerciseIdOrObj !== null) {
      exerciseId = exerciseIdOrObj.exerciseId;
      exerciseType = exerciseIdOrObj.exerciseType || 'independent_practice';
      score = exerciseIdOrObj.score || 0;
      isCorrect = !!exerciseIdOrObj.isCorrect;
      answerData = exerciseIdOrObj.answerData || {};
    }

    const attempt = {
      exerciseId,
      exerciseType,
      score,
      isCorrect,
      answerData,
      timestamp: new Date().toISOString()
    };

    // حفظ في الكاش المحلي
    try {
      const attempts = JSON.parse(localStorage.getItem('acc_practice_attempts') || '[]');
      attempts.unshift(attempt);
      // الاحتفاظ بآخر 50 محاولة في الكاش
      localStorage.setItem('acc_practice_attempts', JSON.stringify(attempts.slice(0, 50)));
    } catch (e) {}

    // المزامنة مع السحابة
    const client = window.SupabaseService?.client;
    const userId = this.getAuthUserId();

    if (client && userId) {
      try {
        const { error } = await client
          .from('practice_attempts')
          .insert({
            user_id: userId,
            exercise_id: exerciseId,
            exercise_type: exerciseType,
            score: score,
            is_correct: isCorrect,
            answer_data: answerData
          });

        if (error) throw error;
        console.log(`[PracticeService] ✅ Attempt for "${exerciseId}" stored in cloud.`);
      } catch (err) {
        console.error('[PracticeService] Cloud save failed for attempt:', err);
      }
    }

    return attempt;
  },

  async fetchUserAttempts() {
    const client = window.SupabaseService?.client;
    const userId = this.getAuthUserId();

    if (client && userId) {
      try {
        const { data, error } = await client
          .from('practice_attempts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return data;
        }
      } catch (e) {
        console.warn('[PracticeService] Cloud fetch failed, using local cache:', e);
      }
    }

    try {
      return JSON.parse(localStorage.getItem('acc_practice_attempts') || '[]');
    } catch (e) {
      return [];
    }
  },

  getStats() {
    try {
      const attempts = JSON.parse(localStorage.getItem('acc_practice_attempts') || '[]');
      const total = attempts.length;
      const passed = attempts.filter(a => a.isCorrect).length;
      return {
        total,
        passed,
        accuracyRate: total > 0 ? Math.round((passed / total) * 100) : 0
      };
    } catch (e) {
      return { total: 0, passed: 0, accuracyRate: 0 };
    }
  }
};

// =========================================================================
// 3. خدمة محاكاة الشركات (SimulationService)
// =========================================================================
const SimulationService = {
  getAuthUserId() {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    return (user && !user.isDevTest) ? user.id : null;
  },

  async saveProgress(companyId, { journal = [], ledger = {}, profile = {}, modules = {}, score = 0, status = 'in_progress' } = {}) {
    if (!companyId) companyId = 'company-nile';

    // 1. تحديث الذاكرة المحلية مع عزل كاش الشركات (DI-01) ودعم حفظ الحالة الفارغة عند التصفير (DI-02)
    try {
      if (Array.isArray(journal)) {
        localStorage.setItem(`student_journal_${companyId}`, JSON.stringify(journal));
        localStorage.setItem('student_journal', JSON.stringify(journal));
      }
      if (ledger && typeof ledger === 'object') {
        localStorage.setItem(`student_ledger_${companyId}`, JSON.stringify(ledger));
        localStorage.setItem('student_ledger', JSON.stringify(ledger));
      }
      if (profile && typeof profile === 'object') {
        localStorage.setItem(`sim_company_profile_${companyId}`, JSON.stringify(profile));
        localStorage.setItem('sim_company_profile', JSON.stringify(profile));
      }
    } catch (e) {}

    // 2. المزامنة مع السحابة
    const client = window.SupabaseService?.client;
    const userId = this.getAuthUserId();

    if (client && userId) {
      try {
        const postedEntries = (journal || []).filter(j => j.status === 'posted');
        const { error } = await client
          .from('simulation_progress')
          .upsert({
            user_id: userId,
            company_id: companyId,
            current_operation: journal.length > 0 ? (journal[journal.length - 1].ref || 'TRX') : null,
            completed_operations: postedEntries.length,
            score: score || (postedEntries.length * 10),
            status: status,
            state_data: { journal, ledger, profile, modules },
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,company_id' });

        if (error) throw error;
        console.log(`[SimulationService] ✅ Simulation state for "${companyId}" synced to cloud.`);
      } catch (err) {
        console.error('[SimulationService] Cloud sync error for simulation:', err);
      }
    }
  },

  async loadProgress(companyId) {
    if (!companyId) companyId = 'company-nile';
    const client = window.SupabaseService?.client;
    const userId = this.getAuthUserId();

    if (client && userId) {
      try {
        const { data, error } = await client
          .from('simulation_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId)
          .maybeSingle();

        if (!error && data && data.state_data) {
          const { journal, ledger, profile, modules } = data.state_data;
          if (journal && Array.isArray(journal)) {
            localStorage.setItem('student_journal', JSON.stringify(journal));
            localStorage.setItem(`student_journal_${companyId}`, JSON.stringify(journal));
          }
          if (ledger) {
            localStorage.setItem('student_ledger', JSON.stringify(ledger));
            localStorage.setItem(`student_ledger_${companyId}`, JSON.stringify(ledger));
          }
          if (profile) {
            localStorage.setItem('sim_company_profile', JSON.stringify(profile));
            localStorage.setItem(`sim_company_profile_${companyId}`, JSON.stringify(profile));
          }
          // استعادة الوحدات المحاسبية الإضافية (البنك، المخزون، الخزينة، الإقفال)
          if (modules && typeof modules === 'object') {
            if (modules.bankReconciliation) {
              const br = modules.bankReconciliation;
              if (br.items) localStorage.setItem('bank_statement_items', JSON.stringify(br.items));
              if (br.caseData) localStorage.setItem('sim_bank_recon_case', JSON.stringify(br.caseData));
              if (br.bookMatches) {
                Object.keys(br.bookMatches).forEach(k => localStorage.setItem(k, br.bookMatches[k]));
              }
            }
            if (modules.inventoryCount) {
              localStorage.setItem('sim_inventory_items_state', JSON.stringify(modules.inventoryCount));
            }
            if (modules.cashCount) {
              if (modules.cashCount.bookBalance != null) localStorage.setItem('sim_cash_book_balance', String(modules.cashCount.bookBalance));
              if (modules.cashCount.denomCounts) localStorage.setItem('sim_cash_denom_counts', JSON.stringify(modules.cashCount.denomCounts));
            }
            if (modules.closing && modules.closing.januaryClosed) {
              localStorage.setItem('january_closed', 'true');
            }
          }
          console.log(`[SimulationService] ✅ Loaded comprehensive remote simulation state for "${companyId}".`);
          return data;
        }
      } catch (err) {
        console.warn('[SimulationService] Remote state fetch failed, falling back to local cache:', err);
      }
    }

    // استرجاع الكاش المحلي المعزول بالشركة (DI-01)
    try {
      const scopedJournal = localStorage.getItem(`student_journal_${companyId}`);
      const scopedLedger = localStorage.getItem(`student_ledger_${companyId}`);
      const scopedProfile = localStorage.getItem(`sim_company_profile_${companyId}`);

      let journal = scopedJournal ? JSON.parse(scopedJournal) : null;
      let ledger = scopedLedger ? JSON.parse(scopedLedger) : null;
      let profile = scopedProfile ? JSON.parse(scopedProfile) : null;

      // Fallback للكاش العام فقط إذا كان البروفايل يخص نفس الشركة
      if (!journal || !ledger) {
        const legacyProfile = JSON.parse(localStorage.getItem('sim_company_profile') || '{}');
        if (legacyProfile.id === companyId) {
          journal = journal || JSON.parse(localStorage.getItem('student_journal') || '[]');
          ledger = ledger || JSON.parse(localStorage.getItem('student_ledger') || '{}');
          profile = profile || legacyProfile;
        } else {
          journal = journal || [];
          ledger = ledger || {};
          profile = profile || { id: companyId };
        }
      }

      return {
        company_id: companyId,
        state_data: { journal, ledger, profile }
      };
    } catch (e) {
      return null;
    }
  },

  getSimStats() {
    try {
      const journal = JSON.parse(localStorage.getItem('student_journal') || '[]');
      const posted = journal.filter(j => j.status === 'posted');
      return {
        totalOperations: journal.length,
        completedOperations: posted.length,
        isStarted: journal.length > 0
      };
    } catch (e) {
      return { totalOperations: 0, completedOperations: 0, isStarted: false };
    }
  }
};

// =========================================================================
// 4. خدمة ترحيل البيانات السابقة (MigrationService)
// =========================================================================
const MigrationService = {
  hasMigrated: false,

  async migrateLegacyLocalStorage() {
    if (this.hasMigrated) return;
    const userId = ProgressService.getAuthUserId();
    if (!userId) return;

    console.log('[MigrationService] 🚀 Checking for legacy local progress to migrate to cloud...');

    try {
      // 1. ترحيل الدروس المكتملة محلياً
      const localLessons = localStorage.getItem('acc_completed_lessons');
      if (localLessons) {
        const lessons = JSON.parse(localLessons);
        if (Array.isArray(lessons) && lessons.length > 0) {
          console.log(`[MigrationService] Migrating ${lessons.length} local lesson(s) to cloud...`);
          for (const lId of lessons) {
            await ProgressService.completeLesson(lId);
          }
        }
      }

      // 2. ترحيل قيود المحاكي المحلية
      const localJournal = localStorage.getItem('student_journal');
      if (localJournal) {
        const journal = JSON.parse(localJournal);
        if (Array.isArray(journal) && journal.length > 0) {
          const profile = JSON.parse(localStorage.getItem('sim_company_profile') || '{}');
          const ledger = JSON.parse(localStorage.getItem('student_ledger') || '{}');
          const companyId = profile.id || 'company-nile';

          console.log(`[MigrationService] Migrating ${journal.length} local journal entries for "${companyId}" to cloud...`);
          await SimulationService.saveProgress(companyId, { journal, ledger, profile });
        }
      }

      this.hasMigrated = true;
      console.log('[MigrationService] ✅ Legacy migration completed successfully.');
    } catch (err) {
      console.warn('[MigrationService] Warning during legacy data migration:', err);
    }
  }
};

// تصدير الخدمات في بيئة المتصفح و Node.js
if (typeof window !== 'undefined') {
  window.ProgressService = ProgressService;
  window.PracticeService = PracticeService;
  window.SimulationService = SimulationService;
  window.MigrationService = MigrationService;
}
if (typeof module !== 'undefined') {
  module.exports = {
    ProgressService,
    PracticeService,
    SimulationService,
    MigrationService
  };
}
