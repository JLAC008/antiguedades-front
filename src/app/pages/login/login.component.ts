import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="auth-page">

      <section class="auth-card" aria-label="Acceso al catálogo privado">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>

        <div class="auth-brand">
          <span class="auth-logo">A</span>
          <h1 class="auth-brand-name">Antigüedades</h1>
          <p class="auth-brand-subtitle">Acceso al catálogo privado</p>
          <div class="auth-flourish" aria-hidden="true">⌘</div>
        </div>

        @if (error()) {
          <div class="auth-error">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <div class="input-shell">
              <span class="input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4Z"/>
                  <path d="m4 7 8 6 8-6"/>
                </svg>
              </span>
              <input
                type="email"
                class="form-input"
                [(ngModel)]="email"
                name="email"
                placeholder="Correo electrónico"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <div class="input-shell">
              <span class="input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M7 10V8a5 5 0 0 1 10 0v2"/>
                  <path d="M6 10h12v10H6Z"/>
                </svg>
              </span>
              <input
                type="password"
                class="form-input"
                [(ngModel)]="password"
                name="password"
                placeholder="Introduce tu contraseña"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading()">
            @if (loading()) { Accediendo... } @else { Iniciar sesión }
          </button>

          <button type="button" class="btn-quick" (click)="quickAccess()">
            Acceso rápido (admin)
          </button>
        </form>

        <p class="auth-quote">Piezas únicas. Historias eternas.</p>
      </section>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(1rem, 4vw, 3rem);
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0.02) 42%, rgba(0,0,0,0.35)),
        url('/assets/login-bg-gallery.png') center / cover no-repeat;
    }
    .auth-page::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 45%, rgba(184,149,90,0.08), transparent 24rem),
        rgba(0,0,0,0.3);
      pointer-events: none;
    }
    .auth-card {
      position: relative;
      z-index: 1;
      width: min(100%, 470px);
      background:
        linear-gradient(180deg, rgba(25, 25, 23, 0.94), rgba(14, 13, 12, 0.96));
      border: 1px solid rgba(184,149,90,0.82);
      padding: clamp(2rem, 4vw, 3rem);
      color: rgba(255,255,255,0.88);
      box-shadow: 0 26px 64px rgba(0,0,0,0.45);
      backdrop-filter: blur(6px);
    }
    .corner {
      position: absolute;
      width: 44px;
      height: 44px;
      border-color: var(--color-accent);
      opacity: 0.9;
      pointer-events: none;
    }
    .corner-tl { top: 10px; left: 10px; border-top: 1px solid; border-left: 1px solid; }
    .corner-tr { top: 10px; right: 10px; border-top: 1px solid; border-right: 1px solid; }
    .corner-bl { bottom: 10px; left: 10px; border-bottom: 1px solid; border-left: 1px solid; }
    .corner-br { bottom: 10px; right: 10px; border-bottom: 1px solid; border-right: 1px solid; }
    .auth-brand {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-logo {
      width: 74px;
      height: 74px;
      margin: 0 auto 1.2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(184,149,90,0.78);
      border-radius: 50%;
      font-family: 'Playfair Display', serif;
      font-size: 2.6rem;
      font-weight: 700;
      color: #d0b272;
      background:
        radial-gradient(circle, rgba(184,149,90,0.12), transparent 64%),
        rgba(0,0,0,0.18);
      box-shadow: inset 0 0 0 6px rgba(184,149,90,0.04);
    }
    .auth-brand-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.75rem, 5vw, 2.35rem);
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #d1a961;
      margin: 0 0 0.35rem;
    }
    .auth-brand-subtitle {
      color: rgba(255,255,255,0.78);
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin: 0;
    }
    .auth-flourish {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.7rem;
      color: var(--color-accent);
      font-family: Georgia, serif;
      margin: 1rem auto 0;
      opacity: 0.88;
    }
    .auth-flourish::before,
    .auth-flourish::after {
      content: '';
      width: 3rem;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(184,149,90,0.75));
    }
    .auth-flourish::after {
      background: linear-gradient(90deg, rgba(184,149,90,0.75), transparent);
    }
    .auth-error {
      background: rgba(184,84,80,0.14);
      border: 1px solid rgba(184,84,80,0.48);
      color: #f4b8b4;
      padding: 0.75rem 1rem;
      border-radius: 5px;
      font-size: 0.875rem;
      margin-bottom: 1.2rem;
    }
    .auth-form { display: flex; flex-direction: column; gap: 1.05rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.48rem; }
    .form-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: rgba(255,255,255,0.9);
    }
    .input-shell {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      border: 1px solid rgba(212,180,131,0.28);
      border-radius: 5px;
      background: rgba(255,255,255,0.035);
      padding: 0 0.85rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-shell:focus-within {
      border-color: rgba(212,180,131,0.68);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .input-icon svg {
      width: 17px;
      height: 17px;
      fill: none;
      stroke: #d4b483;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
      display: block;
    }
    .form-input {
      width: 100%;
      padding: 0.9rem 0;
      border: none;
      font-size: 0.95rem;
      color: rgba(255,255,255,0.92);
      background: transparent;
      outline: none;
    }
    .form-input::placeholder {
      color: rgba(255,255,255,0.5);
    }
    .btn-submit,
    .btn-quick {
      width: 100%;
      border-radius: 5px;
      padding: 0.95rem;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .btn-submit {
      background: linear-gradient(180deg, #c59445, #9e6d26);
      color: white;
      border: none;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      margin-top: 0.3rem;
      box-shadow: 0 16px 34px rgba(0,0,0,0.24);
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 20px 38px rgba(0,0,0,0.3);
    }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-quick {
      background: rgba(0,0,0,0.18);
      border: 1px solid rgba(184,149,90,0.64);
      color: #d4b483;
    }
    .btn-quick:hover {
      background: rgba(184,149,90,0.12);
    }
    .auth-quote {
      color: rgba(255,255,255,0.7);
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 1rem;
      text-align: center;
      margin: 1.8rem 0 0;
    }
    @media (max-width: 720px) {
      .auth-page {
        padding: 0;
        align-items: stretch;
        background: linear-gradient(180deg, #050505 0%, #0b0b0a 100%);
      }
      .auth-page::before {
        display: none;
      }
      .auth-card {
        width: 100%;
        max-width: none;
        height: 100dvh;
        border: none;
        border-radius: 0;
        padding: 3.6rem 1.35rem 1rem;
        backdrop-filter: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      .auth-brand {
        margin-bottom: 0.4rem;
      }
      .auth-logo {
        width: 40px;
        height: 40px;
        font-size: 1.4rem;
      }
      .auth-brand-name {
        font-size: 1.6rem;
        letter-spacing: 0.14em;
      }
      .auth-brand-subtitle {
        font-size: 0.82rem;
      }
      .auth-flourish {
        display: none;
      }
      .auth-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .auth-quote {
        margin: 1rem 0 0;
        font-size: 0.85rem;
      }
      .public-nav {
        top: 0.6rem;
        left: 0.6rem;
      }
    }
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
      this.error.set(err?.error?.error ?? err?.message ?? 'Error al iniciar sesión. Verifica tus credenciales.');
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
