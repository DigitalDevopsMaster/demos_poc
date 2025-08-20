class OrderSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .summary-container {
          padding: 16px;
          background-color: #f9f9f9;
          border-bottom: 1px solid #eee;
        }
        h3 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #333;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .summary-item.total {
          font-weight: bold;
          font-size: 18px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #ddd;
        }
      </style>
      <div class="summary-container">
        <h3>Order Summary</h3>
        <div class="summary-item">
          <span>Subtotal</span>
          <span>$0.00</span>
        </div>
        <div class="summary-item">
          <span>Shipping</span>
          <span>$0.00</span>
        </div>
        <div class="summary-item total">
          <span>Total</span>
          <span>$0.00</span>
        </div>
      </div>
    `;
  }
}

customElements.define('order-summary', OrderSummary);
