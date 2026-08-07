import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { CategoryType } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  newName = '';
  newType: CategoryType = 'expense';
  errorMessage = '';

  constructor(public categoryService: CategoryService) {}

  onAdd(): void {
    const result = this.categoryService.add(this.newName, this.newType);
    if (result.success) {
      this.newName = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = result.message;
    }
  }

  onDelete(id: string): void {
    this.categoryService.delete(id);
  }
}