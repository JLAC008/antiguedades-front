import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AntiquesService } from '../../core/antiques.service';
import { CatalogsService } from '../../core/catalogs.service';
import { AntiqueCardComponent } from '../../components/antique-card/antique-card.component';
import { Antique, Catalog } from '../../models';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [FormsModule, AntiqueCardComponent],
  template: `
    <div class="page-collection">
      <div class="page-header">
        <div class="page-header-inner">
          <h1 class="page-title">Colección Completa</h1>
          <p class="page-subtitle">{{ antiques().length }} pieza{{ antiques().length !== 1 ? 's' : '' }} en total</p>
        </div>
      </div>

      <div class="page-content">
        <div class="filters">
          <div class="filter-group">
            <label class="filter-label">Buscar</label>
            <input
              type="text"
              class="filter-input"
              placeholder="Nombre, material, época..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="applyFilters()"
            />
          </div>
          <div class="filter-group">
            <label class="filter-label">Catálogo</label>
            <select class="filter-select" [(ngModel)]="selectedCatalog" (ngModelChange)="applyFilters()">
              <option value="">Todos los catálogos</option>
              @for (cat of catalogs(); track cat.id) {
                <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Estado</label>
            <select class="filter-select" [(ngModel)]="selectedCondition" (ngModelChange)="applyFilters()">
              <option value="">Todos los estados</option>
              <option value="Excelente">Excelente</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Para restaurar">Para restaurar</option>
            </select>
          </div>
        </div>

        @if (loading()) {
          <div class="antiques-grid">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="skeleton-card"></div>
            }
          </div>
        } @else if (filtered().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">&#128269;</span>
            <p>No se encontraron piezas con los filtros seleccionados.</p>
          </div>
        } @else {
          <div class="antiques-grid">
            @for (antique of filtered(); track antique.id) {
              <app-antique-card [antique]="antique" />
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-collection { min-height: 100vh; background: var(--color-bg); }
    .page-header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 3rem 1.5rem 2rem;
    }
    .page-header-inner { max-width: 1200px; margin: 0 auto; }
    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.375rem;
    }
    .page-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; margin: 0; }
    .page-content { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1.25rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 10px;
    }
    .filter-group { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; min-width: 180px; }
    .filter-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .filter-input, .filter-select {
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 0.9375rem;
      color: var(--color-text);
      background: var(--color-bg);
      transition: border-color 0.2s;
    }
    .filter-input:focus, .filter-select:focus {
      outline: none;
      border-color: var(--color-accent);
    }
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
  `]
})
export class CollectionComponent implements OnInit {
  antiques = signal<Antique[]>([]);
  filtered = signal<Antique[]>([]);
  catalogs = signal<Catalog[]>([]);
  loading = signal(true);
  searchTerm = '';
  selectedCatalog = '';
  selectedCondition = '';

  constructor(
    private antiquesService: AntiquesService,
    private catalogsService: CatalogsService
  ) {}

  async ngOnInit() {
    try {
      const [antiques, catalogs] = await Promise.all([
        this.antiquesService.getAll(),
        this.catalogsService.getAll()
      ]);
      this.antiques.set(antiques);
      this.filtered.set(antiques);
      this.catalogs.set(catalogs);
    } finally {
      this.loading.set(false);
    }
  }

  applyFilters() {
    let result = this.antiques();
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(term) ||
        a.material.toLowerCase().includes(term) ||
        a.year_era.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term)
      );
    }
    if (this.selectedCatalog) {
      result = result.filter(a => a.catalog_id === this.selectedCatalog);
    }
    if (this.selectedCondition) {
      result = result.filter(a => a.condition === this.selectedCondition);
    }
    this.filtered.set(result);
  }
}
