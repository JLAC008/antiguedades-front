import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
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
                <span class="antique-badge">{{ antique()!.type === 'antiguedad' ? 'Antigüedades' : 'Papelería' }}</span>
                <span class="antique-badge">{{ subLabel(antique()!.subcategory) }}{{ antique()!.detail ? ' → ' + detLabel(antique()!.detail) : '' }}</span>
                <span class="antique-badge">{{ antique()!.condition }}</span>
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

              @if (auth.isLoggedIn) {
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
    .antique-badge-row { margin-bottom: 1.5rem; }
    .antique-badge {
      display: inline-block;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border);
      color: var(--color-secondary);
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
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

  constructor(
    private route: ActivatedRoute,
    private antiquesService: AntiquesService,
    public auth: AuthService,
    private router: Router
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
