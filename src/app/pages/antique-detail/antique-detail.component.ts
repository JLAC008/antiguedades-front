import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AntiquesService } from '../../core/antiques.service';
import { AuthService } from '../../core/auth.service';
import { Antique } from '../../models';

@Component({
  selector: 'app-antique-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="page">
      <div class="page-content">
        @if (loading()) {
          <div class="loading-state">Cargando pieza...</div>
        } @else if (!antique()) {
          <div class="empty-state">
            <p>No se encontró la pieza.</p>
            <a routerLink="/" class="btn-primary">Volver al inicio</a>
          </div>
        } @else {
          <a class="breadcrumb" (click)="goBack()" style="cursor:pointer">&larr; Volver</a>

          <div class="antique-layout">
            <div class="antique-gallery">
              @if (antique()!.images && antique()!.images.length > 0) {
                <div class="gallery-main" tabindex="0" (keydown)="onKeydown($event)">
                  <img [src]="selectedImage()" [alt]="antique()!.name" class="gallery-main-img" />
                  @if (images.length > 1) {
                    <button class="gallery-arrow gallery-arrow-left" (click)="prevImage()" [disabled]="currentIndex === 0">&#8249;</button>
                    <button class="gallery-arrow gallery-arrow-right" (click)="nextImage()" [disabled]="currentIndex === images.length - 1">&#8250;</button>
                    <span class="gallery-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
                  }
                </div>
                @if (antique()!.images.length > 1) {
                  <div class="gallery-thumbs">
                    @for (img of antique()!.images; track img) {
                      <img
                        [src]="img"
                        [alt]="antique()!.name"
                        class="gallery-thumb"
                        [class.active]="selectedImage() === img"
                        (click)="selectImage(img)"
                      />
                    }
                  </div>
                }
              } @else {
                <div class="gallery-empty">
                  <span>&#128250;</span>
                  <p>Sin imágenes</p>
                </div>
              }
            </div>

            <div class="antique-info">
              @if (antique()!.catalog) {
                <a [routerLink]="['/catalogo', antique()!.catalog_id]" class="catalog-tag">
                  &#128193; {{ antique()!.catalog!.name }}
                </a>
              }
              <h1 class="antique-title">{{ antique()!.name }}</h1>
              @if (antique()!.year_era) {
                <p class="antique-era">{{ antique()!.year_era }}</p>
              }
              @if (antique()!.price > 0) {
                <p class="antique-price">{{ antique()!.price | currency:'EUR':'symbol':'1.0-0' }}</p>
              }

              <div class="antique-badge-row">
                <span class="antique-badge badge-type">
                  <span [innerHTML]="typeIcon(antique()!.type)" class="badge-icon"></span>
                  {{ antique()!.type === 'antiguedad' ? 'Antigüedades' : 'Papelería' }}
                </span>
                <span class="antique-badge badge-subcat">
                  <span [innerHTML]="subcategoryIcon(antique()!.subcategory)" class="badge-icon"></span>
                  {{ subLabel(antique()!.subcategory) }}
                  @if (antique()!.detail) {
                    <span class="badge-arrow">&rarr;</span>
                    <span [innerHTML]="detailIcon(antique()!.detail)" class="badge-icon"></span>
                    {{ detLabel(antique()!.detail) }}
                  }
                </span>
                <span class="antique-badge badge-cond">
                  {{ antique()!.condition }}
                </span>
              </div>

              @if (antique()!.description) {
                <div class="antique-section">
                  <h3 class="section-label">Descripción</h3>
                  <p class="antique-desc">{{ antique()!.description }}</p>
                </div>
              }

              <div class="antique-specs">
                @if (antique()!.type === 'antiguedad') {
                  @if (antique()!.country) {
                    <div class="spec-item">
                      <span class="spec-label">País</span>
                      <span class="spec-value">{{ antique()!.country }}</span>
                    </div>
                  }
                  @if (antique()!.region) {
                    <div class="spec-item">
                      <span class="spec-label">Región</span>
                      <span class="spec-value">{{ antique()!.region }}</span>
                    </div>
                  }
                  @if (antique()!.element) {
                    <div class="spec-item">
                      <span class="spec-label">Elemento</span>
                      <span class="spec-value">{{ antique()!.element }}</span>
                    </div>
                  }
                }
                @if (antique()!.type === 'papeleria') {
                  @if (antique()!.paper_type) {
                    <div class="spec-item">
                      <span class="spec-label">Tipo de papel</span>
                      <span class="spec-value">{{ antique()!.paper_type }}</span>
                    </div>
                  }
                  @if (antique()!.paper_format) {
                    <div class="spec-item">
                      <span class="spec-label">Formato</span>
                      <span class="spec-value">{{ antique()!.paper_format }}</span>
                    </div>
                  }
                  @if (antique()!.paper_weight) {
                    <div class="spec-item">
                      <span class="spec-label">Gramaje</span>
                      <span class="spec-value">{{ antique()!.paper_weight }} g/m²</span>
                    </div>
                  }
                }
                @if (antique()!.material) {
                  <div class="spec-item">
                    <span class="spec-label">Material</span>
                    <span class="spec-value">{{ antique()!.material }}</span>
                  </div>
                }
                @if (antique()!.dimensions) {
                  <div class="spec-item">
                    <span class="spec-label">Dimensiones</span>
                    <span class="spec-value">{{ antique()!.dimensions }}</span>
                  </div>
                }
                <div class="spec-item">
                  <span class="spec-label">Estado</span>
                  <span class="spec-value">{{ antique()!.condition }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Añadido</span>
                  <span class="spec-value">{{ antique()!.created_at | date:'d MMM y' }}</span>
                </div>
              </div>

              @if (auth.isAdmin) {
                <div class="admin-actions">
                  <a [routerLink]="['/editar', antique()!.id]" class="btn-edit">Editar pieza</a>
                  <button class="btn-delete" (click)="confirmDelete()">Eliminar</button>
                </div>
              }
            </div>
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
    .page-content { max-width: 1100px; margin: 0 auto; padding: 3.2rem 1.5rem 4rem; }
    .breadcrumb {
      display: inline-block;
      font-size: 1rem;
      color: #7c6a58;
      text-decoration: none;
      font-weight: 700;
      margin-bottom: 2rem;
      transition: color 0.2s;
    }
    .breadcrumb:hover { color: var(--color-accent); }
    .antique-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    .gallery-main {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      aspect-ratio: 1;
      background: var(--color-bg-2);
      border: 1px solid #dccdbd;
      box-shadow: 0 16px 42px rgba(64, 47, 29, 0.05);
    }
    .gallery-main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gallery-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba(0,0,0,0.4);
      color: white;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      z-index: 2;
    }
    .gallery-arrow:hover:not(:disabled) { background: rgba(0,0,0,0.65); }
    .gallery-arrow:disabled { opacity: 0.25; cursor: default; }
    .gallery-arrow-left { left: 0.75rem; }
    .gallery-arrow-right { right: 0.75rem; }
    .gallery-counter {
      position: absolute;
      bottom: 0.75rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.45);
      color: white;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      z-index: 2;
    }
    .gallery-thumbs {
      display: flex;
      gap: 0.625rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }
    .gallery-thumb {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid var(--color-border);
      cursor: pointer;
      transition: border-color 0.2s, transform 0.2s;
    }
    .gallery-thumb:hover, .gallery-thumb.active {
      border-color: var(--color-accent);
      transform: scale(1.05);
    }
    .gallery-empty {
      aspect-ratio: 1;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      font-size: 3rem;
    }
    .catalog-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-accent);
      text-decoration: none;
      background: rgba(184,149,90,0.1);
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      margin-bottom: 1rem;
      transition: background 0.2s;
    }
    .catalog-tag:hover { background: rgba(184,149,90,0.18); }
    .antique-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 3.4vw, 2.75rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.5rem;
      line-height: 1.2;
    }
    .antique-era {
      font-size: 0.9375rem;
      color: var(--color-accent);
      font-weight: 600;
      margin: 0 0 0.75rem;
      letter-spacing: 0.02em;
    }
    .antique-price {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 1rem;
    }
    .antique-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      align-items: center;
    }
    .antique-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border);
      color: var(--color-secondary);
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
    }
    .badge-icon {
      display: inline-flex;
      align-items: center;
    }
    .badge-icon svg {
      display: block;
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .badge-icon svg.icon-fill {
      fill: currentColor;
      stroke: none;
    }
    .badge-arrow {
      color: var(--color-accent);
      font-size: 0.9rem;
      line-height: 1;
      margin: 0 0.1rem;
    }
    .antique-section { margin-bottom: 1.5rem; }
    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
      margin: 0 0 0.5rem;
    }
    .antique-desc {
      color: var(--color-text);
      line-height: 1.7;
      margin: 0;
      font-size: 0.9375rem;
    }
    .antique-specs {
      display: grid;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid #dccdbd;
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .spec-item { display: flex; justify-content: space-between; align-items: center; }
    .spec-label { font-size: 0.8125rem; font-weight: 600; color: var(--color-text-muted); }
    .spec-value { font-size: 0.875rem; font-weight: 500; color: var(--color-primary); }
    .admin-actions { display: flex; gap: 0.75rem; }
    .btn-edit {
      flex: 1;
      display: block;
      text-align: center;
      text-decoration: none;
      background: var(--color-primary);
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9375rem;
      transition: background 0.2s;
    }
    .btn-edit:hover { background: var(--color-secondary); }
    .btn-delete {
      flex: 1;
      border: 1px solid var(--color-error);
      color: var(--color-error);
      background: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-delete:hover { background: var(--color-error); color: white; }
    .loading-state, .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--color-text-muted);
    }
    .btn-primary {
      display: inline-block;
      background: var(--color-primary);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 1rem;
    }
    @media (max-width: 768px) {
      .page-content {
        padding: 2rem 1rem 3rem;
      }
      .breadcrumb {
        margin-bottom: 1.25rem;
        font-size: 0.95rem;
      }
      .antique-layout { grid-template-columns: 1fr; gap: 1.5rem; }
      .gallery-thumbs {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 0.2rem;
      }
      .gallery-thumb {
        flex: 0 0 auto;
        width: 64px;
        height: 64px;
      }
      .antique-title {
        font-size: clamp(2rem, 11vw, 2.55rem);
      }
      .spec-item {
        align-items: flex-start;
        gap: 1rem;
      }
      .spec-value {
        text-align: right;
        overflow-wrap: anywhere;
      }
      .admin-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AntiqueDetailComponent implements OnInit {
  antique = signal<Antique | null>(null);
  loading = signal(true);
  selectedImage = signal('');
  images: string[] = [];
  currentIndex = 0;

  subcategoryLabels: Record<string, string> = {
    escultura: 'Escultura', pintura: 'Pintura', cristal: 'Cristal', ceramica: 'Cerámica',
    filatelia: 'Filatelia', fotos: 'Fotos', revistas: 'Revistas / Periódicos',
    documentos: 'Documentos', libros: 'Libros',
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

  private iconSvgs: Record<string, string> = {
    type_antiguedad: '<svg viewBox="0 0 24 24"><path d="M5 20h14M7 17h10M8 8h8M6 11h12M9 8v9M15 8v9M11 8v9M13 8v9M12 3 5 7h14Z"/></svg>',
    type_papeleria: '<svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7Z"/><path d="M14 3v6h5M10 13h6M10 17h6"/></svg>',

    sub_escultura: '<svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M8 9h8v2H8z"/><path d="M6 11h12v1H6z"/><path d="M5 12h14v8H5zM7 14h10v4H7z"/></svg>',
    sub_pintura: '<svg viewBox="0 0 24 24"><path d="M4 20h16"/><path d="M7 20V8l4-4v16"/><path d="M11 20V4l4 4v12"/><path d="M15 20V8l3-3"/></svg>',
    sub_cristal: '<svg viewBox="0 0 24 24"><path d="M8 3h8l-2 10H10L8 3Z"/><path d="M6 13h12l-1 8H7l-1-8Z"/><path d="M12 13v8"/></svg>',
    sub_ceramica: '<svg viewBox="0 0 24 24"><path d="M7 8h10l1 4H6l1-4Z"/><path d="M6 12h12l-2 8H8l-2-8Z"/><path d="M12 8V5a2 2 0 0 1 2-2"/></svg>',
    sub_filatelia: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4Z"/><path d="M4 9h7v7H4z"/><path d="M17 8v8M15 12h4"/><path d="M9 4v21"/></svg>',
    sub_fotos: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="15" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M17 5l-2-3H9L7 5"/></svg>',
    sub_revistas: '<svg viewBox="0 0 24 24"><path d="M4 3h12l4 4v14H4Z"/><path d="M16 3v4h4M7 10h10M7 14h10M7 18h6"/></svg>',
    sub_documentos: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>',
    sub_libros: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M10 9h6M10 13h4"/></svg>',

    det_busto: '<svg viewBox="0 0 24 24"><path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>',
    det_figura: '<svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M5 21v-4a7 7 0 0 1 14 0v4"/></svg>',
    det_belen: '<svg viewBox="0 0 24 24"><path d="M12 2l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-5Z"/><path d="M8 17l-2 5M16 17l2 5M12 14v8"/></svg>',
    det_oleo: '<svg viewBox="0 0 24 24"><path d="M4 20h16"/><path d="M7 20V8l4-4v16"/><path d="M11 20V4l4 4v12"/></svg>',
    det_grabado: '<svg viewBox="0 0 24 24"><path d="M5 5h14v14H5z"/><path d="M8 8l8 8M16 8l-8 8"/></svg>',
    det_acuarela: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-1 14 3 3 0 0 1 0 4"/><path d="M12 2a10 10 0 0 1 1 14 3 3 0 0 0 0 4"/><path d="M12 20v2"/><path d="M8 22h8"/></svg>',
    det_hist_postal: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
    det_entero_postal: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/><rect x="10" y="13" width="4" height="3" rx="0.5"/></svg>',
    det_sello: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/></svg>',
    det_pre_filatelia: '<svg viewBox="0 0 24 24"><path d="M4 6h16"/><path d="M4 10h16"/><path d="M4 14h16"/><path d="M4 18h16"/><path d="M4 6v12"/><path d="M20 6v12"/></svg>',
    det_censura: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>',
    det_familiar: '<svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><circle cx="15" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h2"/><path d="M21 21v-2a4 4 0 0 0-4-4"/><circle cx="12" cy="18" r="2"/></svg>',
    det_boda: '<svg viewBox="0 0 24 24"><path d="M8 5l4 4-4 4"/><path d="M16 5l-4 4 4 4"/><path d="M4 16h16"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>',
    det_ninos: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M6 21v-4a6 6 0 0 1 12 0v4"/><path d="M12 10v2"/><path d="M10 14h4"/></svg>',
    det_hombres: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="3"/><path d="M5 21v-5a7 7 0 0 1 14 0v5"/></svg>',
    det_mujeres: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="3"/><path d="M5 21v-5a7 7 0 0 1 14 0v5"/><path d="M12 9v9"/></svg>',
    det_militar: '<svg viewBox="0 0 24 24"><path d="M12 2l2 7 7 1-5 4 2 7-6-4-6 4 2-7-5-4 7-1 2-7Z"/></svg>',
    det_etnica: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/><path d="M4.5 7.5a12 12 0 0 1 15 0M4.5 16.5a12 12 0 0 0 15 0"/></svg>',
    det_paisaje: '<svg viewBox="0 0 24 24"><path d="M3 18l6-9 5 6 4-3 3 6H3Z"/><circle cx="18" cy="7" r="2"/></svg>',
    det_retrato: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/><path d="M20 12v9M17 17l3-3 3 3"/></svg>',
    det_blanco_negro: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 2a10 10 0 0 0 0 20"/></svg>',
    det_estudio: '<svg viewBox="0 0 24 24"><path d="M2 12h4l3-9 3 9h4"/><path d="M6 12v9h12v-9"/><path d="M10 12l2-6 2 6"/></svg>',
    det_reportaje: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 8v8"/><path d="M12 10v4"/><path d="M16 6v12"/></svg>',
    det_arquitectura: '<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V7l7-5 7 5v14"/><path d="M9 21V9h6v12"/><path d="M11 12h2v3h-2z"/></svg>',
    det_naturaleza: '<svg viewBox="0 0 24 24"><path d="M17 12a7 7 0 0 0-14 0c0 3.3 2.5 6 5.5 7l1 5h1l1-5a7 7 0 0 0 5.5-7Z"/><path d="M17 12a5 5 0 0 0-8-4 7 7 0 0 0-1 8"/></svg>',
    det_post_mortem: '<svg viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M2 12h20"/><path d="M5 5l14 14M19 5l-14 14"/></svg>',
    det_motos: '<svg viewBox="0 0 24 24"><circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M14 16H8"/><path d="M4 12h16"/><path d="M12 4l-2 8h6"/><path d="M18 12l2-4h-4"/></svg>',
    det_coches: '<svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M4 17h2M18 17h2"/><path d="M3 12h18l-2-5H6L3 12Z"/><path d="M6 12V8"/><path d="M18 12V8"/></svg>',
    det_politica: '<svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M7 9l5-4 5 4v2H7V9Z"/><path d="M5 21h14"/><path d="M7 15h10v4H7z"/></svg>',
    det_historia: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    det_ciencia: '<svg viewBox="0 0 24 24"><path d="M9 3h6v5l5 9v2H4v-2l5-9V3Z"/><path d="M4 17h16"/></svg>',
    det_deportes: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0 0 20"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/><path d="M12 2v20"/><path d="M7 4.5a10 10 0 0 0 0 15"/><path d="M17 4.5a10 10 0 0 1 0 15"/></svg>',
    det_moda: '<svg viewBox="0 0 24 24"><path d="M7 3h10l-2 5h4l-1 3-6 3-6-3-1-3h4l-2-5Z"/><path d="M6 14l1 7h10l1-7"/></svg>',
    det_arte: '<svg viewBox="0 0 24 24"><circle cx="13" cy="11" r="9"/><path d="M6 7l4 4 3-3 5 5"/><path d="M6 15l4-4 3 3 5-5"/></svg>',
    det_musica: '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    det_humor: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 9h1M15 9h1"/><path d="M8 15a4 4 0 0 0 8 0"/></svg>',
    det_viajes: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/><path d="M2 12h20"/><path d="M5 8h14M5 16h14"/></svg>',
    det_economia: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>',
    det_cultura: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    det_tecnologia: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>',
    det_folletos: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/><path d="M18 4v16"/></svg>',
    det_partituras: '<svg viewBox="0 0 24 24"><path d="M6 18V3l12-2v15"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M9 15V6l9-2"/></svg>',
    det_escrituras: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 12h8M8 16h6"/></svg>',
    det_mapas: '<svg viewBox="0 0 24 24"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7Z"/><path d="M9 4v13M15 7v13"/><circle cx="12" cy="10" r="2"/></svg>',
    det_carteles: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
    det_otros: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>',
  };

  typeIcon(type: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.iconSvgs['type_' + type] ?? '');
  }

  subcategoryIcon(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.iconSvgs['sub_' + key] ?? '');
  }

  detailIcon(key: string): SafeHtml {
    const clean = key.replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/gi, '').toLowerCase();
    const svg = this.iconSvgs['det_' + clean];
    return this.sanitizer.bypassSecurityTrustHtml(svg ?? this.iconSvgs['det_otros'] ?? '');
  }

  constructor(
    private route: ActivatedRoute,
    private antiquesService: AntiquesService,
    public auth: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      const antique = await this.antiquesService.getById(id);
      this.antique.set(antique);
      if (antique?.images?.length) {
        this.images = antique.images;
        this.selectedImage.set(antique.images[0]);
      }
    } finally {
      this.loading.set(false);
    }
  }

  subLabel(key: string): string {
    return this.subcategoryLabels[key] ?? key;
  }

  detLabel(key: string): string {
    return this.detailLabels[key] ?? key;
  }

  goBack() {
    window.history.back();
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedImage.set(this.images[this.currentIndex]);
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.selectedImage.set(this.images[this.currentIndex]);
    }
  }

  selectImage(img: string) {
    this.currentIndex = this.images.indexOf(img);
    this.selectedImage.set(img);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') { this.prevImage(); event.preventDefault(); }
    if (event.key === 'ArrowRight') { this.nextImage(); event.preventDefault(); }
  }

  async confirmDelete() {
    if (!confirm(`¿Eliminar "${this.antique()?.name}"? Esta acción no se puede deshacer.`)) return;
    await this.antiquesService.delete(this.antique()!.id);
    this.router.navigate(['/coleccion']);
  }
}
