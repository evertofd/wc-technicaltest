import './app-card';
import './user-info';
import type { User } from '../types/types';

export class UserCard extends HTMLElement {
  user?: User | null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(user: User | undefined) {
    this.user = user;
    this.render();
  }

  render() {
    if (!this.shadowRoot || !this.user) {
      this.shadowRoot!.innerHTML = '';
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        .go-button {
          background: var(--color-accent-light);
          color: var(--color-white);
          padding: .5rem .5rem;
          border-radius: .8rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease;
        }
        .go-button:hover {
          background: var(--color-accent);
        }
      </style>
      <app-card title="Información de usuario">
        <user-info slot="content"></user-info>
        <button slot="action" class="go-button">Ir al perfil</button>
      </app-card>
    `;

    const userInfo = this.shadowRoot!.querySelector('user-info') as any;
    if (userInfo) {
      userInfo.data = this.user;
    }

    const button = this.shadowRoot!.querySelector('.go-button');
    if (button) {
      button.addEventListener('click', () => {
        if (this.user?.htmlUrl) {
          window.open(this.user.htmlUrl, '_blank');
        }
      });
    }
  }
}

customElements.define('user-card', UserCard);
