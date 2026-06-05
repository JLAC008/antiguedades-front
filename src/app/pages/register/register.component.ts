import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-split">
        <div class="auth-left">
          <div class="auth-brand">
            <div class="auth-logo">A</div>
            <h2 class="auth-brand-name">ANTIGÜEDADES</h2>
          </div>
          <img src="assets/login-bg.jpg" class="auth-bg-img" alt="" />
        </div>
        <div class="auth-right">
          <div class="auth-form-container">
            <h1 class="auth-title">Crear cuenta</h1>

            @if (error()) {
              <div class="auth-error">{{ error() }}</div>
            }
            @if (success()) {
              <div class="auth-success">{{ success() }}</div>
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
                  placeholder="Mínimo 6 caracteres"
                  required
                  minlength="6"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  class="form-input"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repite la contraseña"
                  required
                />
              </div>
              <button type="submit" class="btn-submit" [disabled]="loading()">
                @if (loading()) { Creando cuenta... } @else { Crear cuenta }
              </button>
            </form>

            <p class="auth-footer">
              ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--color-bg);
    }
    .auth-split {
      display: flex;
      width: 100%;
      max-width: 960px;
      min-height: 320px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    }
    .auth-left {
      flex: 1;
      background: #0a0a0a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      overflow: hidden;
    }
    .auth-brand {
      position: relative;
      z-index: 1;
      text-align: center;
      padding-top: 2rem;
    }
    .auth-bg-img {
      width: 100%;
      flex: 1;
      object-fit: contain;
    }
    .auth-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .auth-brand {
      position: relative;
      z-index: 1;
      text-align: center;
    }
    .auth-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 2px solid var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', serif;
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--color-accent);
      margin: 0 auto 1rem;
      background: rgba(184,149,90,0.08);
    }
    .auth-brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--color-accent-light);
      margin: 0;
    }
    .auth-right {
      flex: 1;
      background: var(--color-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
    }
    .auth-form-container {
      width: 100%;
      max-width: 320px;
    }
    .auth-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 1.5rem;
      text-align: center;
    }
    .auth-error {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: var(--color-error);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }
    .auth-success {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: var(--color-success);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text); }
    .form-input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 0.9375rem;
      color: var(--color-text);
      background: var(--color-bg);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .form-input::placeholder {
      color: var(--color-text-muted);
      opacity: 0.6;
    }
    .btn-submit {
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 0.875rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      margin-top: 0.5rem;
      width: 100%;
    }
    .btn-submit:hover:not(:disabled) { background: var(--color-secondary); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }
    .auth-footer a { color: var(--color-accent); font-weight: 600; text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
    @media (max-width: 700px) {
      .auth-left { display: none; }
      .auth-split { min-height: auto; }
    }
  `]
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    if (!this.email || !this.password) return;
    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signUp(this.email, this.password);
      this.success.set('Cuenta creada correctamente. Ya puedes iniciar sesión.');
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al crear la cuenta.');
    } finally {
      this.loading.set(false);
    }
  }
}
