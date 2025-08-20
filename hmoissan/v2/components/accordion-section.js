/**
 * Accordion Section Component
 * 
 * A collapsible section with a title and content.
 * 
 * Attributes:
 * - title: The text to display in the section header.
 * - open: A boolean attribute to control the initial state (present for open).
 */
class AccordionSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    const header = this.shadowRoot.querySelector('.accordion-header');
    header.addEventListener('click', () => this.toggle());
  }

  toggle() {
    const content = this.shadowRoot.querySelector('.accordion-content');
    const icon = this.shadowRoot.querySelector('.accordion-icon i');
    const isOpen = this.hasAttribute('open');

    if (isOpen) {
      content.style.maxHeight = '0px';
      icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
      this.removeAttribute('open');
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
      this.setAttribute('open', '');
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Accordion Section';
    const isOpen = this.hasAttribute('open');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Avenir', sans-serif;
          border-bottom: 1px solid #eee;
        }
        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          cursor: pointer;
          background-color: #fff;
        }
        .accordion-title {
          font-size: 1.1rem;
          font-weight: 500;
        }
        .accordion-icon i {
          transition: transform 0.3s ease;
        }
        .accordion-content {
          max-height: ${isOpen ? '1000px' : '0px'};
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          background-color: #f9f9f9;
        }
        .content-padding {
            padding: 20px;
        }
      </style>
      <div class="accordion-section">
        <div class="accordion-header">
          <span class="accordion-title">${title}</span>
          <span class="accordion-icon">
            <i class="fas ${isOpen ? 'fa-chevron-down' : 'fa-chevron-right'}"></i>
          </span>
        </div>
        <div class="accordion-content">
            <div class="content-padding">
                <slot></slot>
            </div>
        </div>
      </div>
    `;

     // Set initial state after render
    if (isOpen) {
        const content = this.shadowRoot.querySelector('.accordion-content');
        content.style.maxHeight = content.scrollHeight + 'px';
    }
  }
}

customElements.define('accordion-section', AccordionSection);
