import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">&#9775;</span>
          <h1 class="auth-title">Acceder</h1>
          <p class="auth-subtitle">Inicia sesión para gestionar la colección</p>
        </div>

        @if (error()) {
          <div class="auth-error">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input
              type="email"
              class="form-input"
              [(ngModel)]="email"
              name="email"
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input
              type="password"
              class="form-input"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" class="btn-submit" [disabled]="loading()">
            @if (loading()) { Accediendo... } @else { Iniciar sesión }
          </button>
          <button type="button" class="btn-quick" (click)="quickAccess()">
            Acceso rápido (admin)
          </button>
        </form>

        <p class="auth-footer">
          ¿No tienes cuenta? <a routerLink="/registro">Regístrate</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      background: var(--color-bg);
    }
    .auth-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-icon {
      font-size: 2.5rem;
      color: var(--color-accent);
      display: block;
      margin-bottom: 1rem;
    }
    .auth-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.5rem;
    }
    .auth-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; margin: 0; }
    .auth-error {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: var(--color-error);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
    }
    .form-input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 1rem;
      color: var(--color-text);
      background: var(--color-bg);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .btn-submit {
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 0.875rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      margin-top: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) { background: var(--color-secondary); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-quick {
      width: 100%;
      background: none;
      border: 1px dashed var(--color-accent);
      color: var(--color-accent);
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-quick:hover { background: rgba(184,149,90,0.08); border-style: solid; }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--color-text-muted);
      font-size: 0.9375rem;
    }
    .auth-footer a { color: var(--color-accent); font-weight: 600; text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signIn(this.email, this.password);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      this.loading.set(false);
    }
  }

  async quickAccess() {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signIn('admin@antiguedades.com', 'admin123');
      this.router.navigate(['/']);
    } catch {
      this.error.set('Error al acceder.');
    } finally {
      this.loading.set(false);
    }
  }
}
