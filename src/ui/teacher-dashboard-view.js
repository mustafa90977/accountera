/**
 * teacher-dashboard-view.js — لوحة تحكم المعلم لمتابعة الطلاب وتقييم تسليمات المحاكي
 */

const ExcelTeacherDashboard = {
  submissions: [],
  isLoading: false,

  async fetchSubmissions() {
    this.isLoading = true;
    if (typeof SupabaseService !== 'undefined' && SupabaseService.client) {
      try {
        const { data, error } = await SupabaseService.client
          .from('student_submissions')
          .select('*, companies(name, sector)')
          .order('submitted_at', { ascending: false });

        if (!error && data) {
          this.submissions = data;
        }
      } catch (e) {
        console.error('Error fetching submissions for teacher:', e);
      }
    }
    this.isLoading = false;
  },

  render() {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    const teacherName = user ? user.name : 'أستاذ المادة';

    const totalSubs = this.submissions.length;
    const avgScore = totalSubs > 0 
      ? Math.round(this.submissions.reduce((acc, curr) => acc + Number(curr.score || 0), 0) / totalSubs) 
      : 0;
    const balancedCount = this.submissions.filter(s => s.is_balanced).length;

    return [
      '<div style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem;">',
      '  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; padding: 1.8rem; border-radius: 20px; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">',
      '    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">',
      '      <div>',
      '        <span style="background: #3b82f6; color: #fff; padding: 4px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">',
      '          ' + (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('teacher', { size: 14 }) : '') + '',
      '          <span>بوابة المعلم والمشرف الأكاديمي</span>',
      '        </span>',
      '        <h1 style="font-size: 1.6rem; font-weight: 900; margin: 0.6rem 0 0.2rem;">مرحباً، ' + teacherName + '</h1>',
      '        <p style="color: #94a3b8; font-size: 0.95rem; margin: 0;">متابعة فورية لأداء الطلاب في حل القيود المحاسبية وتدقيق أعمال المحاكي.</p>',
      '      </div>',
      '      <button class="btn-cta-secondary" onclick="ExcelTeacherDashboard.refreshData()" style="padding: 10px 16px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 6px;">',
      '        ' + (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('rotate', { size: 14 }) : '') + '',
      '        <span>تحديث البيانات</span>',
      '      </button>',
      '    </div>',
      '    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">',
      '      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 1.2rem; border-radius: 14px; text-align: center;">',
      '        <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.3rem;">إجمالي التسليمات المحاسبية</div>',
      '        <div style="font-size: 1.8rem; font-weight: 800; font-family: monospace; color: #38bdf8;">' + totalSubs + '</div>',
      '      </div>',
      '      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 1.2rem; border-radius: 14px; text-align: center;">',
      '        <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.3rem;">متوسط درجات الطلاب</div>',
      '        <div style="font-size: 1.8rem; font-weight: 800; font-family: monospace; color: #10b981;">' + avgScore + '%</div>',
      '      </div>',
      '      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 1.2rem; border-radius: 14px; text-align: center;">',
      '        <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.3rem;">دفاتر متزنة 100%</div>',
      '        <div style="font-size: 1.8rem; font-weight: 800; font-family: monospace; color: #f59e0b;">' + balancedCount + '</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">',
      '    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">',
      '      <h2 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 8px;">',
      '        ' + (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 20 }) : '') + '',
      '        <span>سجل تسليمات الطلاب من المحاكي</span>',
      '      </h2>',
      '      <span style="font-size: 0.85rem; color: var(--text-secondary);">متزامن مع قاعدة البيانات السحابية</span>',
      '    </div>',
      this.renderSubmissionsTable(),
      '  </div>',
      '</div>'
    ].join('\n');
  },

  renderSubmissionsTable() {
    if (this.isLoading) {
      return '<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">جاري جلب تسليمات الطلاب من السحابة...</div>';
    }

    if (!this.submissions || this.submissions.length === 0) {
      return [
        '<div style="text-align: center; padding: 3.5rem 1rem; background: var(--surface-ground); border-radius: 12px; border: 1px dashed var(--border-subtle);">',
        '  <div style="margin-bottom: 0.5rem; color: var(--text-muted);">' + (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('inbox', { size: 40 }) : '') + '</div>',
        '  <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.3rem;">لا توجد تسليمات حتى الآن</h3>',
        '  <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">ستظهر هنا قيود الطلاب ونتائج فحص ميزان المراجعة فور قيامهم بالتسليم من المحاكي.</p>',
        '</div>'
      ].join('\n');
    }

    const rows = this.submissions.map(sub => {
      const dateStr = new Date(sub.submitted_at).toLocaleDateString('ar-EG');
      const compName = sub.companies ? sub.companies.name : (sub.company_id || 'شركة تجارية');
      const balancedTag = sub.is_balanced 
        ? '<span style="background: rgba(16,185,129,0.1); color: #10b981; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.8rem;">✓ متزن</span>' 
        : '<span style="background: rgba(239,68,68,0.1); color: #ef4444; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.8rem;">✕ غير متزن</span>';

      const compIcon = (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 14 }) + ' ' : '');

      return [
        '<tr style="border-bottom: 1px solid var(--border-subtle);">',
        '  <td style="padding: 12px 8px; color: var(--text-secondary); font-size: 0.85rem;">' + dateStr + '</td>',
        '  <td style="padding: 12px 8px; font-weight: 700; color: var(--text-primary);">' + compIcon + compName + '</td>',
        '  <td style="padding: 12px 8px; font-family: monospace;">' + (sub.completed_tasks || 0) + ' / ' + (sub.total_tasks || 0) + '</td>',
        '  <td style="padding: 12px 8px;">' + balancedTag + '</td>',
        '  <td style="padding: 12px 8px; font-weight: 800; font-family: monospace; color: #3b82f6;">' + (sub.score || 0) + '%</td>',
        '</tr>'
      ].join('\n');
    }).join('\n');

    return [
      '<div style="overflow-x: auto;">',
      '  <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 0.9rem;">',
      '    <thead>',
      '      <tr style="border-bottom: 2px solid var(--border-subtle); color: var(--text-secondary); font-weight: 700;">',
      '        <th style="padding: 12px 8px;">تاريخ التسليم</th>',
      '        <th style="padding: 12px 8px;">الشركة</th>',
      '        <th style="padding: 12px 8px;">المهام المنجزة</th>',
      '        <th style="padding: 12px 8px;">اتزان الدفاتر</th>',
      '        <th style="padding: 12px 8px;">الدرجة</th>',
      '      </tr>',
      '    </thead>',
      '    <tbody>',
      rows,
      '    </tbody>',
      '  </table>',
      '</div>'
    ].join('\n');
  },

  async refreshData() {
    await this.fetchSubmissions();
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = this.render();
    }
  }
};

if (typeof window !== 'undefined') {
  window.ExcelTeacherDashboard = ExcelTeacherDashboard;
}