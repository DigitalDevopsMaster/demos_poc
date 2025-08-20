/**
 * CategoryCard Web Component
 * Elegant card component for displaying jewelry categories
 * 
 * Attributes:
 * - image-url: Background image URL for the category
 * - title: Category title/name
 * - subtitle: Category description (optional)
 * - category-id: Unique identifier for the category
 * 
 * Events:
 * - category-clicked: Fired when card is clicked
 */

class CategoryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['image-url', 'title', 'subtitle', 'category-id'];
  }

  // Getters for attributes
  get imageUrl() {
    return this.getAttribute('image-url') || '';
  }

  get title() {
    return this.getAttribute('title') || 'Untitled Category';
  }

  get subtitle() {
    return this.getAttribute('subtitle') || '';
  }

  get categoryId() {
    return this.getAttribute('category-id') || '';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  setupEventListeners() {
    const card = this.shadowRoot.querySelector('.category-card');
    
    // Click event
    card.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('category-clicked', {
        detail: {
          categoryId: this.categoryId,
          title: this.title,
          subtitle: this.subtitle
        },
        bubbles: true
      }));
    });

    // Keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
      }
      
      .category-card {
        position: relative;
        height: 280px;
        border-radius: 8px;
        overflow: hidden;
        background-image: url('${this.imageUrl}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        outline: none;
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      .category-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(14,41,35,0.15);
      }
      
      .category-card:focus {
        outline: 2px solid #0e2923;
        outline-offset: 2px;
      }
      
      .category-card:active {
        transform: translateY(-2px);
      }
      
      .category-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(14,41,35,0.1) 0%,
          rgba(14,41,35,0.3) 50%,
          rgba(14,41,35,0.6) 100%
        );
        transition: all 0.3s ease;
      }
      
      .category-card:hover .category-overlay {
        background: linear-gradient(
          135deg,
          rgba(14,41,35,0.2) 0%,
          rgba(14,41,35,0.4) 50%,
          rgba(14,41,35,0.7) 100%
        );
      }
      
      .category-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        z-index: 2;
      }
      
      .category-title {
        color: white;
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 8px 0;
        text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        letter-spacing: 0.5px;
        line-height: 1.2;
      }
      
      .category-subtitle {
        color: rgba(255,255,255,0.9);
        font-size: 14px;
        font-weight: 400;
        margin: 0;
        text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        letter-spacing: 0.3px;
        line-height: 1.4;
        opacity: 0.8;
      }
      
      .category-arrow {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 3;
      }
      
      .category-card:hover .category-arrow {
        background: rgba(255,255,255,0.25);
        transform: scale(1.1);
      }
      
      .arrow-icon {
        width: 16px;
        height: 16px;
        fill: white;
        transition: transform 0.3s ease;
      }
      
      .category-card:hover .arrow-icon {
        transform: translateX(2px);
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .category-card {
          height: 240px;
        }
        
        .category-content {
          padding: 20px;
        }
        
        .category-title {
          font-size: 20px;
        }
        
        .category-subtitle {
          font-size: 13px;
        }
        
        .category-arrow {
          width: 28px;
          height: 28px;
          top: 16px;
          right: 16px;
        }
        
        .arrow-icon {
          width: 14px;
          height: 14px;
        }
      }
      
      @media (max-width: 480px) {
        .category-card {
          height: 200px;
        }
        
        .category-content {
          padding: 16px;
        }
        
        .category-title {
          font-size: 18px;
        }
        
        .category-subtitle {
          font-size: 12px;
        }
      }
    </style>
    
    <div class="category-card" tabindex="0" role="button" aria-label="Browse ${this.title} category">
      <div class="category-overlay"></div>
      
      <div class="category-arrow">
        <svg class="arrow-icon" viewBox="0 0 24 24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </div>
      
      <div class="category-content">
        <h3 class="category-title">${this.title}</h3>
        ${this.subtitle ? `<p class="category-subtitle">${this.subtitle}</p>` : ''}
      </div>
    </div>
    `;
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('category-card')) {
  customElements.define('category-card', CategoryCard);
}
