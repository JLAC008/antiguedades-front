import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogsService } from '../../core/catalogs.service';
import { Catalog } from '../../models';

@Component({
  selector: 'app-manage-catalogs',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div class="page-header-inner">
          <h1 class="page-title">Gestionar catálogos</h1>
          <div class="page-flourish" aria-hidden="true">⌘</div>
          <p class="page-subtitle">Crea y organiza los catálogos de tu colección</p>
        </div>
      </div>

      <div class="page-content">
        <div class="layout">
          <div class="form-panel">
            <h2 class="panel-title">{{ editingCatalog ? 'Editar catálogo' : 'Nuevo catálogo' }}</h2>

            @if (error()) {
              <div class="form-error">{{ error() }}</div>
            }
            @if (success()) {
              <div class="form-success">{{ success() }}</div>
            }

            <form (ngSubmit)="onSubmit()" class="catalog-form">
              <div class="form-group">
                <label class="form-label">Nombre <span class="required">*</span></label>
                <input type="text" class="form-input" [(ngModel)]="form.name" name="name" placeholder="Ej. Porcelana Europea" required />
              </div>
              <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea class="form-textarea" [(ngModel)]="form.description" name="description" rows="3" placeholder="Breve descripción del catálogo..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">URL de imagen de portada</label>
                <input type="url" class="form-input" [(ngModel)]="form.cover_image" name="cover_image" placeholder="https://..." />
              </div>
              @if (form.cover_image) {
                <img [src]="form.cover_image" alt="Portada" class="cover-preview" />
              }
              <div class="form-actions">
                @if (editingCatalog) {
                  <button type="button" class="btn-cancel" (click)="cancelEdit()">Cancelar</button>
                }
                <button type="submit" class="btn-submit" [disabled]="saving()">
                  @if (saving()) { Guardando... } @else { {{ editingCatalog ? 'Guardar cambios' : 'Crear catálogo' }} }
                </button>
              </div>
            </form>
          </div>

          <div class="list-panel">
            <h2 class="panel-title">Catálogos existentes ({{ catalogs().length }})</h2>

            @if (loading()) {
              <div class="loading">Cargando...</div>
            } @else if (catalogs().length === 0) {
              <div class="empty-state">
                <span class="empty-icon">&#128193;</span>
                <p>No hay catálogos todavía. Crea el primero.</p>
              </div>
            } @else {
              <div class="catalogs-list">
                @for (catalog of catalogs(); track catalog.id) {
                  <div class="catalog-item">
                    <div class="catalog-item-img">
                      @if (catalog.cover_image) {
                        <img [src]="catalog.cover_image" [alt]="catalog.name" />
                      } @else {
                        <span>&#9775;</span>
                      }
                    </div>
                    <div class="catalog-item-info">
                      <p class="catalog-item-name">{{ catalog.name }}</p>
                      @if (catalog.description) {
                        <p class="catalog-item-desc">{{ catalog.description }}</p>
                      }
                    </div>
                    <div class="catalog-item-actions">
                      <a [routerLink]="['/catalogo', catalog.id]" class="btn-view" title="Ver catálogo">&#128065;</a>
                      <button class="btn-edit" (click)="startEdit(catalog)" title="Editar">&#9998;</button>
                      <button class="btn-delete" (click)="deleteCatalog(catalog)" title="Eliminar">&#128465;</button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
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
    .page-header-inner { max-width: 1100px; margin: 0 auto; }
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
    .page-subtitle { color: #5f5145; font-size: 1.02rem; margin: 0; }
    .page-content { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .layout { display: grid; grid-template-columns: 380px 1fr; gap: 2rem; align-items: start; }
    .form-panel, .list-panel {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 1.75rem;
    }
    .panel-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 1.5rem;
    }
    .form-error {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: var(--color-error);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    .form-success {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: var(--color-success);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    .catalog-form { display: flex; flex-direction: column; gap: 1.125rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text); }
    .required { color: var(--color-error); }
    .form-input, .form-textarea {
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 0.9375rem;
      color: var(--color-text);
      background: var(--color-bg);
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }
    .form-textarea { resize: vertical; }
    .cover-preview {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid var(--color-border);
    }
    .form-actions { display: flex; gap: 0.75rem; }
    .btn-cancel {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text-muted);
      cursor: pointer;
      background: none;
      transition: all 0.2s;
    }
    .btn-cancel:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .btn-submit {
      flex: 2;
      background: var(--color-primary);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: var(--color-secondary); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .loading { text-align: center; padding: 2rem; color: var(--color-text-muted); }
    .empty-state { text-align: center; padding: 2.5rem; color: var(--color-text-muted); }
    .empty-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .catalogs-list { display: flex; flex-direction: column; gap: 0.875rem; }
    .catalog-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.875rem;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: 10px;
      transition: border-color 0.2s;
    }
    .catalog-item:hover { border-color: var(--color-accent); }
    .catalog-item-img {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--color-bg-2);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--color-accent);
    }
    .catalog-item-img img { width: 100%; height: 100%; object-fit: cover; }
    .catalog-item-info { flex: 1; min-width: 0; }
    .catalog-item-name { font-weight: 600; font-size: 0.9375rem; color: var(--color-primary); margin: 0 0 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .catalog-item-desc { font-size: 0.8125rem; color: var(--color-text-muted); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .catalog-item-actions { display: flex; gap: 0.25rem; flex-shrink: 0; }
    .btn-view, .btn-edit, .btn-delete {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .btn-view:hover { border-color: var(--color-accent); background: rgba(184,149,90,0.08); }
    .btn-edit:hover { border-color: var(--color-primary); background: rgba(28,22,18,0.06); }
    .btn-delete:hover { border-color: var(--color-error); background: rgba(184,84,80,0.08); }
    @media (max-width: 768px) {
      .page-header {
        padding: 2.35rem 1rem 2.15rem;
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
      .page-content {
        padding: 1.5rem 1rem 3rem;
      }
      .layout { grid-template-columns: 1fr; gap: 1rem; }
      .form-panel, .list-panel {
        padding: 1.25rem;
        border-radius: 10px;
      }
      .form-actions {
        flex-direction: column;
      }
      .btn-cancel,
      .btn-submit {
        width: 100%;
      }
      .catalog-item {
        align-items: flex-start;
      }
      .catalog-item-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ManageCatalogsComponent implements OnInit {
  catalogs = signal<Catalog[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal('');
  success = signal('');
  editingCatalog: Catalog | null = null;

  form = { name: '', description: '', cover_image: '' };

  constructor(private catalogsService: CatalogsService) {}

  async ngOnInit() {
    await this.loadCatalogs();
  }

  async loadCatalogs() {
    this.loading.set(true);
    try {
      this.catalogs.set(await this.catalogsService.getAll());
    } finally {
      this.loading.set(false);
    }
  }

  startEdit(catalog: Catalog) {
    this.editingCatalog = catalog;
    this.form = { name: catalog.name, description: catalog.description, cover_image: catalog.cover_image };
    this.error.set('');
    this.success.set('');
  }

  cancelEdit() {
    this.editingCatalog = null;
    this.form = { name: '', description: '', cover_image: '' };
    this.error.set('');
    this.success.set('');
  }

  async onSubmit() {
    if (!this.form.name.trim()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    try {
      if (this.editingCatalog) {
        await this.catalogsService.update(this.editingCatalog.id, this.form);
        this.success.set('Catálogo actualizado correctamente.');
        this.editingCatalog = null;
      } else {
        await this.catalogsService.create(this.form);
        this.success.set('Catálogo creado correctamente.');
      }
      this.form = { name: '', description: '', cover_image: '' };
      await this.loadCatalogs();
      setTimeout(() => this.success.set(''), 3000);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al guardar el catálogo.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteCatalog(catalog: Catalog) {
    if (!confirm(`¿Eliminar el catálogo "${catalog.name}"? Las piezas quedarán sin catálogo.`)) return;
    try {
      await this.catalogsService.delete(catalog.id);
      this.catalogs.set(this.catalogs().filter(c => c.id !== catalog.id));
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al eliminar el catálogo.');
    }
  }
}
