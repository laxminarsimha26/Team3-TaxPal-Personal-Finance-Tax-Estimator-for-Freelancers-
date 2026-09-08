import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Budget } from '../models/budget.model';
import { AuthService } from './auth.service';
import { TransactionService } from './transaction.service';

export interface BudgetProgress extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
}

interface BudgetResponse {
  success: boolean;
  message?: string;
  budgets?: Budget[];
  budget?: Budget;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly API = 'http://localhost:5000/api/budgets';

  private allBudgets = signal<Budget[]>([]);

  selectedMonth = signal<string>(this.currentMonthString());

  constructor(
    private auth: AuthService,
    private txService: TransactionService,
    private http: HttpClient
  ) {
    effect(() => {
      const user = this.auth.currentUser();

      if (user) {
        this.loadBudgets();
      } else {
        this.allBudgets.set([]);
      }
    });
  }

  private currentMonthString(): string {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private loadBudgets(): void {
    this.http.get<BudgetResponse>(this.API, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        if (response.success && response.budgets) {
          this.allBudgets.set(response.budgets);
        }
      },
      error: (error) => {
        console.error('Failed to load budgets', error);
      }
    });
  }

  budgetsWithProgress = computed<BudgetProgress[]>(() => {
    const userId = this.auth.currentUser()?.id;
    const month = this.selectedMonth();

    const monthBudgets = this.allBudgets().filter(
      b =>
        String(b.userId) === String(userId) &&
        b.month === month
    );

    const monthExpenses = this.txService
      .transactions()
      .filter(
        t =>
          t.type === 'expense' &&
          t.date.startsWith(month)
      );

    return monthBudgets.map(b => {
      const spent = monthExpenses
        .filter(t => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...b,
        spent,
        remaining: b.limit - spent,
        percentUsed: b.limit > 0
          ? Math.min(100, Math.round((spent / b.limit) * 100))
          : 0
      };
    });
  });

  budgetedCategories = computed(() =>
    new Set(this.budgetsWithProgress().map(b => b.category))
  );

  setLimit(category: string, limit: number): void {
    const userId = this.auth.currentUser()?.id;

    if (!userId) {
      return;
    }

    const month = this.selectedMonth();

    const existing = this.allBudgets().find(
      b =>
        String(b.userId) === String(userId) &&
        b.month === month &&
        b.category === category
    );

    if (existing) {
      this.http.put<BudgetResponse>(
        `${this.API}/${existing.id}`,
        {
          category,
          limit,
          month
        },
        {
          withCredentials: true
        }
      ).subscribe({
        next: (response) => {
          if (response.success && response.budget) {
            this.allBudgets.update(budgets =>
              budgets.map(b =>
                String(b.id) === String(existing.id)
                  ? response.budget!
                  : b
              )
            );
          }
        },
        error: (error) => {
          console.error('Failed to update budget', error);
        }
      });
    } else {
      this.http.post<BudgetResponse>(
        this.API,
        {
          category,
          limit,
          month
        },
        {
          withCredentials: true
        }
      ).subscribe({
        next: (response) => {
          if (response.success && response.budget) {
            this.allBudgets.update(budgets => [
              ...budgets,
              response.budget!
            ]);
          }
        },
        error: (error) => {
          console.error('Failed to create budget', error);
        }
      });
    }
  }

  delete(id: string): void {
    this.http.delete<BudgetResponse>(
      `${this.API}/${id}`,
      {
        withCredentials: true
      }
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.allBudgets.update(budgets =>
            budgets.filter(b => String(b.id) !== String(id))
          );
        }
      },
      error: (error) => {
        console.error('Failed to delete budget', error);
      }
    });
  }
}