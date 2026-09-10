import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../models/transaction.model';
import { GeneratedReport, ReportType, ReportPeriod, ReportFormat } from '../models/report.model';
import { AuthService } from './auth.service';
import { TransactionService } from './transaction.service';

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transactionCount: number;
  byCategory: { category: string; type: string; amount: number }[];
}

interface CreateReportResponse {
  success: boolean;
  message: string;
  reportId: number;
}

interface DeleteReportResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly STORAGE_KEY = 'taxpal_generated_reports';
  private readonly API_URL = 'https://team3-taxpal-personal-finance-tax.onrender.com/api/reports';
  private allReports = signal<GeneratedReport[]>(this.load());

  constructor(
    private auth: AuthService,
    private txService: TransactionService,
    private http: HttpClient
  ) {}

  private load(): GeneratedReport[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(reports: GeneratedReport[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
  }

  myReports(): GeneratedReport[] {
    const userId = this.auth.currentUser()?.id;
    return this.allReports()
      .filter(r => r.userId === userId)
      .sort((a, b) => b.generatedAt - a.generatedAt);
  }

  private computeRange(
    period: ReportPeriod,
    customStart?: string,
    customEnd?: string
  ): { start: string; end: string; label: string } {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();

    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = (yy: number, mm: number, dd: number) =>
      `${yy}-${pad(mm + 1)}-${pad(dd)}`;

    switch (period) {
      case 'Current Month': {
        const lastDay = new Date(y, m + 1, 0).getDate();

        return {
          start: dateStr(y, m, 1),
          end: dateStr(y, m, lastDay),
          label: today.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })
        };
      }

      case 'Last Month': {
        const lm = m === 0 ? 11 : m - 1;
        const ly = m === 0 ? y - 1 : y;
        const lastDay = new Date(ly, lm + 1, 0).getDate();

        return {
          start: dateStr(ly, lm, 1),
          end: dateStr(ly, lm, lastDay),
          label: new Date(ly, lm, 1).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })
        };
      }

      case 'Current Quarter': {
        const qStart = Math.floor(m / 3) * 3;
        const qEnd = qStart + 2;
        const lastDay = new Date(y, qEnd + 1, 0).getDate();

        return {
          start: dateStr(y, qStart, 1),
          end: dateStr(y, qEnd, lastDay),
          label: `Q${Math.floor(m / 3) + 1} ${y}`
        };
      }

      case 'Current Year':
        return {
          start: `${y}-01-01`,
          end: `${y}-12-31`,
          label: `Year ${y}`
        };

      case 'Custom Range':
        return {
          start: customStart ?? `${y}-01-01`,
          end: customEnd ?? dateStr(y, m, today.getDate()),
          label: `${customStart ?? '...'} to ${customEnd ?? '...'}`
        };
    }
  }

  getFilteredTransactions(
    reportType: ReportType,
    start: string,
    end: string
  ): Transaction[] {
    const all = this.txService
      .transactions()
      .filter(t => t.date >= start && t.date <= end);

    if (reportType === 'Income Statement') {
      return all.filter(t => t.type === 'income');
    }

    if (reportType === 'Expense Report') {
      return all.filter(t => t.type === 'expense');
    }

    return all;
  }

  buildSummary(transactions: Transaction[]): ReportSummary {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    const grouped = new Map<string, { type: string; amount: number }>();

    for (const t of transactions) {
      const key = `${t.type}:${t.category}`;
      const existing = grouped.get(key);

      grouped.set(key, {
        type: t.type,
        amount: (existing?.amount ?? 0) + t.amount
      });
    }

    const byCategory = Array.from(grouped.entries()).map(([key, val]) => ({
      category: key.split(':')[1],
      type: val.type,
      amount: val.amount
    }));

    return {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      transactionCount: transactions.length,
      byCategory
    };
  }

  async generateReport(
    reportType: ReportType,
    period: ReportPeriod,
    format: ReportFormat,
    customStart?: string,
    customEnd?: string
  ): Promise<GeneratedReport> {
    const userId = this.auth.currentUser()?.id ?? '';
    const range = this.computeRange(period, customStart, customEnd);

    const response = await this.http.post<CreateReportResponse>(
      this.API_URL,
      {
        period,
        report_type: reportType,
        format,
        file_path: null
      },
      {
        withCredentials: true
      }
    ).toPromise();

    if (!response?.success || !response.reportId) {
      throw new Error('Failed to save report');
    }

    const report: GeneratedReport = {
      id: response.reportId.toString(),
      userId,
      reportType,
      period,
      periodLabel: range.label,
      format,
      generatedAt: Date.now(),
      startDate: range.start,
      endDate: range.end
    };

    const updated = [...this.allReports(), report];

    this.allReports.set(updated);
    this.persist(updated);

    return report;
  }

  async deleteReport(id: string): Promise<void> {
    await this.http.delete<DeleteReportResponse>(
      `${this.API_URL}/${id}`,
      {
        withCredentials: true
      }
    ).toPromise();

    const updated = this.allReports().filter(r => r.id !== id);

    this.allReports.set(updated);
    this.persist(updated);
  }

  exportCSV(transactions: Transaction[], filename: string): void {
    const header = ['Date', 'Type', 'Category', 'Amount'];

    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount.toFixed(2)
    ]);

    const csvContent = [header, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    this.downloadBlob(blob, `${filename}.csv`);
  }

  exportPDF(
    transactions: Transaction[],
    summary: ReportSummary,
    reportType: string,
    periodLabel: string,
    userName: string,
    filename: string
  ): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`TaxPal — ${reportType}`, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Period: ${periodLabel}`, 14, 28);
    doc.text(`Generated for: ${userName}`, 14, 33);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      38
    );

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Summary', 14, 48);

    autoTable(doc, {
      startY: 52,
      head: [['Metric', 'Amount']],
      body: [
        ['Total Income', summary.totalIncome.toFixed(2)],
        ['Total Expenses', summary.totalExpense.toFixed(2)],
        ['Net Savings', summary.netSavings.toFixed(2)],
        ['Transaction Count', summary.transactionCount.toString()]
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [47, 111, 237]
      }
    });

    const y1 = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text('Category Breakdown', 14, y1);

    autoTable(doc, {
      startY: y1 + 4,
      head: [['Category', 'Type', 'Amount']],
      body: summary.byCategory.map(c => [
        c.category,
        c.type,
        c.amount.toFixed(2)
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [47, 111, 237]
      }
    });

    const y2 = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text('Transactions', 14, y2);

    autoTable(doc, {
      startY: y2 + 4,
      head: [['Date', 'Type', 'Category', 'Amount']],
      body: transactions.map(t => [
        t.date,
        t.type,
        t.category,
        t.amount.toFixed(2)
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: [47, 111, 237]
      }
    });

    doc.save(`${filename}.pdf`);
  }

  printReport(
    transactions: Transaction[],
    summary: ReportSummary,
    reportType: string,
    periodLabel: string,
    userName: string
  ): void {
    const win = window.open('', '_blank');

    if (!win) return;

    const rows = transactions
      .map(
        t =>
          `<tr><td>${t.date}</td><td>${t.type}</td><td>${t.category}</td><td>${t.amount.toFixed(2)}</td></tr>`
      )
      .join('');

    const catRows = summary.byCategory
      .map(
        c =>
          `<tr><td>${c.category}</td><td>${c.type}</td><td>${c.amount.toFixed(2)}</td></tr>`
      )
      .join('');

    win.document.write(`
      <html>
        <head>
          <title>${reportType} - ${periodLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; color: #222; }
            h1 { font-size: 1.4rem; }
            h2 { font-size: 1.1rem; margin-top: 1.5rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
            th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; font-size: 0.85rem; }
            th { background: #2f6fed; color: #fff; }
          </style>
        </head>
        <body>
          <h1>TaxPal — ${reportType}</h1>
          <p>
            Period: ${periodLabel}
            &nbsp;|&nbsp;
            Generated for: ${userName}
            &nbsp;|&nbsp;
            Generated on: ${new Date().toLocaleDateString()}
          </p>

          <h2>Summary</h2>

          <table>
            <tr><th>Metric</th><th>Amount</th></tr>
            <tr><td>Total Income</td><td>${summary.totalIncome.toFixed(2)}</td></tr>
            <tr><td>Total Expenses</td><td>${summary.totalExpense.toFixed(2)}</td></tr>
            <tr><td>Net Savings</td><td>${summary.netSavings.toFixed(2)}</td></tr>
            <tr><td>Transaction Count</td><td>${summary.transactionCount}</td></tr>
          </table>

          <h2>Category Breakdown</h2>

          <table>
            <tr><th>Category</th><th>Type</th><th>Amount</th></tr>
            ${catRows}
          </table>

          <h2>Transactions</h2>

          <table>
            <tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th></tr>
            ${rows}
          </table>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }
}