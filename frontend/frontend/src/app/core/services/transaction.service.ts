import { Injectable, signal, computed } from '@angular/core';
import { Transaction, TransactionType } from '../models/transaction.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly STORAGE_KEY = 'taxpal_transactions';

  private allTransactions = signal<Transaction[]>(this.load());

  constructor(private auth: AuthService) {}

  
  transactions = computed(() => {
    const userId = this.auth.currentUser()?.id;
    return this.allTransactions()
      .filter(t => t.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  totalIncome = computed(() =>
    this.transactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  totalExpense = computed(() =>
    this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  balance = computed(() => this.totalIncome() - this.totalExpense());

  private load(): Transaction[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(transactions: Transaction[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }

  add(type: TransactionType, category: string, amount: number, date: string): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      userId,
      type,
      category,
      amount,
      date,
    };

    const updated = [...this.allTransactions(), newTransaction];
    this.allTransactions.set(updated);
    this.persist(updated);
  }

  delete(id: string): void {
    const updated = this.allTransactions().filter(t => t.id !== id);
    this.allTransactions.set(updated);
    this.persist(updated);
  }
}