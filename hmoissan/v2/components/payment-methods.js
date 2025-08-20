/**
 * Payment Methods Component
 * 
 * Displays saved payment methods and an option to add new ones.
 */
class PaymentMethods extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._methods = [];
  }

  static get observedAttributes() {
    return ['methods', 'selectable'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'methods' && newValue) {
      this._methods = JSON.parse(newValue);
      this.render();
    }
  }

  getCardIcon(cardType) {
    const icons = {
      visa: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4a1564851678f83f056a0.svg',
      mastercard: 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg',
      amex: 'https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5ce1a96a6e4596337fedc9.svg',
      generic: 'https://www.gstatic.com/images/icons/material/system/2x/payment_googblue_48dp.png'
    };
    return icons[cardType] || icons.generic;
  }

  render() {
    const isSelectable = this.hasAttribute('selectable');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: 'Avenir', sans-serif; }
        .payment-methods-container { background-color: #fff; padding: 25px; border-radius: 8px; }
        h2 { font-size: 1.2rem; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        .payment-method-list { display: grid; gap: 15px; }
        .payment-method-item { display: flex; align-items: center; padding: 15px; background-color: #f9f9f9; border-radius: 4px; border: 1px solid #eee; }
        .payment-method-item input[type='radio'] { margin-right: 15px; }
        .payment-method-item img { height: 24px; margin-right: 15px; }
        .payment-method-details { flex-grow: 1; }
        .card-number { font-weight: 500; }
        .card-expiry { color: #777; font-size: 0.9rem; }
        .method-actions button { background: none; border: none; cursor: pointer; color: #007bff; font-size: 0.9rem; }
        .add-method-btn { width: 100%; padding: 15px; background: #f4f4f4; border: 1px solid #ddd; color: #333; border-radius: 4px; cursor: pointer; margin-top: 20px; text-align: center; }
        .add-method-btn:hover { background-color: #e9e9e9; }
      </style>
      <div class="payment-methods-container">
        <h2>Payment Method</h2>
        <div class="payment-method-list">
          ${this._methods.map(method => `
            <div class="payment-method-item">
              ${isSelectable ? `<input type="radio" name="paymentMethod" value="${method.id}" ${method.isPrimary ? 'checked' : ''}>` : ''}
              <img src="${this.getCardIcon(method.cardType)}" alt="${method.cardType}">
              <div class="payment-method-details">
                <span class="card-number">**** **** **** ${method.cardNumber.slice(-4)}</span>
                <div class="card-expiry">Expires ${method.expiryDate}</div>
              </div>
              <div class="method-actions">
                <button class="edit-btn" data-id="${method.id}">Edit</button>
                <button class="delete-btn" data-id="${method.id}">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="add-method-btn">+ Add New Payment Method</div>
      </div>
    `;

    this.shadowRoot.querySelector('.add-method-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('add-payment', { bubbles: true, composed: true }));
    });

    this.shadowRoot.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const methodId = e.target.dataset.id;
        const methodData = this._methods.find(m => m.id === methodId);
        this.dispatchEvent(new CustomEvent('edit-payment', { detail: methodData, bubbles: true, composed: true }));
      });
    });

    this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const methodId = e.target.dataset.id;
        this.dispatchEvent(new CustomEvent('delete-payment', { detail: { id: methodId }, bubbles: true, composed: true }));
      });
    });

    if (isSelectable) {
      this.shadowRoot.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.dispatchEvent(new CustomEvent('payment-selected', { detail: { paymentMethodId: e.target.value }, bubbles: true, composed: true }));
        });
      });
    }
  }
}

customElements.define('payment-methods', PaymentMethods);
