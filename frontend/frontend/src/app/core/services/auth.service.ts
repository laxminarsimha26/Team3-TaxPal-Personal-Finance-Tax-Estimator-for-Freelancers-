import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5000/api/auth';

  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.http.get<AuthResponse>(`${this.API}/me`, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.currentUser.set(response.user);
        }
      },
      error: () => {
        this.currentUser.set(null);
      }
    });
  }

  signup(user: Omit<User, 'id'>) {
    return this.http.post<AuthResponse>(
      `${this.API}/signup`,
      user,
      { withCredentials: true }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `${this.API}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  logout(): void {
    this.http.post<AuthResponse>(
      `${this.API}/logout`,
      {},
      { withCredentials: true }
    ).subscribe({
      next: () => this.currentUser.set(null),
      error: () => this.currentUser.set(null)
    });
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  requestPasswordReset(
    email: string
  ): { success: boolean; message: string; token?: string } {
    return {
      success: false,
      message: 'Password reset is temporarily unavailable.'
    };
  }

  validateResetToken(token: string): boolean {
    return false;
  }

  resetPassword(
    token: string,
    newPassword: string
  ): { success: boolean; message: string } {
    return {
      success: false,
      message: 'Password reset is temporarily unavailable.'
    };
  }
}