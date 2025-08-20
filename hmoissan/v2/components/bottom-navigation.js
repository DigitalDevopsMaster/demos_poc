/**
 * BottomNavigation Web Component
 * Provides the bottom navigation bar with 4 main sections: Sales, Collection, Luxury, Account
 * Automatically detects the current page and highlights the active section
 */
class BottomNavigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  // Get the current active page from the current URL
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename || 'sales'; // Default to sales as entry page
  }

  // Navigation functions
  goToSales() {
    window.location.href = 'sales.html';
  }

  goToCollection() {
    window.location.href = 'collection.html';
  }

  goToLuxury() {
    window.location.href = 'luxury.html';
  }

  goToAccount() {
    window.location.href = 'account.html';
  }

  render() {
    // Add Font Awesome CDN to shadow DOM
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.setAttribute('rel', 'stylesheet');
    fontAwesomeLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    this.shadowRoot.appendChild(fontAwesomeLink);

    const currentPage = this.getCurrentPage();

    // Navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'bottom-nav';

    // Create navigation HTML
    const navHTML = `
      <div class="nav-item ${currentPage === 'sales' ? 'active' : ''}" id="salesNav">
        <i class="fas fa-tag"></i>
        <span>Sales</span>
      </div>
      <div class="nav-item ${currentPage === 'collection' ? 'active' : ''}" id="collectionNav">
        <i class="fas fa-search"></i>
        <span>Collection</span>
      </div>
      <div class="nav-item ${currentPage === 'luxury' ? 'active' : ''}" id="luxuryNav">
        <i class="fas fa-gem"></i>
        <span>Luxury</span>
      </div>
      <div class="nav-item ${currentPage === 'account' ? 'active' : ''}" id="accountNav">
        <i class="fas fa-user"></i>
        <span>Account</span>
      </div>
    `;

    navContainer.innerHTML = navHTML;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      .bottom-nav {
        height: 60px;
        background: #fff;
        color: #333;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #ddd;
        z-index: 999;
      }
      
      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px 10px;
        cursor: pointer;
        transition: color 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .nav-item:hover {
        color: #0e2923;
      }
      
      .nav-item.active {
        color: #0e2923;
      }
      
      .nav-item i {
        font-size: 20px;
        margin-bottom: 4px;
      }
      
      .nav-item span {
        font-size: 12px;
      }
    `;

    // Clear previous content and add new content
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(fontAwesomeLink);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(navContainer);

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    this.shadowRoot.getElementById('salesNav').addEventListener('click', this.goToSales);
    this.shadowRoot.getElementById('collectionNav').addEventListener('click', this.goToCollection);
    this.shadowRoot.getElementById('luxuryNav').addEventListener('click', this.goToLuxury);
    this.shadowRoot.getElementById('accountNav').addEventListener('click', this.goToAccount);
  }
}

// Define the custom element
customElements.define('bottom-navigation', BottomNavigation);
