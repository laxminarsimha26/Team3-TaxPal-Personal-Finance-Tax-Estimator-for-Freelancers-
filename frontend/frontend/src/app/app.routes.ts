import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        m => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        m => m.ResetPasswordComponent
      ),
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/transactions/transactions.component').then(
            m => m.TransactionsComponent
          ),
      },
      {
        path: 'budgets',
        loadComponent: () =>
          import('./features/budgets/budgets.component').then(
            m => m.BudgetsComponent
          ),
      },
       {
        path: 'tax-estimator',
        loadComponent: () =>
          import('./features/tax-estimator/tax-estimator.component').then(
            m => m.TaxEstimatorComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories.component').then(m => m.CategoriesComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];