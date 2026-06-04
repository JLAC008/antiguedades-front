import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalog } from '../../models';

@Component({
  selector: 'app-catalog-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/catalogo', catalog.id]" class="catalog-card">
      <div class="catalog-card-img">
        @if (catalog.cover_image) {
          <img [src]="catalog.cover_image" [alt]="catalog.name" loading="lazy" />
        } @else {
          <div class="catalog-card-placeholder">
            <span>&#9775;</span>
          </div>
        }
      </div>
      <div class="catalog-card-body">
        <h3 class="catalog-card-title">{{ catalog.name }}</h3>
        @if (catalog.description) {
          <p class="catalog-card-desc">{{ catalog.description }}</p>
        }
        <span class="catalog-card-action">Ver colección &rarr;</span>
      </div>
    </a>
  `,
  styles: [`
    .catalog-card {
      display: block;
      text-decoration: none;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.25s, box-shadow 0.25s;
      color: inherit;
    }
    .catalog-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    }
    .catalog-card-img {
      aspect-ratio: 4/3;
      overflow: hidden;
      background: var(--color-bg-2);
    }
    .catalog-card-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .catalog-card:hover .catalog-card-img img { transform: scale(1.04); }
    .catalog-card-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      color: var(--color-accent);
    }
    .catalog-card-body {
      padding: 1.25rem;
    }
    .catalog-card-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.5rem;
    }
    .catalog-card-desc {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: 0 0 0.875rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .catalog-card-action {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 0.01em;
    }
  `]
})
export class CatalogCardComponent {
  @Input() catalog!: Catalog;
}
