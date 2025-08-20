class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['placeholder', 'disabled'];
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
  get placeholder() {
    return this.getAttribute('placeholder') || 'Buscar productos...';
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  // Handle search bar click
  handleSearchClick() {
    console.log('Search bar clicked, opening search modal...');
    
    // Find and open search modal directly
    const searchModal = document.querySelector('search-modal');
    if (searchModal) {
      searchModal.open();
    } else {
      console.warn('search-modal not found in document');
    }
    
    // Still dispatch event for any custom handling
    this.dispatchEvent(new CustomEvent('search-clicked', {
      bubbles: true,
      composed: true,
      detail: { 
        placeholder: this.placeholder,
        element: this
      }
    }));
  }

  render() {
    const container = document.createElement('div');
    container.className = 'search-bar-container';
    
    container.innerHTML = `
      <div class="search-bar" ${this.disabled ? 'disabled' : ''}>
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            class="search-input" 
            placeholder="${this.placeholder}"
            readonly
            ${this.disabled ? 'disabled' : ''}
          >
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        width: 100%;
        flex: 1;
      }
      
      .search-bar-container {
        width: 100%;
        padding: 0;
      }
      
      .search-bar {
        background: white;
        backdrop-filter: blur(15px);
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.3);
      }
      
      .search-bar:hover {
        background: #f8f9fa;
        border-color: #0e2923;
        box-shadow: 0 2px 8px rgba(14, 41, 35, 0.15), 0 1px 3px rgba(14, 41, 35, 0.2);
        transform: translateY(-0.5px);
      }
      
      .search-bar[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .search-bar[disabled]:hover {
        transform: none;
        background: white;
        border-color: rgba(255,255,255,0.3);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }
      
      .search-input-wrapper {
        display: flex;
        align-items: center;
        padding: 8px 15px;
        gap: 10px;
      }
      
      .search-icon {
        color: #0e2923;
        font-size: 14px;
        flex-shrink: 0;
        opacity: 0.7;
      }
      
      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #0e2923;
        background: transparent;
        cursor: pointer;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .search-input::placeholder {
        color: rgba(14, 41, 35, 0.5);
        font-weight: 400;
      }
      
      .search-input[disabled] {
        cursor: not-allowed;
      }
      
      /* Focus states for accessibility */
      .search-bar:focus-within {
        background: white;
        border-color: #0e2923;
        box-shadow: 0 2px 8px rgba(14, 41, 35, 0.15), 0 0 0 2px rgba(14, 41, 35, 0.2);
        outline: none;
      }
      
      /* Mobile responsive */
      @media (max-width: 480px) {
        .search-input-wrapper {
          padding: 6px 12px;
        }
        
        .search-input {
          font-size: 13px;
        }
        
        .search-icon {
          font-size: 13px;
        }
      }
    `;

    // Clear shadow root and append new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  addEventListeners() {
    const searchBar = this.shadowRoot.querySelector('.search-bar');
    const searchInput = this.shadowRoot.querySelector('.search-input');

    if (searchBar && !this.disabled) {
      // Handle click on entire search bar
      searchBar.addEventListener('click', () => this.handleSearchClick());
      
      // Handle focus on input - open modal immediately and blur
      searchInput.addEventListener('focus', () => {
        this.handleSearchClick();
        // Blur the input to prevent keyboard from showing on mobile
        searchInput.blur();
      });
      
      // Prevent actual typing in readonly input
      searchInput.addEventListener('keydown', (e) => {
        e.preventDefault();
        this.handleSearchClick();
      });
      
      // Handle touch events for better mobile experience
      searchBar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.handleSearchClick();
      });
    }
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('search-bar')) {
  customElements.define('search-bar', SearchBar);
}
