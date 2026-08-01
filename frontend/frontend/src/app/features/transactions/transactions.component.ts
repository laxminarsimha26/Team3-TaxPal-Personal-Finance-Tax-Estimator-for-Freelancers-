import { Component } from '@angular/core';
import { TransactionFormComponent } from '../dashboard/transaction-form/transaction-form.component';
import { TransactionListComponent } from '../dashboard/transaction-list/transaction-list.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionFormComponent, TransactionListComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {}