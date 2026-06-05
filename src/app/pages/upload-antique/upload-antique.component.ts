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
      <div class="page-header">
        <div class="page-header-inner">
          @if (step() === 1) {
            <a routerLink="/coleccion" class="breadcrumb">&larr; Cancelar</a>
            <h1 class="page-title">Nueva pieza</h1>
            <div class="page-flourish" aria-hidden="true">⌘</div>
            <p class="page-subtitle">Selecciona el tipo de pieza que quieres añadir</p>
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

      <div class="page-content">
        @if (step() === 1 && !editMode) {
          <div class="category-selector">
            <div class="category-card" (click)="selectCategory('antiguedad')">
              <div class="category-icon category-icon-swords" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="m14.5 5 4.4-3.4 1.5 1.5-3.4 4.4"/>
                  <path d="m9.5 5-4.4-3.4-1.5 1.5 3.4 4.4"/>
                  <path d="m8 8 8 8M16 8l-8 8"/>
                  <path d="m6.5 17.5-2 2M17.5 17.5l2 2M6.7 15.3l2 2M17.3 15.3l-2 2"/>
                </svg>
              </div>
              <h2 class="category-name">Antigüedades</h2>
              <p class="category-desc">Muebles, relojes, porcelana, cerámica y piezas históricas</p>
              <span class="category-divider" aria-hidden="true"></span>
              <span class="category-action">Seleccionar &rarr;</span>
            </div>
            <div class="category-card" (click)="selectCategory('papeleria')">
              <div class="category-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M7 3h7l5 5v13H7Z"/>
                  <path d="M14 3v6h5M10 13h6M10 17h6"/>
                </svg>
              </div>
              <h2 class="category-name">Papelería</h2>
              <p class="category-desc">Documentos, sellos, mapas, grabados y material de archivo</p>
              <span class="category-divider" aria-hidden="true"></span>
              <span class="category-action">Seleccionar &rarr;</span>
            </div>
          </div>
        }

        @if (step() === 2 && !editMode) {
          <div class="subcategory-selector">
            @if (category() === 'antiguedad') {
              <div class="category-card" (click)="selectSubcategory('escultura')">
                <div class="category-icon">&#9997;</div>
                <h2 class="category-name">Escultura</h2>
                <p class="category-desc">Figuras, relieves y piezas tridimensionales</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('pintura')">
                <div class="category-icon">&#127912;</div>
                <h2 class="category-name">Pintura</h2>
                <p class="category-desc">Óleos, acuarelas, grabados y obras en lienzo</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('cristal')">
                <div class="category-icon">&#128161;</div>
                <h2 class="category-name">Cristal</h2>
                <p class="category-desc">Vidrio, cristal tallado, lámparas y objetos de vidrio</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('ceramica')">
                <div class="category-icon">&#127834;</div>
                <h2 class="category-name">Cerámica</h2>
                <p class="category-desc">Porcelana, loza, azulejos y piezas de barro</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
            }
            @if (category() === 'papeleria') {
              <div class="category-card" (click)="selectSubcategory('filatelia')">
                <div class="category-icon">&#9993;</div>
                <h2 class="category-name">Filatelia</h2>
                <p class="category-desc">Sellos, colecciones postales y material de correo</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('fotos')">
                <div class="category-icon">&#128248;</div>
                <h2 class="category-name">Fotos</h2>
                <p class="category-desc">Fotografías antiguas, albumes y positivos</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('revistas')">
                <div class="category-icon">&#128214;</div>
                <h2 class="category-name">Revistas / Periódicos</h2>
                <p class="category-desc">Publicaciones periódicas, diarios y revistas históricas</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('documentos')">
                <div class="category-icon">&#128203;</div>
                <h2 class="category-name">Documentos</h2>
                <p class="category-desc">Escrituras, cartas, mapas y documentos históricos</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
              <div class="category-card" (click)="selectSubcategory('libros')">
                <div class="category-icon">&#128218;</div>
                <h2 class="category-name">Libros</h2>
                <p class="category-desc">Libros antiguos, primeras ediciones y volúmenes de colección</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
            }
          </div>
        }

        @if (step() === 3 && !editMode && hasDetail(form.subcategory)) {
          <div class="subcategory-selector">
            @for (d of detailsForCurrent(); track d.key) {
              <div class="category-card" (click)="selectDetail(d.key)">
                <h2 class="category-name">{{ d.label }}</h2>
                <p class="category-desc">{{ d.desc }}</p>
                <span class="category-action">Seleccionar &rarr;</span>
              </div>
            }
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

            <form (ngSubmit)="onSubmit()" class="antique-form">
              @if (category() === 'antiguedad') {
                <div class="form-grid">
                  <div class="form-col">
                    <div class="form-section-title">Información básica</div>
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
                    <div class="form-section-title">Fotografías</div>
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
                    <div class="form-section-title">Información del documento</div>
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
                    <div class="form-section-title">Fotografías</div>
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

              <div class="form-actions">
                @if (!editMode) {
                  <button type="button" class="btn-cancel" (click)="goBack()">Volver</button>
                }
                @if (editMode) {
                  <a routerLink="/coleccion" class="btn-cancel">Cancelar</a>
                }
                <button type="submit" class="btn-submit" [disabled]="saving()">
                  @if (saving()) { Guardando... } @else { {{ editMode ? 'Guardar cambios' : 'Publicar pieza' }} }
                </button>
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
      gap: 2.45rem;
      max-width: 790px;
      margin: 0 auto;
      padding-top: 0.25rem;
    }
    .category-card {
      background: rgba(255, 255, 255, 0.48);
      border: 1px solid #dccdbd;
      border-radius: 10px;
      padding: 2.25rem 2rem 2.35rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;
      min-height: 360px;
      box-shadow: 0 16px 42px rgba(64, 47, 29, 0.035);
    }
    .category-card:hover {
      border-color: var(--color-accent);
      box-shadow: 0 18px 38px rgba(84, 61, 38, 0.12);
      transform: translateY(-4px);
    }
    .category-icon {
      color: var(--color-accent);
      width: 94px;
      height: 94px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 32% 22%, #33312d, #090909 68%);
      border-radius: 50%;
      margin-bottom: 0.45rem;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.11), 0 14px 28px rgba(0,0,0,0.18);
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
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
    }
    .category-desc {
      color: #5b5046;
      font-family: 'Playfair Display', serif;
      font-size: 1.02rem;
      margin: 0;
      line-height: 1.55;
      max-width: 270px;
      min-height: 3.1rem;
    }
    .category-divider {
      display: block;
      width: 92px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(184,149,90,0.72), transparent);
      margin: 0.8rem 0 0.55rem;
    }
    .category-action {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-accent);
      margin-top: 0;
    }
    .form-container { max-width: 1100px; margin: 0 auto; }
    .antique-form { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; padding: 2rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-bottom: 2rem; }
    .form-col { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-section-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-border);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-row-3 { grid-template-columns: 1fr 1fr 1fr; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text); }
    .required { color: var(--color-error); }
    .form-input, .form-select, .form-textarea {
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 0.9375rem;
      color: var(--color-text);
      background: var(--color-bg);
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
      border: 2px dashed var(--color-border);
      border-radius: 10px;
      transition: border-color 0.2s, background 0.2s;
    }
    .upload-zone:hover { border-color: var(--color-accent); background: rgba(184,149,90,0.04); }
    .upload-zone-inner { padding: 2.5rem 1.5rem; text-align: center; }
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
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }
    .btn-cancel {
      text-decoration: none;
      padding: 0.875rem 1.75rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
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
      border-radius: 8px;
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
      .category-card {
        min-height: auto;
        padding: 1.65rem 1.25rem 1.55rem;
        gap: 0.65rem;
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
        padding: 1.25rem;
        border-radius: 10px;
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
    this.step.set(this.hasDetail(key) ? 3 : 4);
  }

  selectDetail(key: string) {
    this.form.detail = key;
    this.step.set(4);
  }

  goBack() {
    if (this.hasDetail(this.form.subcategory)) {
      this.step.set(3);
    } else {
      this.step.set(2);
    }
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
        material: this.form.type === 'papeleria' ? this.form.paper_type : this.form.material,
        dimensions: this.form.type === 'papeleria' ? `${this.form.paper_format} ${this.form.paper_weight ? '- ' + this.form.paper_weight + 'g' : ''}`.trim() : this.form.dimensions,
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
