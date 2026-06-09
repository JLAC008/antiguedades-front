import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogsService } from '../../core/catalogs.service';
import { AntiquesService } from '../../core/antiques.service';
import { AntiqueCardComponent } from '../../components/antique-card/antique-card.component';
import { Catalog, Antique } from '../../models';
import { AuthService } from '../../core/auth.service';

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
            <div class="page-flourish" aria-hidden="true">⌘</div>
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
            @if (auth.isAdmin) {
              <a routerLink="/subir" class="btn-primary">Añadir primera pieza</a>
            }
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
    .page {
      min-height: 100vh;
      background:
        radial-gradient(circle at 50% 0%, rgba(184, 149, 90, 0.09), transparent 36rem),
        #fbfaf7;
    }
    .page-header {
      background: rgba(255, 255, 255, 0.64);
      border-bottom: 1px solid #ded3c4;
      padding: 3.55rem 1.5rem 3rem;
    }
    .page-header-inner { max-width: 1200px; margin: 0 auto; }
    .breadcrumb {
      font-size: 1rem;
      color: #7c6a58;
      text-decoration: none;
      font-weight: 700;
      display: inline-block;
      margin-bottom: 1.45rem;
      transition: color 0.2s;
    }
    .breadcrumb:hover { color: var(--color-accent); }
    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 3.4vw, 2.75rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
    }
    .page-flourish {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: var(--color-accent);
      font-family: Georgia, serif;
      font-size: 0.92rem;
      margin: 1rem 0 1.05rem;
      opacity: 0.78;
    }
    .page-flourish::before,
    .page-flourish::after {
      content: '';
      width: 4.1rem;
      height: 1px;
      background: linear-gradient(90deg, rgba(184, 149, 90, 0.78), transparent);
    }
    .page-flourish::before {
      background: linear-gradient(90deg, transparent, rgba(184, 149, 90, 0.78));
    }
    .page-subtitle { color: #5f5145; font-size: 1.02rem; margin: 0; }
    .page-content { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; }
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
    @media (max-width: 768px) {
      .page-header {
        padding: 2.35rem 1rem 2.15rem;
      }
      .breadcrumb {
        margin-bottom: 1.05rem;
        font-size: 0.95rem;
      }
      .page-title {
        font-size: clamp(2rem, 11vw, 2.55rem);
      }
      .page-flourish {
        margin: 0.82rem 0 0.92rem;
      }
      .page-flourish::before,
      .page-flourish::after {
        width: 3.3rem;
      }
      .page-content {
        padding: 1.5rem 1rem 3rem;
      }
      .antiques-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
      }
    }
  `]
})
export class CatalogDetailComponent implements OnInit {
  catalog = signal<Catalog | null>(null);
  antiques = signal<Antique[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private catalogsService: CatalogsService,
    private antiquesService: AntiquesService,
    public auth: AuthService
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
