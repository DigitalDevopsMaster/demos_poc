class AddAddressModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.address = null;
    }

    static get observedAttributes() {
        return ['visible', 'address-data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'visible') {
            this.render();
        }
        if (name === 'address-data') {
            this.address = JSON.parse(newValue || 'null');
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const visible = this.hasAttribute('visible');
        this.shadowRoot.innerHTML = `
            <style>
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: ${visible ? 'flex' : 'none'};
                    align-items: center;
                    justify-content: center;
                    z-index: 1001;
                }
                .modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 500px;
                }
                .modal-content h2 {
                    margin-top: 0;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .modal-actions {
                    text-align: right;
                    margin-top: 20px;
                }
                .modal-actions button {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-left: 10px;
                }
                .save-btn {
                    background-color: #007bff;
                    color: white;
                }
            </style>
            <div class="modal-overlay">
                <div class="modal-content">
                    <h2>${this.address ? 'Edit Address' : 'Add New Address'}</h2>
                    <form id="address-form">
                        <input type="hidden" id="address-id" value="${this.address?.id || ''}">
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" required value="${this.address?.name || ''}">
                        </div>
                        <div class="form-group">
                            <label for="street">Street Address</label>
                            <input type="text" id="street" required value="${this.address?.street || ''}">
                        </div>
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" required value="${this.address?.city || ''}">
                        </div>
                        <div class="form-group">
                            <label for="zip">ZIP Code</label>
                            <input type="text" id="zip" required value="${this.address?.zip || ''}">
                        </div>
                        <div class="form-group">
                            <label for="country">Country</label>
                            <input type="text" id="country" required value="${this.address?.country || ''}">
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="cancel-btn">Cancel</button>
                            <button type="submit" class="save-btn">Save Address</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.cancel-btn').addEventListener('click', () => {
            this.removeAttribute('visible');
        });

        this.shadowRoot.querySelector('#address-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const addressData = {
                id: form.querySelector('#address-id').value || `addr_${Date.now()}`,
                name: form.querySelector('#name').value,
                street: form.querySelector('#street').value,
                city: form.querySelector('#city').value,
                zip: form.querySelector('#zip').value,
                country: form.querySelector('#country').value,
            };
            this.dispatchEvent(new CustomEvent('save-address', { detail: addressData }));
            this.removeAttribute('visible');
        });
    }
}

customElements.define('add-address-modal', AddAddressModal);
