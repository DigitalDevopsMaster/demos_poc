/**
 * GradientHeader Web Component
 * Provides a gradient header with optional search bar, title, and cart icon
 * Attributes:
 * - show-search: "true" or "false" to show/hide search bar
 * - search-placeholder: Custom placeholder text for search
 * - title: Main title text
 * - subtitle: Subtitle text
 * - search-action: Custom search action (dispatches custom event if provided)
 */
class GradientHeader extends HTMLElement {
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



  // Handle component clicks (delegated event handling)
  handleComponentClick(event) {
    // Dispatch component click event with target info
    this.dispatchEvent(new CustomEvent('header-component-clicked', {
      bubbles: true,
      detail: { 
        target: event.target,
        side: event.target.closest('.left-component') ? 'left' : 'right'
      }
    }));
  }

  render() {
    // Add Font Awesome CDN to shadow DOM
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.setAttribute('rel', 'stylesheet');
    fontAwesomeLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    this.shadowRoot.appendChild(fontAwesomeLink);

    // Main container
    const container = document.createElement('div');
    container.className = 'gradient-header';
    
    // Create header content structure
    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    
    // Create components row if needed
    if (this.leftComponent || this.rightComponent) {
      const componentsRow = document.createElement('div');
      componentsRow.className = 'components-row';
      
      // Left component
      const leftDiv = document.createElement('div');
      leftDiv.className = 'left-component';
      if (this.leftComponent) {
        leftDiv.innerHTML = this.leftComponent;
      }
      
      // Right component  
      const rightDiv = document.createElement('div');
      rightDiv.className = 'right-component';
      if (this.rightComponent) {
        rightDiv.innerHTML = this.rightComponent;
      }
      
      componentsRow.appendChild(leftDiv);
      componentsRow.appendChild(rightDiv);
      headerContent.appendChild(componentsRow);
    }
    
    // Create title section if needed
    if (this.title || this.subtitle) {
      const titleSection = document.createElement('div');
      titleSection.className = 'title-section';
      
      if (this.title) {
        const titleEl = document.createElement('h2');
        titleEl.className = 'main-title';
        titleEl.textContent = this.title;
        titleSection.appendChild(titleEl);
      }
      
      if (this.subtitle) {
        const subtitleEl = document.createElement('p');
        subtitleEl.className = 'subtitle';
        subtitleEl.textContent = this.subtitle;
        titleSection.appendChild(subtitleEl);
      }
      
      headerContent.appendChild(titleSection);
    }
    
    container.appendChild(headerContent);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      .gradient-header {
        background: linear-gradient(135deg, #0e2923 0%, #1a3d36 50%, #26524a 100%);
        padding: 8px 12px;
        color: white;
        box-shadow: 0 2px 10px rgba(10, 74, 66, 0.3);
        min-height: 40px;
        align-items: center;
        display: flex;
        justify-content: flex-end;
      }
      
      .header-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      

      
      .components-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
      }
      
      .left-component {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      
      .right-component {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 10px;
      }
      
      /* Style injected components */
      .left-component > *,
      .right-component > * {
        color: white;
      }
      
      .left-component button,
      .right-component button {
        background: rgba(255,255,255,0.15);
        border: none;
        color: white;
        padding: 8px 12px;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
      }
      
      .left-component button:hover,
      .right-component button:hover {
        background: rgba(255,255,255,0.25);
        transform: scale(1.05);
      }
      
      .left-component i,
      .right-component i {
        font-size: 18px;
        color: white;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s;
      }
      
      .left-component i:hover,
      .right-component i:hover {
        background: rgba(255,255,255,0.15);
        transform: scale(1.1);
      }
      

      

      
      .title-section {
        margin-bottom: 0;
      }
      
      .main-title {
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 5px 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .subtitle {
        font-size: 14px;
        opacity: 0.9;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `;

    // Clear previous content and add new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(fontAwesomeLink);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const leftComponent = this.shadowRoot.querySelector('.left-component');
    const rightComponent = this.shadowRoot.querySelector('.right-component');

    // Add delegated event listeners for component clicks
    if (leftComponent) {
      leftComponent.addEventListener('click', (event) => this.handleComponentClick(event));
    }
    
    if (rightComponent) {
      rightComponent.addEventListener('click', (event) => this.handleComponentClick(event));
    }
  }
}

// Define the custom element
customElements.define('gradient-header', GradientHeader);
