/**
 * MobileFrame Web Component
 * Provides a mobile device frame with status bar, content area, and bottom navigation
 * Responsive: shows frame on desktop, full screen on mobile
 */
class MobileFrame extends HTMLElement {
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

  render() {
    // Add Font Awesome CDN to shadow DOM
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.setAttribute('rel', 'stylesheet');
    fontAwesomeLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    this.shadowRoot.appendChild(fontAwesomeLink);

    // Main container
    const wrapper = document.createElement('div');
    wrapper.id = 'mobileFrameCtn';
    
    const currentPage = this.getCurrentPage();
    
    wrapper.innerHTML = `
      <div id="mobileFrameEl">
        <!-- Status Bar -->
        <div id="statusBarEl">
          <span>9:41</span>
          <div style="display: flex; gap: 6px;">
            <i class="fas fa-signal"></i>
            <i class="fas fa-battery-three-quarters"></i>
          </div>
        </div>
        
        <!-- App Content Area -->
        <div id="screenContentEl">
          <slot></slot>
        </div>
        

      </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
      #mobileFrameCtn {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        position: relative;
        min-height: 100vh;
      }
      
      #mobileFrameEl {
        width: 375px;
        border-radius: 36px;
        overflow: hidden;
        height: calc(100vh - 50px);
        box-shadow: 0 0 0 14px #1a1a1a, 0 0 0 16px #2a2a2a, 0 20px 40px rgba(0,0,0,0.3);
        position: relative;
        display: flex;
        flex-direction: column;
      }
      
      #statusBarEl {
        height: 44px;
        background: #000;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        font-size: 14px;
        font-weight: 600;
      }
      
      /* Hide status bar on mobile devices */
      @media (max-width: 768px) {
        #statusBarEl {
          display: none;
        }
      }
      
      #screenContentEl {
        flex: 1;
        overflow-y: auto;
        background: #fff;
        max-height: 100%;
      }
      
      /* Mobile responsive styles */
      @media (max-width: 767px) {
        #mobileFrameCtn {
          min-height: 100vh;
        }
        
        #mobileFrameEl {
          width: 100%;
          height: 100vh;
          border-radius: 0;
          box-shadow: none;
        }
      }
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);
  }
}

// Define the custom element
customElements.define('mobile-frame', MobileFrame);
