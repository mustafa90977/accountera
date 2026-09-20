/**
 * document-transaction-engine.js — محرك تدفق المستندات والعمليات التجارية (Document & Transaction Engine v1.0)
 * 
 * المبدأ المعماري رقم 3:
 * Business Event → Document → Transaction → Accounting Treatment → Journal Entry → Ledger → Financial Statements
 * 
 * الطالب لا يبدأ من "شاشة إدخال القيد المجرد"، بل يتعامل مع:
 * 1. الحدث التجاري (Business Event)
 * 2. المستند الرسمي (Document: فاتورة ضريبية، إذن إضافة مخزن، إيصال استلام نقدية)
 * 3. التحقق من التوجيه المحاسبي وضريبة القيمة المضافة (14% VAT) والخصم والتحصيل.
 */

class DocumentTransactionEngine {
  constructor(accountingCore) {
    this.core = accountingCore;
    this.documents = [];
    this.pendingTransactions = [];
  }

  // =========================================================================
  // 1. مولد المستندات الواقعية (Document Factory)
  // =========================================================================
  createTaxInvoice(data) {
    const subtotal = Number(data.subtotal) || 0;
    const vatRate = data.vatRate !== undefined ? data.vatRate : 0.14; // ضريبة القيمة المضافة المصرية 14%
    const vatAmount = Math.round(subtotal * vatRate * 100) / 100;
    const whtRate = data.whtRate || 0; // ضريبة الخصم والتحصيل (1% توريدات / 3% خدمات)
    const whtAmount = Math.round(subtotal * whtRate * 100) / 100;
    const totalDue = subtotal + vatAmount - whtAmount;

    const doc = {
      id: data.id || `INV-${Date.now().toString().slice(-6)}`,
      docType: data.type === 'purchase' ? 'فاتورة شراء ضريبية (Purchase Tax Invoice)' : 'فاتورة بيع ضريبية (Sales Tax Invoice)',
      type: data.type || 'purchase', // 'purchase' | 'sales'
      issueDate: data.date || new Date().toISOString().split('T')[0],
      partyName: data.partyName || (data.type === 'purchase' ? 'شركة الأهرام للتجارة والتوريدات' : 'مؤسسة النيل للتوزيع'),
      taxId: data.taxId || "542-891-304", // رقم التسجيل الضريبي المصري
      commercialRegister: data.commercialRegister || "104920",
      items: data.items || [
        { desc: "أجهزة إلكترونية ومعدات مكتبية", qty: 10, unitPrice: subtotal / 10, total: subtotal }
      ],
      subtotal: subtotal,
      vatRate: vatRate,
      vatAmount: vatAmount,
      whtRate: whtRate,
      whtAmount: whtAmount,
      totalDue: totalDue,
      paymentTerms: data.paymentTerms || 'آجل 30 يوماً (Credit 30 Days)',
      notes: data.notes || 'الفاتورة خاضعة للقانون الضريبي المصري ومعتمدة إلكترونياً.'
    };

    this.documents.push(doc);
    return doc;
  }

  createGoodsReceiptNote(data) {
    const grn = {
      id: data.id || `GRN-${Date.now().toString().slice(-6)}`,
      docType: 'إذن إضافة مخزني (Goods Receipt Note)',
      date: data.date || new Date().toISOString().split('T')[0],
      supplierName: data.supplierName || 'شركة الأهرام للتوريدات',
      poRef: data.poRef || 'PO-2026-081',
      warehouse: data.warehouse || 'مخزن البضاعة التامة الرئيسي (القاهرة)',
      items: data.items || [],
      receivedBy: data.receivedBy || 'أمين المستودع (محمد عبد الرحمن)',
      condition: 'تم الفحص والاستلام بحالة ممتازة ومطابقة للمواصفات.'
    };
    this.documents.push(grn);
    return grn;
  }

  createCashReceiptVoucher(data) {
    const voucher = {
      id: data.id || `CRV-${Date.now().toString().slice(-6)}`,
      docType: 'إيصال استلام نقدية (Cash Receipt Voucher)',
      date: data.date || new Date().toISOString().split('T')[0],
      receivedFrom: data.receivedFrom || 'العميل مؤسسة النيل',
      amount: Number(data.amount) || 0,
      amountInWords: data.amountInWords || 'فقط وقدره المبلغ أعلاه مصرياً لا غير',
      purpose: data.purpose || 'سداد دفعة تحت حساب الفاتورة الضريبية',
      custodian: data.custodian || 'أمين الخزينة الرئيسي'
    };
    this.documents.push(voucher);
    return voucher;
  }

  // =========================================================================
  // 2. تحويل المستند إلى قيد محاسبي نموذجي متوقع (Document to Expected Entry)
  // =========================================================================
  deriveExpectedJournalEntry(doc) {
    if (doc.type === 'purchase') {
      // فاتورة شراء بضاعة بالآجل:
      // من مذكورين:
      // حـ/ مخزون البضاعة (Subtotal)
      // حـ/ مصلحة الضرائب - ضريبة ق.م مدخلات (14% VAT)
      // إلى حـ/ الموردين (Total Due)
      const lines = [
        {
          accountCode: "1105.001",
          accountName: "مخزن البضاعة التامة (القاهرة)",
          acctType: "Asset",
          debit: doc.subtotal,
          credit: 0,
          description: `إثبات شراء بضاعة بموجب فاتورة ضريبية رقم ${doc.id}`
        },
        {
          accountCode: "1106",
          accountName: "مصلحة الضرائب - ضريبة القيمة المضافة مدخلات (14%)",
          acctType: "Asset",
          debit: doc.vatAmount,
          credit: 0,
          description: `ضريبة مدخلات 14% على الفاتورة ${doc.id}`
        }
      ];

      if (doc.whtAmount > 0) {
        // ضريبة الخصم والتحصيل دائن لصالح مصلحة الضرائب (نموذج 41)
        lines.push({
          accountCode: "2103",
          accountName: "مصلحة الضرائب - ضريبة الخصم والتحصيل المستحقة",
          acctType: "Liability",
          debit: 0,
          credit: doc.whtAmount,
          description: `خصم وتحصيل تحت حساب الضريبة (${doc.whtRate * 100}%)`
        });
      }

      lines.push({
        accountCode: "2101.001",
        accountName: `الموردون - ${doc.partyName}`,
        acctType: "Liability",
        debit: 0,
        credit: doc.totalDue,
        description: `استحقاق المورد عن الفاتورة رقم ${doc.id}`
      });

      return {
        ref: doc.id,
        date: doc.issueDate,
        desc: `فاتورة شراء ضريبية من ${doc.partyName}`,
        docRef: doc,
        lines: lines
      };
    } else if (doc.type === 'sales') {
      // فاتورة بيع بضاعة بالآجل:
      // من حـ/ العملاء (Total Due)
      // إلى مذكورين:
      // حـ/ إيرادات المبيعات (Subtotal)
      // حـ/ مصلحة الضرائب - ضريبة ق.م مخرجات (14% Output VAT)
      const lines = [
        {
          accountCode: "1103.001",
          accountName: `العملاء - ${doc.partyName}`,
          acctType: "Asset",
          debit: doc.totalDue,
          credit: 0,
          description: `استحقاق على العميل بموجب فاتورة مبيعات ${doc.id}`
        },
        {
          accountCode: "4101",
          accountName: "إيرادات المبيعات (بضاعة)",
          acctType: "Revenue",
          debit: 0,
          credit: doc.subtotal,
          description: `إيراد مبيعات بضاعة فاتورة ${doc.id}`
        },
        {
          accountCode: "2102",
          accountName: "مصلحة الضرائب - ضريبة القيمة المضافة مخرجات (14%)",
          acctType: "Liability",
          debit: 0,
          credit: doc.vatAmount,
          description: `ضريبة مخرجات مستحقة 14% على الفاتورة ${doc.id}`
        }
      ];

      return {
        ref: doc.id,
        date: doc.issueDate,
        desc: `فاتورة بيع ضريبية لـ ${doc.partyName}`,
        docRef: doc,
        lines: lines
      };
    }

    return null;
  }

  // =========================================================================
  // 3. تقييم تفاعل الطالب مع المستند (Evaluate Document Entry)
  // =========================================================================
  processStudentDocumentSubmission(doc, studentEntry, options = {}) {
    const expected = this.deriveExpectedJournalEntry(doc);
    if (!expected) {
      throw new Error("لا يمكن استخراج التوجيه المحاسبي المتوقع لهذا المستند.");
    }

    // تشغيل محرك التقييم ثماني المستويات في النواة
    const evalReport = this.core.evaluateStudentAttempt(studentEntry, expected);

    if (evalReport.isPassed) {
      // إذا نجح، يتم ترحيل القيد فوراً للنواة وتحديث الأستاذ والميزان
      const posted = this.core.postEntry(studentEntry, {
        postedBy: options.studentId || "student",
        ref: doc.id
      });
      return {
        success: true,
        evalReport: evalReport,
        postedEntry: posted,
        message: "أحسنت! تم إثبات المستند وترحيل القيد بنجاح إلى دفتر اليومية والأستاذ العام وميزان المراجعة."
      };
    } else {
      return {
        success: false,
        evalReport: evalReport,
        message: "يوجد أخطاء في التوجيه المحاسبي للمستند، راجع تشخيص المراجع المحاسبي."
      };
    }
  }
}

if (typeof window !== 'undefined') {
  window.DocumentTransactionEngine = DocumentTransactionEngine;
}
if (typeof module !== 'undefined') {
  module.exports = DocumentTransactionEngine;
}
