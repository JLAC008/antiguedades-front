import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AntiquesService } from '../../core/antiques.service';
import { CatalogsService } from '../../core/catalogs.service';
import { AuthService } from '../../core/auth.service';
import { Catalog, CONDITIONS, Antique, AntiqueType } from '../../models';

@Component({
  selector: 'app-upload-antique',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <div
        class="page-header"
        [class.upload-type-hero]="step() === 1 && !editMode"
        [class.upload-subcategory-hero]="step() === 2 && !editMode"
        [class.upload-paper-hero]="step() === 2 && !editMode && category() === 'papeleria'"
        [class.upload-detail-hero]="step() === 3 && !editMode"
        [class.upload-form-hero]="(step() === 4 && !editMode) || editMode"
      >
        <div class="page-header-inner">
          @if (step() === 1) {
            <a routerLink="/coleccion" class="breadcrumb">&larr; Volver</a>
            <div class="hero-mark" aria-hidden="true">&loz;</div>
            <h1 class="page-title">A&ntilde;adir nueva pieza</h1>
            <p class="page-subtitle">Incorpora una nueva pieza a tu colecci&oacute;n privada</p>
            <div class="page-flourish" aria-hidden="true">&loz;</div>
          }
          @if (step() === 2) {
            <button class="breadcrumb" (click)="step.set(1)">&larr; Volver</button>
            <h1 class="page-title">{{ categoryLabel }}</h1>
            <div class="page-flourish" aria-hidden="true">⌘</div>
            <p class="page-subtitle">Selecciona el tipo de {{ categoryLabel.toLowerCase() }}</p>
          }
          @if (step() === 3) {
            <button class="breadcrumb" (click)="step.set(2)">&larr; Volver</button>
            <h1 class="page-title">{{ categoryLabel }} - {{ subcategoryLabel }}</h1>
            <div class="page-flourish" aria-hidden="true">⌘</div>
            <p class="page-subtitle">Selecciona el tipo de {{ subcategoryLabel.toLowerCase() }}</p>
          }
          @if (step() === 4) {
            <button class="breadcrumb" (click)="step.set(hasDetail(form.subcategory) ? 3 : 2)">&larr; Volver</button>
            <h1 class="page-title">{{ categoryLabel }}{{ subcategoryLabel ? ' - ' + subcategoryLabel : '' }}{{ detailLabel ? ' - ' + detailLabel : '' }}</h1>
            <div class="page-flourish" aria-hidden="true">⌘</div>
            <p class="page-subtitle">Completa los datos de la pieza</p>
          }
          @if (editMode) {
            <a routerLink="/coleccion" class="breadcrumb">&larr; Cancelar</a>
            <h1 class="page-title">{{ categoryLabel }}{{ subcategoryLabel ? ' - ' + subcategoryLabel : '' }}</h1>
            <div class="page-flourish" aria-hidden="true">⌘</div>
            <p class="page-subtitle">Modifica los datos de la pieza</p>
          }
        </div>
      </div>

      <div
        class="page-content"
        [class.upload-type-content]="step() === 1 && !editMode"
        [class.upload-subcategory-content]="step() === 2 && !editMode"
        [class.upload-detail-content]="step() === 3 && !editMode"
        [class.upload-form-content]="(step() === 4 && !editMode) || editMode"
      >
        @if (step() === 1 && !editMode) {
          <p class="category-intro">Selecciona el tipo de pieza que quieres a&ntilde;adir para continuar</p>
          <div class="category-selector">
            <div class="category-card category-card-antique" (click)="selectCategory('antiguedad')">
              <div class="category-icon category-icon-swords" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="m14.5 5 4.4-3.4 1.5 1.5-3.4 4.4"/>
                  <path d="m9.5 5-4.4-3.4-1.5 1.5 3.4 4.4"/>
                  <path d="m8 8 8 8M16 8l-8 8"/>
                  <path d="m6.5 17.5-2 2M17.5 17.5l2 2M6.7 15.3l2 2M17.3 15.3l-2 2"/>
                </svg>
              </div>
              <h2 class="category-name">Antigüedades</h2>
              <span class="category-divider" aria-hidden="true"></span>
              <p class="category-desc">Muebles, relojes, porcelana, cerámica y piezas históricas</p>
              <span class="category-examples-title">Ejemplos:</span>
              <span class="category-examples">Muebles · Relojes · Esculturas · Porcelana · Cerámica · Arte</span>
              <span class="category-action">Seleccionar &rarr;</span>
            </div>
            <div class="category-card category-card-paper" (click)="selectCategory('papeleria')">
              <div class="category-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M7 3h7l5 5v13H7Z"/>
                  <path d="M14 3v6h5M10 13h6M10 17h6"/>
                </svg>
              </div>
              <h2 class="category-name">Papelería</h2>
              <span class="category-divider" aria-hidden="true"></span>
              <p class="category-desc">Documentos, sellos, mapas, grabados y material de archivo</p>
              <span class="category-examples-title">Ejemplos:</span>
              <span class="category-examples">Documentos · Sellos · Mapas · Grabados · Libros · Archivos</span>
              <span class="category-action">Seleccionar &rarr;</span>
            </div>
          </div>
          <div class="category-help">
            <span class="category-help-icon" aria-hidden="true">i</span>
            <div>
              <strong>¿No estás seguro de qué categoría elegir?</strong>
              <p>Puedes cambiar la categoría más adelante desde la edición de la pieza.</p>
            </div>
          </div>
        }

        @if (step() === 2 && !editMode) {
          <div class="subcategory-selector">
            @if (category() === 'antiguedad') {
              <div class="category-card" (click)="selectSubcategory('escultura')">
                <div class="category-icon"><svg viewBox="0 0 24 24"><path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M7 21v-2a5 5 0 0 1 10 0v2"/><path d="M9 14h6"/></svg></div>
                <h2 class="category-name">Escultura</h2>
                <p class="category-desc">Figuras, relieves y piezas tridimensionales</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('pintura')">
                <div class="category-icon"><svg viewBox="0 0 24 24"><path d="M4 20h16"/><path d="M7 20V8l5-4 5 4v12"/><path d="M9 12h6"/><path d="M10 16h4"/></svg></div>
                <h2 class="category-name">Pintura</h2>
                <p class="category-desc">Óleos, acuarelas, grabados y obras en lienzo</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('cristal')">
                <div class="category-icon"><svg viewBox="0 0 24 24"><path d="M8 3h8l-2 10h-4L8 3Z"/><path d="M10 13v6"/><path d="M7 21h10"/><path d="M9 17h6"/></svg></div>
                <h2 class="category-name">Cristal</h2>
                <p class="category-desc">Vidrio, cristal tallado, lámparas y objetos de vidrio</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('ceramica')">
                <div class="category-icon"><svg viewBox="0 0 24 24"><path d="M7 9h10l1 4H6l1-4Z"/><path d="M6 13h12l-2 7H8l-2-7Z"/><path d="M12 9V5a2 2 0 0 1 2-2"/></svg></div>
                <h2 class="category-name">Cerámica</h2>
                <p class="category-desc">Porcelana, loza, azulejos y piezas de barro</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
            }
            @if (category() === 'papeleria') {
              <div class="category-card" (click)="selectSubcategory('filatelia')">
                <div class="category-icon">
                  <svg viewBox="0 0 24 24"><path d="M7 16h10M9 16V9a3 3 0 1 1 6 0v7"/><path d="M5 20h14v-4H5z"/><path d="M8 20v2M16 20v2"/></svg>
                </div>
                <h2 class="category-name">Filatelia</h2>
                <p class="category-desc">Sellos, colecciones postales y material de correo</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('fotos')">
                <div class="category-icon">
                  <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="m7 15 3.2-3.2 2.5 2.5 1.8-1.8L17 15"/><circle cx="16" cy="9" r="1"/></svg>
                </div>
                <h2 class="category-name">Fotos</h2>
                <p class="category-desc">Fotografías antiguas, albumes y positivos</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('revistas')">
                <div class="category-icon">
                  <svg viewBox="0 0 24 24"><path d="M5 5h6a4 4 0 0 1 4 4v10H9a4 4 0 0 0-4 0z"/><path d="M19 5h-4a4 4 0 0 0-4 4"/><path d="M19 5v14a4 4 0 0 0-4 0"/></svg>
                </div>
                <h2 class="category-name">Revistas / Periódicos</h2>
                <p class="category-desc">Publicaciones periódicas, diarios y revistas históricas</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('documentos')">
                <div class="category-icon">
                  <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v6h5M10 13h6M10 17h6"/></svg>
                </div>
                <h2 class="category-name">Documentos</h2>
                <p class="category-desc">Escrituras, cartas, mapas y documentos históricos</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('libros')">
                <div class="category-icon">
                  <svg viewBox="0 0 24 24"><path d="M7 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V6a2 2 0 0 1 2-2Z"/><path d="M8 20V4"/><path d="M11 8h5M11 12h5"/></svg>
                </div>
                <h2 class="category-name">Libros</h2>
                <p class="category-desc">Libros antiguos, primeras ediciones y volúmenes de colección</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
            }
          </div>
          <div class="subcategory-quote" aria-hidden="true">
            <span></span>
            <p>Cada pieza cuenta una historia. Añade con cuidado y preserva el legado.</p>
            <span></span>
          </div>
        }

        @if (step() === 3 && !editMode && hasDetail(form.subcategory)) {
          <div class="subcategory-selector">
            @for (d of detailsForCurrent(); track d.key) {
              <div class="category-card" (click)="selectDetail(d.key)">
                <div class="category-icon"><svg viewBox="0 0 24 24"><path d="M12 3l7 4v6c0 4.2-2.8 7.2-7 8-4.2-.8-7-3.8-7-8V7l7-4Z"/><path d="m9 12 2 2 4-5"/></svg></div>
                <h2 class="category-name">{{ d.label }}</h2>
                <p class="category-desc">{{ d.desc }}</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
            }
          </div>
          <div class="subcategory-quote" aria-hidden="true">
            <span></span>
            <p>Define el detalle con precisión para catalogar mejor la pieza.</p>
            <span></span>
          </div>
        }

        @if ((step() === 4 && !editMode) || editMode) {
          <div class="form-container">
            @if (error()) {
              <div class="form-error">{{ error() }}</div>
            }
            @if (success()) {
              <div class="form-success">{{ success() }}</div>
            }

            <form (ngSubmit)="onSubmit()" class="antique-form" [class.form-step-1]="formStep() === 1" [class.form-step-2]="formStep() === 2" [class.form-step-3]="formStep() === 3" [class.form-step-4]="formStep() === 4">
              <div class="form-step-nav" aria-label="Secciones del formulario">
                <button type="button" class="form-step-item" [class.active]="formStep() === 1" (click)="formStep.set(1)">1. Información básica</button>
                <button type="button" class="form-step-item" [class.active]="formStep() === 2" (click)="formStep.set(2)">2. Detalles</button>
                <button type="button" class="form-step-item" [class.active]="formStep() === 3" (click)="formStep.set(3)">3. Fotografías</button>
                <button type="button" class="form-step-item" [class.active]="formStep() === 4" (click)="formStep.set(4)">4. Revisión</button>
              </div>

              <div class="form-option-c-layout">
                <div class="form-panel-main">
              @if (category() === 'antiguedad') {
                <div class="form-grid">
                  <div class="form-col">
                    <div id="form-basic" class="form-section-title">Información básica</div>
                    <div class="form-group">
                      <label class="form-label">Nombre <span class="required">*</span></label>
                      <input type="text" class="form-input" [(ngModel)]="form.name" name="name" placeholder="Ej. Reloj de péndulo del siglo XIX" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Catálogo</label>
                      <select class="form-select" [(ngModel)]="form.catalog_id" name="catalog_id">
                        <option value="">Sin catálogo</option>
                        @for (cat of catalogs(); track cat.id) {
                          <option [value]="cat.id">{{ cat.name }}</option>
                        }
                      </select>
                    </div>
                    <div class="form-row form-row-3">
                      <div class="form-group">
                        <label class="form-label">País</label>
                        <input type="text" class="form-input" [(ngModel)]="form.country" name="country" placeholder="Ej. España, Francia..." />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Región</label>
                        <input type="text" class="form-input" [(ngModel)]="form.region" name="region" placeholder="Ej. Cataluña, Provenza..." />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Elemento</label>
                        <input type="text" class="form-input" [(ngModel)]="form.element" name="element" placeholder="Ej. Madera, Bronce..." />
                      </div>
                    </div>
                    <div id="form-details" class="form-section-anchor"></div>
                    <div class="form-section-title form-details-title">Detalles de la pieza</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Época / Año</label>
                        <input type="text" class="form-input" [(ngModel)]="form.year_era" name="year_era" placeholder="Ej. Siglo XIX, 1850s" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select class="form-select" [(ngModel)]="form.condition" name="condition">
                          @for (cond of conditions; track cond) {
                            <option [value]="cond">{{ cond }}</option>
                          }
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Material</label>
                        <input type="text" class="form-input" [(ngModel)]="form.material" name="material" placeholder="Ej. Roble, Bronce, Porcelana" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Precio (€)</label>
                        <input type="number" class="form-input" [(ngModel)]="form.price" name="price" placeholder="0" min="0" step="1" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Dimensiones</label>
                      <input type="text" class="form-input" [(ngModel)]="form.dimensions" name="dimensions" placeholder="Ej. 45 x 30 x 20 cm" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Descripción</label>
                      <textarea class="form-textarea" [(ngModel)]="form.description" name="description" rows="5" placeholder="Describe la pieza, su historia, características destacadas..."></textarea>
                    </div>
                  </div>

                  <div class="form-col">
                    <div id="form-photos" class="form-section-title">Fotografías</div>
                    <div class="form-group">
                      <label class="form-label">Añadir imágenes</label>
                      <label class="upload-zone">
                        <input type="file" accept="image/*" multiple (change)="onFilesSelected($event)" hidden />
                        <div class="upload-zone-inner">
                          <span class="upload-icon">&#128247;</span>
                          <p class="upload-text">Arrastra imágenes o haz clic para seleccionar</p>
                          <p class="upload-hint">JPG, PNG, WebP — máx. 10 MB por imagen</p>
                        </div>
                      </label>
                    </div>
                    @if (uploadingImages()) {
                      <div class="upload-progress">
                        <div class="upload-progress-bar">
                          <div class="upload-progress-fill" [style.width.%]="uploadProgress()"></div>
                        </div>
                        <p class="upload-progress-text">Subiendo imágenes... {{ uploadProgress() }}%</p>
                      </div>
                    }
                    @if (existingImages().length > 0) {
                      <div class="images-preview">
                        @for (img of existingImages(); track img; let i = $index) {
                          <div class="image-preview-item">
                            <img [src]="img" alt="Imagen" />
                            <button type="button" class="image-remove" (click)="removeImage(i)">&times;</button>
                            @if (i === 0) {
                              <span class="image-main-badge">Principal</span>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              @if (category() === 'papeleria') {
                <div class="form-grid">
                  <div class="form-col">
                    <div id="form-basic" class="form-section-title">Información del documento</div>
                    <div class="form-group">
                      <label class="form-label">Nombre <span class="required">*</span></label>
                      <input type="text" class="form-input" [(ngModel)]="form.name" name="name" placeholder="Ej. Mapa del siglo XVIII, Carta antigua..." required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Catálogo</label>
                      <select class="form-select" [(ngModel)]="form.catalog_id" name="catalog_id">
                        <option value="">Sin catálogo</option>
                        @for (cat of catalogs(); track cat.id) {
                          <option [value]="cat.id">{{ cat.name }}</option>
                        }
                      </select>
                    </div>
                    <div id="form-details" class="form-section-anchor"></div>
                    <div class="form-section-title form-details-title">Detalles del documento</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Tipo de papel</label>
                        <select class="form-select" [(ngModel)]="form.paper_type" name="paper_type">
                          <option value="">Seleccionar...</option>
                          <option value="verjurado">Verjurado</option>
                          <option value="vitela">Vitela</option>
                          <option value="algodon">Algodón</option>
                          <option value="offset">Offset</option>
                          <option value="reciclado">Reciclado</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Estado</label>
                        <select class="form-select" [(ngModel)]="form.condition" name="condition">
                          @for (cond of conditions; track cond) {
                            <option [value]="cond">{{ cond }}</option>
                          }
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Formato</label>
                        <select class="form-select" [(ngModel)]="form.paper_format" name="paper_format">
                          <option value="">Seleccionar...</option>
                          <option value="a4">A4</option>
                          <option value="a5">A5</option>
                          <option value="a3">A3</option>
                          <option value="carta">Carta</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Gramaje (g/m²)</label>
                        <input type="number" class="form-input" [(ngModel)]="form.paper_weight" name="paper_weight" placeholder="Ej. 120" min="0" step="1" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Año / Época</label>
                      <input type="text" class="form-input" [(ngModel)]="form.year_era" name="year_era" placeholder="Ej. 1780, Siglo XIX..." />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Descripción</label>
                      <textarea class="form-textarea" [(ngModel)]="form.description" name="description" rows="5" placeholder="Describe el documento, su estado, procedencia..."></textarea>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Precio (€)</label>
                      <input type="number" class="form-input" [(ngModel)]="form.price" name="price" placeholder="0" min="0" step="1" />
                    </div>
                  </div>

                  <div class="form-col">
                    <div id="form-photos" class="form-section-title">Fotografías</div>
                    <div class="form-group">
                      <label class="form-label">Añadir imágenes</label>
                      <label class="upload-zone">
                        <input type="file" accept="image/*" multiple (change)="onFilesSelected($event)" hidden />
                        <div class="upload-zone-inner">
                          <span class="upload-icon">&#128247;</span>
                          <p class="upload-text">Arrastra imágenes o haz clic para seleccionar</p>
                          <p class="upload-hint">JPG, PNG, WebP — máx. 10 MB por imagen</p>
                        </div>
                      </label>
                    </div>
                    @if (uploadingImages()) {
                      <div class="upload-progress">
                        <div class="upload-progress-bar">
                          <div class="upload-progress-fill" [style.width.%]="uploadProgress()"></div>
                        </div>
                        <p class="upload-progress-text">Subiendo imágenes... {{ uploadProgress() }}%</p>
                      </div>
                    }
                    @if (existingImages().length > 0) {
                      <div class="images-preview">
                        @for (img of existingImages(); track img; let i = $index) {
                          <div class="image-preview-item">
                            <img [src]="img" alt="Imagen" />
                            <button type="button" class="image-remove" (click)="removeImage(i)">&times;</button>
                            @if (i === 0) {
                              <span class="image-main-badge">Principal</span>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

                  <div class="review-panel">
                    <div class="form-section-title">Revisión</div>
                    <div class="review-grid">
                      <div class="review-item">
                        <span>Tipo</span>
                        <strong>{{ categoryLabel }}</strong>
                      </div>
                      <div class="review-item">
                        <span>Categoría</span>
                        <strong>{{ subcategoryLabel || 'Sin seleccionar' }}</strong>
                      </div>
                      @if (detailLabel) {
                        <div class="review-item">
                          <span>Detalle</span>
                          <strong>{{ detailLabel }}</strong>
                        </div>
                      }
                      <div class="review-item">
                        <span>Nombre</span>
                        <strong>{{ form.name || 'Pendiente' }}</strong>
                      </div>
                      <div class="review-item">
                        <span>Estado</span>
                        <strong>{{ form.condition }}</strong>
                      </div>
                      <div class="review-item">
                        <span>Precio</span>
                        <strong>{{ form.price || 0 }} €</strong>
                      </div>
                      <div class="review-item">
                        <span>Imágenes</span>
                        <strong>{{ existingImages().length }}</strong>
                      </div>
                    </div>
                    <p class="review-note">Revisa que los datos principales estén correctos antes de publicar la pieza.</p>
                  </div>
                </div>

                <aside class="form-guidance" aria-label="Ayuda del formulario">
                  <div class="guidance-kicker">En esta sección</div>
                  <p>Ingresa la información general para identificar y clasificar tu pieza.</p>
                  <div class="guidance-figure" aria-hidden="true">
                    <svg viewBox="0 0 120 120">
                      <path d="M62 17c14 0 25 10 25 24 0 7-3 13-8 18l-2 18 12 6v14H35V83l13-6-2-18c-5-5-8-11-8-18 0-14 10-24 24-24Z"/>
                      <path d="M48 48c8 4 18 4 27 0M51 36c3-4 7-6 12-6 6 0 10 2 13 6M48 77h29M42 97h41"/>
                    </svg>
                  </div>
                </aside>
              </div>

              <div id="form-review" class="form-actions">
                @if (formStep() === 1 && !editMode) {
                  <button type="button" class="btn-cancel" (click)="goBack()">Volver</button>
                }
                @if (formStep() > 1) {
                  <button type="button" class="btn-cancel" (click)="previousFormStep()">Atrás</button>
                }
                @if (editMode) {
                  <a routerLink="/coleccion" class="btn-cancel">Cancelar</a>
                }
                @if (formStep() < 4) {
                  <button type="button" class="btn-submit" (click)="nextFormStep()">Siguiente &rarr;</button>
                } @else {
                  <button type="submit" class="btn-submit" [disabled]="saving()">
                    @if (saving()) { Guardando... } @else { {{ editMode ? 'Guardar cambios' : 'Publicar pieza' }} }
                  </button>
                }
              </div>
            </form>
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
    .page-header.upload-type-hero {
      position: relative;
      overflow: hidden;
      min-height: 260px;
      padding: 3.75rem 1.5rem 2.15rem;
      text-align: center;
      background:
        linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.78)),
        url('/assets/login-bg-gallery.png') center 42% / cover no-repeat;
      border-bottom: 1px solid rgba(184,149,90,0.32);
      color: #fff8ed;
    }
    .page-header.upload-type-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(0,0,0,0.62), transparent 26%, transparent 72%, rgba(0,0,0,0.55)),
        radial-gradient(circle at 15% 45%, rgba(184,149,90,0.14), transparent 18rem);
      pointer-events: none;
    }
    .page-header.upload-type-hero .page-header-inner {
      position: relative;
      z-index: 1;
    }
    .page-header.upload-type-hero .breadcrumb {
      position: absolute;
      left: 0;
      top: 3.15rem;
      color: #d4ac62;
      margin: 0;
    }
    .page-header.upload-type-hero .breadcrumb:hover {
      color: #f2d292;
    }
    .page-header.upload-type-hero .page-title {
      color: #fff8ed;
      font-size: clamp(2.8rem, 5vw, 4.9rem);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      text-shadow: 0 16px 42px rgba(0,0,0,0.62);
    }
    .page-header.upload-type-hero .page-subtitle {
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.1rem, 2vw, 1.45rem);
      margin-top: 0.65rem;
    }
    .page-header.upload-type-hero .page-flourish {
      justify-content: center;
      color: #d4ac62;
      margin: 1.25rem auto 0;
    }
    .hero-mark {
      color: #d4ac62;
      font-family: Georgia, serif;
      font-size: 1rem;
      margin-bottom: 0.85rem;
    }
    .page-header-inner {
      max-width: 1120px;
      margin: 0 auto;
    }
    .breadcrumb {
      font-size: 1rem;
      color: #7c6a58;
      text-decoration: none;
      font-weight: 700;
      display: inline-block;
      margin-bottom: 1.45rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-family: inherit;
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
    .page-subtitle {
      color: #5f5145;
      font-size: 1.02rem;
      margin: 0;
    }
    .page-content {
      max-width: 1120px;
      margin: 0 auto;
      padding: 4rem 1.5rem 5rem;
    }
    .page-content.upload-type-content {
      max-width: 1280px;
      padding: 1.8rem 1.5rem 3.6rem;
    }
    .page-header.upload-subcategory-hero {
      position: relative;
      overflow: hidden;
      min-height: 270px;
      padding: 3rem 1.5rem 2rem;
      background:
        linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 36%, rgba(0,0,0,0.34) 68%, rgba(0,0,0,0.76) 100%),
        url('/assets/login-bg-gallery.png') center 42% / cover no-repeat;
      border-bottom: 1px solid rgba(184,149,90,0.28);
      color: #fff8ed;
    }
    .page-header.upload-paper-hero {
      background:
        linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.28) 68%, rgba(0,0,0,0.72) 100%),
        url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1800&h=620&fit=crop') center 44% / cover no-repeat;
    }
    .page-header.upload-subcategory-hero::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 55%;
      background: linear-gradient(180deg, transparent, #090908);
      pointer-events: none;
    }
    .page-header.upload-subcategory-hero .page-header-inner {
      position: relative;
      z-index: 1;
      max-width: 1060px;
    }
    .page-header.upload-subcategory-hero .breadcrumb {
      color: #d4ac62;
      margin-bottom: 1.5rem;
    }
    .page-header.upload-subcategory-hero .breadcrumb:hover {
      color: #f2d292;
    }
    .page-header.upload-subcategory-hero .page-title {
      color: #fff8ed;
      font-size: clamp(2.8rem, 5vw, 4.2rem);
      text-shadow: 0 16px 42px rgba(0,0,0,0.62);
    }
    .page-header.upload-subcategory-hero .page-subtitle {
      color: rgba(255,248,237,0.86);
      margin-top: 1.25rem;
    }
    .page-header.upload-subcategory-hero .page-flourish {
      color: #d4ac62;
      margin: 1.15rem 0 0;
    }
    .page-content.upload-subcategory-content {
      max-width: 1060px;
      padding: 0 1.5rem 3.2rem;
    }
    .page:has(.upload-type-content) {
      background:
        radial-gradient(circle at 50% 0%, rgba(184,149,90,0.12), transparent 30rem),
        linear-gradient(180deg, #050505 0%, #0b0b0a 48%, #10100f 100%);
      color: #f7efe3;
    }
    .page:has(.upload-subcategory-content) {
      background:
        radial-gradient(circle at 50% 0%, rgba(184,149,90,0.11), transparent 30rem),
        linear-gradient(180deg, #090908 0%, #0b0b0a 48%, #10100f 100%);
      color: #f7efe3;
    }
    .form-error {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: var(--color-error);
      padding: 0.875rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .form-success {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: var(--color-success);
      padding: 0.875rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .category-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.4rem;
      max-width: 1080px;
      margin: 0 auto;
      padding-top: 0.25rem;
    }
    .category-card {
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.82)),
        #11100f;
      border: 1px solid rgba(184,149,90,0.62);
      border-radius: 7px;
      padding: 2.25rem 2rem 0;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      min-height: 380px;
      box-shadow: 0 18px 48px rgba(0,0,0,0.35);
      color: #fff8ed;
      isolation: isolate;
    }
    .category-card::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -2;
      background-position: center;
      background-size: cover;
      opacity: 0.72;
      transition: transform 0.45s, opacity 0.45s;
    }
    .category-card::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background:
        radial-gradient(circle at 50% 32%, rgba(184,149,90,0.18), transparent 11rem),
        linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.78) 68%, rgba(0,0,0,0.92));
    }
    .category-card-antique::before {
      background-image: url('https://images.unsplash.com/photo-1585504198199-20277593b94f?w=900&h=640&fit=crop');
    }
    .category-card-paper::before {
      background-image: url('https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900&h=640&fit=crop');
    }
    .category-card:hover {
      border-color: #d4ac62;
      box-shadow: 0 24px 64px rgba(0,0,0,0.48);
      transform: translateY(-4px);
    }
    .category-card:hover::before {
      transform: scale(1.05);
      opacity: 0.86;
    }
    .category-icon {
      color: #d4ac62;
      width: 94px;
      height: 94px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(3,3,3,0.7);
      border: 1px solid rgba(212,172,98,0.78);
      border-radius: 50%;
      margin-bottom: 0.45rem;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 28px rgba(0,0,0,0.28);
      font-size: 2.3rem;
    }
    .category-icon svg {
      width: 44px;
      height: 44px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.45;
      stroke-linecap: round;
      stroke-linejoin: round;
      display: block;
    }
    .category-icon-swords svg {
      width: 48px;
      height: 48px;
    }
    .category-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 3vw, 2.65rem);
      font-weight: 700;
      color: #fff8ed;
      margin: 0;
      text-shadow: 0 10px 30px rgba(0,0,0,0.62);
    }
    .category-desc {
      color: rgba(255,248,237,0.88);
      font-family: 'Playfair Display', serif;
      font-size: 1.05rem;
      margin: 0;
      line-height: 1.55;
      max-width: 340px;
      min-height: 3.2rem;
    }
    .category-divider {
      display: block;
      width: 92px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(184,149,90,0.72), transparent);
      margin: 0.2rem 0 0.55rem;
    }
    .category-examples-title {
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: 0.95rem;
      font-weight: 700;
      margin-top: 0.25rem;
    }
    .category-examples {
      color: rgba(255,248,237,0.76);
      font-family: 'Playfair Display', serif;
      font-size: 0.88rem;
      line-height: 1.45;
      max-width: 420px;
    }
    .category-action {
      width: calc(100% + 4rem);
      display: block;
      margin: 1.2rem -2rem 0;
      padding: 1rem;
      border-top: 1px solid rgba(184,149,90,0.34);
      background: rgba(3,3,3,0.24);
      font-family: 'Playfair Display', serif;
      font-size: 1.08rem;
      font-weight: 700;
      color: #d4ac62;
    }
    .category-intro {
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.05rem, 2vw, 1.35rem);
      text-align: center;
      margin: 0 0 1.7rem;
    }
    .category-help {
      max-width: 1080px;
      margin: 1.35rem auto 0;
      padding: 1.2rem 1.35rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      border: 1px solid rgba(184,149,90,0.34);
      border-radius: 7px;
      background: linear-gradient(180deg, rgba(18,18,17,0.92), rgba(9,9,8,0.82));
      color: rgba(247,239,227,0.78);
    }
    .category-help-icon {
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(212,172,98,0.68);
      border-radius: 50%;
      color: #d4ac62;
      font-family: Georgia, serif;
    }
    .category-help strong {
      display: block;
      color: #e7c37c;
      font-family: 'Playfair Display', serif;
      font-size: 1.04rem;
      margin-bottom: 0.2rem;
    }
    .category-help p {
      margin: 0;
      font-size: 0.94rem;
    }
    .form-container { max-width: 1100px; margin: 0 auto; }
    .antique-form {
      background: transparent;
      border: none;
      border-radius: 0;
      padding: 0;
    }
    .form-step-nav {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      border-bottom: 1px solid #dccdbd;
      margin-bottom: 1.7rem;
    }
    .form-step-item {
      position: relative;
      padding: 0 0 1rem;
      color: #7b6d60;
      font-size: 0.82rem;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      transition: color 0.2s;
      background: none;
      border: none;
      font-family: inherit;
    }
    .form-step-item:hover {
      color: var(--color-primary);
    }
    .form-step-item:focus-visible {
      outline: 2px solid rgba(184,149,90,0.45);
      outline-offset: 4px;
      border-radius: 3px;
    }
    .form-step-item::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 2px;
      background: transparent;
    }
    .form-step-item.active {
      color: var(--color-primary);
    }
    .form-step-item.active::after {
      background: var(--color-accent);
    }
    .form-option-c-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 190px;
      gap: 1rem;
      align-items: stretch;
    }
    .form-panel-main {
      background: rgba(255, 255, 255, 0.68);
      border: 1px solid #dccdbd;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 16px 42px rgba(64, 47, 29, 0.045);
    }
    .form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 0; }
    .form-col { display: flex; flex-direction: column; gap: 1.25rem; }
    .review-panel { display: none; }
    .form-step-1 .form-col:first-child > :nth-child(n+5),
    .form-step-1 .form-col:nth-child(2),
    .form-step-1 .review-panel {
      display: none;
    }
    .form-step-2 .form-col:first-child > :nth-child(-n+4),
    .form-step-2 .form-col:nth-child(2),
    .form-step-2 .review-panel {
      display: none;
    }
    .form-step-3 .form-col:first-child,
    .form-step-3 .review-panel {
      display: none;
    }
    .form-step-4 .form-grid {
      display: none;
    }
    .form-step-4 .review-panel {
      display: block;
    }
    .form-section-title {
      scroll-margin-top: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8a6f4c;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-border);
    }
    .form-section-anchor {
      scroll-margin-top: 100px;
    }
    .review-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
      margin-top: 1.25rem;
    }
    .review-item {
      background: rgba(250, 248, 244, 0.84);
      border: 1px solid #e2d6c8;
      border-radius: 6px;
      padding: 0.85rem 0.95rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }
    .review-item span {
      color: #7b6d60;
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .review-item strong {
      color: var(--color-primary);
      font-size: 0.95rem;
      overflow-wrap: anywhere;
    }
    .review-note {
      color: #5f5145;
      margin: 1.25rem 0 0;
      line-height: 1.6;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-row-3 { grid-template-columns: 1fr 1fr 1fr; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text); }
    .required { color: var(--color-error); }
    .form-input, .form-select, .form-textarea {
      padding: 0.78rem 0.95rem;
      border: 1px solid #ddcfbe;
      border-radius: 5px;
      font-size: 0.9rem;
      color: var(--color-text);
      background: rgba(255, 255, 255, 0.82);
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .form-textarea { resize: vertical; }
    .upload-zone {
      display: block;
      cursor: pointer;
      border: 1px dashed #d7c7b5;
      border-radius: 5px;
      transition: border-color 0.2s, background 0.2s;
    }
    .upload-zone:hover { border-color: var(--color-accent); background: rgba(184,149,90,0.04); }
    .upload-zone-inner { padding: 2rem 1.5rem; text-align: center; }
    .upload-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
    .upload-text { color: var(--color-text); font-weight: 500; font-size: 0.9375rem; margin: 0 0 0.375rem; }
    .upload-hint { color: var(--color-text-muted); font-size: 0.8125rem; margin: 0; }
    .upload-progress { margin-top: 0.75rem; }
    .upload-progress-bar {
      height: 6px;
      background: var(--color-bg-2);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.375rem;
    }
    .upload-progress-fill {
      height: 100%;
      background: var(--color-accent);
      border-radius: 3px;
      transition: width 0.3s;
    }
    .upload-progress-text { font-size: 0.8125rem; color: var(--color-text-muted); margin: 0; }
    .images-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    .image-preview-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--color-border);
    }
    .image-preview-item img { width: 100%; height: 100%; object-fit: cover; }
    .image-remove {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0,0,0,0.6);
      color: white;
      border: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .image-remove:hover { background: var(--color-error); }
    .image-main-badge {
      position: absolute;
      bottom: 4px;
      left: 4px;
      background: var(--color-accent);
      color: white;
      font-size: 0.625rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .form-guidance {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(246, 239, 229, 0.7));
      border: 1px solid rgba(220, 205, 189, 0.72);
      border-radius: 8px;
      padding: 1.45rem 1.25rem;
      color: #5f5145;
      min-height: 100%;
    }
    .guidance-kicker {
      color: var(--color-primary);
      font-size: 0.78rem;
      font-weight: 800;
      margin-bottom: 0.85rem;
    }
    .form-guidance p {
      margin: 0;
      font-size: 0.86rem;
      line-height: 1.7;
    }
    .guidance-figure {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      color: rgba(140, 113, 73, 0.5);
    }
    .guidance-figure svg {
      width: 100px;
      height: 100px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.68);
      border: 1px solid #dccdbd;
      border-radius: 8px;
    }
    .btn-cancel {
      text-decoration: none;
      padding: 0.875rem 1.75rem;
      border: 1px solid var(--color-border);
      border-radius: 5px;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text-muted);
      transition: all 0.2s;
      background: none;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-cancel:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .btn-submit {
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 5px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: var(--color-secondary); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .subcategory-selector {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      max-width: 790px;
      margin: 0 auto;
      padding-top: 0.25rem;
    }
    .subcategory-selector .category-card {
      min-height: 276px;
      padding: 1.9rem 1.75rem 1.75rem;
    }
    .subcategory-selector .category-icon {
      width: 72px;
      height: 72px;
      font-size: 2.2rem;
      margin-bottom: 0.2rem;
    }
    .subcategory-selector .category-name {
      font-size: 1.45rem;
    }
    .subcategory-selector .category-desc {
      font-size: 0.95rem;
      min-height: 2.95rem;
    }
    .subcategory-selector .category-action {
      margin-top: auto;
      padding-top: 0.85rem;
      position: relative;
    }
    .subcategory-selector .category-action::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 82px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(184,149,90,0.72), transparent);
      transform: translateX(-50%);
    }
    .upload-subcategory-content .subcategory-selector {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      max-width: 820px;
      margin-top: -0.35rem;
    }
    .upload-subcategory-content .subcategory-selector .category-card {
      display: grid;
      grid-template-columns: 112px minmax(0, 1fr);
      grid-template-areas:
        "icon title"
        "icon desc"
        "icon action";
      column-gap: 1.35rem;
      row-gap: 0.45rem;
      align-items: center;
      min-height: 150px;
      padding: 1.45rem 1.7rem;
      text-align: left;
      border-radius: 6px;
      background:
        radial-gradient(circle at 20% 30%, rgba(184,149,90,0.1), transparent 12rem),
        linear-gradient(135deg, rgba(22,22,21,0.96), rgba(10,10,9,0.92));
      border: 1px solid rgba(184,149,90,0.34);
      box-shadow: 0 18px 46px rgba(0,0,0,0.28);
      color: #fff8ed;
    }
    .upload-subcategory-content .subcategory-selector .category-card::before,
    .upload-subcategory-content .subcategory-selector .category-card::after {
      content: none;
    }
    .upload-subcategory-content .subcategory-selector .category-card:nth-child(5) {
      grid-column: 1 / -1;
      justify-self: center;
      width: min(430px, 100%);
    }
    .upload-subcategory-content .subcategory-selector .category-card:hover {
      border-color: rgba(212,172,98,0.82);
      transform: translateY(-3px);
      box-shadow: 0 24px 58px rgba(0,0,0,0.42);
    }
    .upload-subcategory-content .subcategory-selector .category-icon {
      grid-area: icon;
      width: 76px;
      height: 76px;
      justify-self: center;
      margin: 0;
      background: rgba(4,4,4,0.56);
      border: 1px solid rgba(212,172,98,0.78);
      color: #d4ac62;
      box-shadow: 0 0 0 1px rgba(212,172,98,0.12), 0 15px 30px rgba(0,0,0,0.28);
    }
    .upload-subcategory-content .subcategory-selector .category-icon svg {
      width: 35px;
      height: 35px;
      stroke-width: 1.55;
    }
    .upload-subcategory-content .subcategory-selector .category-name {
      grid-area: title;
      color: #fff8ed;
      font-size: 1.55rem;
      line-height: 1.15;
      margin: 0;
      text-shadow: 0 10px 28px rgba(0,0,0,0.5);
    }
    .upload-subcategory-content .subcategory-selector .category-desc {
      grid-area: desc;
      color: rgba(255,248,237,0.82);
      max-width: 280px;
      min-height: auto;
      font-size: 0.94rem;
      line-height: 1.55;
      margin: 0;
    }
    .upload-subcategory-content .subcategory-selector .category-action {
      grid-area: action;
      margin: 0.2rem 0 0;
      padding: 0;
      width: auto;
      border: 0;
      background: transparent;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: 1.02rem;
      font-weight: 700;
    }
    .upload-subcategory-content .subcategory-selector .category-action::before {
      content: none;
    }
    .subcategory-quote {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      margin: 2rem auto 0;
      color: rgba(247,239,227,0.66);
      font-family: 'Playfair Display', serif;
      font-size: 0.95rem;
      text-align: center;
    }
    .subcategory-quote span {
      width: 72px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,172,98,0.78));
    }
    .subcategory-quote span:last-child {
      background: linear-gradient(90deg, rgba(212,172,98,0.78), transparent);
    }
    .subcategory-quote p {
      margin: 0;
    }
    .page-header.upload-detail-hero,
    .page-header.upload-form-hero {
      position: relative;
      overflow: hidden;
      min-height: 245px;
      padding: 3rem 1.5rem 2rem;
      background:
        linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.38) 70%, rgba(0,0,0,0.72) 100%),
        url('/assets/login-bg-gallery.png') center 44% / cover no-repeat;
      border-bottom: 1px solid rgba(184,149,90,0.28);
      color: #fff8ed;
    }
    .page-header.upload-detail-hero::after,
    .page-header.upload-form-hero::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 55%;
      background: linear-gradient(180deg, transparent, #090908);
      pointer-events: none;
    }
    .page-header.upload-detail-hero .page-header-inner,
    .page-header.upload-form-hero .page-header-inner {
      position: relative;
      z-index: 1;
      max-width: 1060px;
    }
    .page-header.upload-detail-hero .breadcrumb,
    .page-header.upload-form-hero .breadcrumb {
      color: #d4ac62;
    }
    .page-header.upload-detail-hero .page-title,
    .page-header.upload-form-hero .page-title {
      color: #fff8ed;
      font-size: clamp(2.35rem, 4.4vw, 4rem);
      text-shadow: 0 16px 42px rgba(0,0,0,0.62);
    }
    .page-header.upload-detail-hero .page-subtitle,
    .page-header.upload-form-hero .page-subtitle {
      color: rgba(255,248,237,0.84);
      margin-top: 1.05rem;
    }
    .page-header.upload-detail-hero .page-flourish,
    .page-header.upload-form-hero .page-flourish {
      color: #d4ac62;
      margin: 1.05rem 0 0;
    }
    .page-content.upload-detail-content {
      max-width: 1060px;
      padding: 0 1.5rem 3.2rem;
    }
    .page-content.upload-form-content {
      max-width: 1160px;
      padding: 1.5rem 1.5rem 3.4rem;
    }
    .page:has(.upload-detail-content),
    .page:has(.upload-form-content) {
      background:
        radial-gradient(circle at 50% 0%, rgba(184,149,90,0.11), transparent 30rem),
        linear-gradient(180deg, #090908 0%, #0b0b0a 48%, #10100f 100%);
      color: #f7efe3;
    }
    .upload-detail-content .subcategory-selector {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      max-width: 900px;
    }
    .upload-detail-content .subcategory-selector .category-card {
      display: grid;
      grid-template-columns: 96px minmax(0, 1fr);
      grid-template-areas:
        "icon title"
        "icon desc"
        "icon action";
      column-gap: 1.2rem;
      row-gap: 0.45rem;
      align-items: center;
      min-height: 140px;
      padding: 1.35rem 1.5rem;
      text-align: left;
      border-radius: 6px;
      background:
        radial-gradient(circle at 18% 35%, rgba(184,149,90,0.12), transparent 12rem),
        linear-gradient(135deg, rgba(22,22,21,0.96), rgba(10,10,9,0.92));
      border: 1px solid rgba(184,149,90,0.34);
      color: #fff8ed;
      box-shadow: 0 18px 46px rgba(0,0,0,0.28);
    }
    .upload-detail-content .subcategory-selector .category-card::before,
    .upload-detail-content .subcategory-selector .category-card::after {
      content: none;
    }
    .upload-detail-content .subcategory-selector .category-card:hover {
      border-color: rgba(212,172,98,0.82);
      transform: translateY(-3px);
      box-shadow: 0 24px 58px rgba(0,0,0,0.42);
    }
    .upload-detail-content .subcategory-selector .category-icon {
      grid-area: icon;
      width: 70px;
      height: 70px;
      justify-self: center;
      margin: 0;
      background: rgba(4,4,4,0.56);
      border: 1px solid rgba(212,172,98,0.78);
      color: #d4ac62;
    }
    .upload-detail-content .subcategory-selector .category-icon svg {
      width: 32px;
      height: 32px;
    }
    .upload-detail-content .subcategory-selector .category-name {
      grid-area: title;
      color: #fff8ed;
      font-size: 1.38rem;
      line-height: 1.15;
      margin: 0;
    }
    .upload-detail-content .subcategory-selector .category-desc {
      grid-area: desc;
      color: rgba(255,248,237,0.78);
      max-width: 300px;
      min-height: auto;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }
    .upload-detail-content .subcategory-selector .category-action {
      grid-area: action;
      width: auto;
      margin: 0.15rem 0 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
    }
    .upload-detail-content .subcategory-selector .category-action::before {
      content: none;
    }
    .upload-form-content .form-container {
      max-width: 1160px;
    }
    .upload-form-content .form-step-nav {
      border-bottom-color: rgba(184,149,90,0.28);
      margin-bottom: 1.35rem;
    }
    .upload-form-content .form-step-item {
      color: rgba(247,239,227,0.58);
    }
    .upload-form-content .form-step-item:hover,
    .upload-form-content .form-step-item.active {
      color: #f2d292;
    }
    .upload-form-content .form-step-item.active::after {
      background: #d4ac62;
    }
    .upload-form-content .form-panel-main,
    .upload-form-content .form-guidance,
    .upload-form-content .form-actions {
      background:
        radial-gradient(circle at 0% 0%, rgba(184,149,90,0.08), transparent 16rem),
        linear-gradient(180deg, rgba(18,18,17,0.94), rgba(9,9,8,0.9));
      border: 1px solid rgba(184,149,90,0.34);
      box-shadow: 0 18px 48px rgba(0,0,0,0.25);
    }
    .upload-form-content .form-section-title {
      color: #d4ac62;
      border-bottom-color: rgba(184,149,90,0.25);
    }
    .upload-form-content .form-label {
      color: #e5c98d;
    }
    .upload-form-content .form-input,
    .upload-form-content .form-select,
    .upload-form-content .form-textarea {
      border-color: rgba(184,149,90,0.36);
      background: rgba(3,3,3,0.56);
      color: #fff8ed;
    }
    .upload-form-content .form-input::placeholder,
    .upload-form-content .form-textarea::placeholder {
      color: rgba(247,239,227,0.38);
    }
    .upload-form-content .form-select option {
      background: #11100f;
      color: #f7efe3;
    }
    .upload-form-content .form-input:focus,
    .upload-form-content .form-select:focus,
    .upload-form-content .form-textarea:focus {
      border-color: #d4ac62;
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .upload-form-content .upload-zone {
      border-color: rgba(184,149,90,0.45);
      background: rgba(3,3,3,0.35);
    }
    .upload-form-content .upload-zone:hover {
      border-color: #d4ac62;
      background: rgba(184,149,90,0.08);
    }
    .upload-form-content .upload-text {
      color: #fff8ed;
    }
    .upload-form-content .upload-hint,
    .upload-form-content .upload-progress-text,
    .upload-form-content .form-guidance,
    .upload-form-content .review-note {
      color: rgba(247,239,227,0.62);
    }
    .upload-form-content .guidance-kicker {
      color: #f2d292;
    }
    .upload-form-content .guidance-figure {
      color: rgba(212,172,98,0.42);
    }
    .upload-form-content .review-item {
      background: rgba(3,3,3,0.42);
      border-color: rgba(184,149,90,0.3);
    }
    .upload-form-content .review-item span {
      color: #d4ac62;
    }
    .upload-form-content .review-item strong {
      color: #fff8ed;
    }
    .upload-form-content .btn-cancel {
      border-color: rgba(184,149,90,0.42);
      color: #d8bf91;
      background: rgba(255,255,255,0.02);
    }
    .upload-form-content .btn-cancel:hover {
      border-color: #d4ac62;
      color: #f2d292;
      background: rgba(184,149,90,0.08);
    }
    .upload-form-content .btn-submit {
      border: 1px solid rgba(212,172,98,0.9);
      background: linear-gradient(180deg, #c69842, #a97725);
      color: #fff8ed;
    }
    .upload-form-content .btn-submit:hover:not(:disabled) {
      background: linear-gradient(180deg, #d3aa59, #ae7d2d);
    }
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
      .page-subtitle {
        font-size: 0.98rem;
        max-width: 26rem;
      }
      .page-content {
        padding: 2.4rem 1rem 3.5rem;
      }
      .category-selector,
      .subcategory-selector {
        grid-template-columns: minmax(0, 1fr);
        gap: 1.2rem;
        max-width: 430px;
      }
      .upload-subcategory-content .subcategory-selector {
        grid-template-columns: minmax(0, 1fr);
        max-width: 430px;
      }
      .upload-subcategory-content .subcategory-selector .category-card,
      .upload-subcategory-content .subcategory-selector .category-card:nth-child(5) {
        width: 100%;
        grid-column: auto;
        grid-template-columns: 82px minmax(0, 1fr);
        column-gap: 1rem;
        min-height: 136px;
        padding: 1.15rem;
      }
      .upload-subcategory-content .subcategory-selector .category-icon {
        width: 64px;
        height: 64px;
      }
      .upload-subcategory-content .subcategory-selector .category-name {
        font-size: 1.35rem;
      }
      .upload-subcategory-content .subcategory-selector .category-desc {
        font-size: 0.88rem;
      }
      .subcategory-quote {
        gap: 0.55rem;
        font-size: 0.86rem;
      }
      .subcategory-quote span {
        width: 34px;
      }
      .category-card {
        min-height: 330px;
        padding: 1.65rem 1.25rem 1.55rem;
        gap: 0.65rem;
      }
      .upload-type-content .category-card {
        padding-bottom: 0;
      }
      .upload-type-content .category-action {
        width: calc(100% + 2.5rem);
        margin-left: -1.25rem;
        margin-right: -1.25rem;
      }
      .page-header.upload-type-hero {
        min-height: 250px;
        padding: 3rem 1rem 1.9rem;
      }
      .page-header.upload-type-hero .breadcrumb {
        position: static;
        display: inline-block;
        margin-bottom: 0.8rem;
      }
      .category-icon {
        width: 72px;
        height: 72px;
        margin-bottom: 0.2rem;
      }
      .category-icon svg {
        width: 34px;
        height: 34px;
      }
      .category-icon-swords svg {
        width: 38px;
        height: 38px;
      }
      .category-name {
        font-size: 1.55rem;
      }
      .category-desc {
        font-size: 0.96rem;
        min-height: auto;
        max-width: 20rem;
      }
      .category-divider {
        margin: 0.45rem 0 0.35rem;
      }
      .subcategory-selector .category-card {
        min-height: auto;
        padding: 1.45rem 1.2rem;
      }
      .subcategory-selector .category-icon {
        width: 62px;
        height: 62px;
        font-size: 1.75rem;
      }
      .subcategory-selector .category-name {
        font-size: 1.35rem;
      }
      .subcategory-selector .category-desc {
        min-height: auto;
      }
      .form-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
      .form-row-3 { grid-template-columns: 1fr; }
      .antique-form {
        padding: 0;
        border-radius: 0;
      }
      .form-step-nav {
        display: flex;
        overflow-x: auto;
        gap: 1.4rem;
        padding-bottom: 0.05rem;
      }
      .form-step-item {
        flex: 0 0 auto;
        text-align: left;
        font-size: 0.78rem;
      }
      .form-option-c-layout {
        grid-template-columns: 1fr;
      }
      .form-panel-main {
        padding: 1.25rem;
        border-radius: 10px;
      }
      .form-guidance {
        min-height: auto;
        padding: 1.15rem;
      }
      .review-grid {
        grid-template-columns: 1fr;
      }
      .guidance-figure {
        display: none;
      }
      .form-actions {
        flex-direction: column-reverse;
      }
      .btn-cancel,
      .btn-submit {
        width: 100%;
        text-align: center;
      }
    }
    @media (max-width: 420px) {
      .page-header {
        padding-top: 1.9rem;
      }
      .category-card {
        padding-inline: 1rem;
      }
    }
  `]
})
export class UploadAntiqueComponent implements OnInit {
  catalogs = signal<Catalog[]>([]);
  existingImages = signal<string[]>([]);
  saving = signal(false);
  uploadingImages = signal(false);
  uploadProgress = signal(0);
  error = signal('');
  success = signal('');
  editMode = false;
  editId = '';
  conditions = CONDITIONS;

  step = signal(1);
  category = signal<AntiqueType | null>(null);
  formStep = signal(1);

  subcategories = [
    { key: 'escultura', label: 'Escultura', icon: '&#9997;' },
    { key: 'pintura', label: 'Pintura', icon: '&#127912;' },
    { key: 'cristal', label: 'Cristal', icon: '&#128161;' },
    { key: 'ceramica', label: 'Cerámica', icon: '&#127834;' },
  ];

  esculturaDetails = [
    { key: 'busto', label: 'Busto', desc: 'Representación de la parte superior del torso humano' },
    { key: 'figura', label: 'Figura', desc: 'Escultura completa de cuerpo entero' },
    { key: 'belen', label: 'Belén', desc: 'Figuras y escenas del belén tradicional' },
  ];

  pinturaDetails = [
    { key: 'oleo', label: 'Óleo', desc: 'Pintura al óleo sobre lienzo, tabla u otros soportes' },
    { key: 'grabado', label: 'Grabado', desc: 'Estampas, aguafuertes y técnicas de impresión' },
    { key: 'acuarela', label: 'Acuarela', desc: 'Pintura ligera con pigmentos diluidos en agua' },
  ];

  filateliaDetails = [
    { key: 'hist-postal', label: 'Hist. postal', desc: 'Historia y evolución de los servicios postales' },
    { key: 'entero-postal', label: 'Entero postal', desc: 'Tarjetas, sobres y aerogramas con estampilla impresa' },
    { key: 'sello', label: 'Sello', desc: 'Sellos individuales, series y bloques' },
    { key: 'pre-filatelia', label: 'Pre-filatelia', desc: 'Marcas postales anteriores al sello adhesivo' },
    { key: 'censura', label: 'Censura', desc: 'Correspondencia con marcas de censura militar o política' },
  ];

  fotosDetails = [
    { key: 'familiar', label: 'Familiar', desc: 'Retratos y escenas familiares' },
    { key: 'boda', label: 'Boda', desc: 'Fotografías de ceremonias nupciales' },
    { key: 'ninos', label: 'Niños', desc: 'Retratos infantiles y de grupo' },
    { key: 'hombres', label: 'Hombres', desc: 'Retratos masculinos individuales o grupales' },
    { key: 'mujeres', label: 'Mujeres', desc: 'Retratos femeninos individuales o grupales' },
    { key: 'militar', label: 'Militar', desc: 'Fotografías de uniformes, campamentos y conflictos' },
    { key: 'etnica', label: 'Étnica', desc: 'Pueblos, tradiciones y vestimentas tradicionales' },
    { key: 'paisaje', label: 'Paisaje', desc: 'Vistas, ciudades y entornos naturales' },
    { key: 'retrato', label: 'Retrato', desc: 'Retratos de estudio formales' },
    { key: 'blanco-negro', label: 'Blanco y negro', desc: 'Fotografía clásica en monocromo' },
    { key: 'estudio', label: 'Estudio', desc: 'Fotografías realizadas en estudio profesional' },
    { key: 'reportaje', label: 'Reportaje', desc: 'Escenas callejeras, eventos y documental' },
    { key: 'arquitectura', label: 'Arquitectura', desc: 'Edificios, monumentos y construcciones' },
    { key: 'naturaleza', label: 'Naturaleza', desc: 'Plantas, animales y paisajes naturales' },
    { key: 'post-mortem', label: 'Post mortem', desc: 'Fotografía funeraria y de difuntos' },
  ];

  revistasDetails = [
    { key: 'motos', label: 'Motos', desc: 'Revistas especializadas en motociclismo' },
    { key: 'coches', label: 'Coches', desc: 'Publicaciones del mundo del automóvil' },
    { key: 'politica', label: 'Política', desc: 'Revistas de actualidad política y social' },
    { key: 'historia', label: 'Historia', desc: 'Publicaciones de divulgación histórica' },
    { key: 'ciencia', label: 'Ciencia', desc: 'Revistas científicas y de divulgación' },
    { key: 'deportes', label: 'Deportes', desc: 'Publicaciones deportivas especializadas' },
    { key: 'moda', label: 'Moda', desc: 'Revistas de moda, tendencias y estilo' },
    { key: 'arte', label: 'Arte', desc: 'Revistas de arte, museos y exposiciones' },
    { key: 'musica', label: 'Música', desc: 'Publicaciones musicales y de artistas' },
    { key: 'humor', label: 'Humor', desc: 'Revistas satíricas y de humor gráfico' },
    { key: 'viajes', label: 'Viajes', desc: 'Revistas de viajes y turismo' },
    { key: 'economia', label: 'Economía', desc: 'Publicaciones económicas y financieras' },
    { key: 'cultura', label: 'Cultura', desc: 'Revistas culturales y literarias' },
    { key: 'tecnologia', label: 'Tecnología', desc: 'Revistas de innovación y tecnología' },
  ];

  documentosDetails = [
    { key: 'folletos', label: 'Folletos', desc: 'Folletos publicitarios, turísticos e informativos' },
    { key: 'partituras', label: 'Partituras', desc: 'Partituras musicales originales o impresas' },
    { key: 'escrituras', label: 'Escrituras', desc: 'Escrituras notariales, legales y oficiales' },
    { key: 'mapas', label: 'Mapas', desc: 'Mapas, planos y cartografía histórica' },
    { key: 'carteles', label: 'Carteles', desc: 'Carteles publicitarios, políticos y culturales' },
    { key: 'otros', label: 'Otros', desc: 'Otros documentos no clasificados' },
  ];

  form: {
    name: string;
    catalog_id: string;
    type: AntiqueType;
    subcategory: string;
    detail: string;
    country: string;
    region: string;
    element: string;
    year_era: string;
    condition: string;
    material: string;
    price: number;
    dimensions: string;
    description: string;
    paper_type: string;
    paper_format: string;
    paper_weight: number;
  };

  constructor(
    private antiquesService: AntiquesService,
    private catalogsService: CatalogsService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.defaultForm();
  }

  get detailLabel(): string {
    const all = [
      ...this.esculturaDetails,
      ...this.pinturaDetails,
      ...this.filateliaDetails,
      ...this.fotosDetails,
      ...this.revistasDetails,
      ...this.documentosDetails,
    ];
    const found = all.find(d => d.key === this.form.detail);
    return found ? found.label : '';
  }

  defaultForm() {
    return {
      name: '',
      catalog_id: '',
      type: 'antiguedad' as AntiqueType,
      subcategory: '',
      detail: '',
      country: '',
      region: '',
      element: '',
      year_era: '',
      condition: 'Bueno',
      material: '',
      price: 0,
      dimensions: '',
      description: '',
      paper_type: '',
      paper_format: '',
      paper_weight: 0,
    };
  }

  get categoryLabel(): string {
    return this.category() === 'papeleria' ? 'Papelería' : 'Antigüedades';
  }

  get subcategoryLabel(): string {
    const all = [
      ...this.subcategories,
      { key: 'filatelia', label: 'Filatelia' },
      { key: 'fotos', label: 'Fotos' },
      { key: 'revistas', label: 'Revistas / Periódicos' },
      { key: 'documentos', label: 'Documentos' },
      { key: 'libros', label: 'Libros' },
    ];
    const found = all.find(s => s.key === this.form.subcategory);
    return found ? found.label : '';
  }

  selectCategory(type: AntiqueType) {
    this.category.set(type);
    this.form.type = type;
    this.step.set(2);
  }

  hasDetail(key: string): boolean {
    if (this.category() === 'antiguedad') {
      return key === 'escultura' || key === 'pintura';
    }
    return key === 'filatelia' || key === 'fotos' || key === 'revistas' || key === 'documentos';
  }

  detailsForCurrent(): { key: string; label: string; desc: string }[] {
    switch (this.form.subcategory) {
      case 'escultura': return this.esculturaDetails;
      case 'pintura': return this.pinturaDetails;
      case 'filatelia': return this.filateliaDetails;
      case 'fotos': return this.fotosDetails;
      case 'revistas': return this.revistasDetails;
      case 'documentos': return this.documentosDetails;
      default: return [];
    }
  }

  selectSubcategory(key: string) {
    this.form.subcategory = key;
    this.formStep.set(1);
    this.step.set(this.hasDetail(key) ? 3 : 4);
  }

  selectDetail(key: string) {
    this.form.detail = key;
    this.formStep.set(1);
    this.step.set(4);
  }

  goBack() {
    if (this.hasDetail(this.form.subcategory)) {
      this.step.set(3);
    } else {
      this.step.set(2);
    }
  }

  nextFormStep() {
    this.formStep.set(Math.min(this.formStep() + 1, 4));
  }

  previousFormStep() {
    this.formStep.set(Math.max(this.formStep() - 1, 1));
  }

  async ngOnInit() {
    this.catalogs.set(await this.catalogsService.getAll());
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = id;
      const antique = await this.antiquesService.getById(id);
      if (antique) {
        this.category.set(antique.type);
        this.form = {
          name: antique.name,
          catalog_id: antique.catalog_id ?? '',
          type: antique.type,
          subcategory: antique.subcategory ?? '',
          detail: antique.detail ?? '',
          country: antique.country ?? '',
          region: antique.region ?? '',
          element: antique.element ?? '',
          year_era: antique.year_era,
          condition: antique.condition,
          material: antique.material,
          price: antique.price,
          dimensions: antique.dimensions,
          description: antique.description,
          paper_type: '',
          paper_format: '',
          paper_weight: 0,
        };
        this.existingImages.set([...antique.images]);
      }
    }
  }

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);
    this.uploadingImages.set(true);
    this.uploadProgress.set(0);
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await this.antiquesService.uploadImage(files[i]);
        urls.push(url);
      } catch {
      }
      this.uploadProgress.set(Math.round(((i + 1) / files.length) * 100));
    }
    this.existingImages.set([...this.existingImages(), ...urls]);
    this.uploadingImages.set(false);
    input.value = '';
  }

  removeImage(index: number) {
    const imgs = [...this.existingImages()];
    imgs.splice(index, 1);
    this.existingImages.set(imgs);
  }

  async onSubmit() {
    if (!this.form.name.trim()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    try {
      const payload: Partial<Antique> = {
        name: this.form.name,
        type: this.form.type,
        subcategory: this.form.subcategory,
        detail: this.form.detail,
        country: this.form.country,
        region: this.form.region,
        element: this.form.element,
        catalog_id: this.form.catalog_id || null,
        year_era: this.form.year_era,
        condition: this.form.condition,
        paper_type: this.form.type === 'papeleria' ? this.form.paper_type : undefined,
        paper_format: this.form.type === 'papeleria' ? this.form.paper_format : undefined,
        paper_weight: this.form.type === 'papeleria' ? this.form.paper_weight : undefined,
        material: this.form.type === 'antiguedad' ? this.form.material : this.form.paper_type,
        dimensions: this.form.type === 'antiguedad' ? this.form.dimensions : `${this.form.paper_format} ${this.form.paper_weight ? '- ' + this.form.paper_weight + 'g' : ''}`.trim(),
        price: this.form.price,
        description: this.form.description,
        images: this.existingImages()
      };
      if (this.editMode) {
        await this.antiquesService.update(this.editId, payload);
        this.success.set('Pieza actualizada correctamente.');
        setTimeout(() => this.router.navigate(['/pieza', this.editId]), 1200);
      } else {
        const created = await this.antiquesService.create(payload);
        this.success.set('Pieza publicada correctamente.');
        setTimeout(() => this.router.navigate(['/pieza', created.id]), 1200);
      }
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al guardar la pieza.');
    } finally {
      this.saving.set(false);
    }
  }
}
