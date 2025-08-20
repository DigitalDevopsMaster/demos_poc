/**
 * BaseModal Web Component
 * Provides the common modal structure, animations, and functionality
 * Used as a base for specific modal implementations (search, cart, etc.)
 * 
 * Attributes:
 * - modal-id: Unique identifier for the modal
 * - title: Modal title
 * - subtitle: Optional subtitle
 * - show-footer: "true"/"false" to show/hide footer
 * 
 * Slots:
 * - header-extra: Additional content in header (like search bar)
 * - default: Main modal content
 * - footer: Footer content
 * 
 * Events:
 * - modal-close: Fired when modal is closed
 * - modal-open: Fired when modal is opened
 */
// Prevent redeclaration if already loaded
if (!customElements.get('base-modal')) {

class BaseModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.render();
  }

  // Observed attributes for reactivity
  static get observedAttributes() {
    return ['modal-id', 'title', 'subtitle', 'show-footer'];
  }

  // Called when attributes change
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Get attribute values with defaults
  get modalId() {
    return this.getAttribute('modal-id') || 'modal';
  }

  get title() {
    return this.getAttribute('title') || 'Modal';
  }

  get subtitle() {
    return this.getAttribute('subtitle') || '';
  }

  get showFooter() {
    return this.getAttribute('show-footer') === 'true';
  }

  // Public methods
  open() {
    this.isOpen = true;
    const overlay = this.shadowRoot.querySelector('.modal-overlay');
    overlay.style.display = 'block';
    overlay.classList.remove('modal-closing');
    document.body.style.overflow = 'hidden';
    
    // Dispatch open event
    this.dispatchEvent(new CustomEvent('modal-open', {
      bubbles: true,
      detail: { modalId: this.modalId }
    }));
  }

  close() {
    const overlay = this.shadowRoot.querySelector('.modal-overlay');
    overlay.classList.add('modal-closing');
    
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.classList.remove('modal-closing');
      document.body.style.overflow = 'auto';
      this.isOpen = false;
      
      // Dispatch close event
      this.dispatchEvent(new CustomEvent('modal-close', {
        bubbles: true,
        detail: { modalId: this.modalId }
      }));
    }, 300);
  }

  render() {
    // Add Font Awesome CDN to shadow DOM
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.setAttribute('rel', 'stylesheet');
    fontAwesomeLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    this.shadowRoot.appendChild(fontAwesomeLink);

    // Modal structure
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="modal-overlay" style="display: none;">
        <div class="modal-content">
          <!-- Header with emerald gradient -->
          <div class="modal-header">
            <div class="header-top">
              <h2 class="modal-title">${this.title}</h2>
              <div class="close-button">
                <i class="fas fa-times"></i>
              </div>
            </div>
            ${this.subtitle ? `<p class="modal-subtitle">${this.subtitle}</p>` : ''}
            <!-- Extra header content slot -->
            <div class="header-extra">
              <slot name="header-extra"></slot>
            </div>
          </div>
          
          <!-- Main content area -->
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <!-- Footer (optional) -->
          ${this.showFooter ? `
            <div class="modal-footer">
              <slot name="footer"></slot>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .modal-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        display: flex;
        flex-direction: column;
        animation: slideInUp 0.3s ease;
      }
      
      .modal-header {
        background: linear-gradient(135deg, #0e2923 0%, #1a3d36 50%, #26524a 100%);
        padding: 15px;
        color: white;
        box-shadow: 0 2px 10px rgba(10, 74, 66, 0.3);
      }
      
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .modal-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0;
      }
      
      .modal-subtitle {
        font-size: 14px;
        opacity: 0.9;
        margin: 5px 0 0 0;
      }
      
      .close-button {
        cursor: pointer;
        padding: 8px;
        transition: opacity 0.2s;
      }
      
      .close-button:hover {
        opacity: 0.7;
      }
      
      .close-button i {
        font-size: 20px;
      }
      
      .header-extra {
        margin-top: 10px;
      }
      
      .modal-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }
      
      .modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        background: white;
      }
      
      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      
      @keyframes slideOutDown {
        from { transform: translateY(0); }
        to { transform: translateY(100%); }
      }
      
      .modal-closing .modal-content {
        animation: slideOutDown 0.3s ease;
      }
      
      /* Responsive design */
      @media (min-width: 768px) {
        .modal-overlay {
          left: 50%;
          transform: translateX(-50%);
          width: 768px;
        }
      }
    `;

    // Clear previous content and add new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(fontAwesomeLink);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(modalContainer);

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const closeButton = this.shadowRoot.querySelector('.close-button');
    const overlay = this.shadowRoot.querySelector('.modal-overlay');

    // Close button click
    closeButton.addEventListener('click', () => this.close());

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
}

// Define the custom element
customElements.define('base-modal', BaseModal);

} // End of conditional block to prevent redeclaration
