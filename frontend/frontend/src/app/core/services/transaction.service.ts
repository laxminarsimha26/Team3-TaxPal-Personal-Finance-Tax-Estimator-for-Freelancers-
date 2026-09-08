import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionType } from '../models/transaction.model';
import { AuthService } from './auth.service';

interface TransactionResponse {
  success: boolean;
  message?: string;
  transactions?: Transaction[];
  transaction?: Transaction;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly API = 'http://localhost:5000/api/transactions';

  private allTransactions = signal<Transaction[]>([]);

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.loadTransactions();
  }

  transactions = computed(() => {
    const userId = this.auth.currentUser()?.id;

    return this.allTransactions()
      .filter(t => String(t.userId) === String(userId))
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

  loadTransactions(): void {
    if (!this.auth.currentUser()) {
      return;
    }

    this.http.get<TransactionResponse>(this.API, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        if (response.success && response.transactions) {
          this.allTransactions.set(response.transactions);
        }
      },
      error: (error) => {
        console.error('Failed to load transactions', error);
      }
    });
  }

  add(
    type: TransactionType,
    category: string,
    amount: number,
    date: string
  ): void {
    this.http.post<TransactionResponse>(
      this.API,
      {
        type,
        category,
        amount,
        date
      },
      {
        withCredentials: true
      }
    ).subscribe({
      next: (response) => {
        if (response.success && response.transaction) {
          this.allTransactions.update(transactions => [
            response.transaction!,
            ...transactions
          ]);
        }
      },
      error: (error) => {
        console.error('Failed to add transaction', error);
      }
    });
  }

  delete(id: string): void {
    this.http.delete<TransactionResponse>(
      `${this.API}/${id}`,
      {
        withCredentials: true
      }
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.allTransactions.update(transactions =>
            transactions.filter(t => String(t.id) !== String(id))
          );
        }
      },
      error: (error) => {
        console.error('Failed to delete transaction', error);
      }
    });
  }
}