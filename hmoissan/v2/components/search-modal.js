/**
 * SearchModal Web Component
 * Specific modal for search functionality, extends BaseModal
 * 
 * Attributes:
 * - search-placeholder: Placeholder text for search input
 * 
 * Events:
 * - search-query: Fired when user performs a search
 */
class SearchModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['search-placeholder'];
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Get attribute values with defaults
  get searchPlaceholder() {
    return this.getAttribute('search-placeholder') || '¿Qué estás buscando?';
  }

  // Public methods
  open() {
    const baseModal = this.shadowRoot.querySelector('base-modal');
    baseModal.open();
    
    // Focus on search input when modal opens
    setTimeout(() => {
      const searchInput = this.shadowRoot.querySelector('#searchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }

  close() {
    const baseModal = this.shadowRoot.querySelector('base-modal');
    baseModal.close();
  }

  // Handle search functionality
  performSearch() {
    const searchInput = this.shadowRoot.querySelector('#searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
      // Dispatch search event
      this.dispatchEvent(new CustomEvent('search-query', {
        bubbles: true,
        detail: { query: query }
      }));
      
      // Optionally close modal after search
      // this.close();
    }
  }

  render() {
    // Load base modal component if not already loaded
    if (!customElements.get('base-modal')) {
      const script = document.createElement('script');
      script.src = 'components/base-modal.js';
      document.head.appendChild(script);
    }

    // Search modal structure using base modal
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
      <base-modal 
        modal-id="searchModal" 
        title="Buscar Joyas" 
        show-footer="false">
        
        <!-- Search bar in header -->
        <div slot="header-extra" class="search-bar-container">
          <div class="search-input-wrapper">
            <input 
              type="text" 
              id="searchInput"
              placeholder="${this.searchPlaceholder}" 
              class="search-input" />
            <button class="search-button" id="searchButton">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        <!-- Search content -->
        <div class="search-content">
          <h3 class="filters-title">Filtros de Búsqueda</h3>
          
          <!-- Category filters -->
          <div class="filter-section">
            <h4>Categorías</h4>
            <div class="filter-options">
              <label class="filter-option">
                <input type="checkbox" value="bracelets"> Pulseras
              </label>
              <label class="filter-option">
                <input type="checkbox" value="earrings"> Aretes
              </label>
              <label class="filter-option">
                <input type="checkbox" value="rings"> Anillos
              </label>
              <label class="filter-option">
                <input type="checkbox" value="necklaces"> Collares
              </label>
              <label class="filter-option">
                <input type="checkbox" value="luxury"> Alta Joyería
              </label>
            </div>
          </div>
          
          <!-- Price range filter -->
          <div class="filter-section">
            <h4>Rango de Precio</h4>
            <div class="price-range">
              <input type="range" min="0" max="10000" value="5000" class="price-slider">
              <div class="price-labels">
                <span>$0</span>
                <span>$10,000+</span>
              </div>
            </div>
          </div>
          
          <!-- Material filter -->
          <div class="filter-section">
            <h4>Material</h4>
            <div class="filter-options">
              <label class="filter-option">
                <input type="checkbox" value="gold"> Oro
              </label>
              <label class="filter-option">
                <input type="checkbox" value="silver"> Plata
              </label>
              <label class="filter-option">
                <input type="checkbox" value="platinum"> Platino
              </label>
              <label class="filter-option">
                <input type="checkbox" value="diamonds"> Diamantes
              </label>
            </div>
          </div>
          
          <div class="search-actions">
            <button class="apply-filters-btn">Aplicar Filtros</button>
            <button class="clear-filters-btn">Limpiar</button>
          </div>
        </div>
      </base-modal>
    `;

    // Styles specific to search modal
    const style = document.createElement('style');
    style.textContent = `
      .search-bar-container {
        margin-top: 10px;
      }
      
      .search-input-wrapper {
        background: white;
        border-radius: 3px;
        padding: 12px 15px;
        border: 1px solid rgba(14, 41, 35, 0.2);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .search-input {
        background: none;
        border: none;
        color: #0e2923;
        flex: 1;
        font-size: 16px;
        outline: none;
      }
      
      .search-input::placeholder {
        color: rgba(14, 41, 35, 0.5);
      }
      
      .search-button {
        background: #0e2923;
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 3px;
        transition: all 0.2s;
      }
      
      .search-button:hover {
        background: #1a3d36;
        transform: translateY(-1px);
      }
      
      .search-content {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .filters-title {
        color: #0e2923;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: 600;
      }
      
      .filter-section {
        margin-bottom: 25px;
      }
      
      .filter-section h4 {
        color: #333;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 600;
      }
      
      .filter-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .filter-option {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 5px 0;
      }
      
      .filter-option input[type="checkbox"] {
        accent-color: #0e2923;
      }
      
      .price-range {
        margin-top: 10px;
      }
      
      .price-slider {
        width: 100%;
        margin-bottom: 10px;
        accent-color: #0e2923;
      }
      
      .price-labels {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #666;
      }
      
      .search-actions {
        margin-top: 30px;
        display: flex;
        gap: 10px;
      }
      
      .apply-filters-btn {
        flex: 1;
        background: #0e2923;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
      }
      
      .clear-filters-btn {
        flex: 1;
        background: transparent;
        color: #0e2923;
        border: 2px solid #0e2923;
        padding: 12px;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
      }
      
      .apply-filters-btn:hover,
      .clear-filters-btn:hover {
        opacity: 0.8;
      }
    `;

    // Clear previous content and add new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(searchContainer);

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const searchButton = this.shadowRoot.querySelector('#searchButton');
    const searchInput = this.shadowRoot.querySelector('#searchInput');
    const applyFiltersBtn = this.shadowRoot.querySelector('.apply-filters-btn');
    const clearFiltersBtn = this.shadowRoot.querySelector('.clear-filters-btn');

    // Search button click
    if (searchButton) {
      searchButton.addEventListener('click', () => this.performSearch());
    }

    // Enter key in search input
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }

    // Apply filters button
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', () => {
        // Collect all filter values and dispatch event
        const filters = this.collectFilters();
        this.dispatchEvent(new CustomEvent('filters-applied', {
          bubbles: true,
          detail: { filters: filters }
        }));
      });
    }

    // Clear filters button
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
  }

  collectFilters() {
    const checkboxes = this.shadowRoot.querySelectorAll('input[type="checkbox"]:checked');
    const priceSlider = this.shadowRoot.querySelector('.price-slider');
    
    const categories = Array.from(checkboxes).map(cb => cb.value);
    const maxPrice = priceSlider ? priceSlider.value : 10000;
    
    return {
      categories: categories,
      maxPrice: maxPrice,
      query: this.shadowRoot.querySelector('#searchInput').value
    };
  }

  clearAllFilters() {
    const checkboxes = this.shadowRoot.querySelectorAll('input[type="checkbox"]');
    const priceSlider = this.shadowRoot.querySelector('.price-slider');
    const searchInput = this.shadowRoot.querySelector('#searchInput');
    
    checkboxes.forEach(cb => cb.checked = false);
    if (priceSlider) priceSlider.value = 5000;
    if (searchInput) searchInput.value = '';
  }
}

// Register the custom element (prevent redeclaration)
if (!customElements.get('search-modal')) {
  customElements.define('search-modal', SearchModal);
}
