/**
 * CartModal Web Component
 * Specific modal for shopping cart functionality, extends BaseModal
 * 
 * Attributes:
 * - items-count: Number of items in cart
 * - total-amount: Total cart amount
 * 
 * Events:
 * - checkout-requested: Fired when user clicks checkout
 * - item-removed: Fired when user removes an item
 * - quantity-changed: Fired when user changes item quantity
 */
class CartModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.cartItems = [];
    this.render();
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['items-count', 'total-amount'];
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Get attribute values with defaults
  get itemsCount() {
    return parseInt(this.getAttribute('items-count')) || this.cartItems.length;
  }

  get totalAmount() {
    return parseFloat(this.getAttribute('total-amount')) || this.calculateTotal();
  }

  // Public methods
  open() {
    const baseModal = this.shadowRoot.querySelector('base-modal');
    baseModal.open();
  }

  close() {
    const baseModal = this.shadowRoot.querySelector('base-modal');
    baseModal.close();
  }

  clearCart() {
    this.cartItems = [];
    this.render();
    this.dispatchCartUpdate();
  }

  addItem(product) {
    const existingItem = this.cartItems.find(item => item.id === product.productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        this.cartItems.push({
            id: product.productId,
            name: product.title,
            price: parseFloat(product.price.replace(/[^0-9.-]+/g, "")), // Sanitize price
            quantity: 1,
            image: product.imageUrl || `https://via.placeholder.com/80x80/0e2923/ffffff?text=${product.title.charAt(0)}`
        });
    }
    this.render();
    this.dispatchCartUpdate();
  }

  // Calculate total from cart items
  calculateTotal() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Handle checkout
  dispatchCartUpdate() {
    const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.dispatchEvent(new CustomEvent('cart-updated', {
        bubbles: true,
        composed: true,
        detail: { 
            items: this.cartItems,
            itemCount: totalItems,
            total: this.calculateTotal()
        }
    }));
  }

  proceedToCheckout() {
    this.dispatchEvent(new CustomEvent('checkout-requested', {
      bubbles: true,
      detail: { 
        items: this.cartItems,
        total: this.totalAmount,
        itemsCount: this.itemsCount
      }
    }));
  }

  // Handle item removal
  removeItem(itemId) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.render();
    this.dispatchCartUpdate();
    
    this.dispatchEvent(new CustomEvent('item-removed', {
      bubbles: true,
      detail: { itemId: itemId, items: this.cartItems }
    }));
  }

  // Handle quantity change
  updateQuantity(itemId, newQuantity) {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
      this.render();
      this.dispatchCartUpdate();
      
      this.dispatchEvent(new CustomEvent('quantity-changed', {
        bubbles: true,
        detail: { itemId: itemId, quantity: newQuantity, items: this.cartItems }
      }));
    }
  }

  render() {
    // Load base modal component if not already loaded
    if (!customElements.get('base-modal')) {
      const script = document.createElement('script');
      script.src = 'components/base-modal.js';
      document.head.appendChild(script);
    }

    const total = this.calculateTotal();
    const itemsCount = this.cartItems.length;

    // Cart modal structure using base modal
    const cartContainer = document.createElement('div');
    cartContainer.innerHTML = `
      <base-modal 
        modal-id="cartModal" 
        title="Mi Carrito" 
        subtitle="${itemsCount} producto${itemsCount !== 1 ? 's' : ''} seleccionado${itemsCount !== 1 ? 's' : ''}"
        show-footer="true">
        
        <!-- Cart items -->
        <div class="cart-content">
          ${this.cartItems.length > 0 ? `
            <div class="cart-items">
              ${this.cartItems.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                  <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                  </div>
                  <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                      <button class="quantity-btn minus" data-action="decrease" data-item-id="${item.id}">-</button>
                      <span class="quantity">${item.quantity}</span>
                      <button class="quantity-btn plus" data-action="increase" data-item-id="${item.id}">+</button>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button class="remove-btn" data-item-id="${item.id}">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-cart">
              <i class="fas fa-shopping-cart empty-icon"></i>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos productos para comenzar</p>
            </div>
          `}
        </div>
        
        <!-- Footer with total and checkout -->
        <div slot="footer" class="cart-footer">
          ${this.cartItems.length > 0 ? `
            <div class="total-section">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">$${total.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span class="total-label">Envío:</span>
                <span class="total-value">Gratis</span>
              </div>
              <div class="total-row final-total">
                <span class="total-label">Total:</span>
                <span class="total-value">$${total.toFixed(2)}</span>
              </div>
            </div>
            <button class="checkout-btn" id="checkoutBtn">
              Proceder al Checkout
            </button>
          ` : `
            <button class="continue-shopping-btn" onclick="this.getRootNode().host.close()">
              Continuar Comprando
            </button>
          `}
        </div>
      </base-modal>
    `;

    // Styles specific to cart modal
    const style = document.createElement('style');
    style.textContent = `
      .cart-content {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .cart-items {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .cart-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 12px;
        background: #fafafa;
      }
      
      .item-image img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        object-fit: cover;
      }
      
      .item-details {
        flex: 1;
      }
      
      .item-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 5px 0;
      }
      
      .item-price {
        font-size: 18px;
        font-weight: 700;
        color: #0e2923;
        margin: 0 0 10px 0;
      }
      
      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .quantity-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #0e2923;
        background: white;
        color: #0e2923;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .quantity-btn:hover {
        background: #0e2923;
        color: white;
      }
      
      .quantity {
        font-weight: 600;
        min-width: 20px;
        text-align: center;
      }
      
      .item-actions {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .remove-btn {
        background: #ff4757;
        color: white;
        border: none;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      
      .remove-btn:hover {
        opacity: 0.8;
      }
      
      .empty-cart {
        text-align: center;
        padding: 40px 20px;
        color: #666;
      }
      
      .empty-icon {
        font-size: 48px;
        color: #ccc;
        margin-bottom: 20px;
      }
      
      .empty-cart h3 {
        margin: 0 0 10px 0;
        color: #333;
      }
      
      .cart-footer {
        background: white;
      }
      
      .total-section {
        margin-bottom: 20px;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .total-row.final-total {
        border-top: 2px solid #0e2923;
        padding-top: 10px;
        margin-top: 15px;
        font-weight: 700;
        font-size: 18px;
      }
      
      .total-label {
        color: #333;
      }
      
      .total-value {
        color: #0e2923;
        font-weight: 600;
      }
      
      .checkout-btn {
        width: 100%;
        background: #0e2923;
        color: white;
        border: none;
        padding: 15px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      
      .checkout-btn:hover {
        opacity: 0.9;
      }
      
      .continue-shopping-btn {
        width: 100%;
        background: transparent;
        color: #0e2923;
        border: 2px solid #0e2923;
        padding: 15px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .continue-shopping-btn:hover {
        background: #0e2923;
        color: white;
      }
    `;

    // Clear previous content and add new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(cartContainer);

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const checkoutBtn = this.shadowRoot.querySelector('#checkoutBtn');
    
    // Checkout button
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
    }

    // Quantity controls
    const quantityBtns = this.shadowRoot.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = parseInt(e.target.dataset.itemId);
        const action = e.target.dataset.action;
        const item = this.cartItems.find(item => item.id === itemId);
        
        if (item) {
          if (action === 'increase') {
            this.updateQuantity(itemId, item.quantity + 1);
          } else if (action === 'decrease' && item.quantity > 1) {
            this.updateQuantity(itemId, item.quantity - 1);
          }
        }
      });
    });

    // Remove buttons
    const removeBtns = this.shadowRoot.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = parseInt(e.target.dataset.itemId);
        this.removeItem(itemId);
      });
    });
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('cart-modal')) {
  customElements.define('cart-modal', CartModal);
}
