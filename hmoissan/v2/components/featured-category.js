class FeaturedCategory extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    static get observedAttributes() {
        return ['image-url', 'title', 'subtitle', 'description', 'button-text', 'category-id', 'image-align'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const imageUrl = this.getAttribute('image-url') || '';
        const title = this.getAttribute('title') || 'Category Title';
        const subtitle = this.getAttribute('subtitle') || 'Category Subtitle';
        const description = this.getAttribute('description') || 'A compelling description of the category goes here, highlighting its unique appeal and craftsmanship.';
        const buttonText = this.getAttribute('button-text') || 'Explore';
        const imageAlign = this.getAttribute('image-align') || 'left';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 4rem 0;
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                }
                .featured-category-container {
                    display: flex;
                    flex-direction: ${imageAlign === 'right' ? 'row-reverse' : 'row'};
                    align-items: center;
                    gap: 2rem;
                    background-color: #f8f8f8;
                    padding: 2rem;
                    border-radius: 8px;
                }
                .image-container {
                    flex: 1;
                }
                .image-container img {
                    width: 100%;
                    height: auto;
                    display: block;
                    border-radius: 8px;
                }
                .text-container {
                    flex: 1;
                    padding: 0 2rem;
                }
                .subtitle {
                    font-size: 0.9rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .title {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin: 0.5rem 0;
                    color: #1a1a1a;
                }
                .description {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #444;
                    margin-bottom: 1.5rem;
                }
                .explore-button {
                    padding: 12px 24px;
                    background-color: #1a1a1a;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: bold;
                    transition: background-color 0.3s ease;
                }
                .explore-button:hover {
                    background-color: #333;
                }
                 @media (max-width: 768px) {
                    .featured-category-container {
                        flex-direction: column;
                        padding: 1rem;
                    }
                    .text-container {
                        padding: 1rem 0;
                        text-align: center;
                    }
                    .title {
                        font-size: 2rem;
                    }
                }
            </style>
            <div class="featured-category-container">
                <div class="image-container">
                    <img src="${imageUrl}" alt="${title}">
                </div>
                <div class="text-container">
                    <p class="subtitle">${subtitle}</p>
                    <h2 class="title">${title}</h2>
                    <p class="description">${description}</p>
                    <button class="explore-button">${buttonText}</button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const button = this.shadowRoot.querySelector('.explore-button');
        button.addEventListener('click', () => {
            const categoryId = this.getAttribute('category-id');
            if (categoryId) {
                this.dispatchEvent(new CustomEvent('featured-category-clicked', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        categoryId: categoryId,
                        title: this.getAttribute('title'),
                        subtitle: this.getAttribute('subtitle')
                    }
                }));
            }
        });
    }
}

customElements.define('featured-category', FeaturedCategory);
