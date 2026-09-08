import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';
import { GeneratedReport, ReportType, ReportPeriod, ReportFormat } from '../../core/models/report.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  reportTypes: ReportType[] = [
    'Income Statement',
    'Expense Report',
    'Full Transaction Report'
  ];

  periods: ReportPeriod[] = [
    'Current Month',
    'Last Month',
    'Current Quarter',
    'Current Year',
    'Custom Range'
  ];

  formats: ReportFormat[] = ['PDF', 'CSV'];

  reportType: ReportType = 'Income Statement';
  period: ReportPeriod = 'Current Month';
  format: ReportFormat = 'PDF';
  customStart = '';
  customEnd = '';

  selectedReport = signal<GeneratedReport | null>(null);

  constructor(
    public reportService: ReportService,
    private auth: AuthService
  ) {}

  recentReports = computed(() => this.reportService.myReports());

  onReset(): void {
    this.reportType = 'Income Statement';
    this.period = 'Current Month';
    this.format = 'PDF';
    this.customStart = '';
    this.customEnd = '';
  }

  async onGenerateReport(): Promise<void> {
    try {
      const report = await this.reportService.generateReport(
        this.reportType,
        this.period,
        this.format,
        this.customStart,
        this.customEnd
      );

      this.selectedReport.set(report);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to save report. Please try again.');
    }
  }

  onPreview(report: GeneratedReport): void {
    this.selectedReport.set(report);
  }

  async onDelete(report: GeneratedReport, event: Event): Promise<void> {
    event.stopPropagation();

    try {
      await this.reportService.deleteReport(report.id);

      if (this.selectedReport()?.id === report.id) {
        this.selectedReport.set(null);
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report. Please try again.');
    }
  }

  private dataFor(report: GeneratedReport) {
    const transactions = this.reportService.getFilteredTransactions(
      report.reportType,
      report.startDate,
      report.endDate
    );

    const summary = this.reportService.buildSummary(transactions);

    return {
      transactions,
      summary
    };
  }

  get previewSummary() {
    const report = this.selectedReport();

    if (!report) {
      return null;
    }

    return this.dataFor(report).summary;
  }

  onDownload(report: GeneratedReport): void {
    const { transactions, summary } = this.dataFor(report);

    const filename = `taxpal-${report.reportType
      .toLowerCase()
      .replace(/\s+/g, '-')}-${report.startDate}-to-${report.endDate}`;

    if (report.format === 'CSV') {
      this.reportService.exportCSV(transactions, filename);
    } else {
      const userName = this.auth.currentUser()?.name ?? 'User';

      this.reportService.exportPDF(
        transactions,
        summary,
        report.reportType,
        report.periodLabel,
        userName,
        filename
      );
    }
  }

  onPrint(report: GeneratedReport): void {
    const { transactions, summary } = this.dataFor(report);
    const userName = this.auth.currentUser()?.name ?? 'User';

    this.reportService.printReport(
      transactions,
      summary,
      report.reportType,
      report.periodLabel,
      userName
    );
  }
}