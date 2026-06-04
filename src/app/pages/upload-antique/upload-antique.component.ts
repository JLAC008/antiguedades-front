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
            <p class="page-subtitle">Selecciona el tipo de pieza que quieres añadir</p>
          }
          @if (step() === 2) {
            <button class="breadcrumb" (click)="step.set(1)">&larr; Volver</button>
            <h1 class="page-title">Antigüedades</h1>
            <p class="page-subtitle">Selecciona el tipo de antigüedad</p>
          }
          @if (step() === 3) {
            <button class="breadcrumb" (click)="step.set(2)">&larr; Volver</button>
            <h1 class="page-title">Antigüedades - {{ subcategoryLabel }}</h1>
            <p class="page-subtitle">Selecciona el tipo de {{ subcategoryLabel.toLowerCase() }}</p>
          }
          @if (step() === 4) {
            <button class="breadcrumb" (click)="step.set(category() === 'antiguedad' ? (form.subcategory === 'escultura' || form.subcategory === 'pintura' ? 3 : 2) : 1)">&larr; Volver</button>
            <h1 class="page-title">{{ categoryLabel }}{{ subcategoryLabel ? ' - ' + subcategoryLabel : '' }}{{ detailLabel ? ' - ' + detailLabel : '' }}</h1>
            <p class="page-subtitle">Completa los datos de la pieza</p>
          }
          @if (editMode) {
            <a routerLink="/coleccion" class="breadcrumb">&larr; Cancelar</a>
            <h1 class="page-title">{{ categoryLabel }}{{ subcategoryLabel ? ' - ' + subcategoryLabel : '' }}</h1>
            <p class="page-subtitle">Modifica los datos de la pieza</p>
          }
        </div>
      </div>

      <div class="page-content">
        @if (step() === 1 && !editMode) {
          <div class="category-selector">
            <div class="category-card" (click)="selectCategory('antiguedad')">
              <div class="category-icon">&#9876;</div>
              <h2 class="category-name">Antigüedades</h2>
              <p class="category-desc">Muebles, relojes, porcelana, cerámica y piezas históricas</p>
              <span class="category-action">Seleccionar &rarr;</span>
            </div>
            <div class="category-card" (click)="selectCategory('papeleria')">
              <div class="category-icon">&#128196;</div>
              <h2 class="category-name">Papelería</h2>
              <p class="category-desc">Documentos, sellos, mapas, grabados y material de archivo</p>
              <span class="category-action">Seleccionar &rarr;</span>
            </div>
          </div>
        }

        @if (step() === 2 && !editMode) {
          <div class="subcategory-selector">
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
          </div>
        }

        @if (step() === 3 && !editMode && (form.subcategory === 'escultura' || form.subcategory === 'pintura')) {
          <div class="subcategory-selector">
            @if (form.subcategory === 'escultura') {
              @for (d of esculturaDetails; track d.key) {
                <div class="category-card" (click)="selectDetail(d.key)">
                  <h2 class="category-name">{{ d.label }}</h2>
                  <p class="category-desc">{{ d.desc }}</p>
                  <span class="category-action">Seleccionar &rarr;</span>
                </div>
              }
            }
            @if (form.subcategory === 'pintura') {
              @for (d of pinturaDetails; track d.key) {
                <div class="category-card" (click)="selectDetail(d.key)">
                  <h2 class="category-name">{{ d.label }}</h2>
                  <p class="category-desc">{{ d.desc }}</p>
                  <span class="category-action">Seleccionar &rarr;</span>
                </div>
              }
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
    .page { min-height: 100vh; background: var(--color-bg); }
    .page-header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 2rem 1.5rem 2.5rem;
    }
    .page-header-inner { max-width: 1100px; margin: 0 auto; }
    .breadcrumb {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      text-decoration: none;
      font-weight: 500;
      display: inline-block;
      margin-bottom: 1rem;
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
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.375rem;
    }
    .page-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; margin: 0; }
    .page-content { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
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
      gap: 1.5rem;
      max-width: 720px;
      margin: 0 auto;
      padding-top: 2rem;
    }
    .category-card {
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .category-card:hover {
      border-color: var(--color-accent);
      box-shadow: 0 8px 32px rgba(184,149,90,0.15);
      transform: translateY(-4px);
    }
    .category-icon {
      font-size: 3rem;
      color: var(--color-accent);
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-2);
      border-radius: 50%;
      margin-bottom: 0.5rem;
    }
    .category-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
    }
    .category-desc {
      color: var(--color-text-muted);
      font-size: 0.9375rem;
      margin: 0;
      line-height: 1.5;
    }
    .category-action {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-accent);
      margin-top: 0.5rem;
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
      gap: 1.5rem;
      max-width: 620px;
      margin: 0 auto;
      padding-top: 2rem;
    }
    @media (max-width: 768px) {
      .category-selector { grid-template-columns: 1fr; }
      .subcategory-selector { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
      .form-row-3 { grid-template-columns: 1fr; }
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
    const all = [...this.esculturaDetails, ...this.pinturaDetails];
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
    const found = this.subcategories.find(s => s.key === this.form.subcategory);
    return found ? found.label : '';
  }

  selectCategory(type: AntiqueType) {
    this.category.set(type);
    this.form.type = type;
    this.step.set(type === 'antiguedad' ? 2 : 3);
  }

  selectSubcategory(key: string) {
    this.form.subcategory = key;
    if (key === 'escultura' || key === 'pintura') {
      this.step.set(3);
    } else {
      this.step.set(4);
    }
  }

  selectDetail(key: string) {
    this.form.detail = key;
    this.step.set(4);
  }

  goBack() {
    if (this.category() === 'antiguedad') {
      if (this.form.subcategory === 'escultura' || this.form.subcategory === 'pintura') {
        this.step.set(3);
      } else {
        this.step.set(2);
      }
    } else {
      this.step.set(1);
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
