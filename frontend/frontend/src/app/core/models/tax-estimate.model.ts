export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface TaxEstimate {
  id: string;
  userId: string;
  quarter: Quarter;
  year: number;
  country: string;
  estimatedTax: number;
  calculatedAt: number; 
}

export interface CalendarEvent {
  title: string;
  date: string;
  description: string;
  badge: 'reminder' | 'payment';
  month: string;
  sortDate: Date;
}