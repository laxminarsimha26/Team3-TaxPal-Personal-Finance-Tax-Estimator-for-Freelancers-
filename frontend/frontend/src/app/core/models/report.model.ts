export type ReportType = 'Income Statement' | 'Expense Report' | 'Full Transaction Report';
export type ReportPeriod = 'Current Month' | 'Last Month' | 'Current Quarter' | 'Current Year' | 'Custom Range';
export type ReportFormat = 'PDF' | 'CSV';

export interface GeneratedReport {
  id: string;
  userId: string;
  reportType: ReportType;
  period: ReportPeriod;
  periodLabel: string;   
  format: ReportFormat;
  generatedAt: number;
  startDate: string;    
  endDate: string;
}