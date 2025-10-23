import './cards-container';
import './user-card';
import './error-card';
import './loading-spinner';
import './metrics-card';
import { SearchInput } from './search-input';
import { UserAdapter } from '../adapters/userAdapter';
import type { ErrorCard } from './error-card';
import type { UserCard } from './user-card';
import type { MetricsCard } from './metrics-card';

export class DashboardView extends HTMLElement {
  private state: 'idle' | 'loading' | 'error' | 'success' = 'idle';
  private payload: any = null;
  private username: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEvents();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 100vw;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 1000px;
          align-items: stretch;
        }

        .cards-grid > * {
          height: 100%;
          animation: fadeIn 0.4s ease-out;
          min-width: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .content {
            padding: 1rem;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 0;
          }
        }

        @media (max-width: 480px) {
          .content {
            padding: 0.5rem;
          }

          .cards-grid {
            gap: 1.25rem;
          }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 4rem 2rem;
          text-align: center;
          animation: fadeIn 0.6s ease-out;
        }

        .github-logo {
          width: 120px;
          height: 120px;
          color: var(--color-accent, #58a6ff);
          opacity: 0.8;
          animation: float 3s ease-in-out infinite;
        }

        .empty-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-light, #c9d1d9);
          margin: 0;
        }

        .empty-subtitle {
          font-size: 1rem;
          color: var(--color-light, #c9d1d9);
          opacity: 0.7;
          max-width: 400px;
          line-height: 1.6;
          margin: 0;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .empty-state {
            padding: 3rem 1.5rem;
          }

          .github-logo {
            width: 100px;
            height: 100px;
          }

          .empty-title {
            font-size: 1.5rem;
          }

          .empty-subtitle {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .empty-state {
            padding: 2rem 1rem;
            gap: 1rem;
          }

          .github-logo {
            width: 80px;
            height: 80px;
          }

          .empty-title {
            font-size: 1.25rem;
          }

          .empty-subtitle {
            font-size: 0.9rem;
          }
        }
      </style>
      <div class="content">
        <search-input id="finder"></search-input>
        <cards-container id="cardsContainer"></cards-container>
      </div>
    `;

    this.updateUI();
  }

  updateUI() {
    const container = this.shadowRoot!.querySelector('#cardsContainer')!;
    container.innerHTML = '';
    /**
     * Author: @EvertoFarias
     * Descripción: Cuando no se ha realizado ninguna búsqueda
     * Muestra el logo de GitHub y un mensaje invitando
     * al usuario a realizar una busqueda. 
     */
    if (this.state === 'idle') {
      container.innerHTML = `
        <div class="empty-state">
          <svg class="github-logo" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <h2 class="empty-title">¡Busca a tu usuario favorito!</h2>
          <p class="empty-subtitle">Escribe un nombre de usuario de GitHub y presiona Enter o haz clic en Buscar</p>
        </div>
      `;
    }

    if (this.state === 'loading') {
      container.innerHTML = `<loading-spinner></loading-spinner>`;
    }

    if (this.state === 'error') {
      const errorCard = document.createElement('error-card') as ErrorCard;
      errorCard.error = this.payload;
      container.appendChild(errorCard);
    }

    /**
     * Author: @EvertoFarias
     * Descripción: Cuando se obtienen los datos del usuario.
     * 1. user-card: muestra información básica del usuario (avatar, nombre, bio, repos)
     * 2. metrics-card: muestra las métricas calculadas (estrellas, ratio, último push)
     * Ambas tarjetas se muestran lado a lado en desktop y apiladas en mobile.
     */
    if (this.state === 'success') {
      const gridContainer = document.createElement('div');
      gridContainer.className = 'cards-grid';

      const userCard = document.createElement('user-card') as UserCard;
      userCard.data = this.payload;
      gridContainer.appendChild(userCard);

      const metricsCard = document.createElement('metrics-card') as MetricsCard;
      metricsCard.user = this.username;
      gridContainer.appendChild(metricsCard);

      container.appendChild(gridContainer);
    }
  }

  addEvents() {
    const finder = this.shadowRoot!.querySelector<SearchInput>('#finder');
    if (!finder) return;

    finder.addEventListener('loading', (event: Event) => {
      if (event instanceof CustomEvent) {
        if (event.detail === true) {
          this.state = 'loading';
          this.payload = null;
          this.updateUI();
        }
      }
    });

    finder.addEventListener('error', (event: Event) => {
      if (event instanceof CustomEvent) {
        this.state = 'error';
        this.payload = event.detail;
        this.updateUI();
      }
    });

    finder.addEventListener('user-info', (event: Event) => {
      if (event instanceof CustomEvent) {
        this.state = 'success';
        this.payload = UserAdapter.convert(event.detail);
        this.username = event.detail.login || event.detail.username || '';
        this.updateUI();
      }
    });
  }
}

if (!customElements.get('dashboard-view')) {
  customElements.define('dashboard-view', DashboardView);
}
