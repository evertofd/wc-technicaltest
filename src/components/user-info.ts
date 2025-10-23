import type { User } from '../types/types';

export class UserInfo extends HTMLElement {
  user?: User;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(user: User) {
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
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          color: var(--color-light);
          text-align: center;
        }

        .picture {
          width: var(--user-image-size, 5rem);
          height: var(--user-image-size, 5rem);
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.6),
                      0 0 0 2px var(--color-accent-light);
        }

        .name {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--color-white);
        }

        .bio {
          font-size: 0.9rem;
          color: var(--color-light);
          opacity: 0.9;
          line-height: 1.4;
        }

        .repos {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--color-white);
          background: var(--color-accent-light);
          padding: .3rem .5rem;
          margin: .5rem;
          border-radius: 0.5rem;
        }
      </style>

      <div class="user-info">
        <img class="picture" src="${this.user.avatarUrl}" alt="${this.user.name || ''}">
        ${this.user.name ? `<span class="name">${this.user.name}</span>` : ''}
        ${this.user.bio ? `<div class="bio">${this.user.bio}</div>` : ''}
        ${this.user.publicRepos ? `<span class="repos">Repos: ${this.user.publicRepos}</span>` : ''}
      </div>
    `;
  }
}

if (!customElements.get('user-info')) {
  customElements.define('user-info', UserInfo);
}
