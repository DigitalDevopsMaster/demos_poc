/**
 * Order Confirmation View Component
 * 
 * A full-screen view to confirm a successful order.
 * 
 * Attributes:
 * - visible: (Boolean) Controls the visibility of the view.
 * 
 * Events:
 * - continue-shopping: Fired when the user clicks the continue shopping button.
 */
class OrderConfirmationView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['visible'];
  }

  get visible() {
    return this.hasAttribute('visible');
  }

  set visible(value) {
    if (value) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  connectedCallback() {
    this.render();
    this.updateVisibility();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'visible') {
      this.updateVisibility();
    }
  }

  updateVisibility() {
    this.shadowRoot.querySelector('.confirmation-container').classList.toggle('visible', this.visible);
  }

  closeView() {
    this.visible = false;
    this.dispatchEvent(new CustomEvent('continue-shopping', { bubbles: true, composed: true }));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: 'Avenir', sans-serif;
        }
        .confirmation-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1200;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .confirmation-container.visible {
          opacity: 1;
          visibility: visible;
        }
        .confirmation-box {
          text-align: center;
          padding: 50px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transform: scale(0.95);
          transition: transform 0.4s ease;
        }
        .confirmation-container.visible .confirmation-box {
            transform: scale(1);
        }
        .icon {
          font-size: 4rem;
          color: #0e2923; /* Emerald */
        }
        h1 {
          font-size: 2rem;
          margin: 20px 0 10px;
          font-weight: 500;
        }
        p {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 30px;
        }
        .continue-btn {
          padding: 15px 30px;
          background: #1a3a3a;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        .continue-btn:hover {
          background: #0e2923;
        }
      </style>

      <div class="confirmation-container">
        <div class="confirmation-box">
          <div class="icon">&#10003;</div>
          <h1>Thank You!</h1>
          <p>Your order has been placed successfully.</p>
          <button class="continue-btn">Continue Shopping</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.continue-btn').addEventListener('click', () => this.closeView());
  }
}

customElements.define('order-confirmation-view', OrderConfirmationView);
