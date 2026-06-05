import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
          <p class="page-subtitle">{{ filtered().length }} pieza{{ filtered().length !== 1 ? 's' : '' }} en total</p>
        </div>
      </div>

      <div class="page-content">
        <div class="search-bar">
          <span class="search-icon">&#128269;</span>
          <input
            type="text"
            class="search-input"
            placeholder="Buscar por nombre, material, época..."
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilters()"
          />
          @if (searchTerm) {
            <button class="search-clear" (click)="searchTerm=''; applyFilters()">&times;</button>
          }
        </div>

        <div class="filter-chips">
          <button class="chip" [class.chip-active]="selectedType" (click)="toggleFilter('type')">
            <span class="chip-label">{{ selectedType ? typeLabel(selectedType) : 'Tipo' }}</span>
            @if (selectedType) { <span class="chip-caret">&#9660;</span> }
            @else { <span class="chip-plus">+</span> }
          </button>
          <button class="chip" [class.chip-active]="selectedSubcategory" (click)="toggleFilter('subcategory')">
            <span class="chip-label">{{ selectedSubcategory ? subLabel(selectedSubcategory) : 'Subcategoría' }}</span>
            @if (selectedSubcategory) { <span class="chip-caret">&#9660;</span> }
            @else { <span class="chip-plus">+</span> }
          </button>
          <button class="chip" [class.chip-active]="selectedDetail" (click)="toggleFilter('detail')">
            <span class="chip-label">{{ selectedDetail ? detLabel(selectedDetail) : 'Detalle' }}</span>
            @if (selectedDetail) { <span class="chip-caret">&#9660;</span> }
            @else { <span class="chip-plus">+</span> }
          </button>
          <button class="chip" [class.chip-active]="selectedCatalog" (click)="toggleFilter('catalog')">
            <span class="chip-label">{{ selectedCatalog ? catalogLabel(selectedCatalog) : 'Catálogo' }}</span>
            @if (selectedCatalog) { <span class="chip-caret">&#9660;</span> }
            @else { <span class="chip-plus">+</span> }
          </button>
          <button class="chip" [class.chip-active]="selectedCondition" (click)="toggleFilter('condition')">
            <span class="chip-label">{{ selectedCondition ? selectedCondition : 'Estado' }}</span>
            @if (selectedCondition) { <span class="chip-caret">&#9660;</span> }
            @else { <span class="chip-plus">+</span> }
          </button>
          @if (hasActiveFilters()) {
            <button class="chip chip-clear" (click)="clearAll()">Limpiar</button>
          }
        </div>

        @if (openFilter) {
          <div class="filter-panel" (click)="openFilter=null">
            <div class="filter-panel-inner" (click)="$event.stopPropagation()">
              <div class="filter-panel-header">
                <span class="filter-panel-title">{{ filterTitle() }}</span>
                <button class="filter-panel-close" (click)="openFilter=null">&times;</button>
              </div>
              <div class="filter-panel-body">
                @if (openFilter === 'type') {
                  <button class="filter-option" [class.selected]="!selectedType" (click)="selectType('')">Todos los tipos</button>
                  <button class="filter-option" [class.selected]="selectedType==='antiguedad'" (click)="selectType('antiguedad')">Antigüedades</button>
                  <button class="filter-option" [class.selected]="selectedType==='papeleria'" (click)="selectType('papeleria')">Papelería</button>
                }
                @if (openFilter === 'subcategory') {
                  <button class="filter-option" [class.selected]="!selectedSubcategory" (click)="selectSubcategory('')">Todas las subcategorías</button>
                  @for (sub of availableSubcategories; track sub) {
                    <button class="filter-option" [class.selected]="selectedSubcategory===sub" (click)="selectSubcategory(sub)">{{ subLabel(sub) }}</button>
                  }
                }
                @if (openFilter === 'detail') {
                  <button class="filter-option" [class.selected]="!selectedDetail" (click)="selectDetail('')">Todos los detalles</button>
                  @for (det of availableDetails; track det) {
                    <button class="filter-option" [class.selected]="selectedDetail===det" (click)="selectDetail(det)">{{ detLabel(det) }}</button>
                  }
                }
                @if (openFilter === 'catalog') {
                  <button class="filter-option" [class.selected]="!selectedCatalog" (click)="selectCatalog('')">Todos los catálogos</button>
                  @for (cat of catalogs(); track cat.id) {
                    <button class="filter-option" [class.selected]="selectedCatalog===cat.id" (click)="selectCatalog(cat.id)">{{ cat.name }}</button>
                  }
                }
                @if (openFilter === 'condition') {
                  <button class="filter-option" [class.selected]="!selectedCondition" (click)="selectCondition('')">Todos los estados</button>
                  <button class="filter-option" [class.selected]="selectedCondition==='Excelente'" (click)="selectCondition('Excelente')">Excelente</button>
                  <button class="filter-option" [class.selected]="selectedCondition==='Bueno'" (click)="selectCondition('Bueno')">Bueno</button>
                  <button class="filter-option" [class.selected]="selectedCondition==='Regular'" (click)="selectCondition('Regular')">Regular</button>
                  <button class="filter-option" [class.selected]="selectedCondition==='Para restaurar'" (click)="selectCondition('Para restaurar')">Para restaurar</button>
                }
              </div>
            </div>
          </div>
        }

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
      padding: 2.5rem 1.5rem 1.5rem;
    }
    .page-header-inner { max-width: 1200px; margin: 0 auto; }
    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.375rem, 3vw, 2rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.25rem;
    }
    .page-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; margin: 0; }
    .page-content { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 10px;
      padding: 0 1rem;
      margin-bottom: 0.75rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-bar:focus-within {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .search-icon { font-size: 1rem; color: var(--color-text-muted); flex-shrink: 0; }
    .search-input {
      flex: 1;
      border: none;
      background: none;
      padding: 0.875rem 0;
      font-size: 0.9375rem;
      color: var(--color-text);
      outline: none;
    }
    .search-clear {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0 0.25rem;
      line-height: 1;
    }
    .search-clear:hover { color: var(--color-text); }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      align-items: center;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      border: 1px solid var(--color-border);
      border-radius: 20px;
      background: var(--color-surface);
      color: var(--color-text-muted);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .chip:hover { border-color: var(--color-accent); color: var(--color-primary); }
    .chip-active {
      background: rgba(184,149,90,0.08);
      border-color: var(--color-accent);
      color: var(--color-accent);
      font-weight: 600;
    }
    .chip-label { white-space: nowrap; }
    .chip-plus, .chip-caret { font-size: 0.625rem; line-height: 1; }
    .chip-clear {
      color: var(--color-error);
      border-color: rgba(220,80,60,0.25);
      margin-left: 0.25rem;
    }
    .chip-clear:hover {
      background: rgba(220,80,60,0.06);
      border-color: var(--color-error);
    }

    .filter-panel {
      position: fixed;
      inset: 0;
      z-index: 200;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 6rem;
      background: rgba(0,0,0,0.3);
    }
    .filter-panel-inner {
      background: var(--color-surface);
      border-radius: 14px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.15);
      width: 380px;
      max-width: 90vw;
      max-height: 60vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: fadeSlideIn 0.15s ease-out;
    }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .filter-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--color-border);
    }
    .filter-panel-title { font-weight: 600; font-size: 0.9375rem; color: var(--color-primary); }
    .filter-panel-close {
      background: none;
      border: none;
      font-size: 1.375rem;
      color: var(--color-text-muted);
      cursor: pointer;
      line-height: 1;
      padding: 0;
    }
    .filter-panel-close:hover { color: var(--color-text); }
    .filter-panel-body {
      padding: 0.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .filter-option {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      padding: 0.625rem 0.875rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      color: var(--color-text);
      cursor: pointer;
      transition: background 0.15s;
    }
    .filter-option:hover { background: var(--color-bg-2); }
    .filter-option.selected {
      background: rgba(184,149,90,0.1);
      color: var(--color-accent);
      font-weight: 600;
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
  selectedType = '';
  selectedSubcategory = '';
  selectedDetail = '';
  selectedCatalog = '';
  selectedCondition = '';
  openFilter: string | null = null;

  subcategoryLabels: Record<string, string> = {
    escultura: 'Escultura',
    pintura: 'Pintura',
    cristal: 'Cristal',
    ceramica: 'Cerámica',
    filatelia: 'Filatelia',
    fotos: 'Fotos',
    revistas: 'Revistas / Periódicos',
    documentos: 'Documentos',
    libros: 'Libros',
  };

  detailLabels: Record<string, string> = {
    busto: 'Busto', figura: 'Figura', belen: 'Belén',
    oleo: 'Óleo', grabado: 'Grabado', acuarela: 'Acuarela',
    'hist-postal': 'Hist. postal', 'entero-postal': 'Entero postal', sello: 'Sello',
    'pre-filatelia': 'Pre-filatelia', censura: 'Censura',
    familiar: 'Familiar', boda: 'Boda', ninos: 'Niños', hombres: 'Hombres',
    mujeres: 'Mujeres', militar: 'Militar', etnica: 'Étnica', paisaje: 'Paisaje',
    retrato: 'Retrato', 'blanco-negro': 'Blanco y negro', estudio: 'Estudio',
    reportaje: 'Reportaje', arquitectura: 'Arquitectura', naturaleza: 'Naturaleza',
    'post-mortem': 'Post mortem',
    motos: 'Motos', coches: 'Coches', politica: 'Política', historia: 'Historia',
    ciencia: 'Ciencia', deportes: 'Deportes', moda: 'Moda', arte: 'Arte',
    musica: 'Música', humor: 'Humor', viajes: 'Viajes', economia: 'Economía',
    cultura: 'Cultura', tecnologia: 'Tecnología',
    folletos: 'Folletos', partituras: 'Partituras', escrituras: 'Escrituras',
    mapas: 'Mapas', carteles: 'Carteles', otros: 'Otros',
  };

  get availableSubcategories(): string[] {
    let items = this.antiques();
    if (this.selectedType) items = items.filter(a => a.type === this.selectedType);
    return [...new Set(items.map(a => a.subcategory).filter(Boolean))].sort();
  }

  get availableDetails(): string[] {
    let items = this.antiques();
    if (this.selectedType) items = items.filter(a => a.type === this.selectedType);
    if (this.selectedSubcategory) items = items.filter(a => a.subcategory === this.selectedSubcategory);
    return [...new Set(items.map(a => a.detail).filter(Boolean))].sort();
  }

  constructor(
    private antiquesService: AntiquesService,
    private catalogsService: CatalogsService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      const [antiques, catalogs] = await Promise.all([
        this.antiquesService.getAll(),
        this.catalogsService.getAll()
      ]);
      this.antiques.set(antiques);
      this.catalogs.set(catalogs);
      this.route.queryParams.subscribe(params => {
        if (params['tipo']) {
          this.selectedType = params['tipo'];
          this.selectedSubcategory = '';
          this.selectedDetail = '';
        }
        this.applyFilters();
      });
    } finally {
      this.loading.set(false);
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedType || this.selectedSubcategory || this.selectedDetail || this.selectedCatalog || this.selectedCondition);
  }

  typeLabel(t: string): string {
    return t === 'antiguedad' ? 'Antigüedades' : 'Papelería';
  }

  subLabel(key: string): string {
    return this.subcategoryLabels[key] ?? key;
  }

  detLabel(key: string): string {
    return this.detailLabels[key] ?? key;
  }

  catalogLabel(id: string): string {
    return this.catalogs().find(c => c.id === id)?.name ?? id;
  }

  filterTitle(): string {
    const map: Record<string, string> = {
      type: 'Tipo', subcategory: 'Subcategoría', detail: 'Detalle',
      catalog: 'Catálogo', condition: 'Estado',
    };
    return map[this.openFilter ?? ''] ?? '';
  }

  toggleFilter(name: string) {
    this.openFilter = this.openFilter === name ? null : name;
  }

  selectType(val: string) {
    this.selectedType = val;
    this.selectedSubcategory = '';
    this.selectedDetail = '';
    this.openFilter = null;
    this.applyFilters();
  }

  selectSubcategory(val: string) {
    this.selectedSubcategory = val;
    this.selectedDetail = '';
    this.openFilter = null;
    this.applyFilters();
  }

  selectDetail(val: string) {
    this.selectedDetail = val;
    this.openFilter = null;
    this.applyFilters();
  }

  selectCatalog(val: string) {
    this.selectedCatalog = val;
    this.openFilter = null;
    this.applyFilters();
  }

  selectCondition(val: string) {
    this.selectedCondition = val;
    this.openFilter = null;
    this.applyFilters();
  }

  clearAll() {
    this.selectedType = '';
    this.selectedSubcategory = '';
    this.selectedDetail = '';
    this.selectedCatalog = '';
    this.selectedCondition = '';
    this.openFilter = null;
    this.applyFilters();
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
    if (this.selectedType) result = result.filter(a => a.type === this.selectedType);
    if (this.selectedSubcategory) result = result.filter(a => a.subcategory === this.selectedSubcategory);
    if (this.selectedDetail) result = result.filter(a => a.detail === this.selectedDetail);
    if (this.selectedCatalog) result = result.filter(a => a.catalog_id === this.selectedCatalog);
    if (this.selectedCondition) result = result.filter(a => a.condition === this.selectedCondition);
    this.filtered.set(result);
  }
}
