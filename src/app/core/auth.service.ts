import { Injectable, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { MOCK_ADMIN } from './mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  loading = signal(false);

  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  async signUp(email: string, password: string) {
    this.currentUser.set(MOCK_ADMIN);
    return { user: MOCK_ADMIN };
  }

  async signIn(email: string, password: string) {
    this.currentUser.set(MOCK_ADMIN);
    return { user: MOCK_ADMIN };
  }

  async signOut() {
    this.currentUser.set(null);
  }
}
