/**
 * Profile Details Component
 * 
 * Displays and allows editing of user profile information.
 * 
 * Attributes:
 * - user-data: A JSON string representing the user's profile data.
 * 
 * Events:
 * - profile-updated: Fired when the user saves updated profile information.
 */
class ProfileDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._userData = null;
    this._isEditing = false;
  }

  static get observedAttributes() {
    return ['user-data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'user-data' && newValue) {
      try {
        this._userData = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Failed to parse user data for ProfileDetails:', e);
        this._userData = null;
      }
    }
  }

  connectedCallback() {
    if (!this._userData) {
      // Provide default data if none is passed
      this._userData = { name: 'Alexandra Dubois', email: 'alexandra.d@example.com' };
    }
    this.render();
  }

  toggleEdit(isEditing) {
    this._isEditing = isEditing;
    this.render();
  }

  saveProfile() {
    const nameInput = this.shadowRoot.getElementById('name');
    const emailInput = this.shadowRoot.getElementById('email');

    const updatedUserData = {
      ...this._userData,
      name: nameInput.value,
      email: emailInput.value
    };

    this.dispatchEvent(new CustomEvent('profile-updated', {
      detail: { userData: updatedUserData }
    }));

    this._userData = updatedUserData;
    this.toggleEdit(false);
  }

  render() {
    if (!this._userData) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Avenir', sans-serif;
        }
        .profile-container {
          background-color: #fff;
          padding: 25px;
          border-radius: 8px;
        }
        h2 {
          font-size: 1.2rem;
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .profile-field {
          margin-bottom: 15px;
        }
        .profile-field label {
          display: block;
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 5px;
        }
        .profile-field span, .profile-field input {
          font-size: 1rem;
        }
        .profile-field input {
          width: calc(100% - 24px);
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .button-container {
          margin-top: 20px;
          text-align: right;
        }
        .edit-btn, .save-btn, .cancel-btn {
          padding: 10px 20px;
          border-radius: 4px;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .edit-btn { background: #f4f4f4; border-color: #ddd; color: #333; }
        .save-btn { background: #1a3a3a; color: #fff; margin-right: 10px; }
        .cancel-btn { background: #f4f4f4; border-color: #ddd; color: #333; }
      </style>
      <div class="profile-container">
        <h2>My Profile</h2>
        ${this._isEditing ? `
          <div class="profile-field">
            <label for="name">Name</label>
            <input type="text" id="name" value="${this._userData.name}">
          </div>
          <div class="profile-field">
            <label for="email">Email</label>
            <input type="email" id="email" value="${this._userData.email}">
          </div>
          <div class="button-container">
            <button class="save-btn">Save</button>
            <button class="cancel-btn">Cancel</button>
          </div>
        ` : `
          <div class="profile-field">
            <label>Name</label>
            <span>${this._userData.name}</span>
          </div>
          <div class="profile-field">
            <label>Email</label>
            <span>${this._userData.email}</span>
          </div>
          <div class="button-container">
            <button class="edit-btn">Edit Profile</button>
          </div>
        `}
      </div>
    `;

    if (this._isEditing) {
      this.shadowRoot.querySelector('.save-btn').addEventListener('click', () => this.saveProfile());
      this.shadowRoot.querySelector('.cancel-btn').addEventListener('click', () => this.toggleEdit(false));
    } else {
      this.shadowRoot.querySelector('.edit-btn').addEventListener('click', () => this.toggleEdit(true));
    }
  }
}

customElements.define('profile-details', ProfileDetails);
