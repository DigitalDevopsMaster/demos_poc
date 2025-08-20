/**
 * PromoGallery Web Component
 * Container component for displaying promotional cards - extends product-gallery concept
 * 
 * Attributes:
 * - title: Gallery title (optional)
 * - layout: "horizontal" (default) or "grid"
 * - gap: Gap between cards (default: 16px)
 * - show-title: "true"/"false" to show/hide title (default: true)
 * 
 * Slots:
 * - default: Promo cards to display
 * 
 * Events:
 * - promo-gallery-ready: Fired when gallery is initialized
 */

class PromoGallery extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['title', 'layout', 'gap', 'show-title'];
  }

  // Getters for attributes
  get title() {
    return this.getAttribute('title') || 'Special Offers';
  }

  get layout() {
    return this.getAttribute('layout') || 'horizontal';
  }

  get gap() {
    return this.getAttribute('gap') || '16px';
  }

  get showTitle() {
    return this.getAttribute('show-title') !== 'false';
  }

  // Called when component is added to DOM
  connectedCallback() {
    this.render();
    this.addEventListeners();
    
    // Dispatch ready event
    this.dispatchEvent(new CustomEvent('promo-gallery-ready', {
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
    // Listen for promo card clicks and bubble them up
    this.addEventListener('promo-clicked', this.handlePromoClick.bind(this));
    this.addEventListener('cta-clicked', this.handleCtaClick.bind(this));
  }

  // Handle promo card clicks
  handlePromoClick(event) {
    console.log('Promo clicked in gallery:', event.detail);
    
    // Re-dispatch with gallery context
    this.dispatchEvent(new CustomEvent('gallery-promo-clicked', {
      bubbles: true,
      composed: true,
      detail: {
        ...event.detail,
        gallery: this,
        galleryTitle: this.title
      }
    }));
  }

  // Handle CTA button clicks
  handleCtaClick(event) {
    console.log('CTA clicked in gallery:', event.detail);
    
    // Re-dispatch with gallery context
    this.dispatchEvent(new CustomEvent('gallery-cta-clicked', {
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
    container.className = 'promo-gallery-container';
    
    container.innerHTML = `
      ${this.showTitle ? `<h2 class="gallery-title">${this.title}</h2>` : ''}
      <div class="promo-grid ${this.layout}">
        <slot></slot>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        margin-bottom: 40px;
      }
      
      .promo-gallery-container {
        max-width: 1200px;
        margin: 0 auto;
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
      
      .promo-grid.horizontal {
        display: flex;
        gap: ${this.gap};
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 8px;
        -webkit-overflow-scrolling: touch;
      }
      
      .promo-grid.horizontal ::slotted(promo-card) {
        flex: 0 0 auto;
        width: 95%;
        scroll-snap-align: start;
      }
      
      .promo-grid.grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: ${this.gap};
      }
      
      /* Custom scrollbar for horizontal layout */
      .promo-grid.horizontal::-webkit-scrollbar {
        height: 6px;
      }
      
      .promo-grid.horizontal::-webkit-scrollbar-track {
        background: rgba(14,41,35,0.1);
        border-radius: 3px;
      }
      
      .promo-grid.horizontal::-webkit-scrollbar-thumb {
        background: rgba(14,41,35,0.3);
        border-radius: 3px;
      }
      
      .promo-grid.horizontal::-webkit-scrollbar-thumb:hover {
        background: rgba(14,41,35,0.5);
      }
      
      
    `;

    // Clear shadow root and append new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('promo-gallery')) {
  customElements.define('promo-gallery', PromoGallery);
}
