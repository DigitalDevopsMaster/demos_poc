/**
 * Payment Methods Component
 * 
 * Displays saved payment methods and an option to add new ones.
 */
class PaymentMethods extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
        .payment-methods-container {
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
        .payment-method-list {
          display: grid;
          gap: 15px;
        }
        .payment-method-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 4px;
          border: 1px solid #eee;
        }
        .payment-method-item img {
          height: 24px;
          margin-right: 15px;
        }
        .payment-method-details {
          flex-grow: 1;
        }
        .add-method-btn {
          width: 100%;
          padding: 15px;
          background: #f4f4f4;
          border: 1px solid #ddd;
          color: #333;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
          text-align: center;
        }
        .add-method-btn:hover {
          background-color: #e9e9e9;
        }
      </style>
      <div class="payment-methods-container">
        <h2>Payment Methods</h2>
        <div class="payment-method-list">
          <!-- Mock Payment Methods -->
          <div class="payment-method-item">
            <img src="https://www.gstatic.com/images/icons/material/system/2x/payment_googblue_48dp.png" alt="Google Pay">
            <span class="payment-method-details">Google Pay</span>
            <button>Remove</button>
          </div>
          <div class="payment-method-item">
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_266x142.png" alt="PayPal">
            <span class="payment-method-details">PayPal</span>
            <button>Remove</button>
          </div>
           <div class="payment-method-item">
            <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4a1564851678f83f056a0.svg" alt="Stripe">
            <span class="payment-method-details">**** 4242</span>
            <button>Remove</button>
          </div>
        </div>
        <div class="add-method-btn">
          + Add New Payment Method
        </div>
      </div>
    `;
  }
}

customElements.define('payment-methods', PaymentMethods);
