import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <span class="nav-brand-icon">A</span>
          <span class="nav-brand-text">Antigüedades</span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">Inicio</a>
          <a routerLink="/coleccion" routerLinkActive="active" class="nav-link">Colección</a>
          @if (auth.isAdmin) {
            <a routerLink="/subir" routerLinkActive="active" class="nav-link">Subir Pieza</a>
            <a routerLink="/catalogos" routerLinkActive="active" class="nav-link">Gestionar</a>
            <a routerLink="/usuarios" routerLinkActive="active" class="nav-link">Usuarios</a>
          }
        </div>

        <div class="nav-actions">
          @if (auth.isLoggedIn) {
            <button class="btn-outline-sm" (click)="signOut()">
              <span class="btn-user-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
                  <path d="M5 20c.7-3.2 3.3-5 7-5s6.3 1.8 7 5"/>
                </svg>
              </span>
              <span>Salir</span>
            </button>
          } @else {
            <a routerLink="/login" class="btn-primary-sm">
              <span class="btn-user-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
                  <path d="M5 20c.7-3.2 3.3-5 7-5s6.3 1.8 7 5"/>
                </svg>
              </span>
              <span>Acceder</span>
            </a>
          }
        </div>

        <button class="nav-toggle" (click)="toggleMenu()" aria-label="Abrir menú">
          <span></span><span></span><span></span>
        </button>
      </div>
      @if (menuOpen) {
        <div class="nav-mobile">
          <a routerLink="/" class="nav-mobile-link" (click)="closeMenu()">Inicio</a>
          <a routerLink="/coleccion" class="nav-mobile-link" (click)="closeMenu()">Colección</a>
          @if (auth.isAdmin) {
            <a routerLink="/subir" class="nav-mobile-link" (click)="closeMenu()">Subir Pieza</a>
            <a routerLink="/catalogos" class="nav-mobile-link" (click)="closeMenu()">Gestionar</a>
            <a routerLink="/usuarios" class="nav-mobile-link" (click)="closeMenu()">Usuarios</a>
          }
          @if (auth.isLoggedIn) {
            <button class="nav-mobile-link nav-mobile-button" (click)="signOut()">Cerrar sesión</button>
          } @else {
            <a routerLink="/login" class="nav-mobile-link" (click)="closeMenu()">Acceder</a>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(180deg, #171717 0%, #111110 100%);
      border-bottom: 1px solid rgba(184, 149, 90, 0.42);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 18px rgba(0,0,0,0.34);
    }
    .nav-container {
      max-width: 1540px;
      margin: 0 auto;
      padding: 0 5.25rem;
      height: 76px;
      display: grid;
      grid-template-columns: minmax(260px, 1fr) auto minmax(260px, 1fr);
      align-items: center;
      gap: 1rem;
    }
    .nav-brand {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      justify-self: start;
      text-decoration: none;
      color: var(--color-accent-light);
    }
    .nav-brand-icon {
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(184, 149, 90, 0.58);
      border-radius: 50%;
      font-family: 'Playfair Display', serif;
      font-size: 1.45rem;
      font-weight: 700;
      color: #d0b272;
      background:
        radial-gradient(circle, rgba(184,149,90,0.18), transparent 62%),
        #1b1a17;
      box-shadow: inset 0 0 0 5px rgba(184,149,90,0.06), 0 0 28px rgba(184,149,90,0.08);
    }
    .nav-brand-text {
      font-family: 'Playfair Display', serif;
      font-size: 1.16rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      text-shadow: 0 0 18px rgba(184,149,90,0.22);
    }
    .nav-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2.65rem;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      justify-self: stretch;
    }
    .nav-link {
      position: relative;
      text-decoration: none;
      color: rgba(255,255,255,0.88);
      font-family: 'Playfair Display', serif;
      font-size: 0.93rem;
      padding: 1.8rem 0 1.55rem;
      transition: color 0.2s;
      font-weight: 600;
      white-space: nowrap;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 1rem;
      width: 0;
      height: 1px;
      background: var(--color-accent);
      transform: translateX(-50%);
      transition: width 0.2s;
    }
    .nav-link:hover,
    .nav-link.active {
      color: var(--color-accent-light);
    }
    .nav-link.active::after,
    .nav-link:hover::after {
      width: 36px;
    }
    .btn-primary-sm,
    .btn-outline-sm {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(184, 149, 90, 0.72);
      color: var(--color-accent-light);
      text-decoration: none;
      padding: 0.78rem 1.42rem;
      border-radius: 999px;
      font-family: 'Playfair Display', serif;
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-primary-sm:hover,
    .btn-outline-sm:hover {
      background: rgba(184,149,90,0.13);
      border-color: var(--color-accent-light);
      transform: translateY(-1px);
    }
    .btn-user-icon svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
      display: block;
    }
    .nav-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: 1px solid rgba(184,149,90,0.5);
      border-radius: 999px;
      cursor: pointer;
      padding: 0.65rem 0.75rem;
      justify-self: end;
    }
    .nav-toggle span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--color-accent-light);
      border-radius: 2px;
      transition: 0.2s;
    }
    .nav-mobile {
      border-top: 1px solid rgba(184,149,90,0.32);
      display: flex;
      flex-direction: column;
      background: #141312;
    }
    .nav-mobile-link {
      text-decoration: none;
      color: rgba(255,255,255,0.88);
      padding: 0.9rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      border-bottom: 1px solid rgba(184,149,90,0.18);
      transition: background 0.2s;
    }
    .nav-mobile-link:hover { background: rgba(184,149,90,0.1); }
    .nav-mobile-button {
      text-align: left;
      background: none;
      border-left: none;
      border-right: none;
      border-top: none;
      cursor: pointer;
      color: var(--color-accent-light);
      font-family: inherit;
    }
    @media (max-width: 920px) {
      .nav-container {
        display: flex;
        padding: 0 1rem;
      }
      .nav-brand-text {
        font-size: 0.98rem;
        letter-spacing: 0.16em;
      }
      .nav-links,
      .nav-actions {
        display: none;
      }
      .nav-toggle { display: flex; }
    }
    @media (max-width: 520px) {
      .nav-container {
        height: 68px;
      }
      .nav-brand {
        gap: 0.7rem;
      }
      .nav-brand-icon {
        width: 38px;
        height: 38px;
        font-size: 1.22rem;
      }
      .nav-brand-text {
        font-size: 0.82rem;
        letter-spacing: 0.12em;
      }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  menuOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
