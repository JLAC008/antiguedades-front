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
            <a routerLink="/coleccion" class="btn-primary">Volver a la colección</a>
          </div>
        } @else {
          <a class="breadcrumb" (click)="goBack()">
            <span aria-hidden="true">←</span>
            Volver a la colección
          </a>

          <div class="antique-layout">
            <section class="antique-gallery" aria-label="Galería de imágenes">
              @if (antique()!.images && antique()!.images.length > 0) {
                <div class="gallery-main" tabindex="0" (keydown)="onKeydown($event)">
                  <img [src]="selectedImage()" [alt]="antique()!.name" class="gallery-main-img" />
                  <div class="gallery-shadow"></div>
                  @if (images.length > 1) {
                    <button class="gallery-arrow gallery-arrow-left" (click)="prevImage()" [disabled]="currentIndex === 0" aria-label="Imagen anterior">‹</button>
                    <button class="gallery-arrow gallery-arrow-right" (click)="nextImage()" [disabled]="currentIndex === images.length - 1" aria-label="Imagen siguiente">›</button>
                    <span class="gallery-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
                  }
                </div>
                @if (antique()!.images.length > 1) {
                  <div class="gallery-thumbs">
                    @for (img of antique()!.images; track img) {
                      <button class="gallery-thumb-btn" [class.active]="selectedImage() === img" (click)="selectImage(img)" type="button">
                        <img [src]="img" [alt]="antique()!.name" class="gallery-thumb" />
                      </button>
                    }
                  </div>
                }
              } @else {
                <div class="gallery-empty">
                  <span aria-hidden="true">A</span>
                  <p>Sin imágenes</p>
                </div>
              }
            </section>

            <section class="antique-info">
              @if (antique()!.catalog) {
                <a [routerLink]="['/catalogo', antique()!.catalog_id]" class="catalog-tag">
                  {{ antique()!.catalog!.name }}
                </a>
              }

              <h1 class="antique-title">{{ antique()!.name }}</h1>
              @if (antique()!.year_era) {
                <p class="antique-era">{{ antique()!.year_era }}</p>
              }

              <div class="title-rule" aria-hidden="true">⌘</div>

              @if (antique()!.price > 0) {
                <p class="antique-price">{{ antique()!.price | currency:'EUR':'symbol':'1.0-0' }}</p>
              }

              <div class="antique-badge-row">
                <span class="antique-badge">{{ antique()!.type === 'antiguedad' ? 'Antigüedades' : 'Papelería' }}</span>
                @if (antique()!.subcategory) {
                  <span class="antique-badge">{{ subLabel(antique()!.subcategory) }}</span>
                }
                @if (antique()!.detail) {
                  <span class="antique-badge">{{ detLabel(antique()!.detail) }}</span>
                }
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
                      <span class="spec-label"><span class="spec-icon">◎</span> País</span>
                      <span class="spec-value">{{ antique()!.country }}</span>
                    </div>
                  }
                  @if (antique()!.region) {
                    <div class="spec-item">
                      <span class="spec-label"><span class="spec-icon">◇</span> Región</span>
                      <span class="spec-value">{{ antique()!.region }}</span>
                    </div>
                  }
                  @if (antique()!.element) {
                    <div class="spec-item">
                      <span class="spec-label"><span class="spec-icon">✦</span> Elemento</span>
                      <span class="spec-value">{{ antique()!.element }}</span>
                    </div>
                  }
                }
                @if (antique()!.type === 'papeleria') {
                  @if (antique()!.paper_type) {
                    <div class="spec-item">
                      <span class="spec-label"><span class="spec-icon">◇</span> Tipo de papel</span>
                      <span class="spec-value">{{ antique()!.paper_type }}</span>
                    </div>
                  }
                  @if (antique()!.paper_format) {
                    <div class="spec-item">
                      <span class="spec-label"><span class="spec-icon">□</span> Formato</span>
                      <span class="spec-value">{{ antique()!.paper_format }}</span>
                    </div>
                  }
                  @if (antique()!.paper_weight) {
                    <div class="spec-item">
                      <span class="spec-label"><span class="spec-icon">≋</span> Gramaje</span>
                      <span class="spec-value">{{ antique()!.paper_weight }} g/m²</span>
                    </div>
                  }
                }
                @if (antique()!.material) {
                  <div class="spec-item">
                    <span class="spec-label"><span class="spec-icon">◇</span> Material</span>
                    <span class="spec-value">{{ antique()!.material }}</span>
                  </div>
                }
                @if (antique()!.dimensions) {
                  <div class="spec-item">
                    <span class="spec-label"><span class="spec-icon">↗</span> Dimensiones</span>
                    <span class="spec-value">{{ antique()!.dimensions }}</span>
                  </div>
                }
                <div class="spec-item">
                  <span class="spec-label"><span class="spec-icon">✓</span> Estado</span>
                  <span class="spec-value">{{ antique()!.condition }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label"><span class="spec-icon">▦</span> Añadido</span>
                  <span class="spec-value">{{ antique()!.created_at | date:'d MMM y' }}</span>
                </div>
              </div>

              @if (auth.isAdmin) {
                <div class="admin-actions">
                  <a [routerLink]="['/editar', antique()!.id]" class="btn-edit">
                    <span aria-hidden="true">✎</span>
                    Editar pieza
                  </a>
                  <button class="btn-delete" (click)="confirmDelete()">
                    <span aria-hidden="true">⌫</span>
                    Eliminar
                  </button>
                </div>
              }
            </section>
          </div>

          <div class="trust-strip" aria-label="Garantías de la pieza">
            <div class="trust-item">
              <span class="trust-icon" aria-hidden="true">✓</span>
              <div><strong>Pieza verificada</strong><span>Autenticidad garantizada</span></div>
            </div>
            <div class="trust-item">
              <span class="trust-icon" aria-hidden="true">▤</span>
              <div><strong>Procedencia documentada</strong><span>Historial completo disponible</span></div>
            </div>
            <div class="trust-item">
              <span class="trust-icon" aria-hidden="true">▣</span>
              <div><strong>Conservación privada</strong><span>Custodia y registro familiar</span></div>
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
        radial-gradient(circle at 50% -8%, rgba(184, 149, 90, 0.16), transparent 31rem),
        radial-gradient(circle at 0% 35%, rgba(184, 149, 90, 0.08), transparent 24rem),
        linear-gradient(180deg, #050505 0%, #0b0b0a 48%, #10100f 100%);
      color: #f7efe3;
    }

    .page-content {
      max-width: 1360px;
      margin: 0 auto;
      padding: 2.25rem 1.5rem 3.6rem;
    }

    .breadcrumb {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      margin-bottom: 1.45rem;
      color: #d4ac62;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s, transform 0.2s;
    }

    .breadcrumb:hover {
      color: #f1cf88;
      transform: translateX(-2px);
    }

    .antique-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.82fr);
      gap: clamp(2rem, 4.2vw, 4.2rem);
      align-items: start;
    }

    .gallery-main {
      position: relative;
      min-height: 480px;
      aspect-ratio: 1.24;
      overflow: hidden;
      border: 1px solid rgba(184, 149, 90, 0.58);
      border-radius: 8px;
      background:
        radial-gradient(circle at center, rgba(184, 149, 90, 0.18), transparent 16rem),
        #0a0a09;
      box-shadow: 0 28px 70px rgba(0, 0, 0, 0.44);
    }

    .gallery-main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .gallery-shadow {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(0, 0, 0, 0.38), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.38)),
        linear-gradient(180deg, transparent 65%, rgba(0, 0, 0, 0.32));
      pointer-events: none;
    }

    .gallery-arrow {
      position: absolute;
      top: 50%;
      z-index: 2;
      width: 48px;
      height: 48px;
      border-radius: 999px;
      border: 1px solid rgba(212, 172, 98, 0.85);
      background: rgba(5, 5, 5, 0.58);
      color: #f8d48c;
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      display: grid;
      place-items: center;
      transform: translateY(-50%);
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }

    .gallery-arrow:hover:not(:disabled) {
      background: rgba(184, 149, 90, 0.22);
      color: #fff8ed;
    }

    .gallery-arrow:disabled {
      opacity: 0.34;
      cursor: default;
    }

    .gallery-arrow-left { left: 1rem; }
    .gallery-arrow-right { right: 1rem; }

    .gallery-counter {
      position: absolute;
      z-index: 2;
      left: 50%;
      bottom: 1rem;
      min-width: 76px;
      transform: translateX(-50%);
      padding: 0.48rem 1rem;
      border: 1px solid rgba(212, 172, 98, 0.72);
      border-radius: 999px;
      background: rgba(6, 6, 5, 0.66);
      color: #fff8ed;
      font-weight: 600;
      text-align: center;
      backdrop-filter: blur(8px);
    }

    .gallery-thumbs {
      display: flex;
      gap: 0.9rem;
      margin-top: 1rem;
      overflow-x: auto;
      padding-bottom: 0.2rem;
    }

    .gallery-thumb-btn {
      flex: 0 0 auto;
      width: 124px;
      height: 86px;
      padding: 0;
      overflow: hidden;
      border: 1px solid rgba(184, 149, 90, 0.24);
      border-radius: 5px;
      background: #0b0b0a;
      cursor: pointer;
      transition: border-color 0.2s, transform 0.2s;
    }

    .gallery-thumb-btn:hover,
    .gallery-thumb-btn.active {
      border-color: #d4ac62;
      transform: translateY(-2px);
    }

    .gallery-thumb {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .gallery-empty {
      min-height: 480px;
      border: 1px solid rgba(184, 149, 90, 0.45);
      border-radius: 8px;
      display: grid;
      place-items: center;
      align-content: center;
      gap: 0.8rem;
      color: rgba(247, 239, 227, 0.7);
      background:
        radial-gradient(circle at center, rgba(184, 149, 90, 0.14), transparent 15rem),
        #0b0b0a;
    }

    .gallery-empty span {
      width: 70px;
      height: 70px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(184, 149, 90, 0.6);
      border-radius: 50%;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
    }

    .antique-info {
      padding-top: 0.25rem;
    }

    .catalog-tag {
      display: inline-flex;
      margin-bottom: 0.9rem;
      color: #d4ac62;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
    }

    .catalog-tag:hover {
      color: #f1cf88;
    }

    .antique-title {
      margin: 0 0 0.42rem;
      color: #fff8ed;
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.75rem, 4.6vw, 4.6rem);
      font-weight: 700;
      line-height: 0.98;
      text-shadow: 0 14px 36px rgba(0, 0, 0, 0.56);
    }

    .antique-era {
      margin: 0;
      color: #d8bf91;
      font-size: 1.05rem;
    }

    .title-rule {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      max-width: 320px;
      margin: 1rem 0 1.4rem;
      color: #c89b4b;
      font-family: Georgia, serif;
      font-size: 1rem;
    }

    .title-rule::before,
    .title-rule::after {
      content: '';
      height: 1px;
      flex: 1;
      background: linear-gradient(90deg, rgba(200, 155, 75, 0.9), transparent);
    }

    .title-rule::before {
      background: linear-gradient(90deg, transparent, rgba(200, 155, 75, 0.9));
    }

    .antique-price {
      margin: 0 0 1.35rem;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.3rem, 4vw, 3.25rem);
      font-weight: 700;
      line-height: 1;
    }

    .antique-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      margin-bottom: 1.8rem;
    }

    .antique-badge {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 0 1.05rem;
      border: 1px solid rgba(184, 149, 90, 0.62);
      border-radius: 999px;
      color: #e2c27f;
      background: rgba(7, 7, 6, 0.48);
      font-size: 0.86rem;
      white-space: nowrap;
    }

    .antique-section {
      margin-bottom: 1.65rem;
    }

    .section-label {
      margin: 0 0 0.65rem;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: 1.08rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .antique-desc {
      max-width: 620px;
      margin: 0;
      color: rgba(247, 239, 227, 0.82);
      font-size: 1rem;
      line-height: 1.85;
    }

    .antique-specs {
      display: grid;
      margin-bottom: 1.55rem;
      padding: 0.95rem 1.25rem;
      border: 1px solid rgba(184, 149, 90, 0.42);
      border-radius: 8px;
      background:
        linear-gradient(180deg, rgba(18, 18, 17, 0.86), rgba(9, 9, 8, 0.78)),
        radial-gradient(circle at 0% 0%, rgba(184, 149, 90, 0.08), transparent 16rem);
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
    }

    .spec-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      min-height: 42px;
      border-bottom: 1px solid rgba(184, 149, 90, 0.16);
    }

    .spec-item:last-child {
      border-bottom: 0;
    }

    .spec-label {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: #d8bf91;
      font-weight: 500;
    }

    .spec-icon {
      width: 1.35rem;
      color: #d4ac62;
      text-align: center;
      font-size: 1.05rem;
    }

    .spec-value {
      color: #fff8ed;
      font-weight: 500;
      text-align: right;
      overflow-wrap: anywhere;
    }

    .admin-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }

    .btn-edit,
    .btn-delete,
    .btn-primary {
      min-height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      text-decoration: none;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s;
    }

    .btn-edit,
    .btn-primary {
      border: 1px solid rgba(212, 172, 98, 0.9);
      background: linear-gradient(180deg, #c69842, #a97725);
      color: #fff8ed;
      box-shadow: 0 16px 34px rgba(184, 149, 90, 0.18);
    }

    .btn-delete {
      border: 1px solid rgba(196, 53, 46, 0.72);
      background: rgba(45, 8, 8, 0.14);
      color: #ff5b55;
      font-size: 0.98rem;
    }

    .btn-edit:hover,
    .btn-primary:hover,
    .btn-delete:hover {
      transform: translateY(-2px);
    }

    .btn-delete:hover {
      background: rgba(196, 53, 46, 0.12);
      border-color: #ff5b55;
    }

    .trust-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 2.35rem;
      padding: 1.25rem 1.35rem;
      border: 1px solid rgba(184, 149, 90, 0.38);
      border-radius: 8px;
      background: linear-gradient(180deg, rgba(16, 16, 15, 0.88), rgba(8, 8, 7, 0.82));
    }

    .trust-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      min-width: 0;
    }

    .trust-icon {
      width: 44px;
      height: 44px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border: 1px solid rgba(212, 172, 98, 0.58);
      color: #d4ac62;
      font-size: 1.2rem;
    }

    .trust-item strong {
      display: block;
      color: #e7c37c;
      font-family: 'Playfair Display', serif;
      font-size: 1.02rem;
      line-height: 1.2;
    }

    .trust-item span span,
    .trust-item div span {
      display: block;
      margin-top: 0.15rem;
      color: rgba(247, 239, 227, 0.6);
      font-size: 0.82rem;
      line-height: 1.25;
    }

    .loading-state,
    .empty-state {
      min-height: 50vh;
      display: grid;
      place-items: center;
      align-content: center;
      gap: 1rem;
      color: rgba(247, 239, 227, 0.72);
      text-align: center;
    }

    @media (max-width: 1050px) {
      .antique-layout {
        grid-template-columns: 1fr;
      }

      .antique-info {
        padding-top: 0;
      }

      .gallery-main {
        min-height: 390px;
      }
    }

    @media (max-width: 760px) {
      .page-content {
        padding: 1.4rem 1rem 2.8rem;
      }

      .breadcrumb {
        margin-bottom: 1rem;
      }

      .gallery-main {
        min-height: 320px;
        aspect-ratio: 0.95;
      }

      .gallery-arrow {
        width: 42px;
        height: 42px;
      }

      .gallery-thumb-btn {
        width: 88px;
        height: 66px;
      }

      .antique-title {
        font-size: clamp(2.35rem, 13vw, 3.4rem);
      }

      .antique-badge-row {
        gap: 0.5rem;
      }

      .antique-badge {
        min-height: 32px;
        padding: 0 0.8rem;
      }

      .spec-item {
        align-items: flex-start;
        gap: 0.9rem;
        padding: 0.7rem 0;
        min-height: auto;
      }

      .spec-label {
        max-width: 42%;
      }

      .admin-actions,
      .trust-strip {
        grid-template-columns: 1fr;
      }

      .trust-item {
        justify-content: flex-start;
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
    busto: 'Busto',
    figura: 'Figura',
    belen: 'Belén',
    oleo: 'Óleo',
    grabado: 'Grabado',
    acuarela: 'Acuarela',
    'hist-postal': 'Hist. postal',
    'entero-postal': 'Entero postal',
    sello: 'Sello',
    'pre-filatelia': 'Pre-filatelia',
    censura: 'Censura',
    familiar: 'Familiar',
    boda: 'Boda',
    ninos: 'Niños',
    hombres: 'Hombres',
    mujeres: 'Mujeres',
    militar: 'Militar',
    etnica: 'Étnica',
    paisaje: 'Paisaje',
    retrato: 'Retrato',
    'blanco-negro': 'Blanco y negro',
    estudio: 'Estudio',
    reportaje: 'Reportaje',
    arquitectura: 'Arquitectura',
    naturaleza: 'Naturaleza',
    'post-mortem': 'Post mortem',
    motos: 'Motos',
    coches: 'Coches',
    politica: 'Política',
    historia: 'Historia',
    ciencia: 'Ciencia',
    deportes: 'Deportes',
    moda: 'Moda',
    arte: 'Arte',
    musica: 'Música',
    humor: 'Humor',
    viajes: 'Viajes',
    economia: 'Economía',
    cultura: 'Cultura',
    tecnologia: 'Tecnología',
    folletos: 'Folletos',
    partituras: 'Partituras',
    escrituras: 'Escrituras',
    mapas: 'Mapas',
    carteles: 'Carteles',
    otros: 'Otros',
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
        this.currentIndex = 0;
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
    if (event.key === 'ArrowLeft') {
      this.prevImage();
      event.preventDefault();
    }
    if (event.key === 'ArrowRight') {
      this.nextImage();
      event.preventDefault();
    }
  }

  async confirmDelete() {
    if (!confirm(`¿Eliminar "${this.antique()?.name}"? Esta acción no se puede deshacer.`)) return;
    await this.antiquesService.delete(this.antique()!.id);
    this.router.navigate(['/coleccion']);
  }
}
