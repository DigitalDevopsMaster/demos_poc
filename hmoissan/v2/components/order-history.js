/**
 * Order History Component
 * 
 * Displays a list of past orders for the user.
 * 
 * Attributes:
 * - orders: A JSON string representing an array of order objects.
 * 
 * Events:
 * - view-order-details: Fired when the user clicks to view details of a specific order.
 */
class OrderHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._orders = [];
  }

  static get observedAttributes() {
    return ['orders'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'orders' && newValue) {
      try {
        this._orders = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Failed to parse orders for OrderHistory:', e);
        this._orders = [];
      }
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Avenir', sans-serif;
        }
        .order-history-container {
          background-color: #fff;
          padding: 25px;
          border-radius: 8px;
        }
        h2 {
          font-size: 1.2rem;
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .order-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 20px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .order-item:last-child {
          border-bottom: none;
        }
        .order-details span {
          display: block;
        }
        .order-id { font-weight: 600; }
        .order-date, .order-status { color: #555; }
        .order-total { font-weight: bold; text-align: right; }
        .view-details-btn {
          background: #f4f4f4;
          border: 1px solid #ddd;
          color: #333;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          justify-self: end;
        }
        .no-orders {
          text-align: center;
          color: #777;
          padding: 40px 0;
        }
      </style>
      <div class="order-history-container">
        <h2>Order History</h2>
        ${this._orders.length > 0 ? this._orders.map(order => `
          <div class="order-item">
            <div class="order-details">
              <span class="order-id">Order #${order.id}</span>
              <span class="order-date">Date: ${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="order-status">
              <span>${order.status}</span>
            </div>
            <div class="order-total">$${order.total.toFixed(2)}</div>
            <button class="view-details-btn" data-order-id="${order.id}">View Details</button>
          </div>
        `).join('') : '<p class="no-orders">You have no past orders.</p>'}
      </div>
    `;

    this.shadowRoot.querySelectorAll('.view-details-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const orderId = e.target.dataset.orderId;
        const order = this._orders.find(o => o.id === orderId);
        this.dispatchEvent(new CustomEvent('view-order-details', {
          detail: { order }
        }));
      });
    });
  }
}

customElements.define('order-history', OrderHistory);
