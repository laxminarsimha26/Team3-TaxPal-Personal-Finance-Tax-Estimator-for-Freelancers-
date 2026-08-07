export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  month: string; // 'YYYY-MM', e.g. '2026-08'
}