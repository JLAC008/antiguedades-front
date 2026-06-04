import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogsService } from '../../core/catalogs.service';
import { CatalogCardComponent } from '../../components/catalog-card/catalog-card.component';
import { Catalog } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CatalogCardComponent],
  template: `
    <div class="page-home">
      <section class="hero">
        <video class="hero-video" autoplay muted playsinline poster="assets/hero-bg.mp4">
          <source src="assets/hero-bg.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <p class="hero-overline">Colecci&oacute;n privada</p>
          <h1 class="hero-title">Nuestra Colecci&oacute;n Familiar</h1>
          <p class="hero-subtitle">Piezas &uacute;nicas reunidas con pasi&oacute;n, guardadas para la familia.</p>
          <a routerLink="/coleccion" class="hero-cta">Ver toda la colecci&oacute;n</a>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Catálogos</h2>
          <p class="section-subtitle">Colecciones organizadas por temática, época o estilo</p>
        </div>

        @if (loading()) {
          <div class="loading-grid">
            @for (i of [1,2,3,4]; track i) {
              <div class="skeleton-card"></div>
            }
          </div>
        } @else if (catalogs().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">&#128193;</span>
            <p>Aún no hay catálogos disponibles.</p>
          </div>
        } @else {
          <div class="catalogs-grid">
            @for (catalog of catalogs(); track catalog.id) {
              <app-catalog-card [catalog]="catalog" />
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .page-home { min-height: 100vh; }
    .hero {
      color: white;
      padding: 5rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 420px;
      position: relative;
      overflow: hidden;
    }
    .hero-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(28, 22, 18, 0.6);
      z-index: 1;
    }
    .hero-content {
      max-width: 620px;
      text-align: center;
      position: relative;
      z-index: 2;
    }
    .hero-overline {
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-accent-light);
      margin: 0 0 1rem;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.875rem, 5vw, 3rem);
      font-weight: 700;
      line-height: 1.2;
      color: white;
      margin: 0 0 1.25rem;
    }
    .hero-subtitle {
      font-size: 1.0625rem;
      color: rgba(255,255,255,0.75);
      line-height: 1.6;
      margin: 0 0 2rem;
    }
    .hero-cta {
      display: inline-block;
      background: var(--color-accent);
      color: white;
      text-decoration: none;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9375rem;
      transition: background 0.2s, transform 0.2s;
    }
    .hero-cta:hover { background: var(--color-accent-light); transform: translateY(-2px); }
    .section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }
    .section-header {
      margin-bottom: 2.5rem;
      text-align: center;
    }
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.5rem;
    }
    .section-subtitle {
      color: var(--color-text-muted);
      font-size: 1rem;
      margin: 0;
    }
    .catalogs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .skeleton-card {
      height: 320px;
      background: linear-gradient(90deg, var(--color-bg-2) 25%, var(--color-border) 50%, var(--color-bg-2) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 12px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--color-text-muted);
    }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
  `]
})
export class HomeComponent implements OnInit {
  catalogs = signal<Catalog[]>([]);
  loading = signal(true);

  constructor(private catalogsService: CatalogsService) {}

  async ngOnInit() {
    try {
      this.catalogs.set(await this.catalogsService.getAll());
    } finally {
      this.loading.set(false);
    }
  }
}
