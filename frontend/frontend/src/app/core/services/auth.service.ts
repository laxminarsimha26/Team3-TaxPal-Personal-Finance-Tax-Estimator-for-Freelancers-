import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'taxpal_users';
  private readonly SESSION_KEY = 'taxpal_current_user';
  private readonly RESET_KEY = 'taxpal_reset_tokens';

  currentUser = signal<User | null>(this.loadSession());

  private loadSession(): User | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private getUsers(): User[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private getResetTokens(): Record<string, { email: string; expiresAt: number }> {
    const raw = localStorage.getItem(this.RESET_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private saveResetTokens(tokens: Record<string, { email: string; expiresAt: number }>): void {
    localStorage.setItem(this.RESET_KEY, JSON.stringify(tokens));
  }

  signup(user: Omit<User, 'id'>): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.some(u => u.email === user.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser: User = { ...user, id: crypto.randomUUID() };
    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    return { success: true, message: 'Account created successfully.' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    this.currentUser.set(found);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(found));
    return { success: true, message: 'Logged in.' };
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  requestPasswordReset(email: string): { success: boolean; message: string; token?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
     
      return { success: true, message: 'If that email is registered, a reset link has been sent.' };
    }

    const token = crypto.randomUUID();
    const tokens = this.getResetTokens();
    tokens[token] = { email, expiresAt: Date.now() + 15 * 60 * 1000 }; // 15 min expiry
    this.saveResetTokens(tokens);

    return {
      success: true,
      message: 'If that email is registered, a reset link has been sent.',
      token, 
    };
  }

  validateResetToken(token: string): boolean {
    const tokens = this.getResetTokens();
    const entry = tokens[token];
    return !!entry && entry.expiresAt > Date.now();
  }

  resetPassword(token: string, newPassword: string): { success: boolean; message: string } {
    const tokens = this.getResetTokens();
    const entry = tokens[token];

    if (!entry || entry.expiresAt < Date.now()) {
      return { success: false, message: 'This reset link is invalid or has expired.' };
    }

    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === entry.email);
    if (idx === -1) {
      return { success: false, message: 'Account not found.' };
    }

    users[idx].password = newPassword;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

    delete tokens[token];
    this.saveResetTokens(tokens);

    return { success: true, message: 'Password updated. You can now log in.' };
  }
}