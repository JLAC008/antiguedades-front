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
      <section class="collection-hero">
        <div class="collection-hero-shade"></div>
        <div class="collection-hero-inner">
          <p class="hero-kicker">Colección completa</p>
          <h1 class="hero-title">Piezas únicas. Historias eternas.</h1>
          <div class="hero-flourish" aria-hidden="true">⌘</div>
          <p class="hero-copy">
            Explora nuestra colección privada de antigüedades cuidadosamente seleccionadas
            por su valor histórico, artístico y cultural.
          </p>

          <div class="stats-row" aria-label="Resumen de la colección">
            <div class="stat-card">
              <span class="stat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M21 8.5 12 3 3 8.5l9 5.5 9-5.5Z"/><path d="M3 8.5V16l9 5.5 9-5.5V8.5"/><path d="M12 14v7.5"/></svg>
              </span>
              <div><strong>{{ antiques().length }}</strong><span>Piezas catalogadas</span></div>
            </div>
            <div class="stat-card">
              <span class="stat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m12 3 7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3Z"/><path d="m12 8 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L12 8Z"/></svg>
              </span>
              <div><strong>{{ categoryCount() }}</strong><span>Categorías</span></div>
            </div>
            <div class="stat-card">
              <span class="stat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/></svg>
              </span>
              <div><strong>{{ eraSummary() }}</strong><span>Épocas representadas</span></div>
            </div>
            <div class="stat-card">
              <span class="stat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.2A3 3 0 0 0 12.5 8H11a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-1.5A3 3 0 0 1 9 14.8"/></svg>
              </span>
              <div><strong>{{ totalValueLabel() }}</strong><span>Valor estimado total</span></div>
            </div>
          </div>
        </div>
      </section>

      <div class="page-content">
        <div class="collection-panel">
          <div class="toolbar">
            <label class="search-bar">
              <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
              </span>
              <input
                type="text"
                class="search-input"
                placeholder="Buscar por nombre, material, época..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="applyFilters()"
              />
              @if (searchTerm) {
                <button class="search-clear" type="button" (click)="searchTerm=''; applyFilters()">&times;</button>
              }
            </label>

            <div class="filter-chips">
              <button class="chip" [class.chip-active]="selectedType" (click)="toggleFilter('type')">
                <span>{{ selectedType ? typeLabel(selectedType) : 'Tipo' }}</span>
                <span class="chip-caret">⌄</span>
              </button>
              <button class="chip" [class.chip-active]="selectedSubcategory" (click)="toggleFilter('subcategory')">
                <span>{{ selectedSubcategory ? subLabel(selectedSubcategory) : 'Categoría' }}</span>
                <span class="chip-caret">⌄</span>
              </button>
              <button class="chip" [class.chip-active]="selectedDetail" (click)="toggleFilter('detail')">
                <span>{{ selectedDetail ? detLabel(selectedDetail) : 'Material' }}</span>
                <span class="chip-caret">⌄</span>
              </button>
              <button class="chip" [class.chip-active]="selectedCondition" (click)="toggleFilter('condition')">
                <span>{{ selectedCondition ? selectedCondition : 'Estado' }}</span>
                <span class="chip-caret">⌄</span>
              </button>
              <button class="chip chip-more" [class.chip-active]="selectedCatalog" (click)="toggleFilter('catalog')">
                <span>{{ selectedCatalog ? catalogLabel(selectedCatalog) : 'Más filtros' }}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M8 5v4M16 15v4"/></svg>
              </button>
              @if (hasActiveFilters()) {
                <button class="chip chip-clear" (click)="clearAll()">Limpiar</button>
              }
            </div>

            <div class="toolbar-actions">
              <select class="sort-select" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" aria-label="Ordenar colección">
                <option value="recent">Ordenar por</option>
                <option value="priceDesc">Precio mayor</option>
                <option value="priceAsc">Precio menor</option>
                <option value="name">Nombre</option>
              </select>
              <button class="view-btn active" type="button" aria-label="Vista de cuadrícula">
                <svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>
              </button>
              <button class="view-btn" type="button" aria-label="Vista de lista">
                <svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>
              </button>
            </div>
          </div>

          <p class="result-count">{{ filtered().length }} pieza{{ filtered().length !== 1 ? 's' : '' }} encontradas</p>

          @if (loading()) {
            <div class="antiques-grid">
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="skeleton-card"></div>
              }
            </div>
          } @else if (filtered().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">⌕</span>
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
                  <button class="filter-option" [class.selected]="!selectedSubcategory" (click)="selectSubcategory('')">Todas las categorías</button>
                  @for (sub of availableSubcategories; track sub) {
                    <button class="filter-option" [class.selected]="selectedSubcategory===sub" (click)="selectSubcategory(sub)">{{ subLabel(sub) }}</button>
                  }
                }
                @if (openFilter === 'detail') {
                  <button class="filter-option" [class.selected]="!selectedDetail" (click)="selectDetail('')">Todos los materiales</button>
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
      </div>
    </div>
  `,
  styles: [`
    .page-collection {
      min-height: 100vh;
      background:
        radial-gradient(circle at 50% 0%, rgba(184, 149, 90, 0.14), transparent 28rem),
        linear-gradient(180deg, #050505 0%, #0b0b0a 46%, #10100f 100%);
      color: #f7efe3;
    }

    .collection-hero {
      position: relative;
      min-height: 460px;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.78)),
        url('/assets/login-bg-gallery.png') center 42% / cover no-repeat;
      border-bottom: 1px solid rgba(184, 149, 90, 0.32);
    }

    .collection-hero-shade {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 18% 30%, rgba(184, 149, 90, 0.16), transparent 18rem),
        radial-gradient(circle at 84% 20%, rgba(184, 149, 90, 0.12), transparent 20rem),
        linear-gradient(90deg, rgba(0,0,0,0.45), transparent 22%, transparent 72%, rgba(0,0,0,0.45));
      pointer-events: none;
    }

    .collection-hero-inner {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 4.2rem 1.5rem 1.55rem;
      text-align: center;
    }

    .hero-kicker {
      margin: 0 0 0.6rem;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: clamp(1rem, 1.8vw, 1.35rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .hero-title {
      max-width: 920px;
      margin: 0 auto;
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.4rem, 5vw, 4.05rem);
      font-weight: 700;
      color: #fff8ed;
      text-shadow: 0 12px 34px rgba(0, 0, 0, 0.55);
    }

    .hero-flourish {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.85rem;
      margin: 1rem auto 1.1rem;
      color: #c89b4b;
      font-family: Georgia, serif;
      font-size: 1rem;
    }

    .hero-flourish::before,
    .hero-flourish::after {
      content: '';
      width: 5.3rem;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(200, 155, 75, 0.9));
    }

    .hero-flourish::after {
      background: linear-gradient(90deg, rgba(200, 155, 75, 0.9), transparent);
    }

    .hero-copy {
      max-width: 650px;
      margin: 0 auto 1.95rem;
      color: rgba(255, 248, 237, 0.78);
      font-size: 1.02rem;
      line-height: 1.75;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.9rem;
      max-width: 930px;
      margin: 0 auto;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-height: 78px;
      padding: 1rem 1.25rem;
      text-align: left;
      background: linear-gradient(135deg, rgba(21, 18, 14, 0.92), rgba(9, 9, 8, 0.78));
      border: 1px solid rgba(200, 155, 75, 0.72);
      box-shadow: 0 16px 42px rgba(0, 0, 0, 0.34);
    }

    .stat-icon {
      display: grid;
      place-items: center;
      width: 2.25rem;
      height: 2.25rem;
      flex: 0 0 auto;
      color: #d4ac62;
    }

    .stat-icon svg,
    .search-icon svg,
    .chip svg,
    .view-btn svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .stat-card strong {
      display: block;
      font-family: 'Playfair Display', serif;
      font-size: 1.72rem;
      line-height: 1;
      color: #ffe0a0;
    }

    .stat-card div span {
      display: block;
      margin-top: 0.28rem;
      color: rgba(255, 248, 237, 0.78);
      font-size: 0.9rem;
      line-height: 1.2;
    }

    .page-content {
      max-width: 1320px;
      margin: -0.1rem auto 0;
      padding: 0 1.5rem 4rem;
    }

    .collection-panel {
      background:
        linear-gradient(180deg, rgba(16, 16, 15, 0.97), rgba(10, 10, 9, 0.98)),
        radial-gradient(circle at 50% 0%, rgba(184, 149, 90, 0.12), transparent 22rem);
      border: 1px solid rgba(184, 149, 90, 0.26);
      box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.35);
      padding: 1.35rem 1.45rem 1.55rem;
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      width: 100%;
    }

    .search-bar,
    .chip,
    .sort-select,
    .view-btn {
      background: rgba(4, 4, 4, 0.72);
      border: 1px solid rgba(184, 149, 90, 0.38);
      color: #f4eadb;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      height: 3rem;
      flex: 1 1 420px;
      min-width: 280px;
      max-width: 480px;
      padding: 0 0.95rem;
    }

    .search-bar:focus-within {
      border-color: rgba(212, 172, 98, 0.95);
      box-shadow: 0 0 0 3px rgba(184, 149, 90, 0.12);
    }

    .search-icon {
      width: 1.12rem;
      height: 1.12rem;
      color: #d4ac62;
      flex: 0 0 auto;
    }

    .search-input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: #fff8ed;
      font-size: 0.94rem;
    }

    .search-input::placeholder {
      color: rgba(247, 239, 227, 0.42);
    }

    .search-clear {
      border: 0;
      background: transparent;
      color: #d4ac62;
      cursor: pointer;
      font-size: 1.4rem;
      line-height: 1;
    }

    .filter-chips {
      display: flex;
      flex: 1 1 auto;
      flex-wrap: nowrap;
      gap: 0.55rem;
      align-items: center;
      min-width: 0;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-height: 3rem;
      padding: 0 0.95rem;
      flex: 0 0 auto;
      cursor: pointer;
      font-size: 0.88rem;
      transition: border-color 0.2s, background 0.2s, color 0.2s;
    }

    .chip:hover,
    .chip-active {
      border-color: #d4ac62;
      color: #d4ac62;
      background: rgba(184, 149, 90, 0.1);
    }

    .chip-caret {
      color: #b8955a;
      font-size: 1rem;
      transform: translateY(-1px);
    }

    .chip-more svg {
      width: 1rem;
      height: 1rem;
      color: #d4ac62;
    }

    .chip-clear {
      color: #f0b7a9;
      border-color: rgba(240, 183, 169, 0.35);
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 0 0 auto;
      margin-left: auto;
    }

    .sort-select {
      height: 3rem;
      min-width: 132px;
      padding: 0 0.85rem;
      outline: 0;
      cursor: pointer;
    }

    .sort-select option {
      background: #11100f;
      color: #f7efe3;
    }

    .view-btn {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      cursor: pointer;
      color: rgba(247, 239, 227, 0.72);
    }

    .view-btn.active,
    .view-btn:hover {
      color: #d4ac62;
      border-color: #d4ac62;
      background: rgba(184, 149, 90, 0.12);
    }

    .view-btn svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .result-count {
      margin: 1rem 0 0.85rem;
      color: rgba(247, 239, 227, 0.56);
      font-size: 0.9rem;
    }

    .antiques-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.95rem;
    }

    .skeleton-card {
      height: 390px;
      border: 1px solid rgba(184, 149, 90, 0.22);
      background: linear-gradient(90deg, #111 25%, #1d1b18 50%, #111 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: rgba(247, 239, 227, 0.62);
    }

    .empty-icon {
      display: block;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }

    .filter-panel {
      position: fixed;
      inset: 0;
      z-index: 200;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 6rem;
      background: rgba(0, 0, 0, 0.58);
      backdrop-filter: blur(4px);
    }

    .filter-panel-inner {
      width: 390px;
      max-width: 90vw;
      max-height: 62vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: #11100f;
      border: 1px solid rgba(184, 149, 90, 0.42);
      box-shadow: 0 18px 70px rgba(0, 0, 0, 0.58);
    }

    .filter-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(184, 149, 90, 0.24);
    }

    .filter-panel-title {
      color: #f8e4bd;
      font-family: 'Playfair Display', serif;
      font-weight: 700;
    }

    .filter-panel-close {
      border: 0;
      background: transparent;
      color: #d4ac62;
      cursor: pointer;
      font-size: 1.45rem;
      line-height: 1;
    }

    .filter-panel-body {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.6rem;
      overflow-y: auto;
    }

    .filter-option {
      width: 100%;
      border: 0;
      background: transparent;
      color: rgba(247, 239, 227, 0.78);
      text-align: left;
      padding: 0.78rem 0.9rem;
      cursor: pointer;
      transition: background 0.16s, color 0.16s;
    }

    .filter-option:hover,
    .filter-option.selected {
      background: rgba(184, 149, 90, 0.12);
      color: #f8d48c;
    }

    @media (max-width: 1280px) {
      .toolbar {
        flex-wrap: wrap;
      }

      .search-bar {
        max-width: none;
      }

      .filter-chips {
        order: 3;
        flex-basis: 100%;
      }

      .toolbar-actions {
        justify-content: flex-end;
        margin-left: auto;
      }

      .antiques-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 900px) {
      .collection-hero {
        min-height: auto;
      }

      .collection-hero-inner {
        padding: 3.2rem 1rem 1.25rem;
      }

      .stats-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .page-content {
        padding: 0 1rem 3rem;
      }

      .collection-panel {
        padding: 1rem;
      }

      .antiques-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 620px) {
      .collection-hero {
        background-position: center top;
      }

      .hero-title {
        font-size: clamp(2.05rem, 12vw, 3rem);
      }

      .hero-copy {
        font-size: 0.95rem;
        margin-bottom: 1.35rem;
      }

      .stats-row,
      .antiques-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        min-height: 70px;
      }

      .filter-chips {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 0.2rem;
      }

      .chip {
        flex: 0 0 auto;
      }

      .toolbar-actions {
        justify-content: stretch;
      }

      .sort-select {
        flex: 1;
      }

      .filter-panel {
        align-items: flex-end;
        padding: 0;
      }

      .filter-panel-inner {
        width: 100%;
        max-width: none;
        max-height: 74vh;
      }
    }
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
  sortBy = 'recent';
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
      type: 'Tipo', subcategory: 'Categoría', detail: 'Material',
      catalog: 'Catálogo', condition: 'Estado',
    };
    return map[this.openFilter ?? ''] ?? '';
  }

  categoryCount(): number {
    return new Set(this.antiques().map(a => a.subcategory).filter(Boolean)).size;
  }

  totalValueLabel(): string {
    const value = this.antiques().reduce((sum, antique) => sum + (antique.price || 0), 0);
    return `${value.toLocaleString('es-ES')}€`;
  }

  eraSummary(): string {
    const years = this.antiques()
      .map(a => a.year_era.match(/\d{4}/)?.[0])
      .filter(Boolean)
      .map(Number);

    if (!years.length) return 'XVI - XX';

    const min = Math.min(...years);
    const max = Math.max(...years);
    return `${this.century(min)} - ${this.century(max)}`;
  }

  century(year: number): string {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
    return romans[Math.ceil(year / 100) - 1] ?? `${year}`;
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
    let result = [...this.antiques()];
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

    if (this.sortBy === 'priceDesc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (this.sortBy === 'priceAsc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (this.sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortBy === 'recent') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    this.filtered.set(result);
  }
}
