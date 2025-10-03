
document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('main-content');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const pages = {
        home: document.getElementById('home-page').innerHTML,
        products: document.getElementById('products-page').innerHTML,
        contact: document.getElementById('contact-page').innerHTML,
    };

    const productsData = [
        { id: 1, name: 'Aura Essential Tee', price: 29.99, img: './assets/t-shirt.jpg', category: 'Tee', size: ['S', 'M', 'L'], color: 'Green' },
        { id: 2, name: 'City Voyager Jacket', price: 89.99, img: './assets/jacket.webp', category: 'Jacket', size: ['M', 'L', 'XL'], color: 'Blue' },
        { id: 3, name: 'Urban Walker Shoes', price: 119.99, img: './assets/shoes.jpg', category: 'Accessory', size: ['M', 'L'], color: 'Brown' },
        { id: 4, name: 'Sunset Orange Hoodie', price: 59.99, img: './assets/Hoodie.webp', category: 'Jacket', size: ['S', 'M'], color: 'Orange' },
        { id: 5, name: 'Denim Classic Jeans', price: 79.99, img: './assets/jeans.jpg', category: 'Pants', size: ['S', 'M', 'L', 'XL'], color: 'Blue' },
        { id: 6, name: 'Leather Messenger Bag', price: 149.99, img: './assets/Bag.jpg', category: 'Accessory', size: [], color: 'Brown' },
        { id: 7, name: 'Minimalist Watch', price: 199.99, img: './assets/Watch.jpg', category: 'Accessory', size: [], color: 'Gray' },
        { id: 8, name: 'Canvas Backpack', price: 69.99, img: './assets/backpack.jpg', category: 'Accessory', size: [], color: 'Black' },
        { id: 9, name: 'Performance Chinos', price: 85.00, img: './assets/Pants.jpg', category: 'Pants', size: ['M', 'L'], color: 'Brown' },
        { id: 10, name: 'Linen Button-Down', price: 65.00, img: './assets/Shirt.jpg', category: 'Tee', size: ['S', 'M', 'L'], color: 'White' },
        { id: 11, name: 'Suede Loafers', price: 135.00, img: './assets/Loafers.jpg', category: 'Accessory', size: ['L', 'XL'], color: 'Brown' },
        { id: 12, name: 'Aviator Sunglasses', price: 95.00, img: './assets/Sunglass.jpg', category: 'Accessory', size: [], color: 'Black' },
    ];
    
    let cart = [];

    function navigateTo(page) {
        mainContent.innerHTML = pages[page];
        lucide.createIcons();

        navLinks.forEach(link => {
            link.classList.toggle('nav-link-active', link.dataset.page === page);
        });

        if (page === 'home' || page === 'products') {
            attachAddToCartListeners();
        }

        if (page === 'products') {
            const filterContent = document.getElementById('filters-content').innerHTML;
            document.querySelector('#filters-container').innerHTML = filterContent;
            document.querySelector('#filter-panel-container aside').innerHTML = filterContent;
            lucide.createIcons();

            renderProducts(productsData);
            setupFilters();
            setupMobileFilters();
        }

        if (page === 'contact') {
            setupContactForm();
        }

        mobileMenu.classList.add('hidden');
        window.scrollTo(0, 0);
    }

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    document.body.addEventListener('click', e => {
        const targetLink = e.target.closest('[data-page]');
        if (targetLink) {
            e.preventDefault();
            const page = targetLink.dataset.page;
            if (pages[page]) {
                navigateTo(page);
            }
        }
    });

    function renderProducts(productsToRender) {
        const productGrid = document.getElementById('product-grid');
        const noResults = document.getElementById('no-results');
        if (!productGrid) return;
        
        productGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
        
        productsToRender.forEach(product => {
            const productHTML = `
                <div class="product-card">
                    <img src="${product.img}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                    <button data-product-id="${product.id}" class="add-to-cart-btn">
                        <i data-lucide="shopping-cart" style="height: 1.25rem; width: 1.25rem;"></i>
                    </button>
                </div>
            `;
            productGrid.innerHTML += productHTML;
        });
        lucide.createIcons();
        attachAddToCartListeners();
    }

    function setupFilters() {
        const filterContexts = document.querySelectorAll('#filters-container, #filter-panel-container');
        if (filterContexts.length === 0) return;
        
        let activeFilters = {
            categories: [],
            price: 'all',
            size: null,
            color: null,
        };

        function applyFilters() {
            let filteredProducts = [...productsData];

            if (activeFilters.categories.length > 0) {
                filteredProducts = filteredProducts.filter(p => activeFilters.categories.includes(p.category));
            }
            if (activeFilters.price !== 'all') {
                const [min, max] = activeFilters.price.split('-').map(Number);
                filteredProducts = filteredProducts.filter(p => p.price >= min && p.price < max);
            }
            if (activeFilters.size) {
                filteredProducts = filteredProducts.filter(p => p.size.includes(activeFilters.size));
            }
                if (activeFilters.color) {
                filteredProducts = filteredProducts.filter(p => p.color === activeFilters.color);
            }
            renderProducts(filteredProducts);
        }
        
        function syncFiltersUI() {
                filterContexts.forEach(context => {
                context.querySelectorAll('.category-filter input').forEach(c => {
                    c.checked = activeFilters.categories.includes(c.value);
                });
                context.querySelectorAll('.price-filter input').forEach(r => {
                    r.checked = activeFilters.price === r.value;
                });
                context.querySelectorAll('.size-btn').forEach(btn => {
                        btn.classList.toggle('active', activeFilters.size === btn.dataset.size);
                });
                context.querySelectorAll('.color-swatch').forEach(s => {
                    s.classList.toggle('active', activeFilters.color === s.dataset.color);
                });
                });
        }
        
        filterContexts.forEach(context => {
            // Price radios
            context.querySelectorAll('.price-filter input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', e => {
                    activeFilters.price = e.target.value;
                    applyFilters();
                    syncFiltersUI();
                });
            });

            // Category checkboxes
            context.querySelectorAll('.category-filter input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    activeFilters.categories = Array.from(document.querySelectorAll('.category-filter input:checked')).map(i => i.value);
                    applyFilters();
                    syncFiltersUI();
                });
            });

            // Size buttons
            context.querySelectorAll('.size-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const size = button.dataset.size;
                    activeFilters.size = activeFilters.size === size ? null : size;
                    applyFilters();
                    syncFiltersUI();
                });
            });

            // Color swatches
            context.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.addEventListener('click', () => {
                    const color = swatch.dataset.color;
                    activeFilters.color = activeFilters.color === color ? null : color;
                    applyFilters();
                    syncFiltersUI();
                });
            });

            // Clear filters button
            context.querySelectorAll('.clear-filters-btn').forEach(button => {
                button.addEventListener('click', () => {
                    activeFilters = { categories: [], price: 'all', size: null, color: null };
                    syncFiltersUI();
                    applyFilters();
                });
            });
        });
    }

    const cartPanelContainer = document.getElementById('cart-panel-container');
    const cartPanel = document.getElementById('cart-panel');
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');

    function openCart() {
        cartPanelContainer.classList.remove('hidden');
        setTimeout(() => cartPanel.style.transform = 'translateX(0)', 10);
        renderCart();
    }

    function closeCart() {
        cartPanel.style.transform = 'translateX(100%)';
        setTimeout(() => cartPanelContainer.classList.add('hidden'), 300);
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function addToCart(productId) {
        const product = productsData.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        renderCart();
    }
    
    function changeQuantity(productId, newQuantity) {
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                if (newQuantity > 0) {
                    cartItem.quantity = newQuantity;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
            }
            updateCartCount();
            renderCart();
    }

    function renderCart() {
        if (cart.length === 0) {
            cartPanel.innerHTML = `
                <div class="cart-header">
                    <h3>Your Cart</h3>
                    <button id="close-cart-btn"><i data-lucide="x"></i></button>
                </div>
                <div class="cart-empty">
                    <i data-lucide="shopping-cart"></i>
                    <h4>Your cart is empty</h4>
                    <p>Looks like you haven't added anything yet.</p>
                </div>
            `;
        } else {
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartPanel.innerHTML = `
                <div class="cart-header">
                    <h3>Your Cart (${cart.reduce((s,i)=>s+i.quantity,0)})</h3>
                    <button id="close-cart-btn"><i data-lucide="x"></i></button>
                </div>
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item" data-product-id="${item.id}">
                            <img src="${item.img}" alt="${item.name}">
                            <div class="item-details">
                                <p>${item.name}</p>
                                <p>$${item.price.toFixed(2)}</p>
                                <div class="quantity-control">
                                    <button class="cart-quantity-btn" data-change="-1">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="cart-quantity-btn" data-change="1">+</button>
                                </div>
                            </div>
                            <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-footer">
                    <div class="subtotal">
                        <span>Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <button class="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            `;
        }
        lucide.createIcons();
    }
    
    function attachAddToCartListeners() {
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            if (button.dataset.listenerAttached) return;
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                addToCart(productId);
                openCart();
            });
            button.dataset.listenerAttached = true;
        });
    }

    cartIcon.addEventListener('click', openCart);
    cartPanelContainer.addEventListener('click', (e) => {
        if (e.target === cartPanelContainer || e.target.closest('#close-cart-btn')) {
            closeCart();
        }
        if (e.target.closest('.cart-quantity-btn')) {
            const button = e.target.closest('.cart-quantity-btn');
            const itemElem = button.closest('[data-product-id]');
            const productId = parseInt(itemElem.dataset.productId);
            const change = parseInt(button.dataset.change);
            const currentItem = cart.find(item => item.id === productId);
            changeQuantity(productId, currentItem.quantity + change);
        }
    });

    function setupMobileFilters() {
        const showBtn = document.getElementById('show-filters-btn');
        const panelContainer = document.getElementById('filter-panel-container');
        const panel = panelContainer?.querySelector('aside');
        
        if (!showBtn || !panelContainer || !panel) return;

        const openPanel = () => {
            panelContainer.classList.remove('hidden');
            setTimeout(() => panel.style.transform = 'translateX(0)', 10);
        };

        const closePanel = () => {
            panel.style.transform = 'translateX(-100%)';
            setTimeout(() => panelContainer.classList.add('hidden'), 300);
        };

        const closeBtnInPanel = panel.querySelector('.close-filters-btn');

        showBtn.addEventListener('click', openPanel);
        
        panelContainer.addEventListener('click', (e) => {
            if (e.target === panelContainer) { 
                closePanel();
            }
        });

        if(closeBtnInPanel) {
            closeBtnInPanel.addEventListener('click', closePanel);
        }
    }

    function setupContactForm() {
        const form = document.getElementById('contact-form');
        if(!form) return;

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const successMessage = document.getElementById('form-success-message');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            
            [name, email, message].forEach(input => {
                input.nextElementSibling.classList.add('hidden');
                input.classList.remove('error');
            });
            successMessage.classList.add('hidden');

            if (name.value.trim() === '') {
                isValid = false;
                name.nextElementSibling.classList.remove('hidden');
                name.classList.add('error');
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                isValid = false;
                email.nextElementSibling.classList.remove('hidden');
                email.classList.add('error');
            }

            if (message.value.trim() === '') {
                isValid = false;
                message.nextElementSibling.classList.remove('hidden');
                message.classList.add('error');
            }

            if (isValid) {
                console.log('Form Submitted:', { name: name.value, email: email.value, message: message.value });
                successMessage.classList.remove('hidden');
                form.reset();
            }
        });
    }

    navigateTo('home');
});
