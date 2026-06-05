import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AntiquesService } from '../../core/antiques.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-home">
      <section class="hero">
        <video class="hero-video" autoplay muted playsinline>
          <source src="assets/hero-bg.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <p class="hero-overline">Colecci&oacute;n privada</p>
          <h1 class="hero-title">Nuestra Colecci&oacute;n Familiar</h1>
          <p class="hero-subtitle">Piezas &uacute;nicas reunidas con pasi&oacute;n, guardadas para la familia.</p>
          <a routerLink="/coleccion" class="hero-cta">Ver toda la colecci&oacute;n</a>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Explora por tipo</h2>
          <p class="section-subtitle">Navega por las categor&iacute;as de la colecci&oacute;n</p>
        </div>

        <div class="type-cards">
          <a routerLink="/coleccion" [queryParams]="{tipo: 'antiguedad'}" class="type-card">
            <div class="type-card-icon">&#9876;</div>
            <h3 class="type-card-name">Antigüedades</h3>
            <p class="type-card-count">{{ counts.antiguedad }} pieza{{ counts.antiguedad !== 1 ? 's' : '' }}</p>
            <p class="type-card-desc">Escultura, pintura, cristal, cer&aacute;mica y piezas hist&oacute;ricas</p>
            <span class="type-card-action">Explorar &rarr;</span>
          </a>
          <a routerLink="/coleccion" [queryParams]="{tipo: 'papeleria'}" class="type-card">
            <div class="type-card-icon">&#128196;</div>
            <h3 class="type-card-name">Papelería</h3>
            <p class="type-card-count">{{ counts.papeleria }} pieza{{ counts.papeleria !== 1 ? 's' : '' }}</p>
            <p class="type-card-desc">Filatelia, fotos, revistas, documentos y libros</p>
            <span class="type-card-action">Explorar &rarr;</span>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-home { min-height: 100vh; }
    .hero {
      color: white;
      padding: 5rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 420px;
      position: relative;
      overflow: hidden;
    }
    .hero-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(28, 22, 18, 0.6);
      z-index: 1;
    }
    .hero-content {
      max-width: 620px;
      text-align: center;
      position: relative;
      z-index: 2;
    }
    .hero-overline {
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-accent-light);
      margin: 0 0 1rem;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.875rem, 5vw, 3rem);
      font-weight: 700;
      line-height: 1.2;
      color: white;
      margin: 0 0 1.25rem;
    }
    .hero-subtitle {
      font-size: 1.0625rem;
      color: rgba(255,255,255,0.75);
      line-height: 1.6;
      margin: 0 0 2rem;
    }
    .hero-cta {
      display: inline-block;
      background: var(--color-accent);
      color: white;
      text-decoration: none;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9375rem;
      transition: background 0.2s, transform 0.2s;
    }
    .hero-cta:hover { background: var(--color-accent-light); transform: translateY(-2px); }
    .section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }
    .section-header {
      margin-bottom: 2.5rem;
      text-align: center;
    }
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0 0 0.5rem;
    }
    .section-subtitle {
      color: var(--color-text-muted);
      font-size: 1rem;
      margin: 0;
    }
    .type-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 720px;
      margin: 0 auto;
    }
    .type-card {
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      text-align: center;
      text-decoration: none;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .type-card:hover {
      border-color: var(--color-accent);
      box-shadow: 0 8px 32px rgba(184,149,90,0.15);
      transform: translateY(-4px);
    }
    .type-card-icon {
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
    .type-card-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
    }
    .type-card-count {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-accent);
      background: rgba(184,149,90,0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      margin: 0;
    }
    .type-card-desc {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }
    .type-card-action {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-accent);
      margin-top: 0.25rem;
    }
    @media (max-width: 640px) {
      .type-cards { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  counts = { antiguedad: 0, papeleria: 0 };

  constructor(private antiquesService: AntiquesService) {}

  ngOnInit() {
    this.counts = this.antiquesService.getCounts();
  }
}
