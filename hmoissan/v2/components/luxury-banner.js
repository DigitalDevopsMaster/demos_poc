class LuxuryBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    padding: 2rem 0;
                    background-color: #0c1a16; /* Dark emerald green */
                    text-align: center;
                    margin: 2rem 0;
                }
                .banner-title {
                    font-size: 1.2rem;
                    color: #d4af37; /* Gold color */
                    font-weight: normal;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    margin: 0;
                    font-family: 'Garamond', serif;
                }
            </style>
            <h2 class="banner-title">The Art of High Jewelry</h2>
        `;
    }
}

customElements.define('luxury-banner', LuxuryBanner);
