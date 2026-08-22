import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ALL_COUNTRIES } from '../data/countries';
import { Quarter, TaxEstimate, CalendarEvent } from '../models/tax-estimate.model';

interface TaxBracket {
  upTo: number;
  rate: number;
}

// ============================================================
// UNITED STATES — real 2026 IRS figures (IRS Rev. Proc. 2025-32)
// Verify current-year numbers at irs.gov before actual filing —
// these adjust for inflation every year.
// ============================================================
const US_STANDARD_DEDUCTION: Record<string, number> = {
  Single: 16100,
  Married: 32200,
};

const US_BRACKETS: Record<string, TaxBracket[]> = {
  Single: [
    { upTo: 12400, rate: 0.10 },
    { upTo: 50400, rate: 0.12 },
    { upTo: 107475, rate: 0.22 },
    { upTo: 205250, rate: 0.24 },
    { upTo: 260600, rate: 0.32 },
    { upTo: 651350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  Married: [
    { upTo: 24800, rate: 0.10 },
    { upTo: 100800, rate: 0.12 },
    { upTo: 214950, rate: 0.22 },
    { upTo: 410500, rate: 0.24 },
    { upTo: 521200, rate: 0.32 },
    { upTo: 768700, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

const SE_TAX_SS_WAGE_BASE = 184500;   // 2026 Social Security wage base
const SE_TAX_SS_RATE = 0.124;         // Social Security portion
const SE_TAX_MEDICARE_RATE = 0.029;   // Medicare portion (uncapped)
const SE_NET_EARNINGS_FACTOR = 0.9235; // only 92.35% of net profit is subject to SE tax

// ============================================================
// OTHER COUNTRIES — simplified progressive brackets
// (illustrative only, not verified against current official tables)
// ============================================================
const SIMPLIFIED_SLABS: Record<string, TaxBracket[]> = {
  India: [
    { upTo: 300000, rate: 0 },
    { upTo: 600000, rate: 0.05 },
    { upTo: 900000, rate: 0.10 },
    { upTo: 1200000, rate: 0.15 },
    { upTo: 1500000, rate: 0.20 },
    { upTo: Infinity, rate: 0.30 },
  ],
  'United Kingdom': [
    { upTo: 12570, rate: 0 },
    { upTo: 50270, rate: 0.20 },
    { upTo: 125140, rate: 0.40 },
    { upTo: Infinity, rate: 0.45 },
  ],
};

const STATES: Record<string, string[]> = {
  'United States': ['California', 'New York', 'Texas', 'Florida', 'Other'],
  India: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Other'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
};

const QUARTER_LABELS: Record<Quarter, string> = {
  Q1: 'Q1 (Jan-Mar)', Q2: 'Q2 (Apr-Jun)', Q3: 'Q3 (Jul-Sep)', Q4: 'Q4 (Oct-Dec)',
};
const QUARTER_DUE_MONTH: Record<Quarter, number> = { Q1: 2, Q2: 5, Q3: 8, Q4: 11 };

export interface USCalculationResult {
  method: 'us-detailed';
  netProfit: number;
  selfEmploymentTax: number;
  adjustedGrossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  incomeTax: number;
  totalAnnualTax: number;
  quarterlyTaxDue: number;
  safeHarborQuarterly: number;
  effectiveRate: number;
}

export interface SimpleCalculationResult {
  method: 'simplified';
  totalDeductions: number;
  taxableQuarterly: number;
  annualizedTaxable: number;
  annualTax: number;
  quarterlyTax: number;
  effectiveRate: number;
  usedGenericRate: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaxService {
  private readonly STORAGE_KEY = 'taxpal_tax_estimates';
  countries = ALL_COUNTRIES;
  filingStatuses = ['Single', 'Married'];
  allQuarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];

  private allEstimates = signal<TaxEstimate[]>(this.load());

  constructor(private auth: AuthService) {}

  statesFor(country: string): string[] {
    return STATES[country] ?? [];
  }

  quarterLabel(quarter: Quarter, year: number): string {
    return `${QUARTER_LABELS[quarter]} ${year}`;
  }

  usesDetailedMethod(country: string): boolean {
    return country === 'United States';
  }

  hasDetailedSlabs(country: string): boolean {
    return !!SIMPLIFIED_SLABS[country];
  }

  private load(): TaxEstimate[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(estimates: TaxEstimate[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(estimates));
  }

  private applyBrackets(taxableIncome: number, brackets: TaxBracket[]): number {
    let tax = 0;
    let previousLimit = 0;
    for (const b of brackets) {
      if (taxableIncome <= previousLimit) break;
      const taxableInBracket = Math.min(taxableIncome, b.upTo) - previousLimit;
      tax += taxableInBracket * b.rate;
      previousLimit = b.upTo;
    }
    return tax;
  }

  // Real US 1099/freelancer calculation
  calculateUS(input: {
    grossIncome: number;
    businessExpenses: number;
    homeOfficeDeduction: number;
    retirementContributions: number;
    healthInsurancePremiums: number;
    filingStatus: string;
  }): USCalculationResult {
    const annualGross = input.grossIncome * 4;
    const annualBusinessExpenses = input.businessExpenses * 4;
    const annualHomeOffice = input.homeOfficeDeduction * 4;
    const annualRetirement = input.retirementContributions * 4;
    const annualHealthInsurance = input.healthInsurancePremiums * 4;

    const netProfit = Math.max(0, annualGross - annualBusinessExpenses - annualHomeOffice);

    const seTaxableEarnings = netProfit * SE_NET_EARNINGS_FACTOR;
    const ssPortion = Math.min(seTaxableEarnings, SE_TAX_SS_WAGE_BASE) * SE_TAX_SS_RATE;
    const medicarePortion = seTaxableEarnings * SE_TAX_MEDICARE_RATE;
    const selfEmploymentTax = ssPortion + medicarePortion;

    const halfSeTaxDeduction = selfEmploymentTax / 2;

    const adjustedGrossIncome = Math.max(
      0,
      netProfit - halfSeTaxDeduction - annualRetirement - annualHealthInsurance
    );

    const standardDeduction = US_STANDARD_DEDUCTION[input.filingStatus] ?? US_STANDARD_DEDUCTION['Single'];
    const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);
    const incomeTax = this.applyBrackets(taxableIncome, US_BRACKETS[input.filingStatus] ?? US_BRACKETS['Single']);

    const totalAnnualTax = incomeTax + selfEmploymentTax;
    const quarterlyTaxDue = totalAnnualTax / 4;
    const safeHarborQuarterly = (totalAnnualTax * 0.9) / 4;
    const effectiveRate = annualGross > 0 ? (totalAnnualTax / annualGross) * 100 : 0;

    return {
      method: 'us-detailed',
      netProfit, selfEmploymentTax, adjustedGrossIncome, standardDeduction,
      taxableIncome, incomeTax, totalAnnualTax, quarterlyTaxDue, safeHarborQuarterly, effectiveRate,
    };
  }

  // Simplified calculation for every other country
  calculateSimplified(input: {
    grossIncome: number;
    businessExpenses: number;
    retirementContributions: number;
    healthInsurancePremiums: number;
    homeOfficeDeduction: number;
    country: string;
  }): SimpleCalculationResult {
    const totalDeductions =
      input.businessExpenses + input.retirementContributions +
      input.healthInsurancePremiums + input.homeOfficeDeduction;

    const taxableQuarterly = Math.max(0, input.grossIncome - totalDeductions);
    const annualizedTaxable = taxableQuarterly * 4;

    const brackets = SIMPLIFIED_SLABS[input.country];
    const usedGenericRate = !brackets;
    const annualTax = brackets
      ? this.applyBrackets(annualizedTaxable, brackets)
      : annualizedTaxable * 0.20;

    const quarterlyTax = annualTax / 4;
    const effectiveRate = annualizedTaxable > 0 ? (annualTax / annualizedTaxable) * 100 : 0;

    return { method: 'simplified', totalDeductions, taxableQuarterly, annualizedTaxable, annualTax, quarterlyTax, effectiveRate, usedGenericRate };
  }

  saveEstimate(quarter: Quarter, year: number, country: string, estimatedTax: number): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    const existing = this.allEstimates().find(e => e.userId === userId && e.quarter === quarter && e.year === year);
    let updated: TaxEstimate[];
    if (existing) {
      updated = this.allEstimates().map(e => (e.id === existing.id ? { ...e, estimatedTax, country } : e));
    } else {
      updated = [...this.allEstimates(), { id: crypto.randomUUID(), userId, quarter, year, country, estimatedTax }];
    }
    this.allEstimates.set(updated);
    this.persist(updated);
  }

  getCalendarEvents(year: number): { month: string; events: CalendarEvent[] }[] {
    const events: CalendarEvent[] = [];
    for (const quarter of this.allQuarters) {
      const dueMonth = QUARTER_DUE_MONTH[quarter];
      const dueDate = new Date(year, dueMonth, 15);
      const reminderDate = new Date(year, dueMonth, 1);
      const monthName = dueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      events.push({
        title: `Reminder: ${quarter} Estimated Tax Payment`,
        date: fmt(reminderDate),
        description: `Reminder for upcoming ${quarter} estimated tax payment due on ${fmt(dueDate)}`,
        badge: 'reminder', month: monthName, sortDate: reminderDate,
      });
      events.push({
        title: `${quarter} Estimated Tax Payment`,
        date: fmt(dueDate),
        description: `${quarter} estimated tax payment due`,
        badge: 'payment', month: monthName, sortDate: dueDate,
      });
    }
    events.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
    const grouped = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      if (!grouped.has(e.month)) grouped.set(e.month, []);
      grouped.get(e.month)!.push(e);
    }
    return Array.from(grouped.entries()).map(([month, events]) => ({ month, events }));
  }
}