class CartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['item-count', 'disabled', 'show-badge'];
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  // Get attribute values with defaults
  get itemCount() {
    return parseInt(this.getAttribute('item-count')) || 0;
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  get showBadge() {
    return this.hasAttribute('show-badge');
  }

  // Handle cart button click
  handleCartClick() {
    if (this.disabled) return;
    
    console.log(`Cart button clicked with ${this.itemCount} items, opening cart modal...`);
    
    // Find and open cart modal directly
    const cartModal = document.querySelector('cart-modal');
    if (cartModal) {
      cartModal.open();
    } else {
      console.warn('cart-modal not found in document');
    }
    
    // Still dispatch event for any custom handling
    this.dispatchEvent(new CustomEvent('cart-clicked', {
      bubbles: true,
      composed: true,
      detail: { 
        itemCount: this.itemCount,
        element: this
      }
    }));
  }

  // Update cart count (can be called externally)
  updateCount(count) {
    this.setAttribute('item-count', count);
  }

  render() {
    const container = document.createElement('div');
    container.className = 'cart-button-container';
    
    container.innerHTML = `
      <div class="cart-button" ${this.disabled ? 'disabled' : ''}>
        <div class="cart-icon-wrapper">
          <svg class="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${this.showBadge && this.itemCount > 0 ? `
            <span class="cart-badge">${this.itemCount > 99 ? '99+' : this.itemCount}</span>
          ` : ''}
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }
      
      .cart-button-container {
        position: relative;
      }
      
      .cart-button {
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .cart-button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }
      
      .cart-icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .cart-icon {
        color: white;
        width: 24px;
        height: 24px;
        transition: all 0.2s ease;
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
      }
      
      .cart-button:hover .cart-icon {
        opacity: 0.7;
      }
      
      .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff4757;
        color: white;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 700;
        border: 2px solid white;
      }
    `;

    // Clear shadow root and append new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  addEventListeners() {
    const cartButton = this.shadowRoot.querySelector('.cart-button');

    if (cartButton && !this.disabled) {
      // Handle click on cart button
      cartButton.addEventListener('click', () => this.handleCartClick());
      
      // Handle keyboard accessibility
      cartButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCartClick();
        }
      });
      
      // Make focusable for accessibility
      cartButton.setAttribute('tabindex', '0');
    }
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('cart-button')) {
  customElements.define('cart-button', CartButton);
}
