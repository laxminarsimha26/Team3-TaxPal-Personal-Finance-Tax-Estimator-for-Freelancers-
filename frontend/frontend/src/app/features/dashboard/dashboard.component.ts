import { Component, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(public auth: AuthService, public txService: TransactionService) {}

  recentTransactions = computed(() => this.txService.transactions().slice(0, 5));

  // Highest amount between income and expense to scale bar heights correctly
  maxBarValue = computed(() => {
    const inc = this.txService.totalIncome();
    const exp = this.txService.totalExpense();
    return Math.max(inc, exp, 1); // Avoid division by zero
  });

  incomeBarHeight = computed(() => {
    const inc = this.txService.totalIncome();
    if (inc <= 0) return 0;
    return Math.min(100, Math.round((inc / this.maxBarValue()) * 100));
  });

  expenseBarHeight = computed(() => {
    const exp = this.txService.totalExpense();
    if (exp <= 0) return 0;
    return Math.min(100, Math.round((exp / this.maxBarValue()) * 100));
  });

  // Category breakdown for the expense pie (category -> % of total expense)
  expenseBreakdown = computed(() => {
    const expenses = this.txService.transactions().filter(t => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);
    if (total === 0) return [];

    const byCategory = new Map<string, number>();
    for (const t of expenses) {
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
    }

    const colors = ['#4361ee', '#2a9d5c', '#f4a261', '#e63946', '#9d4edd'];
    return Array.from(byCategory.entries()).map(([category, amount], i) => ({
      category,
      amount,
      percent: Math.round((amount / total) * 100),
      color: colors[i % colors.length],
    }));
  });

  // Conic-gradient string for the CSS pie chart
  pieGradient = computed(() => {
    const segments = this.expenseBreakdown();
    let cumulative = 0;
    const stops = segments.map(s => {
      const start = cumulative;
      cumulative += s.percent;
      return `${s.color} ${start}% ${cumulative}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  });

  savingsRate = computed(() => {
    const income = this.txService.totalIncome();
    if (income === 0) return 0;
    return Math.round((this.txService.balance() / income) * 100);
  });
}