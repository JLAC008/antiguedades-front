import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppUser, LoginResponse } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(null);
  loading = signal(false);

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }

  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  get isAdmin(): boolean {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'superuser';
  }

  async createUser(email: string, password: string, name: string, role: AppUser['role'] = 'user') {
    const res = await firstValueFrom(
      this.http.post<AppUser>(`${environment.apiUrl}/api/admin/users`, {
        name, email, password, role
      })
    );
    return res;
  }

  async updateUser(id: string, data: { email?: string; password?: string; name?: string; role?: AppUser['role'] }) {
    const res = await firstValueFrom(
      this.http.put<AppUser>(`${environment.apiUrl}/api/admin/users/${id}`, data)
    );
    return res;
  }

  async deleteUser(id: string) {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/api/admin/users/${id}`)
    );
  }

  async listUsers(): Promise<AppUser[]> {
    const res = await firstValueFrom(
      this.http.get<AppUser[]>(`${environment.apiUrl}/api/admin/users`)
    );
    return res;
  }

  async signIn(email: string, password: string) {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, { email, password })
    );
    const user: AppUser = {
      id: res.user_id,
      email: res.email,
      role: res.role as AppUser['role'],
      name: res.username,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.currentUser.set(user);
    return { user };
  }

  async signOut() {
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/api/auth/logout`, {}));
    } finally {
      localStorage.removeItem('auth_user');
      this.currentUser.set(null);
    }
  }
}
