const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/ST/.gemini/antigravity/brain/34190040-a0fe-4e39-959e-77b87452da0d/scratch/lessons_extracted/arabic-lesson-to-pdf';
const fixedDir = 'C:/Users/ST/.gemini/antigravity/brain/34190040-a0fe-4e39-959e-77b87452da0d/scratch/lessons_extracted/lessons-fixed/html';
const outDir = 'd:/مشاريع/accountera/data/theory/lessons';
const outIndex = 'd:/مشاريع/accountera/data/theory/theory-index.json';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 38 Lessons Mapping
const LESSONS_CONFIG = [
  // Module 1: أساسيات المحاسبة والدورة المحاسبية
  { num: 1, file: '01-introduction-to-accounting.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 1 },
  { num: 2, file: '02-accounting-cycle.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 2 },
  { num: 3, file: '03-accounting-documents.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 3 },
  { num: 4, file: '04-types-of-accounts.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 4 },
  { num: 14, file: '14-chart-of-accounts.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 5 }, // تم نقله هنا حسب طلب المستخدم
  { num: 5, file: 'debit-and-credit.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 6 },
  { num: 6, file: 'general-journal.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 7 },
  { num: 7, file: '07-general-ledger.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 8 },
  { num: 8, file: '08-trial-balance.html', mod: 1, modTitle: 'الوحدة الأولى: أساسيات المحاسبة والدورة المحاسبية', order: 9 },

  // Module 2: القوائم المالية وإقفال الحسابات
  { num: 9, file: '09-adjusting-revenues-and-expenses.html', mod: 2, modTitle: 'الوحدة الثانية: القوائم المالية وإقفال الحسابات', order: 10, useFixed: true },
  { num: 10, file: '10-income-statement.html', mod: 2, modTitle: 'الوحدة الثانية: القوائم المالية وإقفال الحسابات', order: 11 },
  { num: 11, file: '11-statement-of-changes-in-equity.html', mod: 2, modTitle: 'الوحدة الثانية: القوائم المالية وإقفال الحسابات', order: 12 },
  { num: 12, file: '12-balance-sheet.html', mod: 2, modTitle: 'الوحدة الثانية: القوائم المالية وإقفال الحسابات', order: 13 },
  { num: 13, file: '13-close-accounts.html', mod: 2, modTitle: 'الوحدة الثانية: القوائم المالية وإقفال الحسابات', order: 14 },

  // Module 3: العمليات التمويلية والنقدية والبنكية
  { num: 15, file: '15-capital-accounting.html', mod: 3, modTitle: 'الوحدة الثالثة: العمليات التمويلية والنقدية والبنكية', order: 15 },
  { num: 16, file: '16-owners-drawing-accounting.html', mod: 3, modTitle: 'الوحدة الثالثة: العمليات التمويلية والنقدية والبنكية', order: 16 },
  { num: 17, file: '17-loans-accounting.html', mod: 3, modTitle: 'الوحدة الثالثة: العمليات التمويلية والنقدية والبنكية', order: 17 },
  { num: 18, file: '18-notes-receivable-and-payable-accounting.html', mod: 3, modTitle: 'الوحدة الثالثة: العمليات التمويلية والنقدية والبنكية', order: 18 },
  { num: 19, file: '19-checks-accounting.html', mod: 3, modTitle: 'الوحدة الثالثة: العمليات التمويلية والنقدية والبنكية', order: 19 },
  { num: 20, file: '20-cash-accounting.html', mod: 3, modTitle: 'الوحدة الثالثة: العمليات التمويلية والنقدية والبنكية', order: 20 },
  { num: 21, file: '21-banks-accounting.html', mod: 3, modTitle: 'الوحدة الثالثة: العمليات التمويلية والنقدية والبنكية', order: 21 },

  // Module 4: الأصول الثابتة وإهلاكها
  { num: 22, file: '22-fixed-assets-accounting.html', mod: 4, modTitle: 'الوحدة الرابعة: الأصول الثابتة وإهلاكها', order: 22 },
  { num: 23, file: '23-depreciation-of-fixed-assets-accounting.html', mod: 4, modTitle: 'الوحدة الرابعة: الأصول الثابتة وإهلاكها', order: 23 },
  { num: 24, file: '24-re-evaluation-of-fixed-assets-accounting.html', mod: 4, modTitle: 'الوحدة الرابعة: الأصول الثابتة وإهلاكها', order: 24 },
  { num: 25, file: '25-fixed-asset-disposal-accounting.html', mod: 4, modTitle: 'الوحدة الرابعة: الأصول الثابتة وإهلاكها', order: 25 },

  // Module 5: المخزون والعمليات التجارية والديون
  { num: 26, file: '26-debtors-and-creditors-accounting.html', mod: 5, modTitle: 'الوحدة الخامسة: المخزون والعمليات التجارية والديون', order: 26 },
  { num: 27, file: '27-debts-accounting.html', mod: 5, modTitle: 'الوحدة الخامسة: المخزون والعمليات التجارية والديون', order: 27, useFixed: true },
  { num: 28, file: '28-inventory-accounting.html', mod: 5, modTitle: 'الوحدة الخامسة: المخزون والعمليات التجارية والديون', order: 28 },
  { num: 29, file: '29-purchases-accounting.html', mod: 5, modTitle: 'الوحدة الخامسة: المخزون والعمليات التجارية والديون', order: 29 },
  { num: 30, file: '30-sales-accounting.html', mod: 5, modTitle: 'الوحدة الخامسة: المخزون والعمليات التجارية والديون', order: 30 },
  { num: 31, file: '31-inventory-valuation-accounting.html', mod: 5, modTitle: 'الوحدة الخامسة: المخزون والعمليات التجارية والديون', order: 31, useFixed: true },
  { num: 32, file: '32-financial-statements-in-commercial-companies.html', mod: 5, modTitle: 'الوحدة الخامسة: المخزون والعمليات التجارية والديون', order: 32 },

  // Module 6: الأخطاء المحاسبية والضرائب والاستثمارات
  { num: 33, file: '33-accounting-errors.html', mod: 6, modTitle: 'الوحدة السادسة: الأخطاء المحاسبية والضرائب والاستثمارات', order: 33 },
  { num: 34, file: '34-correcting-accounting-errors.html', mod: 6, modTitle: 'الوحدة السادسة: الأخطاء المحاسبية والضرائب والاستثمارات', order: 34 },
  { num: 35, file: '35-short-term-investments-in-stocks.html', mod: 6, modTitle: 'الوحدة السادسة: الأخطاء المحاسبية والضرائب والاستثمارات', order: 35, useFixed: true },
  { num: 36, file: '36-corporate-income-tax-accounting.html', mod: 6, modTitle: 'الوحدة السادسة: الأخطاء المحاسبية والضرائب والاستثمارات', order: 36, useFixed: true },
  { num: 37, file: '37-individuals-income-tax-accounting.html', mod: 6, modTitle: 'الوحدة السادسة: الأخطاء المحاسبية والضرائب والاستثمارات', order: 37, useFixed: true },
  { num: 38, file: '38-sales-tax-accounting.html', mod: 6, modTitle: 'الوحدة السادسة: الأخطاء المحاسبية والضرائب والاستثمارات', order: 38, useFixed: true }
];

function cleanHtmlText(str) {
  if (!str) return '';
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseJournalTable(tableHtml) {
  // Parse journal table into structured entry
  // Standard columns: المدين | الدائن | البيان | رقم القيد | رقم المستند | صفحة الأستاذ | التاريخ
  const rows = [];
  const trMatches = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  
  let headers = [];
  let dataRows = [];
  
  for (const tr of trMatches) {
    if (tr.includes('<th')) {
      const ths = (tr.match(/<th[\s\S]*?<\/th>/gi) || []).map(th => cleanHtmlText(th));
      if (ths.length > 0) headers = ths;
    } else if (tr.includes('<td')) {
      const tds = (tr.match(/<td[\s\S]*?<\/td>/gi) || []).map(td => {
        const raw = td;
        const text = cleanHtmlText(td);
        const isBold = /class="b"/i.test(td) || /<b>/i.test(td);
        return { text, raw, isBold };
      });
      dataRows.push(tds);
    }
  }

  // Parse lines: debit, credit, account, date, doc, entryNo
  const entries = [];
  let currentEntry = null;

  for (const row of dataRows) {
    // If row has >= 3 columns
    const debitText = row[0] ? row[0].text : '';
    const creditText = row[1] ? row[1].text : '';
    const descText = row[2] ? row[2].text : '';

    const debit = parseFloat(debitText.replace(/,/g, '')) || 0;
    const credit = parseFloat(creditText.replace(/,/g, '')) || 0;

    let account = descText;
    let lineExplanation = '';
    
    // Check if description has explanation like (شراء نقدي)
    const expMatch = descText.match(/\((.*?)\)/);
    if (expMatch) {
      lineExplanation = expMatch[1];
      account = descText.replace(/\(.*?\)/, '').trim();
    }

    const lineType = debit > 0 ? 'debit' : (credit > 0 ? 'credit' : 'info');

    // Extra columns if present: entryNo, docNo, ledgerPage, date
    let entryNo = row[3] ? row[3].text : '';
    let docNo = row[4] ? row[4].text : '';
    let ledgerPage = row[5] ? row[5].text : '';
    let date = row[6] ? row[6].text : '';

    // If starting a new entry or continuing
    if (lineType === 'debit' && (!currentEntry || currentEntry.lines.length >= 2)) {
      if (currentEntry) entries.push(currentEntry);
      currentEntry = {
        type: 'journal_entry',
        entryNumber: entryNo || (entries.length + 1),
        docNumber: docNo || '',
        date: date || '',
        lines: [],
        explanation: lineExplanation
      };
    } else if (!currentEntry) {
      currentEntry = {
        type: 'journal_entry',
        entryNumber: entryNo || '1',
        docNumber: docNo || '',
        date: date || '',
        lines: [],
        explanation: lineExplanation
      };
    }

    if (lineExplanation && !currentEntry.explanation) {
      currentEntry.explanation = lineExplanation;
    }
    if (date && !currentEntry.date) currentEntry.date = date;
    if (entryNo && !currentEntry.entryNumber) currentEntry.entryNumber = entryNo;
    if (docNo && !currentEntry.docNumber) currentEntry.docNumber = docNo;

    currentEntry.lines.push({
      type: lineType,
      account: account,
      debit: debit,
      credit: credit,
      ledgerPage: ledgerPage
    });
  }

  if (currentEntry) entries.push(currentEntry);
  return entries;
}

function parseHtmlIntoBlocks(html) {
  const blocks = [];

  // Extract body content
  const bodyStart = html.indexOf('<body>');
  const bodyEnd = html.indexOf('</body>');
  const bodyHtml = (bodyStart !== -1 && bodyEnd !== -1)
    ? html.substring(bodyStart + 6, bodyEnd)
    : html;

  // Split into top-level sections using regex for tags
  // Regex matches: <h2>, <h3>, <p>, <div class="eq">, <div class="note">, <div class="keep">, <table class="j">, <table class="t-acc">, <table>, <ul>, <ol>, <div class="ex">
  const tagRegex = /<(h[2-3]|p|div|table|ul|ol)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  let lastIndex = 0;

  while ((match = tagRegex.exec(bodyHtml)) !== null) {
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    const inner = match[3];

    // Determine type by tag and attributes
    if (tag === 'h2') {
      blocks.push({
        type: 'heading',
        level: 2,
        text: cleanHtmlText(inner)
      });
    } else if (tag === 'h3') {
      blocks.push({
        type: 'heading',
        level: 3,
        text: cleanHtmlText(inner)
      });
    } else if (tag === 'p') {
      const clean = cleanHtmlText(inner);
      if (clean.length > 0 && !clean.startsWith('Introduction to') && !clean.startsWith('الدورة المحاسبية /')) {
        blocks.push({
          type: 'paragraph',
          text: clean
        });
      }
    } else if (tag === 'div') {
      if (/class=["']eq["']/i.test(attrs)) {
        blocks.push({
          type: 'equation',
          formula: cleanHtmlText(inner),
          text: cleanHtmlText(inner)
        });
      } else if (/class=["']note["']/i.test(attrs) || /class=["']keep["']/i.test(attrs)) {
        blocks.push({
          type: 'note',
          variant: /keep/i.test(attrs) ? 'tip' : 'warning',
          text: cleanHtmlText(inner)
        });
      } else if (/class=["']ex["']/i.test(attrs)) {
        blocks.push({
          type: 'solved_exercise',
          content: inner.trim(),
          text: cleanHtmlText(inner)
        });
      }
    } else if (tag === 'table') {
      if (/class=["']j["']/i.test(attrs)) {
        // Journal entries table!
        const journalEntries = parseJournalTable(match[0]);
        for (const entry of journalEntries) {
          blocks.push(entry);
        }
      } else if (/class=["']t-acc["']/i.test(attrs)) {
        // T-account table
        blocks.push({
          type: 't_account',
          rawHtml: match[0],
          text: cleanHtmlText(inner)
        });
      } else {
        // Regular table
        const rows = [];
        let headers = [];
        const trs = match[0].match(/<tr[\s\S]*?<\/tr>/gi) || [];
        for (const tr of trs) {
          if (tr.includes('<th')) {
            headers = (tr.match(/<th[\s\S]*?<\/th>/gi) || []).map(th => cleanHtmlText(th));
          } else if (tr.includes('<td')) {
            const tds = (tr.match(/<td[\s\S]*?<\/td>/gi) || []).map(td => cleanHtmlText(td));
            rows.push(tds);
          }
        }
        blocks.push({
          type: 'table',
          headers: headers,
          rows: rows
        });
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const items = (inner.match(/<li[\s\S]*?<\/li>/gi) || []).map(li => cleanHtmlText(li));
      if (items.length > 0) {
        blocks.push({
          type: 'list',
          ordered: tag === 'ol',
          items: items
        });
      }
    }
  }

  return blocks;
}

// Main Execution
const indexList = [];

for (const cfg of LESSONS_CONFIG) {
  const filePath = (cfg.useFixed && fs.existsSync(path.join(fixedDir, cfg.file)))
    ? path.join(fixedDir, cfg.file)
    : path.join(srcDir, cfg.file);

  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Extract Title and Subtitle
  const titleMatch = html.match(/<h1>(.*?)<\/h1>/i);
  const title = titleMatch ? cleanHtmlText(titleMatch[1]) : `الدرس ${cfg.num}`;
  
  const subMatch = html.match(/<div class="sub">(.*?)<\/div>/i);
  const sub = subMatch ? cleanHtmlText(subMatch[1]) : '';

  const blocks = parseHtmlIntoBlocks(html);

  const lessonId = `lesson-${String(cfg.num).padStart(2, '0')}`;
  const lessonData = {
    id: lessonId,
    number: cfg.num,
    title: title,
    sub: sub,
    moduleIndex: cfg.mod,
    moduleTitle: cfg.modTitle,
    displayOrder: cfg.order,
    readTimeMinutes: Math.max(5, Math.round(blocks.length * 0.8)),
    blocksCount: blocks.length,
    blocks: blocks
  };

  fs.writeFileSync(path.join(outDir, `${lessonId}.json`), JSON.stringify(lessonData, null, 2), 'utf8');

  indexList.push({
    id: lessonId,
    number: cfg.num,
    title: title,
    sub: sub,
    moduleIndex: cfg.mod,
    moduleTitle: cfg.modTitle,
    displayOrder: cfg.order,
    readTimeMinutes: lessonData.readTimeMinutes,
    blocksCount: blocks.length
  });
}

// Sort index by displayOrder
indexList.sort((a, b) => a.displayOrder - b.displayOrder);

fs.writeFileSync(outIndex, JSON.stringify(indexList, null, 2), 'utf8');
console.log(`Successfully generated ${indexList.length} lessons into ${outDir}`);
console.log(`Successfully generated theory index into ${outIndex}`);
