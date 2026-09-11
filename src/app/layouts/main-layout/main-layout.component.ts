import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img class="footer-brand-logo" src="assets/logo-antiguedades.png" alt="Antigüedades" />
          <div>
            <p class="footer-brand-name">Antigüedades</p>
            <p class="footer-brand-copy">Colección privada familiar</p>
          </div>
        </div>

        <nav class="footer-links" aria-label="Enlaces secundarios">
          <a routerLink="/">Inicio</a>
          <a routerLink="/coleccion">Colección</a>
          @if (auth.isAdmin) {
            <a routerLink="/subir">Subir Pieza</a>
          }
        </nav>

        <p class="footer-note">Piezas únicas reunidas con pasión, conservadas para la familia.</p>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Antigüedades</span>
        <span>Archivo familiar privado</span>
      </div>
    </footer>
  `,
  styles: [`
    main { min-height: calc(100vh - 64px); }
    .site-footer {
      background:
        linear-gradient(180deg, #171717 0%, #10100f 100%);
      border-top: 1px solid rgba(184, 149, 90, 0.42);
      color: rgba(255,255,255,0.82);
      box-shadow: 0 -1px 18px rgba(0,0,0,0.16);
    }
    .footer-inner {
      max-width: 1540px;
      margin: 0 auto;
      padding: 2.2rem 5.25rem;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 2rem;
    }
    .footer-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.9rem;
      justify-self: start;
    }
    .footer-brand-logo {
      width: 52px;
      height: 52px;
      display: block;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(184,149,90,0.14));
    }
    .footer-brand-name {
      font-family: 'Playfair Display', serif;
      color: var(--color-accent-light);
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin: 0 0 0.2rem;
    }
    .footer-brand-copy {
      color: rgba(255,255,255,0.58);
      font-size: 0.82rem;
      margin: 0;
    }
    .footer-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.9rem;
    }
    .footer-links a {
      color: rgba(255,255,255,0.78);
      font-family: 'Playfair Display', serif;
      font-size: 0.92rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
      white-space: nowrap;
    }
    .footer-links a:hover {
      color: var(--color-accent-light);
    }
    .footer-note {
      justify-self: end;
      max-width: 330px;
      color: rgba(255,255,255,0.62);
      font-family: 'Playfair Display', serif;
      font-size: 0.95rem;
      line-height: 1.55;
      text-align: right;
      margin: 0;
    }
    .footer-bottom {
      max-width: 1540px;
      margin: 0 auto;
      padding: 0.9rem 5.25rem 1.05rem;
      border-top: 1px solid rgba(184,149,90,0.18);
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      color: rgba(255,255,255,0.45);
      font-size: 0.78rem;
    }
    @media (max-width: 920px) {
      .footer-inner {
        padding: 2rem 1rem;
        grid-template-columns: 1fr;
        justify-items: start;
        gap: 1.45rem;
      }
      .footer-links {
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 0.85rem 1.4rem;
      }
      .footer-note {
        justify-self: start;
        text-align: left;
      }
      .footer-bottom {
        padding: 0.9rem 1rem 1.05rem;
        flex-direction: column;
        gap: 0.35rem;
      }
    }
  `]
})
export class MainLayoutComponent {
  auth = inject(AuthService);
}
