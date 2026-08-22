import { Injectable, signal, computed, effect } from '@angular/core';
import { Category, CategoryType } from '../models/category.model';
import { AuthService } from './auth.service';

const DEFAULT_INCOME = ['Salary', 'Freelance', 'Investment', 'Other'];
const DEFAULT_EXPENSE = ['Groceries', 'Rent', 'Utilities', 'Transport', 'Other'];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly STORAGE_KEY = 'taxpal_categories';

  private allCategories = signal<Category[]>(this.load());

  constructor(private auth: AuthService) {
    
    effect(() => {
      const user = this.auth.currentUser();
      if (user) this.seedIfNeeded(user.id);
    });
  }

  private load(): Category[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(categories: Category[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
  }

  private seedIfNeeded(userId: string): void {
    const hasAny = this.allCategories().some(c => c.userId === userId);
    if (hasAny) return;

    const defaults: Category[] = [
      ...DEFAULT_INCOME.map(name => ({ id: crypto.randomUUID(), userId, name, type: 'income' as CategoryType })),
      ...DEFAULT_EXPENSE.map(name => ({ id: crypto.randomUUID(), userId, name, type: 'expense' as CategoryType })),
    ];

    const updated = [...this.allCategories(), ...defaults];
    this.allCategories.set(updated);
    this.persist(updated);
  }

  private forCurrentUser = computed(() => {
    const userId = this.auth.currentUser()?.id;
    return this.allCategories().filter(c => c.userId === userId);
  });

  incomeCategories = computed(() =>
    this.forCurrentUser().filter(c => c.type === 'income')
  );

  expenseCategories = computed(() =>
    this.forCurrentUser().filter(c => c.type === 'expense')
  );

  
  incomeCategoryNames = computed(() => this.incomeCategories().map(c => c.name));
  expenseCategoryNames = computed(() => this.expenseCategories().map(c => c.name));

  add(name: string, type: CategoryType): { success: boolean; message: string } {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return { success: false, message: 'Not logged in.' };

    const trimmed = name.trim();
    if (!trimmed) return { success: false, message: 'Category name required.' };

    const exists = this.forCurrentUser().some(
      c => c.type === type && c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return { success: false, message: 'That category already exists.' };

    const newCategory: Category = { id: crypto.randomUUID(), userId, name: trimmed, type };
    const updated = [...this.allCategories(), newCategory];
    this.allCategories.set(updated);
    this.persist(updated);
    return { success: true, message: 'Category added.' };
  }

  delete(id: string): void {
    const updated = this.allCategories().filter(c => c.id !== id);
    this.allCategories.set(updated);
    this.persist(updated);
  }
}