import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AntiquesService } from '../../core/antiques.service';
import { AntiqueCardComponent } from '../../components/antique-card/antique-card.component';
import { Antique } from '../../models';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [FormsModule, AntiqueCardComponent],
  template: `
    <div class="page-collection">
      <section class="collection-hero">
        <img
          class="collection-hero-image"
          src="assets/home-hero-study-v2.png"
          alt=""
          fetchpriority="high"
        />
        <div class="collection-hero-shade"></div>
        <div class="collection-hero-inner">
          <p class="hero-kicker">Archivo de piezas seleccionadas</p>
          <h1 class="hero-title">Colección privada <span>de antigüedades</span></h1>
          <div class="hero-flourish" aria-hidden="true">&#10087;</div>
          <p class="hero-copy">
            Cada pieza seleccionada cuenta una historia de una época que merece ser recordada.
          </p>

        </div>
      </section>

      <div class="page-content">
        <div class="collection-panel">
          <div class="filter-heading">
            <span>Explorar el archivo</span>
            <div class="collection-summary">
              <p>{{ filtered().length }} pieza{{ filtered().length !== 1 ? 's' : '' }} documentadas</p>
              @if (auth.isLoggedIn) {
                <p class="collection-value">
                  <span>Valor estimado</span>
                  <strong>{{ totalValueLabel() }}</strong>
                </p>
              }
            </div>
          </div>
          <div class="toolbar">
            <label class="search-bar">
              <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
              </span>
              <input
                type="text"
                class="search-input"
                placeholder="Buscar en la colección..."
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
                <span>{{ selectedDetail ? detLabel(selectedDetail) : 'Detalle' }}</span>
                <span class="chip-caret">⌄</span>
              </button>
              <button class="chip chip-more" [class.chip-active]="hasAdvancedFilters()" (click)="openAdvancedFilters()">
                <span>Filtros</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M8 5v4M16 15v4"/></svg>
              </button>
            </div>

            <div class="toolbar-actions">
              <select class="sort-select" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" aria-label="Ordenar colección">
                <option value="recent">Ordenar por</option>
                @if (auth.isLoggedIn) {
                  <option value="priceDesc">Valor mayor</option>
                  <option value="priceAsc">Valor menor</option>
                }
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>

          @if (activeFilterTags().length > 0) {
            <div class="active-filters" aria-label="Filtros activos">
              @for (filter of activeFilterTags(); track filter.key) {
                <button type="button" class="active-filter" (click)="removeFilter(filter.key)">
                  <span>{{ filter.label }}</span>
                  <span aria-hidden="true">&times;</span>
                </button>
              }
              <button type="button" class="clear-filters" (click)="clearAll()">Limpiar filtros</button>
            </div>
          }

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
          <div class="filter-panel" [class.advanced-panel]="openFilter === 'advanced'" (click)="closeFilterPanel()">
            <div class="filter-panel-inner" [class.filter-panel-wide]="openFilter === 'advanced'" (click)="$event.stopPropagation()">
              <div class="filter-panel-header">
                <span class="filter-panel-title">{{ filterTitle() }}</span>
                <button class="filter-panel-close" (click)="closeFilterPanel()">&times;</button>
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
                  <button class="filter-option" [class.selected]="!selectedDetail" (click)="selectDetail('')">Todos los detalles</button>
                  @for (det of availableDetails; track det) {
                    <button class="filter-option" [class.selected]="selectedDetail===det" (click)="selectDetail(det)">{{ detLabel(det) }}</button>
                  }
                }
                @if (openFilter === 'advanced') {
                  <div class="advanced-filters">
                    <label class="advanced-field">
                      <span>Año / período</span>
                      <input type="text" [(ngModel)]="advancedDraft.yearEra" placeholder="Ej. 1930, Victoriano..." />
                    </label>
                    @if (showsCenturyFilter()) {
                      <label class="advanced-field">
                        <span>Siglo</span>
                        <input type="text" [(ngModel)]="advancedDraft.century" placeholder="Ej. XVIII, XIX, XX" />
                      </label>
                    }
                    <label class="advanced-field">
                      <span>País</span>
                      <input type="text" [(ngModel)]="advancedDraft.country" placeholder="Ej. España" />
                    </label>
                    <label class="advanced-field">
                      <span>Región</span>
                      <input type="text" [(ngModel)]="advancedDraft.region" placeholder="Ej. Cataluña" />
                    </label>
                    @if (showsElementFilter()) {
                      <label class="advanced-field">
                        <span>Elemento</span>
                        <input type="text" [(ngModel)]="advancedDraft.element" placeholder="Ej. Bronce, madera..." />
                      </label>
                    }
                    @if (showsThemeFilter()) {
                      <label class="advanced-field">
                        <span>Tema</span>
                        <input type="text" [(ngModel)]="advancedDraft.theme" placeholder="Ej. Historia, militar..." />
                      </label>
                    }
                    @if (showsSignatureFilter()) {
                      <label class="advanced-field">
                        <span>Firma / marca</span>
                        <input type="text" [(ngModel)]="advancedDraft.signature" placeholder="Firma, sello o fabricante" />
                      </label>
                    }
                    @if (showsDocumentFilters()) {
                      <label class="advanced-field">
                        <span>Título</span>
                        <input type="text" [(ngModel)]="advancedDraft.title" placeholder="Título de la obra" />
                      </label>
                      <label class="advanced-field">
                        <span>Autor</span>
                        <input type="text" [(ngModel)]="advancedDraft.author" placeholder="Autor o creador" />
                      </label>
                      <label class="advanced-field">
                        <span>Editor</span>
                        <input type="text" [(ngModel)]="advancedDraft.editor" placeholder="Persona o entidad editorial" />
                      </label>
                      <label class="advanced-field">
                        <span>Imprenta</span>
                        <input type="text" [(ngModel)]="advancedDraft.imprenta" placeholder="Taller o establecimiento impresor" />
                      </label>
                      <label class="advanced-field">
                        <span>Edición</span>
                        <input type="text" [(ngModel)]="advancedDraft.edition" placeholder="Ej. 1.ª edición" />
                      </label>
                    }
                    @if (auth.isLoggedIn) {
                      <label class="advanced-field">
                        <span>Valor mínimo (€)</span>
                        <input type="number" [(ngModel)]="advancedDraft.minValue" min="0" placeholder="0" />
                      </label>
                      <label class="advanced-field">
                        <span>Valor máximo (€)</span>
                        <input type="number" [(ngModel)]="advancedDraft.maxValue" min="0" placeholder="Sin límite" />
                      </label>
                    }
                  </div>
                  <div class="advanced-actions">
                    <button type="button" class="advanced-clear" (click)="clearAdvancedDraft()">Limpiar avanzados</button>
                    <button type="button" class="advanced-apply" (click)="applyAdvancedFilters()">Aplicar filtros</button>
                  </div>
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
      background: #080807;
      border-bottom: 1px solid rgba(184, 149, 90, 0.32);
    }

    .collection-hero-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center 53%;
      z-index: 0;
    }

    .collection-hero-shade {
      position: absolute;
      inset: 0;
      z-index: 1;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.66)),
        radial-gradient(circle at 18% 30%, rgba(184, 149, 90, 0.16), transparent 18rem),
        radial-gradient(circle at 84% 20%, rgba(184, 149, 90, 0.12), transparent 20rem),
        linear-gradient(90deg, rgba(0,0,0,0.45), transparent 22%, transparent 72%, rgba(0,0,0,0.45));
      pointer-events: none;
    }

    .collection-hero-inner {
      position: relative;
      z-index: 2;
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
      max-width: none;
      margin: -0.1rem auto 0;
      padding: 0 0 4rem;
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

    .active-filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem;
      margin-top: 0.85rem;
    }

    .active-filter,
    .clear-filters {
      min-height: 2rem;
      border: 1px solid rgba(184, 149, 90, 0.34);
      border-radius: 2px;
      cursor: pointer;
      font-size: 0.72rem;
    }

    .active-filter {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0 0.65rem;
      background: rgba(184, 149, 90, 0.1);
      color: #ead4ab;
    }

    .active-filter span:last-child {
      color: #d4ac62;
      font-size: 1rem;
      line-height: 1;
    }

    .clear-filters {
      padding: 0 0.55rem;
      background: transparent;
      color: rgba(247, 239, 227, 0.58);
      border-color: transparent;
      text-decoration: underline;
      text-underline-offset: 0.2rem;
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

    .filter-panel-inner.filter-panel-wide {
      width: 720px;
      max-height: 78vh;
    }

    .filter-panel.advanced-panel {
      align-items: stretch;
      justify-content: flex-end;
      padding: 0;
    }

    .filter-panel.advanced-panel .filter-panel-inner {
      width: min(560px, 92vw);
      max-width: none;
      height: 100%;
      max-height: none;
      border-top: 0;
      border-right: 0;
      border-bottom: 0;
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

    .advanced-filters {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      padding: 0.45rem;
    }

    .advanced-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .advanced-field span {
      color: rgba(247, 239, 227, 0.58);
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .advanced-field input,
    .advanced-field select {
      width: 100%;
      min-width: 0;
      height: 2.65rem;
      padding: 0 0.7rem;
      border: 1px solid rgba(184, 149, 90, 0.3);
      border-radius: 2px;
      outline: 0;
      background: #090909;
      color: #f7efe3;
    }

    .advanced-field input:focus,
    .advanced-field select:focus {
      border-color: #d4ac62;
    }

    .advanced-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.65rem;
      padding: 0.75rem 0.45rem 0.35rem;
    }

    .advanced-clear,
    .advanced-apply {
      min-height: 2.55rem;
      padding: 0 0.9rem;
      border: 1px solid rgba(184, 149, 90, 0.38);
      border-radius: 2px;
      cursor: pointer;
    }

    .advanced-clear {
      background: transparent;
      color: rgba(247, 239, 227, 0.68);
    }

    .advanced-apply {
      background: #a77b3c;
      color: #090909;
      font-weight: 700;
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
        padding: 0 0 3rem;
      }

      .collection-panel {
        padding: 1rem;
      }

      .antiques-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 620px) {
      .collection-hero-image {
        object-position: 48% center;
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

      .advanced-filters {
        grid-template-columns: 1fr;
      }
    }

    /* Collection style: private cabinet, based on prototype 2. */
    .page-collection {
      background:
        radial-gradient(circle at 50% 14rem, rgba(164, 117, 48, 0.08), transparent 32rem),
        #090a09;
    }

    .collection-hero {
      min-height: 310px;
      background: #080807;
    }

    .collection-hero-shade {
      background:
        linear-gradient(90deg, rgba(0, 0, 0, 0.08), rgba(5, 5, 4, 0.72) 35%, rgba(5, 5, 4, 0.72) 65%, rgba(0, 0, 0, 0.08)),
        linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(4, 4, 3, 0.62));
    }

    .collection-hero-inner {
      padding: 2.65rem 1.5rem 2.35rem;
    }

    .hero-kicker {
      margin-bottom: 0.8rem;
      color: rgba(225, 198, 145, 0.7);
      font-family: inherit;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.2em;
    }

    .hero-title {
      max-width: 620px;
      font-size: clamp(2.25rem, 4vw, 3.55rem);
      font-weight: 400;
      line-height: 1.06;
    }

    .hero-title span {
      display: block;
      color: #c9974e;
      font-style: italic;
    }

    .hero-flourish {
      margin: 0.8rem auto 0.7rem;
    }

    .hero-flourish::before,
    .hero-flourish::after {
      width: 3.4rem;
    }

    .hero-copy {
      max-width: 470px;
      margin: 0 auto;
      font-family: 'Playfair Display', serif;
      font-size: 0.96rem;
      line-height: 1.6;
    }

    .page-content {
      max-width: none;
      margin-top: 0;
      padding: 0 0 4rem;
    }

    .collection-panel {
      padding: 1.25rem 1.25rem 1.7rem;
      background: linear-gradient(180deg, rgba(14, 15, 14, 0.98), rgba(8, 9, 8, 0.98));
      border-top: 0;
      border-color: rgba(184, 149, 90, 0.2);
      box-shadow: none;
    }

    .filter-heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.85rem;
    }

    .filter-heading span {
      color: #c89b57;
      font-family: 'Playfair Display', serif;
      font-size: 0.98rem;
    }

    .filter-heading p {
      color: rgba(247, 239, 227, 0.42);
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .collection-summary {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .collection-value {
      display: flex;
      align-items: baseline;
      gap: 0.45rem;
      padding-left: 1rem;
      border-left: 1px solid rgba(184, 149, 90, 0.3);
    }

    .collection-value span {
      color: rgba(247, 239, 227, 0.42);
    }

    .collection-value strong {
      color: #d7bd8a;
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: 600;
      letter-spacing: 0;
      font-variant-numeric: tabular-nums;
    }

    .toolbar {
      display: grid;
      grid-template-columns: minmax(200px, 1fr) minmax(0, 2.4fr) auto;
      gap: 0;
      align-items: stretch;
      border: 1px solid rgba(184, 149, 90, 0.2);
      border-radius: 10px;
      background: rgba(8, 8, 7, 0.6);
      backdrop-filter: blur(4px);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    }

    .search-bar {
      height: 3.6rem;
      min-width: 0;
      max-width: none;
      padding: 0 1.1rem;
      border: 0;
      border-right: 1px solid rgba(184, 149, 90, 0.15);
      border-radius: 10px 0 0 10px;
    }

    .filter-chips {
      display: flex;
      gap: 0;
      align-items: center;
    }

    .chip {
      min-height: 3.6rem;
      padding: 0 1.25rem;
      flex: 1 1 0;
      border: 0;
      border-right: 1px solid rgba(184, 149, 90, 0.12);
      border-radius: 0;
      font-family: inherit;
      font-size: 0.85rem;
      gap: 0.5rem;
      transition: background 0.2s, color 0.2s;
      min-width: 0;
    }

    .chip:hover {
      background: rgba(184, 149, 90, 0.08);
    }

    .chip-active {
      background: rgba(184, 149, 90, 0.12);
      color: #e8cf9a;
      box-shadow: inset 0 -2px 0 #d4ac62;
    }

    .chip:last-of-type {
      border-right: 0;
    }

    .toolbar-actions {
      display: flex;
      gap: 0;
      align-items: center;
      border-left: 1px solid rgba(184, 149, 90, 0.15);
    }

    .sort-select {
      height: 3.6rem;
      min-width: 200px;
      padding: 0 1rem;
      border: 0;
      border-radius: 0 10px 10px 0;
      font-size: 0.85rem;
      appearance: none;
      background:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6' fill='none' stroke='%23d4ac62' stroke-width='1.5'/%3E%3C/svg%3E")
        calc(100% - 0.85rem) center / 10px 6px no-repeat,
        rgba(4, 4, 4, 0.72);
      cursor: pointer;
      padding-right: 2rem;
    }

    .antiques-grid {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.7rem;
      margin-top: 1.1rem;
    }

    @media (max-width: 1280px) {
      .toolbar {
        grid-template-columns: 1fr auto;
        border-radius: 8px;
      }

      .search-bar {
        border-radius: 8px 0 0 0;
      }

      .sort-select {
        border-radius: 0 8px 0 0;
      }

      .filter-chips {
        grid-column: 1 / -1;
        grid-row: 2;
        border-top: 1px solid rgba(184, 149, 90, 0.2);
        border-radius: 0 0 8px 8px;
        overflow: hidden;
      }

      .chip:last-of-type {
        border-right: 0;
      }

      .antiques-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    @media (max-width: 900px) {
      .antiques-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 620px) {
      .collection-hero-inner {
        padding-top: 2.2rem;
      }

      .filter-heading {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.15rem;
      }

      .collection-summary {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.25rem;
      }

      .collection-value {
        padding-left: 0;
        border-left: 0;
      }

      .filter-panel {
        align-items: stretch;
        padding: 0;
      }

      .filter-panel-inner,
      .filter-panel-inner.filter-panel-wide {
        width: 100%;
        max-width: none;
        height: 100%;
        max-height: none;
        border: 0;
      }

      .filter-panel-header {
        flex: 0 0 auto;
      }

      .filter-panel-body {
        flex: 1;
      }

      .advanced-actions {
        position: sticky;
        bottom: -0.6rem;
        padding: 0.9rem 0.45rem;
        background: #11100f;
        border-top: 1px solid rgba(184, 149, 90, 0.24);
      }

      .antiques-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 430px) {
      .antiques-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CollectionComponent implements OnInit {
  antiques = signal<Antique[]>([]);
  filtered = signal<Antique[]>([]);
  loading = signal(true);
  searchTerm = '';
  selectedType = '';
  selectedSubcategory = '';
  selectedDetail = '';
  filterYearEra = '';
  filterCentury = '';
  filterCountry = '';
  filterRegion = '';
  filterElement = '';
  filterTheme = '';
  filterSignature = '';
  filterItemTitle = '';
  filterAuthor = '';
  filterEditor = '';
  filterImprenta = '';
  filterEdition = '';
  minValue: number | null = null;
  maxValue: number | null = null;
  advancedDraft = this.emptyAdvancedDraft();
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
    varios: 'Varios',
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
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

  async ngOnInit() {
    try {
      const antiques = await this.antiquesService.getAll();
      this.antiques.set(antiques);
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
    return !!(this.selectedType || this.selectedSubcategory || this.selectedDetail || this.hasAdvancedFilters());
  }

  hasAdvancedFilters(): boolean {
    return !!(
      this.filterYearEra || this.filterCentury || this.filterCountry ||
      this.filterRegion || this.filterElement || this.filterTheme || this.filterSignature ||
      this.filterItemTitle || this.filterAuthor || this.filterEditor || this.filterImprenta || this.filterEdition ||
      (this.auth.isLoggedIn && (this.minValue !== null || this.maxValue !== null))
    );
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

  filterTitle(): string {
    const map: Record<string, string> = {
      type: 'Tipo', subcategory: 'Categoría', detail: 'Detalle',
      advanced: 'Filtros',
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

  openAdvancedFilters() {
    this.advancedDraft = {
      yearEra: this.filterYearEra,
      century: this.filterCentury,
      country: this.filterCountry,
      region: this.filterRegion,
      element: this.filterElement,
      theme: this.filterTheme,
      signature: this.filterSignature,
      title: this.filterItemTitle,
      author: this.filterAuthor,
      editor: this.filterEditor,
      imprenta: this.filterImprenta,
      edition: this.filterEdition,
      minValue: this.minValue,
      maxValue: this.maxValue,
    };
    this.openFilter = 'advanced';
  }

  closeFilterPanel() {
    this.openFilter = null;
  }

  selectType(val: string) {
    this.selectedType = val;
    this.selectedSubcategory = '';
    this.selectedDetail = '';
    this.resetAdvancedValues();
    this.openFilter = null;
    this.applyFilters();
  }

  selectSubcategory(val: string) {
    this.selectedSubcategory = val;
    this.selectedDetail = '';
    this.resetAdvancedValues();
    this.openFilter = null;
    this.applyFilters();
  }

  selectDetail(val: string) {
    this.selectedDetail = val;
    this.openFilter = null;
    this.applyFilters();
  }

  clearAll() {
    this.selectedType = '';
    this.selectedSubcategory = '';
    this.selectedDetail = '';
    this.resetAdvancedValues();
    this.openFilter = null;
    this.applyFilters();
  }

  clearAdvancedDraft() {
    this.advancedDraft = this.emptyAdvancedDraft();
  }

  applyAdvancedFilters() {
    this.filterYearEra = this.advancedDraft.yearEra.trim();
    this.filterCentury = this.advancedDraft.century.trim();
    this.filterCountry = this.advancedDraft.country.trim();
    this.filterRegion = this.advancedDraft.region.trim();
    this.filterElement = this.advancedDraft.element.trim();
    this.filterTheme = this.advancedDraft.theme.trim();
    this.filterSignature = this.advancedDraft.signature.trim();
    this.filterItemTitle = this.advancedDraft.title.trim();
    this.filterAuthor = this.advancedDraft.author.trim();
    this.filterEditor = this.advancedDraft.editor.trim();
    this.filterImprenta = this.advancedDraft.imprenta.trim();
    this.filterEdition = this.advancedDraft.edition.trim();
    this.minValue = this.auth.isLoggedIn ? this.advancedDraft.minValue : null;
    this.maxValue = this.auth.isLoggedIn ? this.advancedDraft.maxValue : null;
    this.openFilter = null;
    this.applyFilters();
  }

  private resetAdvancedValues() {
    this.filterYearEra = '';
    this.filterCentury = '';
    this.filterCountry = '';
    this.filterRegion = '';
    this.filterElement = '';
    this.filterTheme = '';
    this.filterSignature = '';
    this.filterItemTitle = '';
    this.filterAuthor = '';
    this.filterEditor = '';
    this.filterImprenta = '';
    this.filterEdition = '';
    this.minValue = null;
    this.maxValue = null;
    this.advancedDraft = this.emptyAdvancedDraft();
  }

  private emptyAdvancedDraft() {
    return {
      yearEra: '',
      century: '',
      country: '',
      region: '',
      element: '',
      theme: '',
      signature: '',
      title: '',
      author: '',
      editor: '',
      imprenta: '',
      edition: '',
      minValue: null as number | null,
      maxValue: null as number | null,
    };
  }

  showsDocumentFilters(): boolean {
    return ['libros', 'documentos', 'varios'].includes(this.selectedSubcategory);
  }

  showsCenturyFilter(): boolean {
    return ['pintura', 'escultura', 'fotos', 'revistas', 'filatelia', 'varios'].includes(this.selectedSubcategory);
  }

  showsElementFilter(): boolean {
    return ['escultura', 'varios'].includes(this.selectedSubcategory);
  }

  showsThemeFilter(): boolean {
    return ['pintura', 'escultura', 'fotos', 'revistas', 'filatelia', 'varios'].includes(this.selectedSubcategory);
  }

  showsSignatureFilter(): boolean {
    return ['pintura', 'escultura', 'varios'].includes(this.selectedSubcategory);
  }

  activeFilterTags(): { key: string; label: string }[] {
    const tags: { key: string; label: string }[] = [];
    if (this.selectedType) tags.push({ key: 'type', label: `Tipo: ${this.typeLabel(this.selectedType)}` });
    if (this.selectedSubcategory) tags.push({ key: 'subcategory', label: `Categoría: ${this.subLabel(this.selectedSubcategory)}` });
    if (this.selectedDetail) tags.push({ key: 'detail', label: `Detalle: ${this.detLabel(this.selectedDetail)}` });
    if (this.filterYearEra) tags.push({ key: 'yearEra', label: `Período: ${this.filterYearEra}` });
    if (this.filterCentury) tags.push({ key: 'century', label: `Siglo: ${this.filterCentury}` });
    if (this.filterCountry) tags.push({ key: 'country', label: `País: ${this.filterCountry}` });
    if (this.filterRegion) tags.push({ key: 'region', label: `Región: ${this.filterRegion}` });
    if (this.filterElement) tags.push({ key: 'element', label: `Elemento: ${this.filterElement}` });
    if (this.filterTheme) tags.push({ key: 'theme', label: `Tema: ${this.filterTheme}` });
    if (this.filterSignature) tags.push({ key: 'signature', label: `Firma: ${this.filterSignature}` });
    if (this.filterItemTitle) tags.push({ key: 'title', label: `Título: ${this.filterItemTitle}` });
    if (this.filterAuthor) tags.push({ key: 'author', label: `Autor: ${this.filterAuthor}` });
    if (this.filterEditor) tags.push({ key: 'editor', label: `Editor: ${this.filterEditor}` });
    if (this.filterImprenta) tags.push({ key: 'imprenta', label: `Imprenta: ${this.filterImprenta}` });
    if (this.filterEdition) tags.push({ key: 'edition', label: `Edición: ${this.filterEdition}` });
    if (this.auth.isLoggedIn && this.minValue !== null) tags.push({ key: 'minValue', label: `Valor desde: ${this.minValue} €` });
    if (this.auth.isLoggedIn && this.maxValue !== null) tags.push({ key: 'maxValue', label: `Valor hasta: ${this.maxValue} €` });
    return tags;
  }

  removeFilter(key: string) {
    const clear: Record<string, () => void> = {
      type: () => {
        this.selectedType = '';
        this.selectedSubcategory = '';
        this.selectedDetail = '';
        this.resetAdvancedValues();
      },
      subcategory: () => {
        this.selectedSubcategory = '';
        this.selectedDetail = '';
        this.resetAdvancedValues();
      },
      detail: () => this.selectedDetail = '',
      yearEra: () => this.filterYearEra = '',
      century: () => this.filterCentury = '',
      country: () => this.filterCountry = '',
      region: () => this.filterRegion = '',
      element: () => this.filterElement = '',
      theme: () => this.filterTheme = '',
      signature: () => this.filterSignature = '',
      title: () => this.filterItemTitle = '',
      author: () => this.filterAuthor = '',
      editor: () => this.filterEditor = '',
      imprenta: () => this.filterImprenta = '',
      edition: () => this.filterEdition = '',
      minValue: () => this.minValue = null,
      maxValue: () => this.maxValue = null,
    };
    clear[key]?.();
    this.applyFilters();
  }

  private contains(value: string | undefined, term: string): boolean {
    if (!term.trim()) return true;
    const normalize = (text: string) => text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es');
    return normalize(value ?? '').includes(normalize(term.trim()));
  }

  applyFilters() {
    let result = [...this.antiques()];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(term) ||
        (a.title ?? '').toLowerCase().includes(term) ||
        (a.author ?? '').toLowerCase().includes(term) ||
        (a.editor ?? '').toLowerCase().includes(term) ||
        (a.imprenta ?? '').toLowerCase().includes(term) ||
        (a.edition ?? '').toLowerCase().includes(term) ||
        (a.signature ?? '').toLowerCase().includes(term) ||
        (a.theme ?? '').toLowerCase().includes(term) ||
        (a.century ?? '').toLowerCase().includes(term) ||
        a.country.toLowerCase().includes(term) ||
        a.region.toLowerCase().includes(term) ||
        a.element.toLowerCase().includes(term) ||
        a.year_era.toLowerCase().includes(term)
      );
    }
    if (this.selectedType) result = result.filter(a => a.type === this.selectedType);
    if (this.selectedSubcategory) result = result.filter(a => a.subcategory === this.selectedSubcategory);
    if (this.selectedDetail) result = result.filter(a => a.detail === this.selectedDetail);
    if (this.filterYearEra) result = result.filter(a => this.contains(a.year_era, this.filterYearEra));
    if (this.filterCentury) result = result.filter(a => this.contains(a.century, this.filterCentury));
    if (this.filterCountry) result = result.filter(a => this.contains(a.country, this.filterCountry));
    if (this.filterRegion) result = result.filter(a => this.contains(a.region, this.filterRegion));
    if (this.filterElement) result = result.filter(a => this.contains(a.element, this.filterElement));
    if (this.filterTheme) result = result.filter(a => this.contains(a.theme, this.filterTheme));
    if (this.filterSignature) result = result.filter(a => this.contains(a.signature, this.filterSignature));
    if (this.filterItemTitle) result = result.filter(a => this.contains(a.title, this.filterItemTitle));
    if (this.filterAuthor) result = result.filter(a => this.contains(a.author, this.filterAuthor));
    if (this.filterEditor) result = result.filter(a => this.contains(a.editor, this.filterEditor));
    if (this.filterImprenta) result = result.filter(a => this.contains(a.imprenta, this.filterImprenta));
    if (this.filterEdition) result = result.filter(a => this.contains(a.edition, this.filterEdition));
    if (this.auth.isLoggedIn && this.minValue !== null) result = result.filter(a => (a.price || 0) >= this.minValue!);
    if (this.auth.isLoggedIn && this.maxValue !== null) result = result.filter(a => (a.price || 0) <= this.maxValue!);

    if (this.sortBy === 'priceDesc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (this.sortBy === 'priceAsc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (this.sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortBy === 'recent') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    this.filtered.set(result);
  }
}
