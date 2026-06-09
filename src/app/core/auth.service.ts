import { Injectable, signal } from '@angular/core';
import { AppUser } from '../models';

const ADMIN_EMAIL = 'admin@antiguedades.com';
const ADMIN_PASSWORD = 'admin123';

let nextUserId = 2;

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AppUser | null>(null);
  loading = signal(false);

  private users: AppUser[] = [
    { id: 'user-1', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin', name: 'Admin', createdAt: new Date().toISOString() },
  ];

  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  get isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  getUsers(): AppUser[] {
    return this.users.filter(u => u.id !== 'user-1');
  }

  async createUser(email: string, password: string, name: string, role: AppUser['role'] = 'user') {
    if (!this.isAdmin) throw new Error('Solo el administrador puede crear usuarios.');
    const exists = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('Ya existe un usuario con ese correo.');
    const newUser: AppUser = {
      id: `user-${nextUserId++}`,
      email: email.toLowerCase().trim(),
      password,
      role,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, data: { email?: string; password?: string; name?: string; role?: AppUser['role'] }) {
    if (!this.isAdmin) throw new Error('Solo el administrador puede editar usuarios.');
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado.');
    const dup = this.users.find((u, i) => i !== idx && u.email.toLowerCase() === (data.email ?? this.users[idx].email).toLowerCase());
    if (dup) throw new Error('Ya existe otro usuario con ese correo.');
    this.users[idx] = { ...this.users[idx], ...data };
    return this.users[idx];
  }

  async deleteUser(id: string) {
    if (!this.isAdmin) throw new Error('Solo el administrador puede eliminar usuarios.');
    this.users = this.users.filter(u => u.id !== id);
  }

  async signIn(email: string, password: string) {
    const user = this.users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) throw new Error('Correo o contraseña incorrectos.');
    this.currentUser.set(user);
    return { user };
  }

  async signUp(email: string, password: string) {
    throw new Error('El registro no está disponible. Contacta al administrador.');
  }

  async signOut() {
    this.currentUser.set(null);
  }
}
