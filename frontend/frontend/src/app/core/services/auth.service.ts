import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'taxpal_users';
  private readonly SESSION_KEY = 'taxpal_current_user';

  currentUser = signal<User | null>(this.loadSession());

  private loadSession(): User | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private getUsers(): User[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
}