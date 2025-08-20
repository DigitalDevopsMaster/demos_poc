/**
 * Checkout View Component
 * 
 * A full-screen view for the checkout process, including shipping, payment, and order summary.
 * 
 * Attributes:
 * - visible: (Boolean) Controls the visibility of the view.
 * - cart-items: A JSON string of the items to be purchased.
 * 
 * Events:
 * - checkout-completed: Fired when the order is successfully placed.
 * - view-closed: Fired when the user closes the checkout view.
 */
class CheckoutView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._cartItems = [];
    this._addresses = [];
    this._selectedAddressId = null;
  }

  static get observedAttributes() {
    return ['visible', 'cart-items'];
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
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'visible') {
      this.updateVisibility();
    } else if (name === 'cart-items' && newValue) {
      try {
        this._cartItems = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Failed to parse cart items for checkout:', e);
        this._cartItems = [];
      }
    }
  }

  updateVisibility() {
    this.shadowRoot.querySelector('.checkout-container').classList.toggle('visible', this.visible);
  }

  closeView() {
    this.visible = false;
    this.dispatchEvent(new CustomEvent('view-closed', { bubbles: true, composed: true }));
  }

  placeOrder() {
    if (!this._selectedAddressId) {
        alert('Please select a shipping address.');
        return;
    }

    const selectedAddress = this._addresses.find(addr => addr.id === this._selectedAddressId);

    const orderDetails = {
        items: this._cartItems,
        total: this._cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        shippingInfo: selectedAddress
    };

    this.dispatchEvent(new CustomEvent('checkout-completed', {
        bubbles: true,
        composed: true,
        detail: orderDetails
    }));

    console.log('Order placed:', orderDetails);
    this.visible = false; // Hide after placing order
  }

  render() {
    const subtotal = this._cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal; // Assuming free shipping for now

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: 'Avenir', sans-serif;
        }
        .checkout-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f4f4f4;
          z-index: 1100;
          transform: translateX(100%);
          transition: transform 0.4s ease-in-out;
          overflow-y: auto;
        }
        .checkout-container.visible {
          transform: translateX(0);
        }
        .checkout-header {
          display: flex;
          align-items: center;
          padding: 20px;
          background: #fff;
          border-bottom: 1px solid #e0e0e0;
        }
        .back-button {
          background: none; border: none; font-size: 1.5rem; cursor: pointer;
        }
        .checkout-header h1 {
          font-size: 1.5rem; margin: 0; padding-left: 20px; font-weight: 500;
        }
        .checkout-content {
          display: flex; 
          flex-direction: column;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .form-section, .summary-section {
          background: #fff; padding: 25px; border-radius: 8px; margin-bottom: 20px;
        }
        h2 { font-size: 1.2rem; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        .order-summary .summary-item { display: flex; margin-bottom: 15px; }
        .summary-item img { width: 60px; height: 60px; border-radius: 4px; margin-right: 15px; }
        .summary-item-details { flex-grow: 1; }
        .summary-item-details h4 { margin: 0 0 5px; font-size: 1rem; }
        .summary-item-details p { margin: 0; color: #777; }
        .summary-item-price { font-weight: 600; }
        .totals-grid { display: grid; grid-template-columns: 1fr auto; gap: 10px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px; }
        .totals-grid .total { font-weight: bold; font-size: 1.2rem; }
        .place-order-btn { 
          width: 100%; padding: 18px; background: #1a3a3a; color: #fff; border: none; 
          border-radius: 4px; font-size: 1.1rem; cursor: pointer; margin-top: 20px;
        }
      </style>

      <div class="checkout-container">
        <div class="checkout-header">
          <button class="back-button">&larr;</button>
          <h1>Checkout</h1>
        </div>
        <div class="checkout-content">
          <div class="form-section">
            <h2>Shipping Information</h2>
            <address-book id="addressBook" selectable></address-book>
          </div>

          <div class="summary-section">
            <h2>Order Summary</h2>
            <div class="order-summary">
              ${this._cartItems.map(item => `
                <div class="summary-item">
                  <img src="${item.image}" alt="${item.name}">
                  <div class="summary-item-details">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                  </div>
                  <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
            <div class="totals-grid">
              <span>Subtotal</span>
              <span>$${subtotal.toFixed(2)}</span>
              <span>Shipping</span>
              <span>FREE</span>
              <span class="total">Total</span>
              <span class="total">$${total.toFixed(2)}</span>
            </div>
          </div>
          <button class="place-order-btn">Place Order</button>
        </div>
      </div>
      <add-address-modal id="addAddressModal"></add-address-modal>
    `;

    this.shadowRoot.querySelector('.back-button').addEventListener('click', () => this.closeView());
    this.shadowRoot.querySelector('.place-order-btn').addEventListener('click', () => this.placeOrder());

    this.setupAddressBook();
  }

  setupAddressBook() {
    const addressBook = this.shadowRoot.getElementById('addressBook');
    const addAddressModal = this.shadowRoot.getElementById('addAddressModal');

    // Mock data for addresses
    this._addresses = [
        {
            id: 'addr_1',
            name: 'John Doe',
            street: '123 Main St',
            city: 'Anytown',
            zip: '12345',
            country: 'USA',
            isPrimary: true
        },
        {
            id: 'addr_2',
            name: 'Jane Smith',
            street: '456 Oak Ave',
            city: 'Someville',
            zip: '67890',
            country: 'USA',
            isPrimary: false
        }
    ];

    const updateAddressBook = () => {
        addressBook.setAttribute('addresses', JSON.stringify(this._addresses));
    }

    updateAddressBook();

    addressBook.addEventListener('add-address', () => {
        addAddressModal.removeAttribute('address-data');
        addAddressModal.setAttribute('visible', 'true');
    });

    addressBook.addEventListener('edit-address', (e) => {
        addAddressModal.setAttribute('address-data', JSON.stringify(e.detail));
        addAddressModal.setAttribute('visible', 'true');
    });

    addressBook.addEventListener('delete-address', (e) => {
        if (confirm('Are you sure you want to delete this address?')) {
            this._addresses = this._addresses.filter(addr => addr.id !== e.detail.id);
            updateAddressBook();
        }
    });

    addressBook.addEventListener('address-selected', (e) => {
        this._selectedAddressId = e.detail.addressId;
    });

    addAddressModal.addEventListener('save-address', (e) => {
        const savedAddress = e.detail;
        const existingIndex = this._addresses.findIndex(addr => addr.id === savedAddress.id);

        if (existingIndex > -1) {
            this._addresses[existingIndex] = savedAddress;
        } else {
            this._addresses.push(savedAddress);
        }
        updateAddressBook();
    });

    // Pre-select the primary address
    const primaryAddress = this._addresses.find(a => a.isPrimary);
    if (primaryAddress) {
        this._selectedAddressId = primaryAddress.id;
    }
  }
}

customElements.define('checkout-view', CheckoutView);
