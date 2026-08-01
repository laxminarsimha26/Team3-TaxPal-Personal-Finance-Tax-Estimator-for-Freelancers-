import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionType } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent {
  type: TransactionType = 'income';
  category = '';
  amount: number | null = null;
  date = new Date().toISOString().slice(0, 10); // defaults to today

  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other'];
  expenseCategories = ['Groceries', 'Rent', 'Utilities', 'Transport', 'Other'];

  constructor(private txService: TransactionService) {}

  get categoryOptions(): string[] {
    return this.type === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  onSubmit(): void {
    if (!this.category || !this.amount || this.amount <= 0) return;

    this.txService.add(this.type, this.category, this.amount, this.date);

    // reset form (keep type/date for faster repeat entry)
    this.category = '';
    this.amount = null;
  }
}