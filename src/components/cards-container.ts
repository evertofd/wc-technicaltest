export class CardsContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: contents;
        }

        .container {
          display: contents;
        }
      </style>
      <div class="container">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('cards-container')) {
  customElements.define('cards-container', CardsContainer);
}
