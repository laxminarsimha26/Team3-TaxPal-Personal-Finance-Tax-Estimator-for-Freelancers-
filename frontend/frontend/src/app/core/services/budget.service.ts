import { Injectable, signal, computed } from '@angular/core';
import { Budget } from '../models/budget.model';
import { AuthService } from './auth.service';
import { TransactionService } from './transaction.service';

export interface BudgetProgress extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number; // capped at 100 for bar width, actual can exceed
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly STORAGE_KEY = 'taxpal_budgets';

  private allBudgets = signal<Budget[]>(this.load());

  // Currently viewed month — defaults to this month, but the page can change it
  selectedMonth = signal<string>(this.currentMonthString());

  constructor(private auth: AuthService, private txService: TransactionService) {}

  private currentMonthString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private load(): Budget[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(budgets: Budget[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(budgets));
  }

  // This user's budgets for the selected month, with spending calculated
  budgetsWithProgress = computed<BudgetProgress[]>(() => {
    const userId = this.auth.currentUser()?.id;
    const month = this.selectedMonth();

    const monthBudgets = this.allBudgets().filter(
      b => b.userId === userId && b.month === month
    );

    const monthExpenses = this.txService
      .transactions()
      .filter(t => t.type === 'expense' && t.date.startsWith(month));

    return monthBudgets.map(b => {
      const spent = monthExpenses
        .filter(t => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...b,
        spent,
        remaining: b.limit - spent,
        percentUsed: Math.min(100, Math.round((spent / b.limit) * 100)),
      };
    });
  });

  // Categories that already have a budget set this month (to avoid duplicates in the form)
  budgetedCategories = computed(() =>
    new Set(this.budgetsWithProgress().map(b => b.category))
  );

  setLimit(category: string, limit: number): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    const month = this.selectedMonth();
    const existing = this.allBudgets().find(
      b => b.userId === userId && b.month === month && b.category === category
    );

    if (existing) {
      // update in place
      const updated = this.allBudgets().map(b =>
        b.id === existing.id ? { ...b, limit } : b
      );
      this.allBudgets.set(updated);
      this.persist(updated);
    } else {
      const newBudget: Budget = { id: crypto.randomUUID(), userId, category, limit, month };
      const updated = [...this.allBudgets(), newBudget];
      this.allBudgets.set(updated);
      this.persist(updated);
    }
  }

  delete(id: string): void {
    const updated = this.allBudgets().filter(b => b.id !== id);
    this.allBudgets.set(updated);
    this.persist(updated);
  }
}