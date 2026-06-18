import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page-home">
      <section class="hero">
        <video #heroVideo class="hero-video" autoplay muted playsinline preload="auto" poster="/assets/home-hero-study-v2.png">
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>
        <div class="hero-shade" aria-hidden="true"></div>

        <div class="hero-content">
          <p class="hero-overline">Colección privada</p>
          <span class="ornament" aria-hidden="true">◆</span>
          <h1 class="hero-title">Nuestra Colección<br />Familiar</h1>
          <p class="hero-subtitle">
            Piezas únicas reunidas con pasión, guardadas para la familia.
          </p>
          <a routerLink="/coleccion" class="hero-cta">
            <span>Ver toda la colección</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      <section class="heritage">
        <div class="heritage-inner">
          <div class="heritage-media">
            <img
              src="assets/home-antiguedades-card.png"
              alt="Reloj ornamental y busto clásico de la colección"
              loading="lazy"
            />
          </div>

          <div class="heritage-copy">
            <p class="heritage-overline">Colección privada</p>
            <h2>Conservando la<br />historia familiar</h2>
            <p class="heritage-intro">
              Una selección exclusiva de piezas históricas reunidas durante
              décadas. Descubre objetos que representan recuerdos,
              acontecimientos y momentos únicos.
            </p>

            <div class="heritage-feature">
              <span class="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
                </svg>
              </span>
              <div>
                <h3>Cada pieza cuenta una historia</h3>
                <p>
                  Nuestro catálogo digital permite explorar, documentar y
                  preservar el patrimonio familiar de forma organizada y
                  accesible.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .page-home {
      min-height: 100vh;
      background: #090a09;
    }

    .hero {
      min-height: 500px;
      position: relative;
      display: grid;
      place-items: center;
      overflow: hidden;
      color: #fff;
      border-bottom: 1px solid rgba(184, 149, 90, 0.55);
    }
    .hero-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 53%;
      transform: scale(1.015);
      animation: hero-reveal 1.4s ease-out both;
    }
    .hero-shade {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(4, 4, 3, 0.18), rgba(4, 4, 3, 0.48) 38%, rgba(4, 4, 3, 0.48) 62%, rgba(4, 4, 3, 0.2)),
        linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.18));
    }
    .hero-content {
      width: min(760px, calc(100% - 2rem));
      position: relative;
      z-index: 1;
      padding: 4rem 1rem 3.4rem;
      text-align: center;
    }
    .hero-content > * {
      animation: content-rise 0.7s ease-out both;
    }
    .hero-content > .hero-overline { animation-delay: 0.1s; }
    .hero-content > .ornament { animation-delay: 0.25s; }
    .hero-content > .hero-title { animation-delay: 0.4s; }
    .hero-content > .hero-subtitle { animation-delay: 0.6s; }
    .hero-content > .hero-cta { animation-delay: 0.8s; }
    .hero-overline,
    .heritage-overline {
      margin: 0;
      color: #d2ad68;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
    }
    .ornament {
      display: block;
      margin: 0.6rem 0 0.55rem;
      color: #b8955a;
      font-size: 0.48rem;
    }
    .hero-title {
      margin: 0;
      color: #fffdf8;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2.8rem, 5.2vw, 4.6rem);
      font-weight: 700;
      line-height: 0.98;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.92);
    }
    .hero-subtitle {
      margin: 1rem auto 1.55rem;
      color: rgba(255, 253, 248, 0.92);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1rem;
      line-height: 1.55;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95);
    }
    .hero-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      min-height: 48px;
      padding: 0 1.45rem 0 1.7rem;
      color: #fff;
      background: #b28c4e;
      border: 1px solid #c9a96d;
      border-radius: 4px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease;
    }
    .hero-cta svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .hero-cta:hover {
      background: #c09a59;
      transform: translateY(-2px);
      box-shadow: 0 16px 34px rgba(0, 0, 0, 0.34);
    }

    .heritage {
      position: relative;
      padding: clamp(3rem, 6vw, 5.5rem) 1.5rem;
      background:
        radial-gradient(circle at 72% 30%, rgba(164, 117, 48, 0.11), transparent 25rem),
        radial-gradient(circle at 18% 82%, rgba(184, 149, 90, 0.06), transparent 24rem),
        linear-gradient(180deg, #0d0e0d 0%, #090a09 100%);
      border-bottom: 1px solid rgba(184, 149, 90, 0.2);
      overflow: hidden;
    }
    .heritage::after {
      content: '';
      position: absolute;
      right: -8rem;
      bottom: -10rem;
      width: 34rem;
      height: 34rem;
      border: 1px solid rgba(184, 149, 90, 0.08);
      border-radius: 50%;
      box-shadow:
        inset 0 0 0 4rem rgba(184, 149, 90, 0.018),
        inset 0 0 0 8rem rgba(184, 149, 90, 0.012);
      pointer-events: none;
    }
    .heritage-inner {
      width: min(1180px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
      align-items: center;
      gap: clamp(2.5rem, 6vw, 6.5rem);
      position: relative;
      z-index: 1;
    }
    .heritage-inner > * {
      animation: content-rise 0.8s 0.2s ease-out both;
    }
    .heritage-inner > .heritage-copy {
      animation-delay: 0.4s;
    }
    .heritage-media {
      height: clamp(390px, 47vw, 590px);
      overflow: hidden;
      border-radius: 6px;
      background: #12100d;
      border: 1px solid rgba(184, 149, 90, 0.32);
      box-shadow: 0 24px 55px rgba(0, 0, 0, 0.48);
    }
    .heritage-media img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: 30% center;
      transition: transform 700ms ease;
    }
    .heritage-media:hover img {
      transform: scale(1.025);
    }
    .heritage-copy {
      max-width: 510px;
    }
    .heritage-copy h2 {
      margin: 0.55rem 0 1.2rem;
      color: #fff8ed;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2.25rem, 4.1vw, 3.65rem);
      font-weight: 700;
      line-height: 0.98;
    }
    .heritage-intro {
      margin: 0;
      max-width: 46ch;
      color: rgba(255, 248, 237, 0.76);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.04rem;
      line-height: 1.65;
    }
    .heritage-feature {
      display: grid;
      grid-template-columns: 58px 1fr;
      gap: 1.1rem;
      align-items: start;
      margin-top: 2rem;
      padding-top: 1.65rem;
      border-top: 1px solid rgba(184, 149, 90, 0.22);
    }
    .feature-icon {
      width: 54px;
      height: 54px;
      display: grid;
      place-items: center;
      color: #c49a52;
      border-radius: 50%;
      background: #11110f;
    }
    .feature-icon svg {
      width: 30px;
      height: 30px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.25;
      stroke-linejoin: round;
    }
    .heritage-feature h3 {
      margin: 0 0 0.3rem;
      color: #f8ead4;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.12rem;
    }
    .heritage-feature p {
      margin: 0;
      color: rgba(255, 248, 237, 0.7);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 0.95rem;
      line-height: 1.55;
    }
    @keyframes hero-reveal {
      from { opacity: 0; transform: scale(1.05); }
      to { opacity: 1; transform: scale(1.015); }
    }
    @keyframes content-rise {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 820px) {
      .hero {
        min-height: 520px;
      }
      .hero-video {
        object-position: 50% center;
      }
      .hero-shade {
        background: rgba(4, 4, 3, 0.48);
      }
      .heritage {
        padding: 3.25rem 1rem 4rem;
      }
      .heritage-inner {
        grid-template-columns: 1fr;
        gap: 2.25rem;
      }
      .heritage-media {
        height: min(76vw, 500px);
      }
      .heritage-copy {
        max-width: 620px;
      }
    }

    @media (max-width: 520px) {
      .hero {
        min-height: 470px;
      }
      .hero-content {
        padding: 3.1rem 0.25rem 2.8rem;
      }
      .hero-title {
        font-size: clamp(2.55rem, 13vw, 3.4rem);
      }
      .hero-subtitle {
        max-width: 30ch;
        font-size: 0.95rem;
      }
      .hero-cta {
        width: min(100%, 260px);
      }
      .heritage-media {
        height: 390px;
      }
      .heritage-copy h2 {
        font-size: 2.55rem;
      }
      .heritage-feature {
        grid-template-columns: 48px 1fr;
      }
      .feature-icon {
        width: 46px;
        height: 46px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-video,
      .hero-content > *,
      .heritage-inner > * {
        animation: none;
      }
      .hero-cta,
      .heritage-media img {
        transition: none;
      }
    }
  `]
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('heroVideo') private heroVideo?: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {
      // Browsers can still defer autoplay on slow first loads; the poster remains visible.
    });
  }
}
