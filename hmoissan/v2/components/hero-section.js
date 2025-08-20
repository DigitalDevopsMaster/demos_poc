/**
 * HeroSection Web Component
 * Reusable hero section for collection and luxury pages
 * 
 * Attributes:
 * - title: Main hero title
 * - description: Hero description text
 * - background-color: Background color (optional, defaults to gradient)
 * - text-color: Text color (optional, defaults to #0e2923)
 * - description-color: Description text color (optional, defaults to #6c757d)
 */

class HeroSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['title', 'description', 'background-color', 'text-color', 'description-color'];
  }

  // Getters for attributes
  get title() {
    return this.getAttribute('title') || 'UNTITLED';
  }

  get description() {
    return this.getAttribute('description') || '';
  }

  get backgroundColor() {
    return this.getAttribute('background-color') || 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
  }

  get textColor() {
    return this.getAttribute('text-color') || '#0e2923';
  }

  get descriptionColor() {
    return this.getAttribute('description-color') || '#6c757d';
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
      }
      
      .hero-section {
        padding: 40px 20px;
        text-align: center;
        background: ${this.backgroundColor};
        position: relative;
        overflow: hidden;
      }
      
      .hero-content {
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      }
      
      .hero-title {
        color: ${this.textColor};
        font-size: 36px;
        font-weight: 700;
        margin: 0 0 16px 0;
        letter-spacing: 2px;
        text-transform: uppercase;
        line-height: 1.2;
      }
      
      .hero-description {
        color: ${this.descriptionColor};
        font-size: 18px;
        font-weight: 400;
        margin: 0;
        line-height: 1.6;
        letter-spacing: 0.5px;
      }
      
      /* Decorative elements */
      .hero-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(14,41,35,0.03) 0%, transparent 70%);
        animation: float 20s ease-in-out infinite;
        z-index: 1;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .hero-section {
          padding: 32px 16px;
        }
        
        .hero-title {
          font-size: 28px;
          letter-spacing: 1.5px;
        }
        
        .hero-description {
          font-size: 16px;
        }
      }
      
      @media (max-width: 480px) {
        .hero-section {
          padding: 24px 12px;
        }
        
        .hero-title {
          font-size: 24px;
          letter-spacing: 1px;
        }
        
        .hero-description {
          font-size: 15px;
        }
      }
    </style>
    
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">${this.title}</h1>
        ${this.description ? `<p class="hero-description">${this.description}</p>` : ''}
      </div>
    </div>
    `;
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('hero-section')) {
  customElements.define('hero-section', HeroSection);
}
