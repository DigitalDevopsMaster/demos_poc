/**
 * HmoissanLayout Web Component
 * Main layout component that composes the entire page structure:
 * - mobile-frame (outer container)
 * - gradient-header (with optional component injection)
 * - slot for page content
 * - bottom-navigation
 * 
 * Attributes:
 * - title: Page title
 * - subtitle: Page subtitle
 * - show-search: "true"/"false" to show/hide search bar in header
 * - search-placeholder: Custom search placeholder
 * - topbar-component: Name of component to inject in header (future feature)
 */
class HmoissanLayout extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['title', 'subtitle', 'left-component', 'right-component'];
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Get attribute values with defaults
  get title() {
    return this.getAttribute('title') || null;
  }

  get subtitle() {
    return this.getAttribute('subtitle') || null;
  }

  get leftComponent() {
    return this.getAttribute('left-component') || '';
  }

  get rightComponent() {
    return this.getAttribute('right-component') || '';
  }

  render() {
    // Load global styles if not already loaded
    if (!document.querySelector('link[href="styles/global.css"]')) {
      const globalStyles = document.createElement('link');
      globalStyles.rel = 'stylesheet';
      globalStyles.href = 'styles/global.css';
      document.head.appendChild(globalStyles);
    }

    // Import required components
    const componentsToLoad = [
      'components/mobile-frame.js',
      'components/gradient-header.js', 
      'components/bottom-navigation.js'
    ];

    // Load components if not already loaded
    componentsToLoad.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
      }
    });

    // Main layout structure
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'hmoissan-layout';
    
    layoutContainer.innerHTML = `
      <mobile-frame>
        <div class="layout-content">
          <!-- Header with gradient -->
          <gradient-header 
            title="${this.title || ''}" 
            subtitle="${this.subtitle || ''}"
            ${this.leftComponent ? `left-component="${this.leftComponent}"` : ''}
            ${this.rightComponent ? `right-component="${this.rightComponent}"` : ''}>
          </gradient-header>
          
          <!-- Page content slot -->
          <div class="page-content">
            <slot></slot>
          </div>
          
          <!-- Bottom navigation -->
          <bottom-navigation></bottom-navigation>
        </div>
      </mobile-frame>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      .hmoissan-layout {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .layout-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        position: relative;
      }
      
      gradient-header {
        position: sticky;
        top: 0;
        z-index: 999;
      }

      .page-content {
        flex: 1;
        overflow-y: auto;
        padding-bottom: 70px; /* Space for bottom navigation + extra padding */
      }
      
      /* Ensure mobile-frame takes full space */
      mobile-frame {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;

    // Clear previous content and add new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(layoutContainer);

    // Add event listeners
    this.addEventListeners();
  }

  // Add event listeners
  addEventListeners() {
    // Listen for header-component-clicked events from gradient-header
    this.shadowRoot.addEventListener('header-component-clicked', this.handleComponentEvent.bind(this));
  }

  // Handle component events from gradient-header
  handleComponentEvent(event) {
    const { target, side } = event.detail;
    
    // Dispatch the component event to the parent page
    this.dispatchEvent(new CustomEvent('header-component-clicked', {
      bubbles: true,
      detail: { 
        target: target,
        side: side,
        element: target
      }
    }));
  }

  // Expose methods to interact with child components
  openSearchModal() {
    // Dispatch event to be handled by parent page
    this.dispatchEvent(new CustomEvent('search-requested', {
      bubbles: true,
      detail: { action: 'open-search' }
    }));
  }

  openCartModal() {
    // Dispatch event to be handled by parent page
    this.dispatchEvent(new CustomEvent('cart-requested', {
      bubbles: true,
      detail: { action: 'open-cart' }
    }));
  }
}

// Define the custom element
customElements.define('hmoissan-layout', HmoissanLayout);
