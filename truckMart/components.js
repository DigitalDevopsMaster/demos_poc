// Web Components for TruckMart

// Navigation Component
class TruckNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav style="
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                position: sticky;
                top: 0;
                z-index: 1000;
            ">
                <div class="container" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                ">
                    <div style="display: flex; align-items: center;">
                        <a href="index.html" style="
                            font-size: 1.8rem;
                            font-weight: 700;
                            color: #667eea;
                            text-decoration: none;
                            display: flex;
                            align-items: center;
                        ">
                            <i class="fas fa-truck" style="margin-right: 10px;"></i>
                            TruckMart
                        </a>
                    </div>
                    <div style="display: flex; align-items: center; gap: 30px;">
                        <a href="index.html" style="text-decoration: none; color: #333; font-weight: 500;">Inicio</a>
                        <a href="listings.html" style="text-decoration: none; color: #333; font-weight: 500;">Camionetas</a>
                        <a href="sell.html" style="text-decoration: none; color: #333; font-weight: 500;">Vender</a>
                        <a href="about.html" style="text-decoration: none; color: #333; font-weight: 500;">Nosotros</a>
                        <a href="contact.html" style="text-decoration: none; color: #333; font-weight: 500;">Contacto</a>
                        <div style="position: relative; margin-left: 20px;">
                            <a href="profile.html" style="
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                text-decoration: none;
                                color: #333;
                                font-weight: 500;
                                padding: 8px 15px;
                                border-radius: 20px;
                                background: #f8f9fa;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
                                <div style="
                                    width: 30px; 
                                    height: 30px; 
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                    border-radius: 50%; 
                                    display: flex; 
                                    align-items: center; 
                                    justify-content: center;
                                    color: white;
                                    font-size: 0.8rem;
                                    font-weight: 600;
                                ">JD</div>
                                <span>Mi Cuenta</span>
                                <i class="fas fa-chevron-down" style="font-size: 0.8rem;"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
}

// Search Bar Component
class TruckSearchBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                margin: 0 20px;
            ">
                <div style="
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr auto;
                    gap: 20px;
                    align-items: end;
                ">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Marca</label>
                        <select style="
                            width: 100%;
                            padding: 12px 15px;
                            border: 2px solid #e1e5e9;
                            border-radius: 8px;
                            font-size: 16px;
                        ">
                            <option>Todas las marcas</option>
                            <option>Ford</option>
                            <option>Chevrolet</option>
                            <option>RAM</option>
                            <option>Toyota</option>
                            <option>Nissan</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Precio Máximo</label>
                        <select style="
                            width: 100%;
                            padding: 12px 15px;
                            border: 2px solid #e1e5e9;
                            border-radius: 8px;
                            font-size: 16px;
                        ">
                            <option>Sin límite</option>
                            <option>$200,000</option>
                            <option>$300,000</option>
                            <option>$400,000</option>
                            <option>$500,000</option>
                            <option>$600,000+</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Ubicación</label>
                        <select style="
                            width: 100%;
                            padding: 12px 15px;
                            border: 2px solid #e1e5e9;
                            border-radius: 8px;
                            font-size: 16px;
                        ">
                            <option>Todas las ciudades</option>
                            <option>Ciudad de México</option>
                            <option>Guadalajara</option>
                            <option>Monterrey</option>
                            <option>Puebla</option>
                            <option>Tijuana</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" style="
                        height: 50px;
                        padding: 0 30px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-search"></i>
                        Buscar
                    </button>
                </div>
            </div>
        `;
    }
}

// Truck Card Component
class TruckCard extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute('data-id');
        const title = this.getAttribute('data-title');
        const price = this.getAttribute('data-price');
        const year = this.getAttribute('data-year');
        const mileage = this.getAttribute('data-mileage');
        const location = this.getAttribute('data-location');
        const image = this.getAttribute('data-image');

        this.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                cursor: pointer;
            " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 15px 30px rgba(0,0,0,0.15)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.1)'"
               onclick="window.location.href='truck-detail.html?id=${id}'">
                <div style="position: relative;">
                    <img src="${image}" alt="${title}" style="
                        width: 100%;
                        height: 250px;
                        object-fit: cover;
                    ">
                    <div style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: rgba(255,255,255,0.9);
                        padding: 8px;
                        border-radius: 50%;
                        cursor: pointer;
                    ">
                        <i class="far fa-heart" style="color: #667eea;"></i>
                    </div>
                </div>
                <div style="padding: 25px;">
                    <h3 style="
                        font-size: 1.3rem;
                        margin-bottom: 15px;
                        color: #333;
                        font-weight: 600;
                    ">${title}</h3>
                    <div style="
                        font-size: 1.8rem;
                        font-weight: 700;
                        color: #667eea;
                        margin-bottom: 20px;
                    ">${price}</div>
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 20px;
                    ">
                        <div style="display: flex; align-items: center; gap: 8px; color: #666;">
                            <i class="fas fa-calendar"></i>
                            <span>${year}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: #666;">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${mileage}</span>
                        </div>
                    </div>
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #666;
                        margin-bottom: 20px;
                    ">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;">
                        Ver Detalles
                    </button>
                </div>
            </div>
        `;
    }
}

// Filter Sidebar Component
class FilterSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div>
                <h3 style="margin-bottom: 25px; color: #333; font-size: 1.3rem;">Filtros</h3>
                
                <div style="margin-bottom: 30px;">
                    <h4 style="margin-bottom: 15px; color: #333;">Marca</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${['Ford', 'Chevrolet', 'RAM', 'Toyota', 'Nissan'].map(brand => `
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="checkbox" style="margin: 0;">
                                <span>${brand}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h4 style="margin-bottom: 15px; color: #333;">Rango de Precio</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <input type="range" min="100000" max="800000" value="400000" style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #666;">
                            <span>$100,000</span>
                            <span>$800,000</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h4 style="margin-bottom: 15px; color: #333;">Año</h4>
                    <div style="display: flex; gap: 10px;">
                        <select style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option>Desde</option>
                            ${Array.from({length: 10}, (_, i) => 2024 - i).map(year => `<option>${year}</option>`).join('')}
                        </select>
                        <select style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <option>Hasta</option>
                            ${Array.from({length: 10}, (_, i) => 2024 - i).map(year => `<option>${year}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h4 style="margin-bottom: 15px; color: #333;">Kilometraje</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${['0 - 30,000 km', '30,000 - 60,000 km', '60,000 - 100,000 km', '100,000+ km'].map(range => `
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="radio" name="mileage" style="margin: 0;">
                                <span>${range}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                    Aplicar Filtros
                </button>
            </div>
        `;
    }
}

// Footer Component
class TruckFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer style="
                background: #2c3e50;
                color: white;
                padding: 60px 0 30px;
                margin-top: 80px;
            ">
                <div class="container">
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 40px;
                        margin-bottom: 40px;
                    ">
                        <div>
                            <h3 style="
                                font-size: 1.5rem;
                                margin-bottom: 20px;
                                color: #667eea;
                            ">TruckMart</h3>
                            <p style="
                                line-height: 1.6;
                                color: #bdc3c7;
                                margin-bottom: 20px;
                            ">La plataforma más confiable para comprar y vender camionetas usadas en México.</p>
                            <div style="display: flex; gap: 15px;">
                                <a href="#" style="
                                    color: #667eea;
                                    font-size: 1.5rem;
                                    transition: color 0.3s ease;
                                "><i class="fab fa-facebook"></i></a>
                                <a href="#" style="
                                    color: #667eea;
                                    font-size: 1.5rem;
                                    transition: color 0.3s ease;
                                "><i class="fab fa-twitter"></i></a>
                                <a href="#" style="
                                    color: #667eea;
                                    font-size: 1.5rem;
                                    transition: color 0.3s ease;
                                "><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: 20px;">Enlaces Rápidos</h4>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 10px;">
                                    <a href="listings.html" style="color: #bdc3c7; text-decoration: none;">Ver Camionetas</a>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <a href="sell.html" style="color: #bdc3c7; text-decoration: none;">Vender mi Camioneta</a>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <a href="about.html" style="color: #bdc3c7; text-decoration: none;">Nosotros</a>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <a href="contact.html" style="color: #bdc3c7; text-decoration: none;">Contacto</a>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: 20px;">Soporte</h4>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin-bottom: 10px;">
                                    <a href="#" style="color: #bdc3c7; text-decoration: none;">Centro de Ayuda</a>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <a href="#" style="color: #bdc3c7; text-decoration: none;">Términos y Condiciones</a>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <a href="#" style="color: #bdc3c7; text-decoration: none;">Política de Privacidad</a>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <a href="#" style="color: #bdc3c7; text-decoration: none;">FAQ</a>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: 20px;">Contacto</h4>
                            <div style="color: #bdc3c7; line-height: 1.8;">
                                <p><i class="fas fa-phone" style="margin-right: 10px; color: #667eea;"></i> +52 55 1234 5678</p>
                                <p><i class="fas fa-envelope" style="margin-right: 10px; color: #667eea;"></i> info@truckmart.mx</p>
                                <p><i class="fas fa-map-marker-alt" style="margin-right: 10px; color: #667eea;"></i> Ciudad de México, México</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="
                        border-top: 1px solid #34495e;
                        padding-top: 30px;
                        text-align: center;
                        color: #bdc3c7;
                    ">
                        <p>&copy; 2024 TruckMart. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Register all components
customElements.define('truck-navbar', TruckNavbar);
customElements.define('truck-search-bar', TruckSearchBar);
customElements.define('truck-card', TruckCard);
customElements.define('filter-sidebar', FilterSidebar);
customElements.define('truck-footer', TruckFooter);
