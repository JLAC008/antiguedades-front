import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogsService } from '../../core/catalogs.service';
import { AntiquesService } from '../../core/antiques.service';
import { AntiqueCardComponent } from '../../components/antique-card/antique-card.component';
import { Catalog, Antique } from '../../models';

@Component({
  selector: 'app-catalog-detail',
  standalone: true,
  imports: [RouterLink, AntiqueCardComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="page-header-inner">
          <a routerLink="/" class="breadcrumb">&larr; Catálogos</a>
          @if (catalog()) {
            <h1 class="page-title">{{ catalog()!.name }}</h1>
            @if (catalog()!.description) {
              <p class="page-subtitle">{{ catalog()!.description }}</p>
            }
          }
        </div>
      </div>

      <div class="page-content">
        @if (loading()) {
          <div class="antiques-grid">
            @for (i of [1,2,3,4]; track i) {
              <div class="skeleton-card"></div>
            }
          </div>
        } @else if (antiques().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">&#128250;</span>
            <p>Este catálogo no tiene piezas todavía.</p>
            <a routerLink="/subir" class="btn-primary">Añadir primera pieza</a>
          </div>
        } @else {
          <div class="antiques-grid">
            @for (antique of antiques(); track antique.id) {
              <app-antique-card [antique]="antique" />
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: var(--color-bg); }
    .page-header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 2rem 1.5rem 2.5rem;
    }
    .page-header-inner { max-width: 1200px; margin: 0 auto; }
    .breadcrumb {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      text-decoration: none;
      font-weight: 500;
      display: inline-block;
      margin-bottom: 1rem;
      transition: color 0.2s;
    }
    .breadcrumb:hover { color: var(--color-accent); }
    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.5rem;
    }
    .page-subtitle { color: var(--color-text-muted); font-size: 1rem; margin: 0; }
    .page-content { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; }
    .antiques-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .skeleton-card {
      height: 340px;
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
    .btn-primary {
      display: inline-block;
      background: var(--color-primary);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 1rem;
      transition: background 0.2s;
    }
    .btn-primary:hover { background: var(--color-secondary); }
  `]
})
export class CatalogDetailComponent implements OnInit {
  catalog = signal<Catalog | null>(null);
  antiques = signal<Antique[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private catalogsService: CatalogsService,
    private antiquesService: AntiquesService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      const [catalog, antiques] = await Promise.all([
        this.catalogsService.getById(id),
        this.antiquesService.getByCatalog(id)
      ]);
      this.catalog.set(catalog);
      this.antiques.set(antiques);
    } finally {
      this.loading.set(false);
    }
  }
}
