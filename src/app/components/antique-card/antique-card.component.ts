import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Antique } from '../../models';

@Component({
  selector: 'app-antique-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <a [routerLink]="['/pieza', antique.id]" class="antique-card">
      <div class="antique-card-img">
        @if (antique.images && antique.images.length > 0) {
          <img [src]="antique.images[0]" [alt]="antique.name" loading="lazy" />
        } @else {
          <div class="antique-card-placeholder">
            <span>&#128250;</span>
          </div>
        }
        <span class="antique-card-badge">{{ antique.condition }}</span>
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
        @if (antique.price > 0) {
          <p class="antique-card-price">{{ antique.price | currency:'EUR':'symbol':'1.0-0' }}</p>
        }
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
      object-fit: cover;
      transition: transform 0.4s;
    }
    .antique-card:hover .antique-card-img img { transform: scale(1.05); }
    .antique-card-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    .antique-card-badge {
      position: absolute;
      top: 0.625rem;
      right: 0.625rem;
      background: rgba(255,255,255,0.92);
      border: 1px solid var(--color-border);
      color: var(--color-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 20px;
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
    .antique-card-price {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.5rem;
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
      aspect-ratio: 1.42;
      background: #090909;
    }
    :host-context(.page-collection) .antique-card-img::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 42%;
      background: linear-gradient(180deg, transparent, rgba(8, 8, 8, 0.82));
      pointer-events: none;
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
    :host-context(.page-collection) .antique-card-price {
      order: 4;
      color: #e2b866;
      font-family: 'Playfair Display', serif;
      font-size: 1.45rem;
      margin: auto 0 0;
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
  `]
})
export class AntiqueCardComponent {
  @Input() antique!: Antique;

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
    };

    return labels[this.antique?.subcategory] ?? (this.antique?.type === 'papeleria' ? 'Papelería' : 'Antigüedad');
  }
}
