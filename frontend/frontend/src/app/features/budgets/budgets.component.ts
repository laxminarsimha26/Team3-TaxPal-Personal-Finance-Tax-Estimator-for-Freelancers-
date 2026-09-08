import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css',
})
export class BudgetsComponent {
  newCategory = '';
  newLimit: number | null = null;

  constructor(public budgetService: BudgetService, private categoryService: CategoryService) {}

  get availableCategories(): string[] {
    const used = this.budgetService.budgetedCategories();
    return this.categoryService.expenseCategoryNames().filter(c => !used.has(c));
  }

  onAddBudget(): void {
    if (!this.newCategory || !this.newLimit || this.newLimit <= 0) return;
    this.budgetService.setLimit(this.newCategory, this.newLimit);
    this.newCategory = '';
    this.newLimit = null;
  }

  onDelete(id: string): void {
    this.budgetService.delete(id);
  }

  barColor(percentUsed: number): string {
    if (percentUsed >= 100) return '#e63946';
    if (percentUsed >= 70) return '#f4a261';
    return '#2a9d5c';
  }
}