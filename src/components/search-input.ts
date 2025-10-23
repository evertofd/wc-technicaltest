import { config } from '../config/config';

export class SearchInput extends HTMLElement {
  private input!: HTMLInputElement;
  private button!: HTMLButtonElement;
  private controller?: AbortController;
  private isLoading: boolean = false;

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
        .search-container {
          display: flex;
          gap: 0.5rem;
          align-items: stretch;
          width: 100%;
          max-width: 600px;
        }

        input {
          border: 2px solid var(--color-accent-dark);
          border-radius: 0.25rem;
          padding: 0.5rem 0.75rem;
          flex: 1;
          min-width: 0;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        button {
          background: var(--color-accent-dark);
          color: var(--color-white);
          border: none;
          border-radius: 0.25rem;
          padding: 0.5rem 1.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        button:hover:not(:disabled) {
          background: var(--color-accent);
          transform: translateY(-1px);
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        button:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .search-container {
            flex-direction: column;
          }

          button {
            width: 100%;
          }
        }
      </style>
      <div class="search-container">
        <input
          type="text"
          placeholder="Escribe un nombre de usuario"
          aria-label="Nombre de usuario de GitHub"
        />
        <button
          type="button"
          aria-label="Buscar usuario"
        >
          🔍 Buscar
        </button>
      </div>
    `;
    this.input = this.shadowRoot!.querySelector('input')!;
    this.button = this.shadowRoot!.querySelector('button')!;
  }

  /**
   * Author: @EvertoFarias
   * Descripción:
   * - Click en botón: ejecuta búsqueda si hay texto y no está cargando
   * - Enter en input: ejecuta búsqueda si hay texto y no está cargando
   * Ambos validan que el input no esté vacío antes de hacer la petición.
   */
  addEvents() {
    this.button.addEventListener('click', () => {
      const userId = this.input.value.trim();
      if (!userId || this.isLoading) return;
      this.fetchUser(userId);
    });

    this.input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const userId = this.input.value.trim();
        if (!userId || this.isLoading) return;
        this.fetchUser(userId);
      }
    });
  }

  fetchUser(userId: string) {
    this.controller?.abort();
    this.controller = new AbortController();

    this.isLoading = true;
    this.updateButtonState();

    this.dispatchEvent(
      new CustomEvent('loading', { detail: true, bubbles: true })
    );

    fetch(`${config.apiBaseUrl}/profiles/${userId}`, { signal: this.controller.signal })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Usuario no encontrado');
          }
          throw new Error('Error al conectar con el servidor');
        }
        return res.json();
      })
      .then((detail) => {
        const userInfo = {
          login: detail.username,
          avatar_url: detail.avatar,
          name: detail.name,
          bio: detail.bio,
          public_repos: detail.publicRepos,
          html_url: detail.profileUrl
        };
        this.dispatchEvent(
          new CustomEvent('user-info', { detail: userInfo, bubbles: true })
        );
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;

        let errorMessage = err.message;
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo.';
        }

        this.dispatchEvent(
          new CustomEvent('error', { detail: errorMessage, bubbles: true })
        );
      })
      .finally(() => {
        this.isLoading = false;
        this.updateButtonState();
        this.dispatchEvent(
          new CustomEvent('loading', { detail: false, bubbles: true })
        );
      });
  }

  /**
   * Author: @EvertoFarias
   * Descripción: Actualiza el estado del botón de búsqueda.
   * - Deshabilita/habilita el botón según el estado de carga
   * - Cambia el texto entre "Buscar" y "Buscando..."
   */
  updateButtonState() {
    if (this.button) {
      this.button.disabled = this.isLoading;
      this.button.textContent = this.isLoading ? '⏳ Buscando...' : '🔍 Buscar';
      this.button.setAttribute('aria-busy', this.isLoading.toString());
    }
  }

}

customElements.define('search-input', SearchInput);
