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
          <span class="nav-brand-icon">&#9775;</span>
          <span>Antiguedades</span>
        </a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">Catálogos</a>
          <a routerLink="/coleccion" routerLinkActive="active" class="nav-link">Colección</a>
          @if (auth.isLoggedIn) {
            <a routerLink="/subir" routerLinkActive="active" class="nav-link">Subir Pieza</a>
            <a routerLink="/catalogos" routerLinkActive="active" class="nav-link">Gestionar</a>
            <button class="btn-outline-sm" (click)="signOut()">Salir</button>
          } @else {
            <a routerLink="/login" class="btn-primary-sm">Acceder</a>
          }
        </div>
        <button class="nav-toggle" (click)="toggleMenu()">
          <span></span><span></span><span></span>
        </button>
      </div>
      @if (menuOpen) {
        <div class="nav-mobile">
          <a routerLink="/" class="nav-mobile-link" (click)="closeMenu()">Catálogos</a>
          <a routerLink="/coleccion" class="nav-mobile-link" (click)="closeMenu()">Colección</a>
          @if (auth.isLoggedIn) {
            <a routerLink="/subir" class="nav-mobile-link" (click)="closeMenu()">Subir Pieza</a>
            <a routerLink="/catalogos" class="nav-mobile-link" (click)="closeMenu()">Gestionar</a>
            <button class="nav-mobile-link" style="text-align:left;background:none;border:none;cursor:pointer;color:var(--color-error);padding:0.75rem 1.5rem;font-size:0.9375rem;" (click)="signOut()">Cerrar sesión</button>
          } @else {
            <a routerLink="/login" class="nav-mobile-link" (click)="closeMenu()">Acceder</a>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 8px rgba(0,0,0,0.06);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      letter-spacing: 0.01em;
    }
    .nav-brand-icon {
      color: var(--color-accent);
      font-size: 1.4rem;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .nav-link {
      text-decoration: none;
      color: var(--color-text-muted);
      font-size: 0.9375rem;
      padding: 0.5rem 0.875rem;
      border-radius: 6px;
      transition: all 0.2s;
      font-weight: 500;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--color-primary);
      background: var(--color-bg-2);
    }
    .btn-primary-sm {
      background: var(--color-primary);
      color: white;
      text-decoration: none;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-size: 0.9375rem;
      font-weight: 600;
      transition: all 0.2s;
      margin-left: 0.5rem;
    }
    .btn-primary-sm:hover { background: var(--color-secondary); }
    .btn-outline-sm {
      background: none;
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      margin-left: 0.5rem;
    }
    .btn-outline-sm:hover { border-color: var(--color-error); color: var(--color-error); }
    .nav-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .nav-toggle span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--color-primary);
      border-radius: 2px;
      transition: 0.2s;
    }
    .nav-mobile {
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      background: var(--color-surface);
    }
    .nav-mobile-link {
      text-decoration: none;
      color: var(--color-text);
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border-bottom: 1px solid var(--color-border);
      transition: background 0.2s;
    }
    .nav-mobile-link:hover { background: var(--color-bg-2); }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .nav-toggle { display: flex; }
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
    this.router.navigate(['/']);
  }
}
