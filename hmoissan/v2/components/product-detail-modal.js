/**
 * Product Detail Modal Component
 * 
 * A full-screen modal to display detailed information about a single product.
 * 
 * Attributes:
 * - product-id: The ID of the product to display.
 * - visible: (Boolean) Controls the visibility of the modal.
 * 
 * Events:
 * - modal-closed: Fired when the modal is closed.
 * - add-to-cart: Fired when the user clicks the 'Add to Cart' button.
 */
class ProductDetailModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.productData = null;
  }

  static get observedAttributes() {
    return ['visible', 'product-id'];
  }

  get visible() {
    return this.hasAttribute('visible');
  }

  set visible(value) {
    if (value) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector('.close-button').addEventListener('click', () => this.hide());
    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => this.hide());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'visible') {
      this.updateVisibility();
    } else if (name === 'product-id' && newValue) {
      this.fetchProductData(newValue);
    }
  }

  fetchProductData(productId) {
    // In a real app, this would be an API call.
    // For now, we use mock data.
    const mockProduct = {
      id: productId,
      title: 'Emerald Cut Diamond Ring',
      description: 'A stunning emerald-cut diamond set in a platinum band. This timeless piece combines classic elegance with modern sophistication, making it the perfect choice for any special occasion.',
      price: '$7,850',
      images: [
        'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      variants: {
        size: ['5', '6', '7', '8'],
        metal: ['Platinum', 'Gold', 'White Gold']
      },
      relatedProducts: [
        { id: 'rp-001', title: 'Diamond Tennis Bracelet', subtitle: 'Luxury Series', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'rp-002', title: 'Emerald Drop Earrings', subtitle: 'Vintage Collection', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 'rp-003', title: 'Gold Chain Bracelet', subtitle: 'Classic Collection', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
      ]
    };
    this.productData = mockProduct;
    this.render();
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
    this.dispatchEvent(new CustomEvent('modal-closed', { bubbles: true, composed: true }));
  }

  updateVisibility() {
    const modal = this.shadowRoot.querySelector('.modal-container');
    if (this.visible) {
      modal.classList.add('visible');
    } else {
      modal.classList.remove('visible');
    }
  }

  render() {
    if (!this.productData) {
        this.shadowRoot.innerHTML = `
        <style>
          .overlay { display: none; }
          .modal-container { display: none; }
        </style>
        <div class="overlay"></div>
        <div class="modal-container">
            <button class="close-button">&times;</button>
        </div>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: 'Avenir', sans-serif;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 999;
        }
        .modal-container.visible .overlay {
          opacity: 1;
          pointer-events: auto;
        }
        .modal {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          max-width: 600px;
          height: 100%;
          background: #fff;
          box-shadow: -5px 0 25px rgba(0,0,0,0.2);
          transition: right 0.4s ease-in-out;
          overflow-y: auto;
          z-index: 1000;
        }
        .modal-container.visible .modal {
          right: 0;
        }
        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 2.5rem;
          color: #333;
          cursor: pointer;
        }
        .modal-content {
          padding: 40px;
        }
        .product-images {
          margin-bottom: 30px;
        }
        .main-image {
          width: 100%;
          height: 350px;
          margin-bottom: 10px;
          object-fit: cover;
        }
        .thumbnail-gallery {
          display: flex;
          gap: 10px;
        }
        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          cursor: pointer;
          border: 2px solid transparent;
        }
        .thumbnail.selected {
          border-color: #C0A062; /* Gold color */
        }
        .product-info h1 {
          font-size: 2rem;
          margin: 0 0 10px;
          font-weight: 500;
        }
        .product-info .price {
          font-size: 1.5rem;
          color: #C0A062;
          margin-bottom: 20px;
        }
        .product-info .description {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .variants .variant-group {
          margin-bottom: 20px;
        }
        .variants label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .variants select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .add-to-cart-btn {
          width: 100%;
          padding: 15px;
          background: #1a3a3a; /* Dark Emerald */
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        .add-to-cart-btn:hover {
          background: #244e4e;
        }
        .related-products {
          margin-top: 50px;
        }
        .related-products h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }
        .related-gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
      </style>

      <div class="modal-container">
        <div class="overlay"></div>
        <div class="modal">
          <button class="close-button">&times;</button>
          <div class="modal-content">
            <div class="product-images">
              <img class="main-image" src="${this.productData.images[0]}" alt="Product Image">
              <div class="thumbnail-gallery">
                ${this.productData.images.map((img, index) => `<img src="${img}" class="thumbnail ${index === 0 ? 'selected' : ''}" alt="Thumbnail ${index + 1}">`).join('')}
              </div>
            </div>

            <div class="product-info">
              <h1>${this.productData.title}</h1>
              <p class="price">${this.productData.price}</p>
              <p class="description">${this.productData.description}</p>
            </div>

            <div class="variants">
              ${Object.keys(this.productData.variants).map(key => `
                <div class="variant-group">
                  <label for="${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <select id="${key}" name="${key}">
                    ${this.productData.variants[key].map(option => `<option value="${option}">${option}</option>`).join('')}
                  </select>
                </div>
              `).join('')}
            </div>

            <button class="add-to-cart-btn">Add to Cart</button>

            <div class="related-products">
              <h2>You Might Also Like</h2>
              <div class="related-gallery">
                ${this.productData.relatedProducts.map(item => `
                  <product-card 
                    image-url="${item.image}" 
                    title="${item.title}" 
                    subtitle="${item.subtitle}"
                    product-id="${item.id}">
                  </product-card>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.addEventListeners();
  }

  addEventListeners() {
    const closeButton = this.shadowRoot.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => this.hide());
    }

    const overlay = this.shadowRoot.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', () => this.hide());
    }

    const mainImage = this.shadowRoot.querySelector('.main-image');
    this.shadowRoot.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', () => {
        if (mainImage) mainImage.src = thumb.src;
        const selected = this.shadowRoot.querySelector('.thumbnail.selected');
        if (selected) selected.classList.remove('selected');
        thumb.classList.add('selected');
      });
    });

    const addToCartButton = this.shadowRoot.querySelector('.add-to-cart-btn');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const variants = {};
            this.shadowRoot.querySelectorAll('.variants select').forEach(select => {
                variants[select.name] = select.value;
            });

            this.dispatchEvent(new CustomEvent('add-to-cart', {
                bubbles: true,
                composed: true,
                detail: {
                    productId: this.productData.id,
                    title: this.productData.title,
                    price: this.productData.price,
                    variants
                }
            }));
            // Optional: Show confirmation and close or update button text
            addToCartButton.textContent = 'Added to Cart!';
            setTimeout(() => { addToCartButton.textContent = 'Add to Cart'; }, 2000);
        });
    }

    this.shadowRoot.querySelectorAll('.related-gallery product-card').forEach(card => {
        card.addEventListener('product-clicked', (e) => {
            e.stopPropagation();
            const { productId } = e.detail;
            this.setAttribute('product-id', productId);
        });
    });
  }
}

customElements.define('product-detail-modal', ProductDetailModal);
