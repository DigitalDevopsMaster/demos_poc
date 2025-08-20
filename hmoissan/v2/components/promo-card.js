/**
 * PromoCard Web Component
 * Reusable promotional card component - extends product-card concept with promo-specific features
 * 
 * Attributes:
 * - image-url: Background image URL for the promotion
 * - title: Promotion title/name
 * - subtitle: Promotion subtitle/description
 * - discount: Discount percentage (e.g., "30%", "50%")
 * - discount-text: Custom discount text (e.g., "FLASH SALE", "LIMITED TIME")
 * - cta-text: Call-to-action button text (default: "Shop Now")
 * - promo-id: Unique identifier for the promotion
 * - expires: Expiration date/time (optional)
 * - featured: "true"/"false" for featured styling
 * 
 * Events:
 * - promo-clicked: Fired when card is clicked
 * - cta-clicked: Fired when CTA button is clicked
 */

class PromoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['image-url', 'title', 'subtitle', 'discount', 'discount-text', 'cta-text', 'promo-id', 'expires', 'featured'];
  }

  // Getters for attributes
  get imageUrl() {
    return this.getAttribute('image-url') || '';
  }

  get title() {
    return this.getAttribute('title') || 'Special Offer';
  }

  get subtitle() {
    return this.getAttribute('subtitle') || '';
  }

  get discount() {
    return this.getAttribute('discount') || '';
  }

  get discountText() {
    return this.getAttribute('discount-text') || 'SALE';
  }

  get ctaText() {
    return this.getAttribute('cta-text') || 'Shop Now';
  }

  get promoId() {
    return this.getAttribute('promo-id') || '';
  }

  get expires() {
    return this.getAttribute('expires') || '';
  }

  get isFeatured() {
    return this.getAttribute('featured') === 'true';
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
    const card = this.shadowRoot.querySelector('.promo-card');
    const ctaButton = this.shadowRoot.querySelector('.cta-button');
    
    if (card) {
      card.addEventListener('click', this.handleCardClick.bind(this));
      card.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    if (ctaButton) {
      ctaButton.addEventListener('click', this.handleCtaClick.bind(this));
    }
  }

  // Handle card click
  handleCardClick(event) {
    // Don't trigger if CTA button was clicked
    if (event.target.closest('.cta-button')) return;
    
    console.log(`Promo card clicked: ${this.title} (ID: ${this.promoId})`);
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('promo-clicked', {
      bubbles: true,
      composed: true,
      detail: {
        promoId: this.promoId,
        title: this.title,
        subtitle: this.subtitle,
        discount: this.discount,
        discountText: this.discountText,
        imageUrl: this.imageUrl,
        expires: this.expires,
        isFeatured: this.isFeatured,
        element: this
      }
    }));
  }

  // Handle CTA button click
  handleCtaClick(event) {
    event.stopPropagation();
    console.log(`CTA clicked: ${this.ctaText} for ${this.title}`);
    
    // Dispatch CTA-specific event
    this.dispatchEvent(new CustomEvent('cta-clicked', {
      bubbles: true,
      composed: true,
      detail: {
        promoId: this.promoId,
        title: this.title,
        ctaText: this.ctaText,
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
    container.className = 'promo-card-container';
    
    container.innerHTML = `
      <div class="promo-card ${this.isFeatured ? 'featured' : ''}" tabindex="0" role="button" aria-label="View ${this.title} promotion">
        ${this.discount ? `
          <div class="discount-badge">
            <span class="discount-text">${this.discountText}</span>
            <span class="discount-amount">${this.discount} OFF</span>
          </div>
        ` : ''}
        
        <div class="promo-content">
          <div class="promo-info">
            <h3 class="promo-title">${this.title}</h3>
            <p class="promo-subtitle">${this.subtitle}</p>
            ${this.expires ? `<p class="promo-expires">Expires: ${this.expires}</p>` : ''}
          </div>
          
          <button class="cta-button" aria-label="${this.ctaText} for ${this.title}">
            ${this.ctaText}
            <span class="cta-arrow">→</span>
          </button>
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
      
      .promo-card-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .promo-card {
        position: relative;
        height: 100%;
        border-radius: 12px;
        overflow: hidden;
        background-image: url('${this.imageUrl}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        outline: none;
      }
      
      .promo-card.featured {
        height: 280px;
        box-shadow: 0 8px 30px rgba(14,41,35,0.2);
      }
      
      .promo-card:hover {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0,0,0,0.2);
      }
      
      .promo-card.featured:hover {
        box-shadow: 0 15px 50px rgba(14,41,35,0.3);
      }
      
      .promo-card:focus {
        box-shadow: 0 0 0 3px rgba(14,41,35,0.4), 0 12px 40px rgba(0,0,0,0.2);
        transform: translateY(-3px);
      }
      
      .promo-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(0,0,0,0.3) 0%,
          rgba(0,0,0,0.4) 50%,
          rgba(14,41,35,0.6) 100%
        );
        transition: all 0.3s ease;
      }
      
      .promo-card:hover::before {
        background: linear-gradient(
          135deg,
          rgba(0,0,0,0.4) 0%,
          rgba(0,0,0,0.5) 50%,
          rgba(14,41,35,0.7) 100%
        );
      }
      
      .discount-badge {
        position: absolute;
        top: 16px;
        left: 16px;
        background: linear-gradient(135deg, #ff6b7a, #ff4757);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        z-index: 3;
        box-shadow: 0 4px 12px rgba(255,71,87,0.4);
        text-align: center;
        min-width: 80px;
      }
      
      .discount-text {
        display: block;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 2px;
      }
      
      .discount-amount {
        display: block;
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 0.5px;
      }
      
      .promo-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        z-index: 2;
        min-height: 100px;
      }
      
      .promo-info {
        flex: 1;
        margin-right: 20px;
      }
      
      .promo-title {
        color: white;
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px 0;
        text-shadow: 0 2px 6px rgba(0,0,0,0.4);
        letter-spacing: 0.5px;
        line-height: 1.2;
      }
      
      .promo-subtitle {
        color: rgba(255,255,255,0.95);
        font-size: 16px;
        font-weight: 400;
        margin: 0 0 6px 0;
        text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        letter-spacing: 0.3px;
        line-height: 1.3;
      }
      
      .promo-expires {
        color: rgba(255,255,255,0.8);
        font-size: 12px;
        font-weight: 500;
        margin: 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        line-height: 1.4;
      }
      
      .cta-button {
        background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
        color: #0e2923;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      
      .cta-button:hover {
        background: linear-gradient(135deg, #ffffff, rgba(255,255,255,0.95));
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.3);
      }
      
      .cta-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      
      .cta-arrow {
        font-size: 16px;
        transition: transform 0.3s ease;
      }
      
      .cta-button:hover .cta-arrow {
        transform: translateX(4px);
      }
      
      /* Featured card styles */
      .promo-card.featured .promo-title {
        font-size: 28px;
      }
      
      .promo-card.featured .promo-subtitle {
        font-size: 18px;
      }
      
      .promo-card.featured .cta-button {
        padding: 14px 24px;
        font-size: 15px;
      }
      
   
    `;

    // Clear shadow root and append new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('promo-card')) {
  customElements.define('promo-card', PromoCard);
}
