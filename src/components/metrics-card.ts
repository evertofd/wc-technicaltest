import './app-card';
import { config } from '../config/config';
import type { MetricsResponse, UserMetrics } from '../types/types';

export class MetricsCard extends HTMLElement {
  private state: 'idle' | 'loading' | 'error' | 'success' = 'idle';
  private metrics?: UserMetrics | null;
  private errorMessage: string = '';
  private username: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set user(username: string) {
    this.username = username;
    this.fetchMetrics();
  }

  connectedCallback() {
    this.render();
  }

  /**
   * Author: @EvertoFarias
   * Descripción: Obtiene las métricas de GitHub del usuario desde el backend.
   * Consume el endpoint /metrics/:username y maneja tres estados:
   * - loading: mientras se hace la petición
   * - success: cuando se obtienen las métricas correctamente
   * - error: cuando falla la petición o el usuario no existe
   * Actualiza el componente re-renderizando en cada cambio de estado.
   */
  async fetchMetrics() {
    if (!this.username) return;

    this.state = 'loading';
    this.render();

    try {
      const response = await fetch(`${config.apiBaseUrl}/metrics/${this.username}`);

      if (!response.ok) {
        throw new Error('No se pudieron obtener las métricas');
      }

      const data: MetricsResponse = await response.json();
      this.metrics = data.metrics;
      this.state = 'success';
    } catch (error) {
      this.state = 'error';
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    } finally {
      this.render();
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .metrics-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          width: 100%;
        }

        @media (max-width: 768px) {
          :host {
            margin-top: 50px;
          }
        }

        @media (max-width: 480px) {
          .metrics-content {
            padding: 1rem;
            gap: 0.75rem;
          }

          .metric-item {
            padding: 0.75rem;
          }

          .metric-icon {
            font-size: 1.5rem;
            min-width: 2rem;
          }

          .metric-value {
            font-size: 1.25rem;
          }
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(88, 166, 255, 0.08);
          border-radius: 8px;
          border: 1px solid rgba(88, 166, 255, 0.2);
          transition: all 0.2s ease;
        }

        .metric-item:hover {
          background: rgba(88, 166, 255, 0.12);
          border-color: rgba(88, 166, 255, 0.3);
          transform: translateX(4px);
        }

        .metric-item.stars {
          border-left: 3px solid var(--color-warning, #d29922);
        }

        .metric-item.ratio {
          border-left: 3px solid var(--color-success, #3fb950);
        }

        .metric-item.activity {
          border-left: 3px solid var(--color-purple, #bc8cff);
        }

        .metric-icon {
          font-size: 1.75rem;
          min-width: 2.5rem;
          text-align: center;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .metric-info {
          flex: 1;
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--color-light, #c9d1d9);
          opacity: 0.7;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-white, #ffffff);
          margin-top: 0.25rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .loading-text {
          text-align: center;
          color: var(--color-light);
          padding: 2rem;
        }

        .error-text {
          text-align: center;
          color: #ef4444;
          padding: 1rem;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          color: var(--color-light);
          opacity: 0.7;
          font-style: italic;
          padding: 1rem;
        }
      </style>
      ${this.renderContent()}
    `;
  }

  renderContent() {
    if (this.state === 'loading') {
      return `
        <app-card title="📊 Métricas">
          <div slot="content" class="loading-text">
            Cargando métricas...
          </div>
        </app-card>
      `;
    }

    if (this.state === 'error') {
      return `
        <app-card title="📊 Métricas">
          <div slot="content" class="error-text">
            ⚠️ ${this.errorMessage}
          </div>
        </app-card>
      `;
    }

    if (this.state === 'success' && this.metrics) {
      return `
        <app-card title="📊 Métricas">
          <div slot="content" class="metrics-content">
            ${this.renderMetricItem('⭐', 'Total Estrellas', this.formatNumber(this.metrics.totalStars), 'stars')}
            ${this.renderMetricItem('📈', 'Ratio Followers/Repos', this.metrics.followersToReposRatio.toFixed(2), 'ratio')}
            ${this.renderMetricItem('📅', 'Último Push', this.formatLastPush(this.metrics.lastPushDaysAgo), 'activity')}
          </div>
        </app-card>
      `;
    }

    return '';
  }
  /**
   * Author: @evertoFarias
   * Descripción: Genera el HTML para un item de métrica individual.
   * Recibe el ícono, etiqueta, valor y una clase CSS opcional
   * cada métrica con colores diferentes posee un color diferente.
   */
  renderMetricItem(icon: string, label: string, value: string, className: string = '') {
    return `
      <div class="metric-item ${className}">
        <span class="metric-icon">${icon}</span>
        <div class="metric-info">
          <div class="metric-label">${label}</div>
          <div class="metric-value">${value}</div>
        </div>
      </div>
    `;
  }

  /**
   * Author: @EvertoFarias
   * Descripción: Formatea números grandes con separador de miles.
   */
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }
  
  /**
   * Author: @EvertoFarias
   * Descripción: Formatea los días desde el último push.
   * Maneja casos especiales: null (sin actividad), 0 (hoy), 1 (ayer),
   * y múltiples días mostrando "Hace X días".
   */
  formatLastPush(days: number | null): string {
    if (days === null) {
      return 'Sin actividad';
    }

    if (days === 0) {
      return 'Hoy';
    }

    if (days === 1) {
      return 'Ayer';
    }

    return `Hace ${days} días`;
  }
}

customElements.define('metrics-card', MetricsCard);
