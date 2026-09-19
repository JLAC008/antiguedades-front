import { Component, OnInit, signal } from '@angular/core';
import { AntiqueCardComponent } from '../../components/antique-card/antique-card.component';
import { AntiquesService } from '../../core/antiques.service';
import { Antique } from '../../models';

@Component({
  selector: 'app-reserved',
  standalone: true,
  imports: [AntiqueCardComponent],
  template: `
    <main class="page-collection reserved-page">
      <section class="reserved-hero">
        <div class="reserved-hero-inner">
          <p class="reserved-kicker">Gestión privada</p>
          <h1>Obras reservadas</h1>
          <div class="reserved-flourish" aria-hidden="true">&#10087;</div>
          <p>Consulta las piezas que actualmente tienen el estado reservado.</p>
        </div>
      </section>

      <section class="reserved-content">
        <div class="reserved-heading">
          <div>
            <p class="reserved-label">Estado de las piezas</p>
            <h2>Listado de reservas</h2>
          </div>
          @if (!loading() && !error()) {
            <span class="reserved-count">{{ reservedAntiques().length }} pieza{{ reservedAntiques().length !== 1 ? 's' : '' }}</span>
          }
        </div>

        @if (loading()) {
          <div class="reserved-grid" aria-label="Cargando obras reservadas">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="reserved-skeleton"></div>
            }
          </div>
        } @else if (error()) {
          <div class="reserved-empty">
            <span class="reserved-empty-icon" aria-hidden="true">!</span>
            <p>{{ error() }}</p>
          </div>
        } @else if (reservedAntiques().length === 0) {
          <div class="reserved-empty">
            <span class="reserved-empty-icon" aria-hidden="true">⌕</span>
            <p>No hay obras con estado reservado.</p>
          </div>
        } @else {
          <div class="reserved-grid">
            @for (antique of reservedAntiques(); track antique.id) {
              <app-antique-card [antique]="antique" />
            }
          </div>
        }
      </section>
    </main>
  `,
  styles: [`
    .reserved-page {
      min-height: 100vh;
      color: #f7efe3;
      background:
        radial-gradient(circle at 50% 10rem, rgba(164, 117, 48, 0.09), transparent 32rem),
        #090a09;
    }

    .reserved-hero {
      border-bottom: 1px solid rgba(184, 149, 90, 0.28);
      background:
        linear-gradient(90deg, rgba(0, 0, 0, 0.12), rgba(5, 5, 4, 0.7), rgba(0, 0, 0, 0.12)),
        url('/assets/home-hero-study-v2.png') center 43% / cover;
    }

    .reserved-hero-inner {
      width: min(1180px, calc(100% - 2rem));
      min-height: 265px;
      margin: 0 auto;
      display: grid;
      place-content: center;
      text-align: center;
      padding: 3.25rem 1rem 2.8rem;
    }

    .reserved-kicker,
    .reserved-label {
      margin: 0;
      color: #d2ad68;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
    }

    .reserved-hero h1 {
      margin: 0.75rem 0 0;
      color: #fff8ed;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2.3rem, 5vw, 4rem);
      line-height: 1;
    }

    .reserved-flourish {
      margin: 0.8rem 0 0.65rem;
      color: #b8955a;
      font-size: 0.7rem;
    }

    .reserved-hero p:last-child {
      max-width: 42rem;
      margin: 0 auto;
      color: rgba(255, 248, 237, 0.74);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1rem;
      line-height: 1.55;
    }

    .reserved-content {
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 3rem 0 5rem;
    }

    .reserved-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(184, 149, 90, 0.24);
    }

    .reserved-heading h2 {
      margin: 0.35rem 0 0;
      color: #fff8ed;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(1.65rem, 3vw, 2.35rem);
      line-height: 1.1;
    }

    .reserved-count {
      flex: 0 0 auto;
      color: rgba(255, 248, 237, 0.62);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 0.95rem;
    }

    .reserved-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.95rem;
    }

    .reserved-skeleton {
      height: 390px;
      border: 1px solid rgba(184, 149, 90, 0.22);
      background: linear-gradient(90deg, #111 25%, #1d1b18 50%, #111 75%);
      background-size: 200% 100%;
      animation: reserved-shimmer 1.5s infinite;
    }

    .reserved-empty {
      padding: 4rem 1rem;
      color: rgba(247, 239, 227, 0.62);
      text-align: center;
    }

    .reserved-empty-icon {
      display: block;
      margin-bottom: 1rem;
      color: #d4ac62;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 3.5rem;
    }

    .reserved-empty p {
      margin: 0;
    }

    @keyframes reserved-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 900px) {
      .reserved-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 620px) {
      .reserved-hero-inner {
        min-height: 230px;
        padding: 2.8rem 0.5rem 2.35rem;
      }

      .reserved-content {
        padding-top: 2.35rem;
      }

      .reserved-heading {
        align-items: start;
        flex-direction: column;
      }

      .reserved-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReservedComponent implements OnInit {
  reservedAntiques = signal<Antique[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(private antiquesService: AntiquesService) {}

  async ngOnInit() {
    try {
      this.reservedAntiques.set(await this.antiquesService.getAll(undefined, undefined, undefined, undefined, undefined, 'reservado'));
    } catch {
      this.error.set('No se han podido cargar las obras reservadas.');
    } finally {
      this.loading.set(false);
    }
  }
}
