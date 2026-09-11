import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Antique, ANTIQUE_STATUS_LABELS, DEFAULT_ANTIQUE_IMAGE } from '../../models';

@Component({
  selector: 'app-antique-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/pieza', antique.id]" class="antique-card">
      <div class="antique-card-img">
        @if (antique.images && antique.images.length > 0) {
          <img [src]="antique.images[0]" [alt]="antique.name" loading="lazy" />
        } @else {
          <img class="default-antique-image" [src]="defaultImage" [alt]="antique.name + ' — imagen de referencia'" loading="lazy" />
        }
        @if (antique.status) {
          <span class="antique-status-ribbon" [class]="'antique-status-' + antique.status">{{ statusLabel() }}</span>
        }
      </div>
      <div class="antique-card-body">
        <h3 class="antique-card-title">{{ antique.name }}</h3>
        @if (antique.year_era) {
          <p class="antique-card-era">{{ antique.year_era }}</p>
        }
        <p class="antique-card-meta">
          <span class="meta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m12 3 7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3Z"/><path d="m12 8 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L12 8Z"/></svg>
          </span>
          {{ categoryLabel() }}
        </p>
        @if (antique.description) {
          <p class="antique-card-desc">{{ antique.description }}</p>
        }
        <div class="antique-card-footer">
          @if (antique.material) {
            <span class="antique-card-material">{{ antique.material }}</span>
          }
          <span class="antique-card-link">Ver detalle <span aria-hidden="true">→</span></span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .antique-card {
      display: block;
      text-decoration: none;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.25s, box-shadow 0.25s;
      color: inherit;
    }
    .antique-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    }
    .antique-card-img {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--color-bg-2);
    }
    .antique-card-img img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
      transition: transform 0.4s;
    }
    .antique-status-ribbon {
      position: absolute;
      top: 0.9rem;
      left: -0.35rem;
      z-index: 3;
      padding: 0.45rem 0.9rem 0.45rem 1rem;
      color: #17120c;
      background: #d4ac62;
      border: 1px solid rgba(255, 239, 194, 0.72);
      border-left: 0;
      border-radius: 0 3px 3px 0;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .antique-status-ribbon::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -0.36rem;
      border-top: 0.36rem solid #80602d;
      border-left: 0.36rem solid transparent;
    }
    .antique-status-pagado { background: #d9c188; }
    .antique-status-vendido { background: #c98263; color: #fff4ec; }
    .antique-status-enviado { background: #8fb1b1; }
    .antique-card:hover .antique-card-img img { transform: scale(1.05); }
    .antique-card-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    .antique-card-body {
      padding: 1rem 1.125rem 1.25rem;
    }
    .antique-card-title {
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.25rem;
    }
    .antique-card-era {
      font-size: 0.8125rem;
      color: var(--color-accent);
      font-weight: 600;
      margin: 0 0 0.375rem;
      letter-spacing: 0.02em;
    }
    .antique-card-desc {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .antique-card-meta,
    .antique-card-footer,
    .antique-card-material,
    .antique-card-link {
      display: none;
    }

    :host-context(.page-collection) .antique-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: linear-gradient(180deg, rgba(18, 18, 17, 0.98), rgba(10, 10, 9, 0.98));
      border: 1px solid rgba(184, 149, 90, 0.34);
      border-radius: 6px;
      box-shadow: 0 22px 46px rgba(0, 0, 0, 0.28);
      color: #f7efe3;
    }
    :host-context(.page-collection) .antique-card:hover {
      transform: translateY(-5px);
      border-color: rgba(212, 172, 98, 0.8);
      box-shadow: 0 28px 62px rgba(0, 0, 0, 0.44);
    }
    :host-context(.page-collection) .antique-card-img {
      aspect-ratio: 1;
      background: #11100f;
    }
    :host-context(.page-collection) .antique-card-img img {
      object-fit: cover;
      object-position: center;
    }
    :host-context(.page-collection) .antique-card-img img.default-antique-image {
      object-position: 68% center;
    }
    :host-context(.page-collection) .antique-card:hover .antique-card-img img {
      transform: none;
    }
    :host-context(.page-collection) .antique-card-img::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 42%;
      background: linear-gradient(180deg, transparent, rgba(8, 8, 8, 0.82));
      pointer-events: none;
      z-index: 2;
    }
    :host-context(.page-collection) .antique-card-placeholder {
      background:
        radial-gradient(circle at center, rgba(184, 149, 90, 0.18), transparent 8rem),
        #0d0d0c;
      color: #b8955a;
    }
    :host-context(.page-collection) .antique-card-badge {
      top: 0.8rem;
      right: 0.8rem;
      background: rgba(12, 12, 11, 0.82);
      border-color: rgba(212, 172, 98, 0.72);
      color: #f5d690;
      border-radius: 5px;
      backdrop-filter: blur(8px);
    }
    :host-context(.page-collection) .antique-card-body {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 1.05rem 1.1rem 1.2rem;
    }
    :host-context(.page-collection) .antique-card-title {
      color: #fff8ed;
      font-size: 1.12rem;
      margin-bottom: 0.25rem;
    }
    :host-context(.page-collection) .antique-card-era {
      color: #d4ac62;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0;
      margin-bottom: 0.75rem;
    }
    :host-context(.page-collection) .antique-card-meta {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: rgba(247, 239, 227, 0.68);
      font-size: 0.82rem;
      margin: 0 0 0.8rem;
    }
    :host-context(.page-collection) .meta-icon {
      width: 1.05rem;
      height: 1.05rem;
      color: #c89b4b;
    }
    :host-context(.page-collection) .meta-icon svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    :host-context(.page-collection) .antique-card-desc {
      color: rgba(247, 239, 227, 0.64);
      font-size: 0.86rem;
      -webkit-line-clamp: 3;
      margin-bottom: 1.1rem;
    }
    :host-context(.page-collection) .antique-card-footer {
      order: 5;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 0.7rem;
    }
    :host-context(.page-collection) .antique-card-material {
      display: block;
      color: rgba(247, 239, 227, 0.45);
      font-size: 0.74rem;
      line-height: 1.35;
      max-width: 52%;
    }
    :host-context(.page-collection) .antique-card-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: #d4ac62;
      font-size: 0.82rem;
      white-space: nowrap;
    }

    :host-context(.page-collection) .antique-card {
      background: #101110;
      border-color: rgba(184, 149, 90, 0.22);
      border-radius: 1px;
      box-shadow: none;
    }

    :host-context(.page-collection) .antique-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.42);
    }

    :host-context(.page-collection) .antique-card-img {
      aspect-ratio: 1;
    }

    :host-context(.page-collection) .antique-card-img::after {
      height: 34%;
      background: linear-gradient(180deg, transparent, rgba(8, 8, 8, 0.62));
    }

    :host-context(.page-collection) .antique-card-body {
      padding: 0.85rem 0.8rem 0.95rem;
    }

    :host-context(.page-collection) .antique-card-title {
      font-size: 1rem;
      font-weight: 400;
    }

    :host-context(.page-collection) .antique-card-era {
      margin-bottom: 0.5rem;
      font-size: 0.74rem;
    }

    :host-context(.page-collection) .antique-card-meta {
      margin-bottom: 0.55rem;
      font-size: 0.74rem;
    }

    :host-context(.page-collection) .antique-card-desc {
      margin-bottom: 0.8rem;
      font-size: 0.74rem;
      -webkit-line-clamp: 2;
    }

    :host-context(.page-collection) .antique-card-link {
      color: #c79a55;
      font-size: 0.72rem;
    }
  `]
})
export class AntiqueCardComponent {
  @Input() antique!: Antique;
  defaultImage = DEFAULT_ANTIQUE_IMAGE;

  statusLabel(): string {
    return this.antique.status ? ANTIQUE_STATUS_LABELS[this.antique.status] : '';
  }

  categoryLabel(): string {
    const labels: Record<string, string> = {
      escultura: 'Escultura',
      pintura: 'Pintura',
      cristal: 'Cristal',
      ceramica: 'Cerámica',
      filatelia: 'Filatelia',
      fotos: 'Fotografía',
      revistas: 'Revistas',
      documentos: 'Documentos',
      libros: 'Libros',
      varios: 'Varios',
    };

    return labels[this.antique?.subcategory] ?? (this.antique?.type === 'papeleria' ? 'Papelería' : 'Antigüedad');
  }
}
