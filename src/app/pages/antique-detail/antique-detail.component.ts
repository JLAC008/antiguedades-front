import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AntiquesService } from '../../core/antiques.service';
import { AuthService } from '../../core/auth.service';
import { Antique, AntiqueStatus, ANTIQUE_STATUS_LABELS, DEFAULT_ANTIQUE_IMAGE } from '../../models';

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
                  @if (antique()!.status) {
                    <span class="antique-status-ribbon" [class]="'antique-status-' + antique()!.status">{{ statusLabel(antique()!.status) }}</span>
                  }
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
                  <img [src]="defaultImage" [alt]="antique()!.name + ' — imagen de referencia'" class="gallery-default-img" />
                  @if (antique()!.status) {
                    <span class="antique-status-ribbon" [class]="'antique-status-' + antique()!.status">{{ statusLabel(antique()!.status) }}</span>
                  }
                  <p>Imagen de referencia</p>
                </div>
              }
            </section>

            <section class="antique-info">
              @if (antique()!.catalog) {
                <a [routerLink]="['/catalogo', antique()!.catalog_id]" class="catalog-tag">
                  {{ antique()!.catalog!.name }}
                </a>
              }

              <div class="info-head">
                <div class="info-head-left">
                  @if (antique()!.lot_number) {
                    <p class="antique-lot-number">Lote nº {{ antique()!.lot_number }}</p>
                  }
                  <h1 class="antique-title">{{ antique()!.name }}</h1>
                  @if (antique()!.year_era) {
                    <p class="antique-era">{{ antique()!.year_era }}</p>
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
                </div>
                @if (auth.isAdmin && antique()!.price > 0) {
                  <p class="antique-price">{{ antique()!.price | currency:'EUR':'symbol':'1.0-0' }}</p>
                }
              </div>

              <div class="info-card">
                <div class="info-card-body">
                  @if (antique()!.description) {
                    <div class="info-desc-col">
                      <h3 class="section-label">Descripción</h3>
                      <p class="antique-desc">{{ antique()!.description }}</p>
                    </div>
                  }
                  <div class="info-specs-col">
                    <h3 class="section-label">Detalles</h3>
                    <div class="specs-grid">
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
                      @if (antique()!.title) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">▤</span> Título</span>
                          <span class="spec-value">{{ antique()!.title }}</span>
                        </div>
                      }
                      @if (antique()!.author) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">✎</span> Autor</span>
                          <span class="spec-value">{{ antique()!.author }}</span>
                        </div>
                      }
                      @if (antique()!.editor) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">▣</span> Editor</span>
                          <span class="spec-value">{{ antique()!.editor }}</span>
                        </div>
                      }
                      @if (antique()!.imprenta) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">▦</span> Imprenta</span>
                          <span class="spec-value">{{ antique()!.imprenta }}</span>
                        </div>
                      }
                      @if (antique()!.edition) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">№</span> Edición</span>
                          <span class="spec-value">{{ antique()!.edition }}</span>
                        </div>
                      }
                      @if (antique()!.century) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">◷</span> Siglo</span>
                          <span class="spec-value">{{ antique()!.century }}</span>
                        </div>
                      }
                      @if (antique()!.theme) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">◆</span> Tema</span>
                          <span class="spec-value">{{ antique()!.theme }}</span>
                        </div>
                      }
                      @if (antique()!.signature) {
                        <div class="spec-item">
                          <span class="spec-label"><span class="spec-icon">✦</span> Firma / marca</span>
                          <span class="spec-value">{{ antique()!.signature }}</span>
                        </div>
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
                  </div>
                </div>
              </div>

              @if (auth.isAdmin) {
                <div class="admin-actions">
                  <a [routerLink]="['/editar', antique()!.id]" class="btn-edit">
                    <span aria-hidden="true">✎</span>
                    Editar pieza
                  </a>
                  <button class="btn-delete" (click)="showDeleteModal.set(true)">
                    <span aria-hidden="true">⌫</span>
                    Eliminar
                  </button>
                </div>
              }

              @if (showDeleteModal()) {
                <div class="modal-overlay" (click)="cancelDelete()">
                  <div class="modal" (click)="$event.stopPropagation()">
                    <h3 class="modal-title">Eliminar pieza</h3>
                    <p class="modal-text">
                      ¿Estás seguro de que deseas eliminar <strong>{{ antique()!.name }}</strong>?
                      <br/>Esta acción no se puede deshacer.
                    </p>
                    <div class="modal-actions">
                      <button class="btn-cancel" (click)="cancelDelete()">Cancelar</button>
                      <button class="btn-delete-confirm" (click)="confirmDelete()">Eliminar</button>
                    </div>
                  </div>
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
      grid-template-columns: minmax(0, 1fr) minmax(460px, 1fr);
      gap: clamp(2rem, 4.2vw, 4.2rem);
      align-items: stretch;
    }

    .antique-gallery {
      display: flex;
      flex-direction: column;
    }

    .gallery-main {
      flex: 1 1 auto;
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
      object-fit: contain;
      display: block;
    }

    .antique-status-ribbon {
      position: absolute;
      top: 1.15rem;
      left: -0.35rem;
      z-index: 3;
      padding: 0.55rem 1.1rem 0.55rem 1.2rem;
      color: #17120c;
      background: #d4ac62;
      border: 1px solid rgba(255, 239, 194, 0.8);
      border-left: 0;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.36);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .antique-status-ribbon::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -0.42rem;
      border-top: 0.42rem solid #80602d;
      border-left: 0.42rem solid transparent;
    }
    .antique-status-reservado { background: var(--color-accent); }
    .antique-status-pagado { background: var(--color-accent-light); }
    .antique-status-vendido { background: var(--color-secondary); color: #fff8ed; }
    .antique-status-enviado { background: var(--color-primary); color: var(--color-accent-light); }

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
      position: relative;
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

    .gallery-default-img {
      width: min(82%, 560px);
      max-height: 420px;
      object-fit: contain;
      display: block;
      border-radius: 4px;
    }

    .antique-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
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
      margin: 0;
      color: #fff8ed;
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.2rem, 3.8vw, 3.4rem);
      font-weight: 700;
      line-height: 1;
      text-shadow: 0 14px 36px rgba(0, 0, 0, 0.56);
    }

    .antique-lot-number {
      margin: 0 0 0.55rem;
      color: #d4ac62;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .antique-era {
      margin: 0.3rem 0 0;
      color: #d8bf91;
      font-size: 1rem;
    }

    .antique-price {
      margin: 0;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.8rem, 3vw, 2.6rem);
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
      align-self: center;
    }

    .info-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.25rem;
      margin-bottom: 1rem;
    }

    .info-head-left {
      flex: 1;
      min-width: 0;
    }

    .antique-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.65rem;
    }

    .antique-badge {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 0 0.85rem;
      border: 1px solid rgba(184, 149, 90, 0.62);
      border-radius: 999px;
      color: #e2c27f;
      background: rgba(7, 7, 6, 0.48);
      font-size: 0.82rem;
      white-space: nowrap;
    }

    .section-label {
      margin: 0 0 0.55rem;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .info-card {
      border: 1px solid rgba(184, 149, 90, 0.35);
      border-radius: 8px;
      background:
        linear-gradient(180deg, rgba(18, 18, 17, 0.88), rgba(9, 9, 8, 0.8)),
        radial-gradient(circle at 0% 0%, rgba(184, 149, 90, 0.06), transparent 16rem);
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
    }

    .info-card-body {
      display: grid;
      grid-template-columns: minmax(0, 1.08fr) minmax(300px, 0.92fr);
      gap: 1.25rem;
      padding: 1.15rem 1.25rem;
    }

    .info-desc-col {
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-right: 0.35rem;
    }

    .antique-desc {
      margin: 0;
      color: rgba(247, 239, 227, 0.82);
      font-size: 0.98rem;
      line-height: 1.82;
    }

    .info-specs-col {
      min-width: 0;
    }

    .specs-grid {
      display: grid;
      gap: 0.15rem;
    }

    .spec-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      min-height: 32px;
      padding: 0.2rem 0;
      border-bottom: 1px solid rgba(184, 149, 90, 0.12);
    }

    .spec-item:last-child {
      border-bottom: 0;
    }

    .spec-label {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      color: #d8bf91;
      font-weight: 500;
      font-size: 0.88rem;
      white-space: nowrap;
    }

    .spec-icon {
      width: 1.1rem;
      color: #d4ac62;
      text-align: center;
      font-size: 0.9rem;
    }

    .spec-value {
      color: #fff8ed;
      font-weight: 400;
      text-align: right;
      overflow-wrap: anywhere;
      font-size: 0.88rem;
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
      grid-template-columns: repeat(2, minmax(260px, max-content));
      justify-content: center;
      gap: clamp(2rem, 7vw, 7rem);
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

      .gallery-main {
        min-height: 390px;
      }
    }

    @media (max-width: 820px) {
      .info-card-body {
        grid-template-columns: 1fr;
      }

      .info-desc-col {
        border-bottom: 1px solid rgba(184, 149, 90, 0.18);
        padding-bottom: 0.85rem;
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

      .info-head {
        flex-direction: column;
        gap: 0.65rem;
      }

      .antique-title {
        font-size: clamp(2rem, 11vw, 2.8rem);
      }

      .antique-badge-row {
        gap: 0.5rem;
      }

      .antique-badge {
        min-height: 30px;
        padding: 0 0.7rem;
      }

      .spec-item {
        align-items: flex-start;
        gap: 0.7rem;
        padding: 0.35rem 0;
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

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal {
      background: #1c1b1a;
      border: 1px solid rgba(184,149,90,0.35);
      border-radius: 12px;
      padding: 2rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
      color: #f0e8db;
    }
    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: #f0e8db;
    }
    .modal-text {
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0 0 1.5rem;
      color: rgba(240,232,219,0.8);
    }
    .modal-text strong {
      color: #f0e8db;
    }
    .modal-actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn-cancel {
      flex: 1;
      min-height: 48px;
      border: 1px solid rgba(184,149,90,0.35);
      border-radius: 8px;
      background: transparent;
      color: #f0e8db;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-cancel:hover {
      background: rgba(184,149,90,0.1);
    }
    .btn-delete-confirm {
      flex: 1;
      min-height: 48px;
      border: none;
      border-radius: 8px;
      background: #a0302b;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-delete-confirm:hover {
      background: #c43d36;
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeSlideRight {
      from { opacity: 0; transform: translateX(-16px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    @keyframes scaleReveal {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }

    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 28px 70px rgba(0,0,0,0.44), 0 0 0 rgba(212,172,98,0); }
      50%      { box-shadow: 0 28px 70px rgba(0,0,0,0.44), 0 0 32px rgba(212,172,98,0.18); }
    }

    @keyframes badgePop {
      0%   { opacity: 0; transform: scale(0.5); }
      60%  { transform: scale(1.08); }
      100% { opacity: 1; transform: scale(1); }
    }

    @keyframes trustSlideLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    @keyframes trustSlideRight {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .breadcrumb {
      animation: fadeSlideUp 0.5s ease-out both;
    }

    .antique-gallery {
      animation: fadeSlideUp 0.7s ease-out 0.1s both;
    }

    .antique-info {
      animation: fadeSlideUp 0.7s ease-out 0.2s both;
    }

    .gallery-main {
      animation: glowPulse 5s ease-in-out infinite, scaleReveal 0.8s ease-out 0.1s both;
    }

    .gallery-main-img {
      transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease;
    }

    .gallery-main:hover .gallery-main-img {
      transform: none;
    }

    .gallery-arrow {
      transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s;
    }
    .gallery-arrow:hover:not(:disabled) {
      transform: translateY(-50%) scale(1.1);
    }

    .gallery-thumb-btn {
      transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    }
    .gallery-thumb-btn:hover,
    .gallery-thumb-btn.active {
      transform: translateY(-3px);
      box-shadow: 0 4px 16px rgba(212,172,98,0.2);
    }

    .antique-title {
      animation: fadeSlideUp 0.6s ease-out 0.25s both;
    }

    .antique-era {
      animation: fadeSlideUp 0.5s ease-out 0.35s both;
    }

    .antique-badge {
      animation: badgePop 0.5s ease-out both;
    }
    .antique-badge:nth-child(1) { animation-delay: 0.4s; }
    .antique-badge:nth-child(2) { animation-delay: 0.47s; }
    .antique-badge:nth-child(3) { animation-delay: 0.54s; }
    .antique-badge:nth-child(4) { animation-delay: 0.61s; }
    .antique-badge:nth-child(5) { animation-delay: 0.68s; }

    .antique-price {
      animation: fadeSlideUp 0.6s ease-out 0.35s both;
    }

    .section-label {
      animation: fadeSlideUp 0.5s ease-out 0.4s both;
    }

    .antique-desc {
      animation: fadeSlideUp 0.6s ease-out 0.45s both;
    }

    .spec-item {
      animation: fadeSlideRight 0.45s ease-out both;
    }
    .spec-item:nth-child(1) { animation-delay: 0.45s; }
    .spec-item:nth-child(2) { animation-delay: 0.48s; }
    .spec-item:nth-child(3) { animation-delay: 0.51s; }
    .spec-item:nth-child(4) { animation-delay: 0.54s; }
    .spec-item:nth-child(5) { animation-delay: 0.57s; }
    .spec-item:nth-child(6) { animation-delay: 0.60s; }
    .spec-item:nth-child(7) { animation-delay: 0.63s; }
    .spec-item:nth-child(8) { animation-delay: 0.66s; }
    .spec-item:nth-child(9) { animation-delay: 0.69s; }
    .spec-item:nth-child(10) { animation-delay: 0.72s; }
    .spec-item:nth-child(11) { animation-delay: 0.75s; }
    .spec-item:nth-child(12) { animation-delay: 0.78s; }
    .spec-item:nth-child(13) { animation-delay: 0.81s; }
    .spec-item:nth-child(14) { animation-delay: 0.84s; }
    .spec-item:nth-child(15) { animation-delay: 0.87s; }

    .admin-actions {
      animation: fadeSlideUp 0.6s ease-out 0.5s both;
    }

    .trust-strip {
      animation: fadeSlideUp 0.7s ease-out 0.3s both;
    }
    .trust-item:nth-child(1) {
      animation: trustSlideLeft 0.6s ease-out 0.35s both;
    }
    .trust-item:nth-child(2) {
      animation: fadeSlideUp 0.6s ease-out 0.45s both;
    }
    .trust-item:nth-child(3) {
      animation: trustSlideRight 0.6s ease-out 0.55s both;
    }

    @media (prefers-reduced-motion: reduce) {
      .breadcrumb,
      .antique-gallery,
      .antique-info,
      .gallery-main,
      .antique-title,
      .antique-era,
      .antique-badge,
      .antique-price,
      .section-label,
      .antique-desc,
      .spec-item,
      .admin-actions,
      .trust-strip,
      .trust-item,
      .gallery-main-img {
        animation: none;
        transition: none;
      }
      .gallery-main:hover .gallery-main-img {
        transform: none;
      }
    }
  `]
})
export class AntiqueDetailComponent implements OnInit {
  defaultImage = DEFAULT_ANTIQUE_IMAGE;

  statusLabel(status: AntiqueStatus | null | undefined): string {
    return status ? ANTIQUE_STATUS_LABELS[status] : '';
  }
  antique = signal<Antique | null>(null);
  loading = signal(true);
  selectedImage = signal('');
  images: string[] = [];
  currentIndex = 0;
  showDeleteModal = signal(false);

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

  cancelDelete() {
    this.showDeleteModal.set(false);
  }

  async confirmDelete() {
    this.showDeleteModal.set(false);
    await this.antiquesService.delete(this.antique()!.id);
    this.router.navigate(['/coleccion']);
  }
}
