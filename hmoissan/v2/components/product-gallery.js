/**
 * ProductGallery Web Component
 * Container component for displaying a grid of product cards
 * 
 * Attributes:
 * - title: Gallery title (optional)
 * - columns: Number of columns for desktop (default: auto-fit)
 * - min-card-width: Minimum width for each card (default: 280px)
 * - gap: Gap between cards (default: 20px)
 * 
 * Slots:
 * - default: Product cards to display
 * 
 * Events:
 * - gallery-ready: Fired when gallery is initialized
 */

class ProductGallery extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['title', 'columns', 'min-card-width', 'gap'];
  }

  // Getters for attributes
  get title() {
    return this.getAttribute('title') || '';
  }

  get columns() {
    return this.getAttribute('columns') || 'auto-fit';
  }

  get minCardWidth() {
    return this.getAttribute('min-card-width') || '280px';
  }

  get gap() {
    return this.getAttribute('gap') || '20px';
  }

  // Called when component is added to DOM
  connectedCallback() {
    this.render();
    this.addEventListeners();
    
    // Dispatch ready event
    this.dispatchEvent(new CustomEvent('gallery-ready', {
      bubbles: true,
      composed: true,
      detail: { element: this }
    }));
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Add event listeners
  addEventListeners() {
    // Listen for product card clicks and bubble them up
    this.addEventListener('product-clicked', this.handleProductClick.bind(this));
  }

  // Handle product card clicks
  handleProductClick(event) {
    console.log('Product clicked in gallery:', event.detail);
    
    // Re-dispatch with gallery context
    this.dispatchEvent(new CustomEvent('gallery-product-clicked', {
      bubbles: true,
      composed: true,
      detail: {
        ...event.detail,
        gallery: this,
        galleryTitle: this.title
      }
    }));
  }

  render() {
    const container = document.createElement('div');
    container.className = 'gallery-container';
    
    container.innerHTML = `
      ${this.title ? `<h2 class="gallery-title">${this.title}</h2>` : ''}
      <div class="product-grid">
        <slot></slot>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }
      
      .gallery-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .gallery-title {
        color: #0e2923;
        font-size: 32px;
        font-weight: 700;
        text-align: center;
        margin: 0 0 30px 0;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      
      .product-grid {
        display: grid;
        grid-template-columns: repeat(${this.columns}, minmax(${this.minCardWidth}, 1fr));
        gap: ${this.gap};
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        .gallery-container {
          padding: 16px;
        }
        
        .gallery-title {
          font-size: 28px;
          margin: 0 0 24px 0;
        }
        
        .product-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
      }
      
      @media (max-width: 480px) {
        .gallery-container {
          padding: 12px;
        }
        
        .gallery-title {
          font-size: 24px;
          margin: 0 0 20px 0;
        }
        
        .product-grid {
          grid-template-columns: 1fr;
          gap: 12px;
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
if (!customElements.get('product-gallery')) {
  customElements.define('product-gallery', ProductGallery);
}
