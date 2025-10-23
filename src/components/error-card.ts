import './app-card';

export class ErrorCard extends HTMLElement {
  private message: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set error(msg: string) {
    this.message = msg;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
        }

        .icon {
          font-size: 3rem;
          filter: drop-shadow(0 2px 8px rgba(248, 81, 73, 0.3));
        }

        .message {
          font-size: 0.95rem;
          color: var(--color-light, #c9d1d9);
          background: rgba(248, 81, 73, 0.15);
          padding: 1rem 1.5rem;
          border-radius: 8px;
          border: 1px solid rgba(248, 81, 73, 0.3);
          text-align: center;
          line-height: 1.5;
        }
      </style>

      <app-card title="Error">
        <div slot="content" class="content">
          <span class="icon">⚠️</span>
          <div class="message">${this.message || 'Ha ocurrido un error inesperado'}</div>
        </div>
      </app-card>
    `;
  }
}

if (!customElements.get('error-card')) {
  customElements.define('error-card', ErrorCard);
}