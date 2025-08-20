/**
 * CategoryDetailView Web Component
 * Shows products for a specific category or promotion
 * Reuses existing product-card, product-gallery, and hero-section components
 * 
 * Attributes:
 * - category-id: ID of the category or promo
 * - title: Display title for the category/promo
 * - subtitle: Subtitle/description
 * - type: "category" or "promo" (affects styling and data)
 * - visible: "true"/"false" to show/hide the view
 * 
 * Events:
 * - view-closed: Fired when back button is clicked
 * - product-clicked: Bubbled from product gallery
 */

class CategoryDetailView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.products = [];
    this.history = []; // For back navigation within the component
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['category-id', 'title', 'subtitle', 'type', 'visible'];
  }

  // Getters for attributes
  get categoryId() {
    return this.getAttribute('category-id') || '';
  }

  get title() {
    return this.getAttribute('title') || 'Category';
  }

  get subtitle() {
    return this.getAttribute('subtitle') || '';
  }

  get type() {
    return this.getAttribute('type') || 'category';
  }

  get isVisible() {
    return this.getAttribute('visible') === 'true';
  }

  connectedCallback() {
    this.render();
    this.loadProducts();
    this.setupEventListeners();
    this.updateVisibility();

    // Set initial internal state for history
    this.internalCategoryId = this.categoryId;
    this.internalTitle = this.title;
    this.internalSubtitle = this.subtitle;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && oldValue !== newValue) {
      if (name === 'visible') {
        this.updateVisibility();
      } else {
        // On initial load, set internal state from attributes
        this.internalCategoryId = this.categoryId;
        this.internalTitle = this.title;
        this.internalSubtitle = this.subtitle;
        this.history = []; // Clear history on new category
        this.loadProducts();
        this.render();
      }
    }
  }

  setupEventListeners() {
    // Back button functionality
    const backButton = this.shadowRoot.querySelector('.back-button');
    if (backButton) {
      // Remove any existing listeners first
      const newBackButton = backButton.cloneNode(true);
      backButton.parentNode.replaceChild(newBackButton, backButton);
      
      // Add fresh event listener
      newBackButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.history.length > 0) {
          const previousState = this.history.pop();
          // Restore previous state without re-rendering component
          this.updateHero(previousState.title, previousState.subtitle);
          this.updateProductGrid(this.getMockProducts(previousState.categoryId));

          // Restore internal state for history consistency
          this.internalCategoryId = previousState.categoryId;
          this.internalTitle = previousState.title;
          this.internalSubtitle = previousState.subtitle;
        } else {
          this.hide();
        }
      });
    }
  }

  show() {
    this.setAttribute('visible', 'true');
  }

  hide() {
    this.setAttribute('visible', 'false');
    this.history = []; // Clear history on close
    this.dispatchEvent(new CustomEvent('view-closed', {
      detail: { categoryId: this.categoryId, type: this.type },
      bubbles: true
    }));
  }

  updateVisibility() {
    const container = this.shadowRoot.querySelector('.detail-view-container');
    if (container) {
      container.style.display = this.isVisible ? 'block' : 'none';
    }
  }

  loadProducts() {
    // Mock data - in real app this would come from API
    const mockProducts = this.getMockProducts();
    this.products = mockProducts;
    this.renderProducts();
  }

  getMockProducts(categoryId = this.categoryId) {
    const productsByCategory = {
      'bracelets': [
        { id: 'br-001', title: 'Gold Chain Bracelet', subtitle: 'Classic Collection', price: '$1,250', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'br-002', title: 'Diamond Tennis Bracelet', subtitle: 'Luxury Series', price: '$4,750', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'br-003', title: 'Pearl Strand Bracelet', subtitle: 'Elegant Collection', price: '$890', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'earrings': [
        { id: 'er-001', title: 'Emerald Drop Earrings', subtitle: 'Vintage Collection', price: '$1,890', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'er-002', title: 'Diamond Studs', subtitle: 'Classic Collection', price: '$2,150', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'er-003', title: 'Gold Hoops', subtitle: 'Modern Collection', price: '$750', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'necklaces': [
        { id: 'nc-001', title: 'Pearl Strand Necklace', subtitle: 'Luxury Series', price: '$3,200', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'nc-002', title: 'Diamond Pendant', subtitle: 'Classic Collection', price: '$2,450', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'nc-003', title: 'Gold Chain Necklace', subtitle: 'Modern Collection', price: '$1,150', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'rings': [
        { id: 'rg-001', title: 'Diamond Solitaire Ring', subtitle: 'Engagement Collection', price: '$3,450', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'rg-002', title: 'Sapphire Ring', subtitle: 'Royal Collection', price: '$2,980', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'rg-003', title: 'Gold Band Ring', subtitle: 'Wedding Collection', price: '$850', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'engagement-rings': [
        { id: 'eng-001', title: 'Classic Solitaire', subtitle: 'Timeless Elegance', price: '$4,250', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'eng-002', title: 'Vintage Halo Ring', subtitle: 'Art Deco Collection', price: '$5,890', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'eng-003', title: 'Three Stone Ring', subtitle: 'Symbolic Collection', price: '$6,750', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'high-jewelry': [
        { id: 'blue', title: 'BLUE', subtitle: 'Oceanic Elegance Collection', isSubcategory: true, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'casablanca', title: 'CASABLANCA', subtitle: 'Moroccan Inspired Luxury', isSubcategory: true, image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'compton', title: 'COMPTON', subtitle: 'Urban Sophistication', isSubcategory: true, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'horseback', title: 'HORSEBACK', subtitle: 'Equestrian Heritage', isSubcategory: true, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'indigo', title: 'INDIGO', subtitle: 'Deep Blue Mystique', isSubcategory: true, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'macaw', title: 'MACAW', subtitle: 'Tropical Vibrance', isSubcategory: true, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'monti', title: 'MONTI', subtitle: 'Alpine Precision', isSubcategory: true, image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'moonstar', title: 'MOONSTAR', subtitle: 'Celestial Dreams', isSubcategory: true, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'mozah', title: 'MOZAH', subtitle: 'Arabian Nights', isSubcategory: true, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'oz', title: 'OZ', subtitle: 'Emerald City Magic', isSubcategory: true, image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'pollen', title: 'POLLEN', subtitle: 'Nature\'s Golden Touch', isSubcategory: true, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'robot', title: 'ROBOT', subtitle: 'Futuristic Precision', isSubcategory: true, image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'tortue', title: 'TORTUE', subtitle: 'Timeless Elegance', isSubcategory: true, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'yaya', title: 'YAYA', subtitle: 'Playful Luxury', isSubcategory: true, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'blue': [
        { id: 'blue-001', title: 'Sapphire Ocean Ring', subtitle: 'BLUE Collection', price: '$12,500', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'blue-002', title: 'Deep Blue Pendant', subtitle: 'BLUE Collection', price: '$9,800', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'casablanca': [
        { id: 'casa-001', title: 'Moroccan Star Necklace', subtitle: 'CASABLANCA Collection', price: '$15,200', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'casa-002', title: 'Desert Moon Earrings', subtitle: 'CASABLANCA Collection', price: '$8,950', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'compton': [
        { id: 'comp-001', title: 'Urban Gold Bangle', subtitle: 'COMPTON Collection', price: '$7,800', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'horseback': [
        { id: 'horse-001', title: 'Equestrian Diamond Brooch', subtitle: 'HORSEBACK Collection', price: '$11,300', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'indigo': [
        { id: 'ind-001', title: 'Indigo Sapphire Earrings', subtitle: 'INDIGO Collection', price: '$9,900', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'macaw': [
        { id: 'macaw-001', title: 'Vibrant Ruby Pendant', subtitle: 'MACAW Collection', price: '$14,000', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'monti': [
        { id: 'monti-001', title: 'Alpine Diamond Watch', subtitle: 'MONTI Collection', price: '$22,500', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'moonstar': [
        { id: 'moon-001', title: 'Celestial Diamond Necklace', subtitle: 'MOONSTAR Collection', price: '$18,800', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'mozah': [
        { id: 'mozah-001', title: 'Arabian Pearl Tiara', subtitle: 'MOZAH Collection', price: '$25,000', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'oz': [
        { id: 'oz-001', title: 'Emerald City Ring', subtitle: 'OZ Collection', price: '$19,900', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'pollen': [
        { id: 'pollen-001', title: 'Golden Topaz Brooch', subtitle: 'POLLEN Collection', price: '$8,200', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'robot': [
        { id: 'robot-001', title: 'Futuristic Diamond Cuff', subtitle: 'ROBOT Collection', price: '$16,500', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'tortue': [
        { id: 'tortue-001', title: 'Timeless Diamond Bracelet', subtitle: 'TORTUE Collection', price: '$13,400', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'yaya': [
        { id: 'yaya-001', title: 'Playful Sapphire Ring', subtitle: 'YAYA Collection', price: '$7,100', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      // Promo products
      'flash-diamonds': [
        { id: 'fd-001', title: 'Diamond Solitaire', subtitle: 'Flash Sale Special', price: '$1,470', originalPrice: '$2,450', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'fd-002', title: 'Diamond Earrings', subtitle: 'Limited Time', price: '$1,290', originalPrice: '$2,150', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ],
      'emerald-collection': [
        { id: 'ec-001', title: 'Emerald Ring', subtitle: 'New Collection', price: '$1,417', originalPrice: '$1,890', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'ec-002', title: 'Emerald Necklace', subtitle: 'Gold & Emerald', price: '$2,400', originalPrice: '$3,200', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ]
    };

    return productsByCategory[categoryId] || [];
  }

  updateHero(title, subtitle) {
    const titleEl = this.shadowRoot.querySelector('.hero-title');
    const subtitleEl = this.shadowRoot.querySelector('.hero-description');
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
  }

  updateProductGrid(newProducts) {
    const gallery = this.shadowRoot.querySelector('product-gallery');
    if (!gallery) return;

    gallery.classList.add('fade-out');

    setTimeout(() => {
      this.products = newProducts;
      this.renderProducts(); // Re-render only the grid
      requestAnimationFrame(() => {
        gallery.classList.remove('fade-out');
      });
    }, 300);
  }

  handleSubcategoryClick(categoryId, title, subtitle) {
    // Save current internal state to history before navigating
    this.history.push({
      categoryId: this.internalCategoryId,
      title: this.internalTitle,
      subtitle: this.internalSubtitle,
    });

    // Update hero and grid without changing attributes
    this.updateHero(title, subtitle);
    this.updateProductGrid(this.getMockProducts(categoryId));

    // Manually update internal properties for history consistency
    this.internalCategoryId = categoryId;
    this.internalTitle = title;
    this.internalSubtitle = subtitle;
  }

  renderProducts() {
    const gallery = this.shadowRoot.querySelector('product-gallery');
    if (gallery && this.products.length > 0) {
      gallery.innerHTML = '';
      const hasSubcategories = this.products.some(item => item.isSubcategory);

      if (hasSubcategories) {
        this.products.forEach(subcategory => {
          const categoryCard = document.createElement('category-card');
          categoryCard.setAttribute('image-url', subcategory.image);
          categoryCard.setAttribute('title', subcategory.title);
          categoryCard.setAttribute('subtitle', subcategory.subtitle);
          categoryCard.setAttribute('category-id', subcategory.id);

          // Navigate to product list on click
          categoryCard.addEventListener('click', () => {
            this.handleSubcategoryClick(subcategory.id, subcategory.title, subcategory.subtitle);
          });

          gallery.appendChild(categoryCard);
        });
      } else {
        this.products.forEach(product => {
          const productCard = document.createElement('product-card');
          productCard.setAttribute('image-url', product.image);
          productCard.setAttribute('title', product.title);
          productCard.setAttribute('subtitle', product.subtitle);
          productCard.setAttribute('price', product.price);
          productCard.setAttribute('product-id', product.id);
          gallery.appendChild(productCard);
        });
      }
    }
  }

  render() {
    const heroTitle = this.type === 'promo' ? `${this.title} - Special Offer` : this.title;
    const heroDescription = this.type === 'promo' ? 
      `Exclusive ${this.title.toLowerCase()} promotion. ${this.subtitle}` : 
      `Explore our ${this.title.toLowerCase()} collection. ${this.subtitle}`;

    this.shadowRoot.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .detail-view-container {
        display: ${this.isVisible ? 'block' : 'none'};
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        z-index: 1000;
        overflow-y: auto;
        animation: slideIn 0.3s ease-out;
        width: 100%;
        max-width: 768px;
        margin: auto;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      
      .detail-header {
        position: sticky;
        top: 0;
        background: white;
        border-bottom: 1px solid #e9ecef;
        z-index: 10;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .back-button {
        background: none;
        border: none;
        font-size: 24px;
        color: #0e2923;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
      }
      
      .back-button:hover {
        background: rgba(14,41,35,0.1);
      }
      
      .header-title {
        color: #0e2923;
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        letter-spacing: 0.5px;
      }
      
      .detail-content {
        min-height: calc(100vh - 80px);
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .detail-header {
          padding: 12px 16px;
        }
        
        .header-title {
          font-size: 18px;
        }
        
        .back-button {
          width: 36px;
          height: 36px;
          font-size: 20px;
        }
      }
    </style>
    
    <div class="detail-view-container">
      <div class="detail-header">
        <button class="back-button" aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <h2 class="header-title">${this.title}</h2>
      </div>
      
      <div class="detail-content">
        <hero-section 
          title="${heroTitle}"
          description="${heroDescription}">
        </hero-section>
        
        <product-gallery title="">
        </product-gallery>
      </div>
    </div>
    `;

    // Setup event listeners after DOM is ready
    setTimeout(() => {
      this.setupEventListeners();
      this.renderProducts();
    }, 0);
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('category-detail-view')) {
  customElements.define('category-detail-view', CategoryDetailView);
}
