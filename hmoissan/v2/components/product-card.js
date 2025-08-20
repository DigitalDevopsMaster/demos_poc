/**
 * ProductCard Web Component
 * Reusable card component for displaying jewelry products
 * 
 * Attributes:
 * - image-url: Background image URL for the product
 * - title: Product title/name
 * - subtitle: Product subtitle/collection
 * - best-seller: "true"/"false" to show best seller badge
 * - price: Product price (optional)
 * - product-id: Unique identifier for the product
 * 
 * Events:
 * - product-clicked: Fired when card is clicked
 */

class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['image-url', 'title', 'subtitle', 'best-seller', 'price', 'product-id'];
  }

  // Getters for attributes
  get imageUrl() {
    return this.getAttribute('image-url') || '';
  }

  get title() {
    return this.getAttribute('title') || 'Untitled Product';
  }

  get subtitle() {
    return this.getAttribute('subtitle') || '';
  }

  get isBestSeller() {
    return this.getAttribute('best-seller') === 'true';
  }

  get price() {
    return this.getAttribute('price') || '';
  }

  get productId() {
    return this.getAttribute('product-id') || '';
  }

  // Called when component is added to DOM
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Add event listeners
  addEventListeners() {
    const card = this.shadowRoot.querySelector('.product-card');
    if (card) {
      card.addEventListener('click', this.handleCardClick.bind(this));
      card.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  // Handle card click
  handleCardClick(event) {
    console.log(`Product card clicked: ${this.title} (ID: ${this.productId})`);
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('product-clicked', {
      bubbles: true,
      composed: true,
      detail: {
        productId: this.productId,
        title: this.title,
        subtitle: this.subtitle,
        imageUrl: this.imageUrl,
        price: this.price,
        isBestSeller: this.isBestSeller,
        element: this
      }
    }));
  }

  // Handle keyboard navigation
  handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleCardClick(event);
    }
  }

  render() {
    const container = document.createElement('div');
    container.className = 'product-card-container';
    
    container.innerHTML = `
      <div class="product-card" tabindex="0" role="button" aria-label="View ${this.title}">
        ${this.isBestSeller ? '<div class="best-seller-badge">Best Seller</div>' : ''}
        <div class="product-info">
          <h3 class="product-title">${this.title}</h3>
          <p class="product-subtitle">${this.subtitle}</p>
          ${this.price ? `<p class="product-price">${this.price}</p>` : ''}
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
      
      .product-card-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .product-card {
        position: relative;
        height: 320px;
        border-radius: 8px;
        overflow: hidden;
        background-image: url('${this.imageUrl}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        outline: none;
      }
      
      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      .product-card:focus {
        box-shadow: 0 0 0 3px rgba(14,41,35,0.3), 0 8px 25px rgba(0,0,0,0.15);
        transform: translateY(-2px);
      }
      
      .product-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(0,0,0,0.1) 0%,
          rgba(0,0,0,0.2) 50%,
          rgba(14,41,35,0.4) 100%
        );
        transition: all 0.3s ease;
      }
      
      .product-card:hover::before {
        background: linear-gradient(
          135deg,
          rgba(0,0,0,0.2) 0%,
          rgba(0,0,0,0.3) 50%,
          rgba(14,41,35,0.6) 100%
        );
      }
      
      .best-seller-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        background: linear-gradient(135deg, #ff6b7a, #ff4757);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        z-index: 3;
        box-shadow: 0 2px 8px rgba(255,71,87,0.3);
      }
      
      .product-info {
        position: absolute;
        bottom: 16px;
        right: 16px;
        text-align: right;
        z-index: 2;
      }
      
      .product-title {
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 4px 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        letter-spacing: 0.5px;
      }
      
      .product-subtitle {
        color: rgba(255,255,255,0.9);
        font-size: 14px;
        font-weight: 400;
        margin: 0 0 4px 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        letter-spacing: 0.3px;
      }
      
      .product-price {
        color: white;
        font-size: 16px;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        letter-spacing: 0.5px;
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        .product-card {
          height: 280px;
        }
        
        .product-title {
          font-size: 16px;
        }
        
        .product-subtitle {
          font-size: 13px;
        }
        
        .product-price {
          font-size: 14px;
        }
        
        .best-seller-badge {
          font-size: 9px;
          padding: 3px 6px;
        }
      }
      
      @media (max-width: 480px) {
        .product-card {
          height: 250px;
        }
        
        .product-title {
          font-size: 15px;
        }
        
        .product-subtitle {
          font-size: 12px;
        }
      }
    `;

    // Clear shadow root and append new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('product-card')) {
  customElements.define('product-card', ProductCard);
}
