class AddressBook extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.addresses = [];
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['addresses', 'selectable'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'addresses') {
            try {
                this.addresses = JSON.parse(newValue || '[]');
            } catch (e) {
                console.error('Failed to parse addresses attribute:', e);
                this.addresses = [];
            }
        }
        this.render();
    }

    render() {
        const selectable = this.hasAttribute('selectable');
        this.shadowRoot.innerHTML = `
            <style>
                h2 {
                    font-size: 1.2rem;
                    margin-top: 0;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .address-book-container {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                }
                .address-list {
                    display: grid;
                    gap: 15px;
                }
                .address-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .address-details p {
                    margin: 0;
                    font-size: 14px;
                }
                .address-details p strong {
                    font-weight: 600;
                }
                .actions button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: #007bff;
                    margin-left: 10px;
                }
                .add-new-btn {
                    margin-top: 20px;
                    padding: 10px 15px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .selection-input {
                    margin-right: 15px;
                }
            </style>
            <div class="address-book-container">
                <h2>Address Book</h2>
                <div class="address-list">
                    ${this.addresses.map((addr, index) => `
                        <div class="address-item">
                            ${selectable ? `<input type="radio" name="selected_address" class="selection-input" value="${addr.id}" ${addr.isPrimary ? 'checked' : ''}>` : ''}
                            <div class="address-details">
                                <p><strong>${addr.name}</strong></p>
                                <p>${addr.street}, ${addr.city}, ${addr.zip}</p>
                                <p>${addr.country}</p>
                            </div>
                            <div class="actions">
                                <button class="edit-btn" data-index="${index}">Edit</button>
                                <button class="delete-btn" data-index="${index}">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="add-new-btn">Add New Address</button>
            </div>
        `;

        this.shadowRoot.querySelector('.add-new-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-address'));
        });

        this.shadowRoot.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                this.dispatchEvent(new CustomEvent('edit-address', { detail: this.addresses[index] }));
            });
        });

        this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                this.dispatchEvent(new CustomEvent('delete-address', { detail: this.addresses[index] }));
            });
        });

        if (selectable) {
            this.shadowRoot.querySelectorAll('.selection-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    this.dispatchEvent(new CustomEvent('address-selected', { detail: { addressId: e.target.value } }));
                });
            });
        }
    }
}

customElements.define('address-book', AddressBook);
