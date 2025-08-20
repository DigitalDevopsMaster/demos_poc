class PaymentInformation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .payment-container {
          padding: 16px;
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
        .pay-button {
            display: block;
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #0e2923 0%, #1a3d36 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            margin-top: 16px;
        }
      </style>
      <div class="payment-container">
        <h3>Payment Information</h3>
        <div class="form-grid">
          <div class="full-width">
            <input type="text" placeholder="Card Number">
          </div>
          <div>
            <input type="text" placeholder="MM / YY">
          </div>
          <div>
            <input type="text" placeholder="CVV">
          </div>
        </div>
        <button class="pay-button">Pay Now</button>
      </div>
    `;
  }
}

customElements.define('payment-information', PaymentInformation);
