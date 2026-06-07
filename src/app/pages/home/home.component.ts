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
        <div class="hero-vignette"></div>
        <div class="hero-content">
          <div class="hero-mark">✦</div>
          <p class="hero-overline">Colección privada</p>
          <div class="hero-flourish" aria-hidden="true">⌘</div>
          <h1 class="hero-title">Nuestra Colección Familiar</h1>
          <div class="hero-flourish hero-flourish-small" aria-hidden="true">⌘</div>
          <p class="hero-subtitle">Piezas únicas reunidas con pasión, guardadas para la familia.</p>
          <a routerLink="/coleccion" class="hero-cta">
            <span>Ver toda la colección</span>
            <span aria-hidden="true">›</span>
          </a>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <p class="section-overline">Explora</p>
          <h2 class="section-title">Explora por tipo</h2>
          <div class="section-flourish" aria-hidden="true">⌘</div>
          <p class="section-subtitle">Navega por las categorías de la colección</p>
        </div>

        <div class="type-cards">
          <a routerLink="/coleccion" [queryParams]="{tipo: 'antiguedad'}" class="type-card">
            <div class="type-card-media">
              <img src="assets/home-antiguedades-card.png" alt="" loading="lazy" />
            </div>
            <div class="type-card-content">
              <div class="type-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M5 20h14M7 17h10M8 8h8M6 11h12M9 8v9M15 8v9M11 8v9M13 8v9M12 3 5 7h14Z"/>
                </svg>
              </div>
              <h3 class="type-card-name">Antigüedades</h3>
              <p class="type-card-count">{{ counts.antiguedad }} pieza{{ counts.antiguedad !== 1 ? 's' : '' }}</p>
              <p class="type-card-desc">Escultura, pintura, cristal, cerámica y piezas históricas</p>
              <span class="type-card-action">Explorar &rarr;</span>
            </div>
          </a>

          <a routerLink="/coleccion" [queryParams]="{tipo: 'papeleria'}" class="type-card">
            <div class="type-card-media">
              <img src="assets/home-papeleria-card.png" alt="" loading="lazy" />
            </div>
            <div class="type-card-content">
              <div class="type-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M7 3h7l5 5v13H7Z"/>
                  <path d="M14 3v6h5M10 13h6M10 17h6"/>
                </svg>
              </div>
              <h3 class="type-card-name">Papelería</h3>
              <p class="type-card-count">{{ counts.papeleria }} pieza{{ counts.papeleria !== 1 ? 's' : '' }}</p>
              <p class="type-card-desc">Filatelia, fotos, revistas, documentos y libros</p>
              <span class="type-card-action">Explorar &rarr;</span>
            </div>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-home {
      min-height: 100vh;
      background:
        radial-gradient(circle at 50% 0%, rgba(184, 149, 90, 0.12), transparent 38rem),
        #fbfaf7;
    }
    .hero {
      color: white;
      padding: 7.1rem 1.5rem 5.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 470px;
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
      background:
        linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(15, 12, 9, 0.36) 45%, rgba(0, 0, 0, 0.72)),
        rgba(10, 8, 6, 0.48);
      z-index: 1;
    }
    .hero-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 48%, rgba(0,0,0,0.64) 100%);
      z-index: 1;
      pointer-events: none;
    }
    .hero-content {
      max-width: 820px;
      text-align: center;
      position: relative;
      z-index: 2;
    }
    .hero-mark {
      color: var(--color-accent);
      font-size: 0.9rem;
      line-height: 1;
      margin-bottom: 0.9rem;
      text-shadow: 0 0 18px rgba(212, 180, 131, 0.5);
    }
    .hero-overline {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--color-accent-light);
      margin: 0;
    }
    .hero-flourish,
    .section-flourish {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.9rem;
      color: var(--color-accent);
      font-family: Georgia, serif;
      font-size: 1rem;
      margin: 0.75rem auto 1rem;
      opacity: 0.9;
    }
    .hero-flourish::before,
    .hero-flourish::after,
    .section-flourish::before,
    .section-flourish::after {
      content: '';
      width: 3.8rem;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(184, 149, 90, 0.72));
    }
    .hero-flourish::after,
    .section-flourish::after {
      background: linear-gradient(90deg, rgba(184, 149, 90, 0.72), transparent);
    }
    .hero-flourish-small {
      margin: 0.85rem auto 1.25rem;
      transform: scale(0.72);
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.3rem, 5vw, 4.25rem);
      font-weight: 700;
      line-height: 1.08;
      color: white;
      margin: 0;
      text-shadow: 0 3px 28px rgba(0,0,0,0.66);
    }
    .hero-subtitle {
      font-family: 'Playfair Display', serif;
      font-size: 1.12rem;
      color: rgba(255,255,255,0.9);
      line-height: 1.6;
      margin: 0 0 1.8rem;
    }
    .hero-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      min-width: 238px;
      background: linear-gradient(135deg, #b99b62, #9d7d44);
      color: white;
      text-decoration: none;
      padding: 1.02rem 1.45rem 1.02rem 1.75rem;
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 18px 36px rgba(0,0,0,0.28);
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    }
    .hero-cta:hover {
      background: linear-gradient(135deg, #c7aa73, #aa884d);
      transform: translateY(-2px);
      box-shadow: 0 22px 42px rgba(0,0,0,0.34);
    }

    .section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.25rem 1.5rem 5rem;
    }
    .section-header {
      margin-bottom: 1.45rem;
      text-align: center;
    }
    .section-overline {
      color: #8a6f4c;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.34em;
      margin: 0 0 0.35rem;
      text-transform: uppercase;
    }
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.8rem, 3vw, 2.35rem);
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
    }
    .section-flourish {
      margin: 0.08rem auto 0.1rem;
      transform: scale(0.58);
    }
    .section-subtitle {
      color: #4f453b;
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      margin: 0;
    }
    .type-cards {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.65rem;
      max-width: 980px;
      margin: 0 auto;
    }
    .type-card {
      min-height: 220px;
      display: grid;
      grid-template-columns: 48% 52%;
      overflow: hidden;
      text-decoration: none;
      color: #fff8ed;
      border: 1px solid rgba(184,149,90,0.5);
      border-radius: 8px;
      background: #0c0c0b;
      box-shadow: 0 18px 42px rgba(64, 47, 29, 0.16);
      transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    }
    .type-card:hover {
      border-color: #d4ac62;
      transform: translateY(-4px);
      box-shadow: 0 24px 52px rgba(64, 47, 29, 0.24);
    }
    .type-card-media {
      position: relative;
      min-height: 220px;
      overflow: hidden;
      background: #080808;
    }
    .type-card-media::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(9,9,8,0.25) 58%, #0c0c0b 100%);
      pointer-events: none;
    }
    .type-card-media img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      transition: transform 0.45s;
    }
    .type-card:hover .type-card-media img {
      transform: scale(1.05);
    }
    .type-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      min-width: 0;
      padding: 1.35rem 1.45rem;
      text-align: center;
      background:
        radial-gradient(circle at 50% 0%, rgba(184,149,90,0.12), transparent 8rem),
        linear-gradient(90deg, #121110, #0b0b0a);
    }
    .type-card-icon {
      width: 62px;
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d4ac62;
      border: 1px solid rgba(212,172,98,0.65);
      border-radius: 50%;
      background: rgba(0,0,0,0.32);
      margin-bottom: 0.25rem;
    }
    .type-card-icon svg {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.45;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .type-card-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.45rem;
      font-weight: 700;
      color: #fff8ed;
      margin: 0;
    }
    .type-card-count {
      font-family: 'Playfair Display', serif;
      font-size: 0.83rem;
      font-weight: 600;
      color: #d4ac62;
      border: 1px solid rgba(184,149,90,0.65);
      padding: 0.08rem 0.72rem 0.12rem;
      border-radius: 20px;
      margin: 0;
      line-height: 1.35;
      background: rgba(0,0,0,0.22);
    }
    .type-card-desc {
      color: rgba(255,248,237,0.86);
      font-family: 'Playfair Display', serif;
      font-size: 0.95rem;
      margin: 0;
      line-height: 1.35;
      max-width: 245px;
      min-height: 2.65rem;
    }
    .type-card-action {
      display: inline-block;
      font-family: 'Playfair Display', serif;
      font-size: 0.93rem;
      font-weight: 600;
      color: #d4ac62;
      margin-top: 0.4rem;
      padding-bottom: 0.28rem;
      border-bottom: 1px solid currentColor;
      min-width: 86px;
    }
    @media (max-width: 760px) {
      .hero {
        min-height: 500px;
        padding: 5.5rem 1rem 4rem;
      }
      .hero-title {
        font-size: clamp(2rem, 12vw, 3rem);
      }
      .hero-cta {
        width: min(100%, 270px);
      }
      .section {
        padding: 2.4rem 1rem 3.5rem;
      }
      .type-cards {
        grid-template-columns: 1fr;
        max-width: 520px;
      }
      .type-card {
        grid-template-columns: 1fr;
      }
      .type-card-media {
        min-height: 180px;
      }
      .type-card-media::after {
        background: linear-gradient(180deg, transparent 0%, rgba(12,12,11,0.86) 100%);
      }
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
