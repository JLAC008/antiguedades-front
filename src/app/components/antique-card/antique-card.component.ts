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
        @if (antique.price > 0) {
          <p class="antique-card-price">{{ antique.price | currency:'EUR':'symbol':'1.0-0' }}</p>
        }
        @if (antique.description) {
          <p class="antique-card-desc">{{ antique.description }}</p>
        }
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
  `]
})
export class AntiqueCardComponent {
  @Input() antique!: Antique;
}
