/**
 * Account Menu Component
 * 
 * Displays a menu of account-related actions like settings, contact, and logout.
 */
class AccountMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('#logout-btn').addEventListener('click', this.handleLogout);
    this.shadowRoot.querySelector('#app-settings-btn').addEventListener('click', this.handleAppSettings);
  }

  handleLogout(e) {
    e.preventDefault();
    // In a real app, you would clear session/token and redirect.
    alert('Logout action triggered!');
  }

  handleAppSettings(e) {
    e.preventDefault();
    // This is a placeholder. In a native app context, this would
    // trigger a deep link to the app's settings screen.
    alert('Opening app settings...');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Avenir', sans-serif;
        }
        .account-menu-container {
          background-color: #fff;
          padding: 15px 25px;
          border-radius: 8px;
        }
        .menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .menu-item {
          border-bottom: 1px solid #eee;
        }
        .menu-item:last-child {
          border-bottom: none;
        }
        .menu-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          text-decoration: none;
          color: #333;
          font-size: 1rem;
        }
        .menu-link i {
          color: #aaa;
        }
        #logout-btn {
            color: #c0392b;
            font-weight: bold;
        }
      </style>
      <div class="account-menu-container">
        <ul class="menu-list">
          <li class="menu-item">
            <a href="#" id="app-settings-btn" class="menu-link">
              <span>App Settings</span>
              <i class="fas fa-chevron-right"></i>
            </a>
          </li>
          <li class="menu-item">
            <a href="#contact" class="menu-link">
              <span>Contact</span>
              <i class="fas fa-chevron-right"></i>
            </a>
          </li>
          <li class="menu-item">
            <a href="#privacy" class="menu-link">
              <span>Privacy</span>
              <i class="fas fa-chevron-right"></i>
            </a>
          </li>
          <li class="menu-item">
            <a href="#" id="logout-btn" class="menu-link">
              <span>Logout</span>
              <i class="fas fa-sign-out-alt"></i>
            </a>
          </li>
        </ul>
      </div>
    `;
  }
}

customElements.define('account-menu', AccountMenu);
