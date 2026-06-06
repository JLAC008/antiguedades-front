import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { AppUser } from '../../models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="page-content">
        <h1 class="page-title">Gestionar Usuarios</h1>

        <div class="layout">
          <div class="form-panel">
            <h2 class="panel-title">{{ editingUser() ? 'Editar usuario' : 'Nuevo usuario' }}</h2>

            @if (error()) {
              <div class="alert alert-error">{{ error() }}</div>
            }
            @if (success()) {
              <div class="alert alert-success">{{ success() }}</div>
            }

            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input class="form-input" [(ngModel)]="formName" name="name" placeholder="Nombre del usuario" />
            </div>
            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input class="form-input" type="email" [(ngModel)]="formEmail" name="email" placeholder="correo@ejemplo.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña{{ editingUser() ? ' (dejar en blanco para mantener)' : '' }}</label>
              <input class="form-input" type="password" [(ngModel)]="formPassword" name="password" [placeholder]="editingUser() ? 'Nueva contraseña' : 'Contraseña'" />
            </div>

            <div class="form-actions">
              <button class="btn-submit" (click)="editingUser() ? updateUser() : createUser()" [disabled]="saving()">
                @if (saving()) { Guardando... } @else if (editingUser()) { Guardar cambios } @else { Crear usuario }
              </button>
              @if (editingUser()) {
                <button class="btn-cancel" (click)="cancelEdit()">Cancelar</button>
              }
            </div>
          </div>

          <div class="list-panel">
            <h2 class="panel-title">Usuarios ({{ users().length }})</h2>

            @if (users().length === 0) {
              <p class="empty">No hay usuarios creados.</p>
            }

            <div class="user-list">
              @for (user of users(); track user.id) {
                <div class="user-item">
                    <div class="user-info">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-email">{{ user.email }}</span>
                    <div class="user-pw-row">
                      <span class="user-pw" [class.blurred]="!revealed.has(user.id)">{{ user.password }}</span>
                      <button class="btn-eye" (click)="togglePw(user.id)" [attr.aria-label]="revealed.has(user.id) ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                        @if (revealed.has(user.id)) {
                          <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>
                        } @else {
                          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    <span class="user-role" [class.role-user]="user.role === 'user'">{{ user.role === 'admin' ? 'Admin' : 'Usuario' }}</span>
                  </div>
                  <div class="user-actions">
                    <button class="btn-edit" (click)="editUser(user)">Editar</button>
                    <button class="btn-delete" (click)="deleteUser(user.id)">Eliminar</button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: radial-gradient(circle at 50% 0%, rgba(184, 149, 90, 0.09), transparent 36rem), #fbfaf7;
    }
    .page-content { max-width: 1100px; margin: 0 auto; padding: 3.2rem 1.5rem 4rem; }
    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 2rem;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }
    .form-panel, .list-panel {
      background: rgba(255,255,255,0.6);
      border: 1px solid #dccdbd;
      border-radius: 10px;
      padding: 1.5rem;
    }
    .panel-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .form-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-secondary);
    }
    .form-input {
      width: 100%;
      padding: 0.75rem 0.85rem;
      border: 1px solid #dccdbd;
      border-radius: 6px;
      font-size: 0.9rem;
      background: white;
      outline: none;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.15);
    }
    .btn-submit {
      flex: 1;
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 0.85rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: var(--color-secondary); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .form-actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn-cancel {
      flex-shrink: 0;
      background: none;
      border: 1px solid var(--color-border);
      color: var(--color-secondary);
      padding: 0.85rem 1rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: all 0.2s;
    }
    .btn-cancel:hover {
      background: rgba(0,0,0,0.04);
    }
    .alert {
      padding: 0.7rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    .alert-error {
      background: rgba(184,84,80,0.12);
      border: 1px solid rgba(184,84,80,0.4);
      color: #b85450;
    }
    .alert-success {
      background: rgba(76,175,80,0.12);
      border: 1px solid rgba(76,175,80,0.4);
      color: #2e7d32;
    }
    .empty {
      color: var(--color-text-muted);
      text-align: center;
      padding: 2rem 0;
    }
    .user-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .user-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1rem;
      background: white;
      border: 1px solid #e5dbcf;
      border-radius: 8px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }
    .user-name {
      font-weight: 700;
      color: var(--color-primary);
      font-size: 0.9rem;
    }
    .user-email {
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }
    .user-pw-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .user-pw {
      font-size: 0.78rem;
      color: var(--color-text-muted);
      font-family: 'Courier New', monospace;
      transition: filter 0.25s ease;
    }
    .user-pw.blurred {
      filter: blur(4px);
    }
    .btn-eye {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--color-text-muted);
      transition: color 0.2s;
    }
    .btn-eye:hover {
      color: var(--color-accent);
    }
    .btn-eye svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
      display: block;
    }
    .user-role {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-accent);
      margin-top: 0.15rem;
    }
    .user-role.role-user {
      color: var(--color-secondary);
    }
    .user-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }
    .btn-edit {
      flex-shrink: 0;
      background: none;
      border: 1px solid var(--color-accent);
      color: var(--color-accent);
      padding: 0.4rem 0.85rem;
      border-radius: 5px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-edit:hover {
      background: var(--color-accent);
      color: white;
    }
    .btn-delete {
      flex-shrink: 0;
      background: none;
      border: 1px solid var(--color-error);
      color: var(--color-error);
      padding: 0.4rem 0.85rem;
      border-radius: 5px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-delete:hover {
      background: var(--color-error);
      color: white;
    }
    @media (max-width: 768px) {
      .layout { grid-template-columns: 1fr; }
    }
  `]
})
export class ManageUsersComponent {
  private auth = inject(AuthService);
  users = signal<AppUser[]>([]);
  saving = signal(false);
  error = signal('');
  success = signal('');

  editingUser = signal<AppUser | null>(null);
  revealed = new Set<string>();

  formName = '';
  formEmail = '';
  formPassword = '';

  constructor() {
    this.loadUsers();
  }

  togglePw(id: string) {
    if (this.revealed.has(id)) {
      this.revealed.delete(id);
    } else {
      this.revealed.add(id);
    }
  }

  editUser(user: AppUser) {
    this.editingUser.set(user);
    this.formName = user.name;
    this.formEmail = user.email;
    this.formPassword = '';
    this.error.set('');
    this.success.set('');
  }

  cancelEdit() {
    this.editingUser.set(null);
    this.formName = '';
    this.formEmail = '';
    this.formPassword = '';
    this.error.set('');
    this.success.set('');
  }

  private loadUsers() {
    this.users.set(this.auth.getUsers());
  }

  async createUser() {
    this.error.set('');
    this.success.set('');
    if (!this.formName || !this.formEmail || !this.formPassword) {
      this.error.set('Todos los campos son obligatorios.');
      return;
    }
    this.saving.set(true);
    try {
      await this.auth.createUser(this.formEmail, this.formPassword, this.formName, 'user');
      this.success.set('Usuario creado correctamente.');
      this.formName = '';
      this.formEmail = '';
      this.formPassword = '';
      this.loadUsers();
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al crear usuario.');
    } finally {
      this.saving.set(false);
    }
  }

  async updateUser() {
    this.error.set('');
    this.success.set('');
    const user = this.editingUser();
    if (!user) return;
    if (!this.formName || !this.formEmail) {
      this.error.set('Nombre y correo son obligatorios.');
      return;
    }
    this.saving.set(true);
    try {
      const data: Partial<Pick<AppUser, 'name' | 'email' | 'password'>> = { name: this.formName, email: this.formEmail };
      if (this.formPassword) data.password = this.formPassword;
      await this.auth.updateUser(user.id, data);
      this.success.set('Usuario actualizado correctamente.');
      this.cancelEdit();
      this.loadUsers();
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al actualizar usuario.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteUser(id: string) {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await this.auth.deleteUser(id);
      this.loadUsers();
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al eliminar usuario.');
    }
  }
}
