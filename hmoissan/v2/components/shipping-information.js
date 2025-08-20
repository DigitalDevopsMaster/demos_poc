class ShippingInformation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .shipping-container {
          padding: 16px;
          border-bottom: 1px solid #eee;
        }
        h3 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #333;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .full-width {
          grid-column: 1 / -1;
        }
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          box-sizing: border-box;
        }
      </style>
      <div class="shipping-container">
        <h3>Shipping Information</h3>
        <div class="form-grid">
          <div class="full-width">
            <input type="text" placeholder="Full Name">
          </div>
          <div class="full-width">
            <input type="text" placeholder="Address">
          </div>
          <div>
            <input type="text" placeholder="City">
          </div>
          <div>
            <input type="text" placeholder="State / Province">
          </div>
          <div>
            <input type="text" placeholder="Postal Code">
          </div>
          <div>
            <input type="text" placeholder="Country">
          </div>
          <div class="full-width">
            <input type="tel" placeholder="Phone Number">
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('shipping-information', ShippingInformation);
