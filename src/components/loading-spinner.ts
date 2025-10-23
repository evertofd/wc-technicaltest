export class LoadingSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback(): void {
    this.render();
  }

  render(): void {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          .loading {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            padding: 3rem;
          }

          .github-spinner {
            width: 64px;
            height: 64px;
            animation: pulse 2s ease-in-out infinite;
          }

          .loading-text {
            color: var(--color-light, #c9d1d9);
            font-size: 1rem;
            font-weight: 500;
            animation: fade 1.5s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(0.95);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }

          @keyframes fade {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
          }
        </style>
        <div class="loading">
          <svg class="github-spinner" viewBox="0 0 16 16" fill="currentColor" style="color: #58a6ff;">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <div class="loading-text">Buscando usuario...</div>
        </div>
      `;
    }
  }
}

customElements.define('loading-spinner', LoadingSpinner);
