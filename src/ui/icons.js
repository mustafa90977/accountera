/**
 * icons.js — مكتبة الأيقونات المتجهة الموحدة لمنصة Accountera (Phosphor Icons Style)
 * متوافقة 100% مع معايير UI/UX Pro Max للمنتجات المالية والـ SaaS
 * سماكة خط 1.5px، أبعاد متسقة، وتوافق تام مع اتجاه القراءة العربي (RTL)
 */

const AccounteraIcons = {
  // 1. الشعار المتجهي الرسمي لـ Accountera (القيد المزدوج والاتزان المالي)
  brand(size = 38) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="accountera-brandmark">
        <defs>
          <linearGradient id="accBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#059669" />
            <stop offset="50%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#06B6D4" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#059669" flood-opacity="0.25" />
          </filter>
        </defs>
        <!-- خلفية الشعار المنحنية بانسيابية -->
        <rect width="40" height="40" rx="11" fill="url(#accBrandGrad)" filter="url(#glow)"/>
        <!-- رمز القيد المزدوج (عمود المدين، عمود الدائن، وجسر الاتزان المحاسبي) -->
        <path d="M12 28V15C12 13.8954 12.8954 13 14 13C15.1046 13 16 13.8954 16 15V28" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <path d="M24 28V15C24 13.8954 24.8954 13 26 13C27.1046 13 28 13.8954 28 15V28" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <!-- جسر الاتزان وقوس التبادل المالي الأنيق -->
        <path d="M14 20H26" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <circle cx="20" cy="11" r="2.5" fill="#FFFFFF"/>
        <!-- نقطة الارتكاز المحاسبية -->
        <path d="M17 28H23" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  },

  // 2. محرك توليد أيقونات Phosphor SVG بسماكة 1.5px
  render(name, options = {}) {
    const size = options.size || 20;
    const cls = options.className || '';
    const strokeWidth = options.strokeWidth || 1.5;

    const paths = {
      // شريط التنقل واللوحات
      'chart-bar': `
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M7 16v-4"/>
        <path d="M12 16v-8"/>
        <path d="M17 16v-6"/>
      `,
      'trend-up': `
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      `,
      'book-open': `
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      `,
      'user': `
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      `,
      'credit-card': `
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      `,
      'target': `
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      `,
      'buildings': `
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <path d="M9 22v-4h6v4"/>
        <line x1="8" y1="6" x2="8.01" y2="6"/>
        <line x1="16" y1="6" x2="16.01" y2="6"/>
        <line x1="8" y1="10" x2="8.01" y2="10"/>
        <line x1="16" y1="10" x2="16.01" y2="10"/>
        <line x1="8" y1="14" x2="8.01" y2="14"/>
        <line x1="16" y1="14" x2="16.01" y2="14"/>
      `,
      'question': `
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      `,
      'house': `
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      `,
      'graduation-cap': `
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 3 3 5 6 5s6-2 6-5v-5"/>
      `,

      // مؤشرات المحاكاة والدفاتر المالية
      'scales': `
        <path d="M12 3v18M6 8l6-2 6 2M6 8l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z"/>
        <path d="M3 21h18"/>
      `,
      'bank': `
        <path d="M3 10h18M3 14h18M3 18h18M4 10v8M8 10v8M12 10v8M16 10v8M20 10v8M12 3L2 8h20l-10-5z"/>
      `,
      'chart-pie': `
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
        <path d="M22 12A10 10 0 0 0 12 2v10z"/>
      `,
      'flame': `
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      `,
      'trophy': `
        <path d="M8 21h8M12 17v4M6 4h12v4a6 6 0 0 1-12 0V4z"/>
        <path d="M6 6H3a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h1M18 6h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-1"/>
      `,
      'star': `
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      `,
      'lightbulb': `
        <path d="M9 18h6M10 22h4M15 13a5 5 0 1 0-6 0c0 2 2 3 2 4h4c0-1 2-2 2-4z"/>
      `,
      'check': `
        <polyline points="20 6 9 17 4 12"/>
      `,
      'check-circle': `
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      `,
      'x': `
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      `,
      'gear': `
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      `,
      'sun': `
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      `,
      'moon': `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      `,
      'arrow-left': `
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      `,
      'arrow-right': `
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      `,
      'bell': `
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      `,
      'file-text': `
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      `,
      'sparkle': `
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
      `
    };

    const inner = paths[name] || paths['file-text'];
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="svg-icon ${cls}" aria-hidden="true">${inner}</svg>`;
  }
};

window.AccounteraIcons = AccounteraIcons;
