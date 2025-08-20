/**
 * Add/Edit Payment Modal Component
 * 
 * A modal dialog for adding or editing a payment method (credit card).
 * 
 * Attributes:
 * - visible: (Boolean) Controls the visibility of the modal.
 * - payment-data: A JSON string of the payment method to be edited.
 * 
 * Events:
 * - save-payment: Fired when the user saves a new or edited payment method.
 * - view-closed: Fired when the modal is closed.
 */
class AddPaymentModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._paymentData = null;
  }

  static get observedAttributes() {
    return ['visible', 'payment-data'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'visible') {
      this.updateVisibility();
    } else if (name === 'payment-data') {
      this._paymentData = newValue ? JSON.parse(newValue) : null;
      this.render();
    }
  }

  updateVisibility() {
    this.shadowRoot.querySelector('.modal-container').classList.toggle('visible', this.hasAttribute('visible'));
  }

  close() {
    this.removeAttribute('visible');
    this.dispatchEvent(new CustomEvent('view-closed', { bubbles: true, composed: true }));
  }

  savePayment() {
    const form = this.shadowRoot.querySelector('form');
    if (form.checkValidity()) {
      const formData = new FormData(form);
      const paymentDetails = {
        id: this._paymentData?.id || `payment_${Date.now()}`,
        cardholderName: formData.get('cardholderName'),
        cardNumber: formData.get('cardNumber'),
        expiryDate: formData.get('expiryDate'),
        cvv: formData.get('cvv'),
        cardType: this.getCardType(formData.get('cardNumber')),
      };

      this.dispatchEvent(new CustomEvent('save-payment', {
        detail: paymentDetails,
        bubbles: true,
        composed: true
      }));
      this.close();
    } else {
      form.reportValidity();
    }
  }

  getCardType(cardNumber) {
    if (/^4/.test(cardNumber)) return 'visa';
    if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
    if (/^3[47]/.test(cardNumber)) return 'amex';
    return 'generic';
  }

  render() {
    const isEditing = !!this._paymentData;
    this.shadowRoot.innerHTML = `
      <style>
        .modal-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); justify-content: center; align-items: center; z-index: 1200; }
        .modal-container.visible { display: flex; }
        .modal-content { background: #fff; padding: 30px; border-radius: 8px; width: 90%; max-width: 500px; }
        h2 { margin-top: 0; }
        form { display: flex; flex-direction: column; gap: 15px; }
        input { padding: 12px; border: 1px solid #ccc; border-radius: 4px; }
        .form-row { display: flex; gap: 15px; }
        .form-row > div { flex: 1; }
        .button-group { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        button { padding: 10px 20px; border-radius: 4px; border: none; cursor: pointer; }
        .save-btn { background: #1a3a3a; color: white; }
        .cancel-btn { background: #eee; }
      </style>
      <div class="modal-container">
        <div class="modal-content">
          <h2>${isEditing ? 'Edit' : 'Add'} Payment Method</h2>
          <form>
            <input type="text" name="cardholderName" placeholder="Cardholder Name" value="${this._paymentData?.cardholderName || ''}" required>
            <input type="text" name="cardNumber" placeholder="Card Number" value="${this._paymentData?.cardNumber || ''}" required pattern="[0-9]{13,16}">
            <div class="form-row">
              <input type="text" name="expiryDate" placeholder="MM/YY" value="${this._paymentData?.expiryDate || ''}" required pattern="(0[1-9]|1[0-2])\/([0-9]{2})">
              <input type="text" name="cvv" placeholder="CVV" value="${this._paymentData?.cvv || ''}" required pattern="[0-9]{3,4}">
            </div>
            <div class="button-group">
              <button type="button" class="cancel-btn">Cancel</button>
              <button type="button" class="save-btn">Save</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.save-btn').addEventListener('click', () => this.savePayment());
    this.shadowRoot.querySelector('.cancel-btn').addEventListener('click', () => this.close());
  }
}

customElements.define('add-payment-modal', AddPaymentModal);
