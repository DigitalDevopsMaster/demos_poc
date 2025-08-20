/**
 * CategoryGallery Web Component
 * Container for category cards with responsive grid layout
 * 
 * Attributes:
 * - title: Gallery title (optional)
 * - columns: Number of columns for grid layout (default: auto-fit)
 * - gap: Gap between cards (default: 20px)
 * 
 * Events:
 * - gallery-category-clicked: Bubbled from category cards
 * - gallery-ready: Fired when gallery is initialized
 */

class CategoryGallery extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['title', 'columns', 'gap'];
  }

  // Getters for attributes
  get title() {
    return this.getAttribute('title') || '';
  }

  get columns() {
    return this.getAttribute('columns') || 'auto-fit';
  }

  get gap() {
    return this.getAttribute('gap') || '20px';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    // Dispatch ready event
    this.dispatchEvent(new CustomEvent('gallery-ready', {
      detail: { type: 'category-gallery' },
      bubbles: true
    }));
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  setupEventListeners() {
    // Listen for category clicks and bubble them up
    this.addEventListener('category-clicked', (event) => {
      this.dispatchEvent(new CustomEvent('gallery-category-clicked', {
        detail: event.detail,
        bubbles: true
      }));
    });
  }

  render() {
    const gridColumns = this.columns === 'auto-fit' 
      ? 'repeat(auto-fit, minmax(280px, 1fr))'
      : `repeat(${this.columns}, 1fr)`;

    this.shadowRoot.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
      }
      
      .category-gallery-container {
        padding: 20px;
      }
      
      .gallery-title {
        color: #0e2923;
        font-size: 28px;
        font-weight: 700;
        text-align: center;
        margin: 0 0 24px 0;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      
      .category-grid {
        display: grid;
        grid-template-columns: ${gridColumns};
        gap: ${this.gap};
        width: 100%;
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .category-gallery-container {
          padding: 16px;
        }
        
        .gallery-title {
          font-size: 24px;
          margin: 0 0 20px 0;
        }
        
        .category-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }
      }
      
      @media (max-width: 480px) {
        .category-gallery-container {
          padding: 12px;
        }
        
        .gallery-title {
          font-size: 20px;
          margin: 0 0 16px 0;
        }
        
        .category-grid {
          grid-template-columns: 1fr;
          gap: 12px;
        }
      }
    </style>
    
    <div class="category-gallery-container">
      ${this.title ? `<h2 class="gallery-title">${this.title}</h2>` : ''}
      <div class="category-grid">
        <slot></slot>
      </div>
    </div>
    `;
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('category-gallery')) {
  customElements.define('category-gallery', CategoryGallery);
}
