import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AntiquesService } from '../../core/antiques.service';
import { CategoryService } from '../../core/category.service';
import { ConditionService } from '../../core/condition.service';
import { Antique, AntiqueType, CategoryGroup, ConditionItem } from '../../models';

@Component({
  selector: 'app-upload-antique',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header upload-form-hero">
        <div class="page-header-inner">
          @if (editMode) {
            <a routerLink="/coleccion" class="breadcrumb">&larr; Cancelar</a>
            <h1 class="page-title">{{ categoryLabel }}{{ subcategoryLabel ? ' - ' + subcategoryLabel : '' }}</h1>
            <div class="page-flourish" aria-hidden="true">⌘</div>
            <p class="page-subtitle">Modifica los datos de la pieza</p>
          } @else {
            <a routerLink="/coleccion" class="breadcrumb">&larr; Volver</a>
            <h1 class="page-title">A&ntilde;adir nueva pieza</h1>
            <div class="page-flourish" aria-hidden="true">⌘</div>
            <p class="page-subtitle">Incorpora una nueva pieza a tu colecci&oacute;n privada</p>
          }
        </div>
      </div>

      <div class="page-content upload-form-content">
          <div class="form-container">
            @if (error()) {
              <div class="form-error">{{ error() }}</div>
            }
            @if (success()) {
              <div class="form-success">{{ success() }}</div>
            }

            <form (ngSubmit)="onSubmit()" class="antique-form" [class.form-step-1]="formStep() === 1" [class.form-step-2]="formStep() === 2" [class.form-step-3]="formStep() === 3" [class.form-step-4]="formStep() === 4">
              <div class="form-step-nav" aria-label="Secciones del formulario">
                <button type="button" class="form-step-item" [class.active]="formStep() === 1" (click)="goToStep(1)">1. Información básica</button>
                <button type="button" class="form-step-item" [class.active]="formStep() === 2" [disabled]="validatingName() || !canAccessStep(2)" (click)="goToStep(2)">2. Detalles</button>
                <button type="button" class="form-step-item" [class.active]="formStep() === 3" [disabled]="validatingName() || !canAccessStep(3)" (click)="goToStep(3)">3. Fotografías</button>
                <button type="button" class="form-step-item" [class.active]="formStep() === 4" [disabled]="validatingName() || !canAccessStep(4)" (click)="goToStep(4)">4. Revisión</button>
              </div>

              <div class="form-option-c-layout">
                <div class="form-panel-main">
              <div class="form-classification">
                <div class="form-row form-row-3">
                  <div class="form-group">
                    <label class="form-label">Tipo <span class="required">*</span></label>
                    <select class="form-select" [(ngModel)]="form.type" name="edit-type" (change)="onTypeChange()">
                      <option value="antiguedad">Antigüedades</option>
                      <option value="papeleria">Papelería</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Subcategoría <span class="required">*</span></label>
                    <select class="form-select" [(ngModel)]="form.subcategory" name="edit-sub" (change)="onSubcategoryChange()">
                      <option value="">Seleccionar...</option>
                      @for (sub of subcategoriesForType; track sub.key) {
                        <option [value]="sub.key">{{ sub.label }}</option>
                      }
                    </select>
                  </div>
                  @if (hasDetail(form.subcategory)) {
                    <div class="form-group">
                      <label class="form-label">Detalle <span class="required">*</span></label>
                      <select class="form-select" [(ngModel)]="form.detail" name="edit-det">
                        <option value="">Seleccionar...</option>
                        @for (d of detailsForCurrent(); track d.key) {
                          <option [value]="d.key">{{ d.label }}</option>
                        }
                      </select>
                    </div>
                  }
                </div>
              </div>
              @if (category() === 'antiguedad') {
                <div class="form-grid">
                  <div class="form-col">
                    <div id="form-basic" class="form-section-title">Información básica</div>
                    <div class="form-group">
                      <label class="form-label">Nombre <span class="required">*</span></label>
                      <input type="text" class="form-input" [(ngModel)]="form.name" name="name" placeholder="Ej. Reloj de péndulo del siglo XIX" maxlength="200" required />
                      <label class="duplicate-name-option">
                        <input type="checkbox" [(ngModel)]="form.allow_duplicate_name" name="allow_duplicate_name" />
                        <span>Permitir guardar esta pieza aunque el nombre ya exista</span>
                      </label>
                    </div>
                    <div class="form-row form-row-4">
                      <div class="form-group">
                        <label class="form-label">País</label>
                        <input type="text" class="form-input" [(ngModel)]="form.country" name="country" placeholder="Ej. España, Francia..." maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Región</label>
                        <input type="text" class="form-input" [(ngModel)]="form.region" name="region" placeholder="Ej. Cataluña, Provenza..." maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Elemento</label>
                        <input type="text" class="form-input" [(ngModel)]="form.element" name="element" placeholder="Ej. Madera, Bronce..." maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Estado <span class="required">*</span></label>
                        <select class="form-select" [(ngModel)]="form.condition" name="edit-condition">
                          @for (c of conditions(); track c.label) {
                            <option [value]="c.label">{{ c.label }}</option>
                          }
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Tema</label>
                        <input type="text" class="form-input" [(ngModel)]="form.theme" name="theme" placeholder="Ej. Religión, historia, retrato..." maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Firma / marca</label>
                        <input type="text" class="form-input" [(ngModel)]="form.signature" name="signature" placeholder="Autor, fabricante, sello o inscripción" maxlength="200" />
                      </div>
                    </div>
                    <div id="form-details" class="form-section-anchor"></div>
                    <div class="form-section-title form-details-title">Detalles de la pieza</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Año</label>
                        <input type="text" class="form-input" [(ngModel)]="form.year_era" name="year_era" placeholder="Ej. 1850" maxlength="100" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Siglo</label>
                        <input type="text" class="form-input" [(ngModel)]="form.century" name="century" placeholder="Ej. XVIII, XIX, XX" maxlength="100" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Valor (€) <span class="required">*</span></label>
                      <input type="number" class="form-input" [(ngModel)]="form.price" name="price" placeholder="0" min="0.01" step="0.01" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Descripción</label>
                      <textarea class="form-input form-textarea" [(ngModel)]="form.description" name="description" placeholder="Describe brevemente la pieza (material, estado, historia...)" rows="3" maxlength="2000"></textarea>
                      <p class="char-counter">{{ form.description.length }}/2000 caracteres</p>
                    </div>
                  </div>

                  <div class="form-col">
                    <div id="form-photos" class="form-section-title">Fotografías</div>
                    <div class="form-group">
                      <label class="form-label">Añadir imágenes <span class="required">*</span></label>
                      <label class="upload-zone" tabindex="-1">
                        <input type="file" accept="image/*" multiple name="images" (change)="onFilesSelected($event)" hidden />
                        <div class="upload-zone-inner">
                          <span class="upload-icon">&#128247;</span>
                          <p class="upload-text">Arrastra imágenes o haz clic para seleccionar</p>
                          <p class="upload-hint">JPG, PNG, WebP — máx. 2 MB · máx. 5 fotos</p>
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
                          <div class="image-preview-item" [class.main-image]="i === 0" (dblclick)="setMainImage(i)" title="Doble clic para establecer como principal">
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
                      <input type="text" class="form-input" [(ngModel)]="form.name" name="name" placeholder="Ej. Mapa del siglo XVIII, Carta antigua..." maxlength="200" required />
                      <label class="duplicate-name-option">
                        <input type="checkbox" [(ngModel)]="form.allow_duplicate_name" name="paper_allow_duplicate_name" />
                        <span>Permitir guardar esta pieza aunque el nombre ya exista</span>
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Título</label>
                      <input type="text" class="form-input" [(ngModel)]="form.title" name="title" placeholder="Título original de la obra o documento" maxlength="200" />
                    </div>
                    <div class="form-row form-row-3">
                      <div class="form-group">
                        <label class="form-label">Autor</label>
                        <input type="text" class="form-input" [(ngModel)]="form.author" name="author" placeholder="Autor o creador" maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Editor</label>
                        <input type="text" class="form-input" [(ngModel)]="form.editor" name="editor" placeholder="Persona o entidad editorial" maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Edición</label>
                        <input type="text" class="form-input" [(ngModel)]="form.edition" name="edition" placeholder="Ej. 1.ª edición" maxlength="200" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Imprenta</label>
                      <input type="text" class="form-input" [(ngModel)]="form.imprenta" name="imprenta" placeholder="Taller o establecimiento impresor" maxlength="200" />
                    </div>
                    <div class="form-row form-row-3">
                      <div class="form-group">
                        <label class="form-label">País</label>
                        <input type="text" class="form-input" [(ngModel)]="form.country" name="paper_country" placeholder="Ej. España, Francia..." maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Región</label>
                        <input type="text" class="form-input" [(ngModel)]="form.region" name="paper_region" placeholder="Ej. Madrid, Cataluña..." maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Estado <span class="required">*</span></label>
                        <select class="form-select" [(ngModel)]="form.condition" name="paper-condition">
                          @for (c of conditions(); track c.label) {
                            <option [value]="c.label">{{ c.label }}</option>
                          }
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Tema</label>
                        <input type="text" class="form-input" [(ngModel)]="form.theme" name="paper_theme" placeholder="Ej. Historia, religión, militar, novela..." maxlength="200" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Firma / autógrafo</label>
                        <input type="text" class="form-input" [(ngModel)]="form.signature" name="paper_signature" placeholder="Firma, dedicatoria o marca" maxlength="200" />
                      </div>
                    </div>
                    <div id="form-details" class="form-section-anchor"></div>
                    <div class="form-section-title form-details-title">Detalles del documento</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Año</label>
                        <input type="text" class="form-input" [(ngModel)]="form.year_era" name="year_era" placeholder="Ej. 1780" maxlength="100" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Siglo</label>
                        <input type="text" class="form-input" [(ngModel)]="form.century" name="paper_century" placeholder="Ej. XVIII, XIX, XX" maxlength="100" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Valor (€) <span class="required">*</span></label>
                      <input type="number" class="form-input" [(ngModel)]="form.price" name="price" placeholder="0" min="0.01" step="0.01" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Descripción</label>
                      <textarea class="form-input form-textarea" [(ngModel)]="form.description" name="paper_description" placeholder="Describe brevemente el documento (contenido, estado, procedencia...)" rows="3" maxlength="2000"></textarea>
                      <p class="char-counter">{{ form.description.length }}/2000 caracteres</p>
                    </div>
                  </div>

                  <div class="form-col">
                    <div id="form-photos" class="form-section-title">Fotografías</div>
                    <div class="form-group">
                      <label class="form-label">Añadir imágenes <span class="required">*</span></label>
                      <label class="upload-zone" tabindex="-1">
                        <input type="file" accept="image/*" multiple name="images" (change)="onFilesSelected($event)" hidden />
                        <div class="upload-zone-inner">
                          <span class="upload-icon">&#128247;</span>
                          <p class="upload-text">Arrastra imágenes o haz clic para seleccionar</p>
                          <p class="upload-hint">JPG, PNG, WebP — máx. 2 MB · máx. 5 fotos</p>
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
                          <div class="image-preview-item" [class.main-image]="i === 0" (dblclick)="setMainImage(i)" title="Doble clic para establecer como principal">
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
                    <div class="review-fields">
                      <div class="rv-row">
                        <div class="rv-cell">
                          <span class="rv-label">Tipo</span>
                          <strong class="rv-value">{{ categoryLabel }}</strong>
                        </div>
                        <div class="rv-cell">
                          <span class="rv-label">Categoría</span>
                          <strong class="rv-value">{{ subcategoryLabel || 'Sin seleccionar' }}</strong>
                        </div>
                        @if (detailLabel) {
                          <div class="rv-cell">
                            <span class="rv-label">Detalle</span>
                            <strong class="rv-value">{{ detailLabel }}</strong>
                          </div>
                        }
                        <div class="rv-cell">
                          <span class="rv-label">Nombre</span>
                          <strong class="rv-value">{{ form.name || 'Pendiente' }}</strong>
                        </div>
                      </div>
                      <div class="rv-row">
                        @if (form.year_era) {
                          <div class="rv-cell">
                            <span class="rv-label">Año</span>
                            <strong class="rv-value">{{ form.year_era }}</strong>
                          </div>
                        }
                        <div class="rv-cell">
                          <span class="rv-label">Valor</span>
                          <strong class="rv-value">{{ form.price || 0 }} €</strong>
                        </div>
                        <div class="rv-cell">
                          <span class="rv-label">Estado</span>
                          <strong class="rv-value">{{ form.condition }}</strong>
                        </div>
                      </div>
                      @if (form.description) {
                        <div class="rv-row">
                          <div class="rv-cell">
                            <span class="rv-label">Descripción</span>
                            <strong class="rv-value">{{ form.description }}</strong>
                          </div>
                        </div>
                      }
                      @if (form.title || form.author || form.editor || form.imprenta || form.edition || form.century || form.theme || form.signature) {
                        <div class="rv-row">
                          @if (form.title) {
                            <div class="rv-cell">
                              <span class="rv-label">Título</span>
                              <strong class="rv-value">{{ form.title }}</strong>
                            </div>
                          }
                          @if (form.author) {
                            <div class="rv-cell">
                              <span class="rv-label">Autor</span>
                              <strong class="rv-value">{{ form.author }}</strong>
                            </div>
                          }
                          @if (form.editor) {
                            <div class="rv-cell">
                              <span class="rv-label">Editor</span>
                              <strong class="rv-value">{{ form.editor }}</strong>
                            </div>
                          }
                          @if (form.imprenta) {
                            <div class="rv-cell">
                              <span class="rv-label">Imprenta</span>
                              <strong class="rv-value">{{ form.imprenta }}</strong>
                            </div>
                          }
                          @if (form.edition) {
                            <div class="rv-cell">
                              <span class="rv-label">Edición</span>
                              <strong class="rv-value">{{ form.edition }}</strong>
                            </div>
                          }
                          @if (form.century) {
                            <div class="rv-cell">
                              <span class="rv-label">Siglo</span>
                              <strong class="rv-value">{{ form.century }}</strong>
                            </div>
                          }
                          @if (form.theme) {
                            <div class="rv-cell">
                              <span class="rv-label">Tema</span>
                              <strong class="rv-value">{{ form.theme }}</strong>
                            </div>
                          }
                          @if (form.signature) {
                            <div class="rv-cell">
                              <span class="rv-label">Firma / marca</span>
                              <strong class="rv-value">{{ form.signature }}</strong>
                            </div>
                          }
                        </div>
                      }
                      @if (form.type === 'antiguedad') {
                        <div class="rv-row">
                          @if (form.country) {
                            <div class="rv-cell">
                              <span class="rv-label">País</span>
                              <strong class="rv-value">{{ form.country }}</strong>
                            </div>
                          }
                          @if (form.region) {
                            <div class="rv-cell">
                              <span class="rv-label">Región</span>
                              <strong class="rv-value">{{ form.region }}</strong>
                            </div>
                          }
                          @if (form.element) {
                            <div class="rv-cell">
                              <span class="rv-label">Elemento</span>
                              <strong class="rv-value">{{ form.element }}</strong>
                            </div>
                          }
                        </div>
                      }
                      @if (form.type === 'papeleria') {
                        <div class="rv-row">
                          @if (form.country) {
                            <div class="rv-cell">
                              <span class="rv-label">País</span>
                              <strong class="rv-value">{{ form.country }}</strong>
                            </div>
                          }
                          @if (form.region) {
                            <div class="rv-cell">
                              <span class="rv-label">Región</span>
                              <strong class="rv-value">{{ form.region }}</strong>
                            </div>
                          }
                        </div>
                      }
                      @if (existingImages().length > 0) {
                        <div class="rv-row rv-images-row">
                          <div class="rv-cell rv-images-cell">
                            <span class="rv-label">Imágenes</span>
                            <div class="rv-images">
                              @for (img of existingImages(); track img) {
                                <div class="rv-thumb">
                                  <img [src]="img" alt="" />
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      }
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
                  <a routerLink="/coleccion" class="btn-cancel">Cancelar</a>
                }
                @if (formStep() > 1) {
                  <button type="button" class="btn-cancel" (click)="previousFormStep()">Atrás</button>
                }
                @if (editMode) {
                  <a routerLink="/coleccion" class="btn-cancel">Cancelar</a>
                }
                @if (formStep() < 4) {
                  <button type="button" class="btn-submit" [disabled]="validatingName()" (click)="nextFormStep()">
                    @if (validatingName()) { Comprobando... } @else { Siguiente &rarr; }
                  </button>
                } @else {
                  <button type="submit" class="btn-submit" [disabled]="saving()">
                    @if (saving()) { Guardando... } @else { {{ editMode ? 'Guardar cambios' : 'Publicar pieza' }} }
                  </button>
                }
              </div>

              @if (showErrorModal()) {
                <div class="modal-overlay" (click)="showErrorModal.set(false)">
                  <div class="modal" (click)="$event.stopPropagation()">
                    <h3 class="modal-title">{{ errorModalTitle() }}</h3>
                    <p class="modal-text">{{ errorModalMessage() }}</p>
                    <div class="modal-actions">
                      <button type="button" class="btn-cancel" (click)="showErrorModal.set(false)">Entendido</button>
                    </div>
                  </div>
                </div>
              }

              @if (showSizeModal()) {
                <div class="modal-overlay" (click)="showSizeModal.set(false)">
                  <div class="modal" (click)="$event.stopPropagation()">
                    <h3 class="modal-title">Fotos no válidas</h3>
                    <p class="modal-text">
                      Las siguientes imágenes superan el tamaño máximo de 2 MB y no se han subido:
                    </p>
                    <ul class="modal-text file-list">
                      @for (f of sizeModalFiles(); track f.name) {
                        <li>{{ f.name }} — {{ (f.size / (1024 * 1024)).toFixed(1) }} MB</li>
                      }
                    </ul>
                    <div class="modal-actions">
                      <button type="button" class="btn-cancel" (click)="showSizeModal.set(false)">Entendido</button>
                    </div>
                  </div>
                </div>
              }
            </form>
          </div>
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
    .form-step-item:disabled {
      color: #b7aea4;
      cursor: not-allowed;
      opacity: 0.62;
    }
    .form-step-item:disabled:hover {
      color: #b7aea4;
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
    .review-panel {
      display: none;
      max-width: 100%;
      overflow: hidden;
    }
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
    .form-step-2 .form-classification,
    .form-step-3 .form-classification,
    .form-step-4 .form-classification {
      display: none;
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
    .review-fields {
      margin-top: 1.25rem;
    }
    .rv-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .rv-cell {
      background: rgba(250, 248, 244, 0.84);
      border: 1px solid #e2d6c8;
      border-radius: 6px;
      padding: 0.55rem 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      min-width: 0;
    }
    .rv-label {
      color: #7b6d60;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      white-space: nowrap;
    }
    .rv-value {
      color: var(--color-primary);
      font-size: 0.88rem;
      line-height: 1.45;
      overflow-wrap: break-word;
      word-break: normal;
    }
    .rv-images-row .rv-cell {
      grid-column: 1 / -1;
    }
    .rv-images {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }
    .rv-thumb {
      width: 64px;
      height: 64px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid var(--color-border);
    }
    .rv-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .review-note {
      color: #5f5145;
      margin: 1.25rem 0 0;
      line-height: 1.6;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-row-3 { grid-template-columns: 1fr 1fr 1fr; }
    .form-classification {
      padding-bottom: 1.25rem;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--color-border);
    }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .duplicate-name-option {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      width: fit-content;
      padding: 0.2rem 0;
      color: rgba(214, 202, 184, 0.68);
      font-size: 0.8rem;
      font-weight: 500;
      line-height: 1.3;
      cursor: pointer;
      transition: color 0.2s;
    }
    .duplicate-name-option:hover {
      color: rgba(235, 221, 199, 0.88);
    }
    .duplicate-name-option:focus-within {
      color: rgba(235, 221, 199, 0.94);
    }
    .duplicate-name-option:has(input:checked) {
      color: #d8b66d;
    }
    .duplicate-name-option input {
      appearance: none;
      width: 16px;
      height: 16px;
      margin: 0;
      border: 1px solid rgba(184, 149, 90, 0.65);
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.28);
      flex: 0 0 auto;
      position: relative;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
    }
    .duplicate-name-option input:checked {
      border-color: #9e6d26;
      background: linear-gradient(180deg, #c59445, #9e6d26);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
    }
    .duplicate-name-option input:checked::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .duplicate-name-option input:focus-visible {
      outline: none;
    }
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
    .form-input:-webkit-autofill,
    .form-input:-webkit-autofill:hover,
    .form-input:-webkit-autofill:focus,
    .form-input:-webkit-autofill:active {
      transition: background-color 9999s ease-in-out 0s;
      -webkit-text-fill-color: var(--color-text) !important;
      caret-color: var(--color-text);
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .form-textarea { resize: vertical; }
    .char-counter {
      align-self: flex-end;
      margin: -0.25rem 0 0;
      color: var(--color-text-muted);
      font-size: 0.74rem;
      font-weight: 600;
    }
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
    .image-preview-item img { width: 100%; height: 100%; object-fit: scale-down; }
    .image-preview-item.main-image {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent), 0 0 16px rgba(200, 155, 75, 0.34);
    }
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
    .page-header.upload-form-hero::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 55%;
      background: linear-gradient(180deg, transparent, #090908);
      pointer-events: none;
    }
    .page-header.upload-form-hero .page-header-inner {
      position: relative;
      z-index: 1;
      max-width: 1060px;
    }
    .page-header.upload-form-hero .breadcrumb {
      color: #d4ac62;
    }
    .page-header.upload-form-hero .page-title {
      color: #fff8ed;
      font-size: clamp(2.35rem, 4.4vw, 4rem);
      text-shadow: 0 16px 42px rgba(0,0,0,0.62);
    }
    .page-header.upload-form-hero .page-subtitle {
      color: rgba(255,248,237,0.84);
      margin-top: 1.05rem;
    }
    .page-header.upload-form-hero .page-flourish {
      color: #d4ac62;
      margin: 1.05rem 0 0;
    }
    .page-content.upload-form-content {
      max-width: 1160px;
      padding: 1.5rem 1.5rem 3.4rem;
    }
    .page:has(.upload-form-content) {
      background:
        radial-gradient(circle at 50% 0%, rgba(184,149,90,0.11), transparent 30rem),
        linear-gradient(180deg, #090908 0%, #0b0b0a 48%, #10100f 100%);
      color: #f7efe3;
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
    .upload-form-content .form-input:-webkit-autofill,
    .upload-form-content .form-input:-webkit-autofill:hover,
    .upload-form-content .form-input:-webkit-autofill:focus,
    .upload-form-content .form-input:-webkit-autofill:active {
      transition: background-color 9999s ease-in-out 0s;
      -webkit-text-fill-color: #fff8ed !important;
      caret-color: #fff8ed;
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
    .upload-form-content .char-counter,
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
    .upload-form-content .rv-cell {
      background: rgba(3,3,3,0.42);
      border-color: rgba(184,149,90,0.3);
    }
    .upload-form-content .rv-label {
      color: #d4ac62;
    }
    .upload-form-content .rv-value {
      color: #fff8ed;
    }
    .upload-form-content .rv-thumb {
      border-color: rgba(184,149,90,0.3);
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
    .modal-text.file-list {
      margin-bottom: 1.5rem;
      padding-left: 1.25rem;
    }
    .modal-text.file-list li {
      margin-bottom: 0.35rem;
    }
    .modal-actions {
      display: flex;
      gap: 0.75rem;
    }
    .modal-actions .btn-cancel {
      flex: 1;
      border: 1px solid rgba(184,149,90,0.35);
      background: transparent;
      color: #f0e8db;
      font-size: 0.95rem;
      font-weight: 600;
      padding: 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .modal-actions .btn-cancel:hover {
      background: rgba(184,149,90,0.1);
    }
    @media (max-width: 420px) {
      .page-header {
        padding-top: 1.9rem;
      }
    }
  `]
})
export class UploadAntiqueComponent implements OnInit {
  existingImages = signal<string[]>([]);
  saving = signal(false);
  uploadingImages = signal(false);
  validatingName = signal(false);
  uploadProgress = signal(0);
  error = signal('');
  success = signal('');
  showErrorModal = signal(false);
  errorModalTitle = signal('Completa el formulario');
  errorModalMessage = signal('');
  showSizeModal = signal(false);
  sizeModalFiles = signal<{name: string, size: number}[]>([]);
  editMode = false;
  editId = '';
  category = signal<AntiqueType>('antiguedad');
  formStep = signal(1);
  categories = signal<CategoryGroup[]>([]);
  conditions = signal<ConditionItem[]>([]);

  form: {
    name: string;
    allow_duplicate_name: boolean;
    type: AntiqueType;
    subcategory: string;
    detail: string;
    country: string;
    region: string;
    element: string;
    title: string;
    author: string;
    editor: string;
    imprenta: string;
    edition: string;
    signature: string;
    theme: string;
    century: string;
    year_era: string;
    price: number;
    description: string;
    condition: string;
  };

  constructor(
    private antiquesService: AntiquesService,
    private categoryService: CategoryService,
    private conditionService: ConditionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.defaultForm();
  }

  get detailLabel(): string {
    const group = this.categories().find(g => g.type === this.form.type);
    if (!group) return '';
    for (const sub of group.subcategories) {
      const found = sub.details.find(d => d.key === this.form.detail);
      if (found) return found.label;
    }
    return '';
  }

  defaultForm() {
    return {
      name: '',
      allow_duplicate_name: false,
      type: 'antiguedad' as AntiqueType,
      subcategory: '',
      detail: '',
      country: '',
      region: '',
      element: '',
      title: '',
      author: '',
      editor: '',
      imprenta: '',
      edition: '',
      signature: '',
      theme: '',
      century: '',
      year_era: '',
      price: 0,
      description: '',
      condition: 'Bueno',
    };
  }

  get categoryLabel(): string {
    return this.category() === 'papeleria' ? 'Papelería' : 'Antigüedades';
  }

  get subcategoryLabel(): string {
    const group = this.categories().find(g => g.type === this.form.type);
    if (!group) return '';
    const found = group.subcategories.find(s => s.key === this.form.subcategory);
    return found ? found.label : '';
  }

  get subcategoriesForType(): { key: string; label: string }[] {
    const group = this.categories().find(g => g.type === this.form.type);
    if (!group) return [];
    return group.subcategories.map(s => ({ key: s.key, label: s.label }));
  }

  onTypeChange() {
    this.category.set(this.form.type);
    this.form.subcategory = '';
    this.form.detail = '';
  }

  onSubcategoryChange() {
    this.form.detail = '';
  }

  hasDetail(key: string): boolean {
    const group = this.categories().find(g => g.type === this.form.type);
    if (!group) return false;
    const sub = group.subcategories.find(s => s.key === key);
    return sub ? sub.details.length > 0 : false;
  }

  detailsForCurrent(): { key: string; label: string; desc: string }[] {
    const group = this.categories().find(g => g.type === this.form.type);
    if (!group) return [];
    const sub = group.subcategories.find(s => s.key === this.form.subcategory);
    return sub ? sub.details : [];
  }

  isBasicComplete(): boolean {
    return !!(
      this.form.type &&
      this.form.subcategory &&
      this.form.name.trim() &&
      (!this.hasDetail(this.form.subcategory) || this.form.detail)
    );
  }

  isDetailsComplete(): boolean {
    return Number(this.form.price) > 0;
  }

  isPhotosComplete(): boolean {
    return this.existingImages().length > 0;
  }

  canAccessStep(step: number): boolean {
    if (step <= 1) return true;
    if (!this.isBasicComplete()) return false;
    if (step <= 2) return true;
    if (!this.isDetailsComplete()) return false;
    if (step <= 3) return true;
    return this.isPhotosComplete();
  }

  async goToStep(step: number) {
    if (step <= this.formStep()) {
      this.error.set('');
      this.formStep.set(step);
      return;
    }

    if (!this.validateBeforeStep(step)) return;
    if (step >= 2 && !(await this.validateUniqueName())) return;
    this.error.set('');
    this.formStep.set(step);
  }

  async nextFormStep() {
    await this.goToStep(Math.min(this.formStep() + 1, 4));
  }

  previousFormStep() {
    this.error.set('');
    this.formStep.set(Math.max(this.formStep() - 1, 1));
  }

  private validateBeforeStep(targetStep: number): boolean {
    if (targetStep >= 2 && !this.validateBasicInformation()) return false;
    if (targetStep >= 3 && !this.validateDetails()) return false;
    if (targetStep >= 4 && !this.validatePhotos()) return false;
    return true;
  }

  private validateBasicInformation(): boolean {
    if (!this.form.type) {
      return this.failValidation('Selecciona el tipo de pieza.', 'edit-type', 1);
    }
    if (!this.form.subcategory) {
      return this.failValidation('Selecciona una categoría antes de continuar.', 'edit-sub', 1);
    }
    if (this.hasDetail(this.form.subcategory) && !this.form.detail) {
      return this.failValidation('Selecciona el detalle de la categoría.', 'edit-det', 1);
    }
    if (!this.form.name.trim()) {
      return this.failValidation('El nombre es obligatorio.', 'name', 1);
    }
    return true;
  }

  private validateDetails(): boolean {
    if (!Number.isFinite(Number(this.form.price)) || Number(this.form.price) <= 0) {
      return this.failValidation('El valor debe ser superior a 0 €.', 'price', 2);
    }
    if (this.form.description.length > 2000) {
      const fieldName = this.form.type === 'papeleria' ? 'paper_description' : 'description';
      return this.failValidation('La descripción no puede superar los 2000 caracteres.', fieldName, 2);
    }
    return true;
  }

  private validatePhotos(): boolean {
    if (this.existingImages().length === 0) {
      return this.failValidation('Añade al menos una fotografía antes de continuar.', 'images', 3);
    }
    return true;
  }

  private failValidation(message: string, fieldName: string, step: number, title = 'Completa el formulario'): false {
    this.errorModalTitle.set(title);
    this.errorModalMessage.set(message);
    this.showErrorModal.set(true);
    this.formStep.set(step);
    setTimeout(() => {
      const field = document.querySelector<HTMLElement>(`[name="${fieldName}"]`);
      const target = fieldName === 'images' ? field?.closest<HTMLElement>('.upload-zone') : field;
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target?.focus();
    });
    return false;
  }

  private async validateUniqueName(): Promise<boolean> {
    if (this.form.allow_duplicate_name) return true;
    const normalizedName = this.form.name.trim();
    this.validatingName.set(true);
    try {
      const matches = await this.antiquesService.getAll(normalizedName);
      const duplicate = matches.some(antique =>
        antique.id !== this.editId && antique.name.trim().toLocaleLowerCase() === normalizedName.toLocaleLowerCase()
      );
      if (duplicate) {
        return this.failValidation(
          `Ya existe una pieza con el nombre "${normalizedName}". Utiliza un nombre diferente.`,
          'name',
          1,
          'Pieza duplicada'
        );
      }
      return true;
    } catch {
      return this.failValidation(
        'No se ha podido comprobar si el nombre ya existe. Inténtalo de nuevo.',
        'name',
        1,
        'No se pudo validar el nombre'
      );
    } finally {
      this.validatingName.set(false);
    }
  }

  async ngOnInit() {
    this.categories.set(await this.categoryService.getCategories());
    this.conditions.set(await this.conditionService.getConditions());
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = id;
      const antique = await this.antiquesService.getById(id);
      if (antique) {
        this.category.set(antique.type);
        this.form = {
          name: antique.name,
          allow_duplicate_name: antique.allow_duplicate_name ?? false,
          type: antique.type,
          subcategory: antique.subcategory ?? '',
          detail: antique.detail ?? '',
          country: antique.country ?? '',
          region: antique.region ?? '',
          element: antique.element ?? '',
          title: antique.title ?? '',
          author: antique.author ?? '',
          editor: antique.editor ?? '',
          imprenta: antique.imprenta ?? '',
          edition: antique.edition ?? '',
          signature: antique.signature ?? '',
          theme: antique.theme ?? '',
          century: antique.century ?? '',
          year_era: antique.year_era,
          price: antique.price,
          description: antique.description ?? '',
          condition: antique.condition ?? 'Bueno',
        };
        this.existingImages.set([...antique.images]);
      }
    }
  }

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);
    const oversized = files.filter(f => f.size > 2 * 1024 * 1024);
    if (oversized.length > 0) {
      this.sizeModalFiles.set(oversized.map(f => ({ name: f.name, size: f.size })));
      this.showSizeModal.set(true);
      input.value = '';
      return;
    }
    if (this.existingImages().length + files.length > 5) {
      this.errorModalMessage.set('Máximo 5 fotos por pieza.');
      this.showErrorModal.set(true);
      input.value = '';
      return;
    }
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

  setMainImage(index: number) {
    if (index === 0) return;
    const imgs = [...this.existingImages()];
    const [img] = imgs.splice(index, 1);
    imgs.unshift(img);
    this.existingImages.set(imgs);
  }

  async onSubmit() {
    if (!this.validateBeforeStep(4)) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const normalizedName = this.form.name.trim();
      if (!(await this.validateUniqueName())) return;
      const payload: Partial<Antique> = {
        name: normalizedName,
        allow_duplicate_name: this.form.allow_duplicate_name,
        type: this.form.type,
        subcategory: this.form.subcategory,
        detail: this.form.detail || this.form.subcategory,
        country: this.form.country,
        region: this.form.region,
        element: this.form.element,
        title: this.form.title,
        author: this.form.author,
        editor: this.form.editor,
        imprenta: this.form.imprenta,
        edition: this.form.edition,
        signature: this.form.signature,
        theme: this.form.theme,
        century: this.form.century,
        year_era: this.form.year_era,
        price: this.form.price,
        description: this.form.description,
        condition: this.form.condition,
        material: '',
        dimensions: '',
        paper_type: '',
        paper_format: '',
        paper_weight: 0,
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
      const message = err?.error?.error ?? err?.message ?? 'Error al guardar la pieza.';
      if (message.includes('Ya existe una pieza')) {
        this.failValidation(message, 'name', 1, 'Pieza duplicada');
      } else {
        this.error.set(message);
      }
    } finally {
      this.saving.set(false);
    }
  }
}
