let cart = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];
let activeDiscount = 0;

document.addEventListener("DOMContentLoaded", async () => {
    // 1. FETCH & INJECT GLOBAL LAYOUT COMPONENTS FIRST
    try {
        await includeComponent("global-header", "./components/header.html");
        await includeComponent("global-footer", "./components/footer.html");
    } catch (err) {
        console.warn("Layout components loading optimization note:", err);
    }

    // 2. INITIALIZE MENUS, SEARCH, CART, ETC.
    initResponsiveComponents();

    if (typeof initCartEngine === "function") {
        initCartEngine();
    }

    // 3. SYNC LOGIN / ADMIN UI AFTER HEADER EXISTS
    if (typeof window.syncHeaderAuthUI === "function") {
        window.syncHeaderAuthUI();
    }

    // 4. DEBUG USER SESSION
    console.log(
        "Current User:",
        JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"))
    );

    // 5. NOTIFY OTHER MODULES THAT LAYOUT IS READY
    document.dispatchEvent(
        new Event("LayoutComponentsLoaded")
    );
});

// 🔄 USE SYNCED LIVE STOCK COUNTERS INSTEAD OF NATIVE FILE REFS
let storedBaseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];

const renderCategoryView = (baseArray) => {
    // Sync local custom additions layer
    const customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
    const completeCatalog = [...baseArray, ...customProducts];

    // Example targeting the "fresh" category page filter:
    // Change "fresh" to match the category string for each specific page file layout
    const pageCategoryTarget = "fresh"; 
    
    const displayItems = completeCatalog.filter(p => p.category === pageCategoryTarget);

    // Call your normal page grid loop generation function here...
    // renderGridCards(displayItems);
};

if (storedBaseProducts.length === 0) {
    fetch("./data/products.json")
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(data));
            renderCategoryView(data);
        });
} else {
    renderCategoryView(storedBaseProducts);
}
// Add this globally so ANY page can access it instantly
window.getLiveInventory = async function() {
    try {
        let storedBase = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
        
        // If local storage is blank, pull from the master file once
        if (storedBase.length === 0) {
            const response = await fetch("./data/products.json");
            storedBase = await response.json();
            localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(storedBase));
        }
        
        const customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
        
        // Return the true, synchronized inventory array
        return [...storedBase, ...customProducts];
    } catch (error) {
        console.error("Inventory pipeline failure:", error);
        return JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
    }
};

// Clean Modular Component Injection Engine
async function includeComponent(targetId, filePath) {
    const element = document.getElementById(targetId);
    if (!element) return;
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            element.innerHTML = await response.text();
        } else {
            console.error(`Failed to fetch component file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error loading HTML layout snippet:`, error);
    }
}

// Group Interface Interactions Securely 
function initResponsiveComponents() {
    
    // ================= ELEMENTS LOOKUP =================
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const navOverlay = document.getElementById("nav-overlay");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search");
    const searchPanel = document.querySelector(".srch");
    const searchTrigger = document.getElementById("mobile-search-trigger");

    // ================= AUTOMATED ACTIVE PAGE LINK HIGHLIGHTS =================
    const currentUrl = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".main-nav a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        
        // 🛑 CRITICAL SAFE GUARD: Skip JavaScript button bindings, null tags, and dummy references
        if (!href || href === "#") return;

        if (href === currentUrl) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // ================= MOBILE NAVIGATION DRAWER TOGGLES =================
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mainNav.classList.toggle("open");

            if (navOverlay) {
                navOverlay.classList.toggle("visible");
            }
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener("click", () => {
            menuToggle?.classList.remove("active");
            mainNav?.classList.remove("open");
            navOverlay.classList.remove("visible");

            document
                .getElementById("cart-drawer")
                ?.classList.remove("open");
        });
    }

    // ================= RESPONSIVE SEARCH AND SUGGESTIONS (UPDATED) =================
    if (searchForm && searchInput) {
        let products = [];

        (async () => {
            try {
                // Check if our live tracking system already possesses the base catalog
                let storedBaseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
                
                if (storedBaseProducts.length === 0) {
                    const response = await fetch("./data/products.json");
                    storedBaseProducts = await response.json();
                    localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(storedBaseProducts));
                }
                
                // Read custom added items 
                const customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
                
                // Unify into a single search database that respects admin removals!
                products = [...storedBaseProducts, ...customProducts];
            } catch (error) {
                console.error("Failed to load products database:", error);
            }
        })();

        // Handle opening and focusing the mobile search container bar dropdown
        if (searchTrigger && searchPanel) {
            searchTrigger.addEventListener("click", (e) => {
                e.stopPropagation();
                searchPanel.classList.toggle("active");
                
                if (searchPanel.classList.contains("active")) {
                    searchInput.focus();
                }
            });
        }

        const searchBox = document.createElement("div");
        searchBox.id = "search-suggestions";
        searchInput.parentElement.style.position = "relative";
        searchInput.parentElement.appendChild(searchBox);

        function showSuggestions(query) {
            if (!query) {
                searchBox.innerHTML = "";
                searchBox.style.display = "none";
                return;
            }

            const matches = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );

            if (matches.length === 0) {
                searchBox.innerHTML = `
                    <div class="search-empty">
                        No products found
                    </div>
                `;
                searchBox.style.display = "block";
                return;
            }

            searchBox.innerHTML = matches
                .slice(0, 8)
                .map(product => {
                    const parsedPrice = typeof product.price === "number" ? "₦" + product.price.toLocaleString() : product.price;
                    return `
                        <a class="search-item" href="product.html?id=${product.id}">
                            <img src="${product.image}">
                            <div>
                                <strong>${product.name}</strong>
                                <span>${parsedPrice}</span>
                            </div>
                        </a>
                    `;
                }).join("");

            searchBox.style.display = "block";
        }

        searchInput.addEventListener("input", () => {
            showSuggestions(searchInput.value.trim());
        });

        document.addEventListener("click", e => {
            if (
                !searchInput.contains(e.target) &&
                !searchBox.contains(e.target) &&
                (!searchTrigger || !searchTrigger.contains(e.target))
            ) {
                searchBox.style.display = "none";
            }
        });
    }

    // ===================================================
    // SECRET ADMIN EASTER EGG INJECTOR (UPDATED)
    // ===================================================
    const logoElement = document.querySelector(".logo");
    if (logoElement) {
        logoElement.style.cursor = "pointer"; 
        
        logoElement.addEventListener("dblclick", () => {
            const activeUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER")) || 
                               JSON.parse(localStorage.getItem("BUYIT_ADMIN"));
            
            // Dynamic Role check replaces single-string dependency mapping
            if (activeUser && activeUser.role === "admin") {
                alert(`Admin signature recognized (${activeUser.name}). Opening control deck...`);
                window.location.href = "admin.html";
            } else {
                console.log("BuyIt brand signature verified.");
            }
        });
    }
}

// ===================================================
// CORE SHOPPING CART LOGIC ENGINE
// ===================================================
function initCartEngine() {
    const cartLink = document.querySelector(".cart-link");
    const cartDrawer = document.getElementById("cart-drawer");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const navOverlay = document.getElementById("nav-overlay");
    const applyPromoBtn = document.getElementById("apply-promo-btn");
    const promoInput = document.getElementById("promo-code-input");
    const promoMessage = document.getElementById("promo-message");

    // Toggle Side Cart Panel Drawer
    if (cartLink && cartDrawer) {
        cartLink.addEventListener("click", (e) => {
            e.preventDefault(); 
            cartDrawer.classList.toggle("open");
            if (navOverlay) navOverlay.classList.toggle("visible");
        });
    }

    if (closeCartBtn && cartDrawer) {
        closeCartBtn.addEventListener("click", () => {
            cartDrawer.classList.remove("open");
            if (navOverlay) navOverlay.classList.remove("visible");
        });
    }

    // Handle Sliding Drawer Coupon Validation
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener("click", () => {
            const code = promoInput.value.trim().toUpperCase();
            if (code === "SAVE10") {
                activeDiscount = 0.10;
                promoMessage.textContent = "Promo Applied! 10% Off.";
                promoMessage.className = "promo-msg success";
            } else if (code === "SUPERBUY") {
                activeDiscount = 0.20;
                promoMessage.textContent = "Mega Code Active! 20% Off.";
                promoMessage.className = "promo-msg success";
            } else {
                activeDiscount = 0;
                promoMessage.textContent = "Invalid Code.";
                promoMessage.className = "promo-msg error";
            }
            updateCartDOM();
        });
    }

    updateCartDOM();
}

window.addToCart = function(id, name, price, image) {
    const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    
    if (isNaN(numericPrice)) {
        console.error(`Invalid formatting item price match data parsing failed for: ${name}`);
        return;
    }

    // Keep item queries safe across alternate database layer mutations
    const existingProduct = cart.find(item => item.id.toString() === id.toString());

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price: numericPrice, image, quantity: 1 });
    }
    
    saveAndSyncCart();
    
    document.getElementById("cart-drawer")?.classList.add("open");
    document.getElementById("nav-overlay")?.classList.add("visible");
};

window.changeQuantity = function(id, delta) {
    const product = cart.find(item => item.id.toString() === id.toString());
    if (!product) return;
    
    product.quantity += delta;
    if (product.quantity <= 0) {
        cart = cart.filter(item => item.id.toString() !== id.toString());
    }
    saveAndSyncCart();
};

window.removeProductFromCart = function(id) {
    cart = cart.filter(item => item.id.toString() !== id.toString());
    saveAndSyncCart();
};

function saveAndSyncCart() {
    localStorage.setItem("BUYIT_CART", JSON.stringify(cart));
    updateCartDOM();
}

window.updateCartDOM = function() {
    const itemsContainer = document.getElementById("cart-drawer-items");
    const cartBadge = document.getElementById("cart-badge");
    const cartCountTitle = document.getElementById("cart-count-title");
    const subtotalLabel = document.getElementById("cart-subtotal");
    const discountRow = document.getElementById("discount-row");
    const discountLabel = document.getElementById("cart-discount");
    const totalLabel = document.getElementById("cart-total");

    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItemsCount;
        totalItemsCount > 0 ? cartBadge.classList.remove("hidden") : cartBadge.classList.add("hidden");
    }
    if (cartCountTitle) cartCountTitle.textContent = totalItemsCount;

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p style="text-align:center; padding: 40px 0; color:#888;">Your cart feels light. Start adding items!</p>`;
        if (subtotalLabel) subtotalLabel.textContent = "₦0";
        if (discountRow) discountRow.style.display = "none";
        if (totalLabel) totalLabel.textContent = "₦0";
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">₦${(item.price * item.quantity).toLocaleString()}</span>
                <div class="quantity-controls">
                    <button onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.id}', 1)">+</button>
                    <span style="margin-left: auto;"></span>
                    <button class="remove-item-btn" onclick="removeProductFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        </div>
    `).join("");

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = subtotal * activeDiscount;
    const finalTotal = subtotal - discountAmount;

    if (subtotalLabel) subtotalLabel.textContent = `₦${subtotal.toLocaleString()}`;
    
    if (activeDiscount > 0 && discountRow && discountLabel) {
        discountRow.style.display = "flex";
        discountLabel.textContent = `-₦${discountAmount.toLocaleString()}`;
    } else if (discountRow) {
        discountRow.style.display = "none";
    }

    if (totalLabel) totalLabel.textContent = `₦${finalTotal.toLocaleString()}`;
};

// ===================================================
// USER AUTHENTICATION STATE SYNC (UPDATED)
// ===================================================
window.syncHeaderAuthUI = function() {
    const authContainer = document.getElementById("auth-link-container");
    const adminContainer = document.getElementById("admin-link-container");
    if (!authContainer) return;

    const currentUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    const activeAdmin = JSON.parse(localStorage.getItem("BUYIT_ADMIN"));
    const loggedInUser = currentUser || activeAdmin;
    
    // Check if user role matches administration permission sets dynamically
    const isAdmin = Boolean(loggedInUser && loggedInUser.role === "admin");

    if (adminContainer) {
        if (isAdmin) {
            adminContainer.style.display = "block";
            adminContainer.innerHTML = `
                <a href="admin.html">
                    <i class="fa-solid fa-unlock-keyhole"></i> Admin Panel
                </a>
            `;
        } else {
            adminContainer.style.display = "none";
            adminContainer.innerHTML = "";
        }
    }

    if (loggedInUser) {
        authContainer.innerHTML = `
            <a href="#" id="logout-trigger" style="color: var(--color-primary);">
                <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </a>
        `;

        document.getElementById("logout-trigger")?.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("BUYIT_CURRENT_USER");
            localStorage.removeItem("BUYIT_ADMIN");
            alert("Logged out successfully.");
            window.location.href = "login.html";
        });
    } else {
        authContainer.innerHTML = `
            <a href="login.html">
                <i class="fa-solid fa-user"></i> Log In
            </a>
        `;
    }
};

// ===================================================
// GLOBAL WISHLIST ENGINE MODULE
// ===================================================
let wishlist = JSON.parse(localStorage.getItem("BUYIT_WISHLIST")) || [];

window.toggleWishlist = function(productId, event) {
    if (event) event.preventDefault(); 
    
    const index = wishlist.indexOf(productId.toString());
    if (index > -1) {
        wishlist.splice(index, 1); 
    } else {
        wishlist.push(productId.toString()); 
    }
    
    localStorage.setItem("BUYIT_WISHLIST", JSON.stringify(wishlist));
    window.updateWishlistUI();
};

window.updateWishlistUI = function() {
    const badge = document.getElementById("wishlist-badge");
    const headerIcon = document.getElementById("wishlist-icon-header");
    
    if (badge) {
        badge.textContent = wishlist.length;
        wishlist.length > 0 ? badge.classList.remove("hidden") : badge.classList.add("hidden");
    }
    
    if (headerIcon) {
        if (wishlist.length > 0) {
            headerIcon.className = "fa-solid fa-heart";
            headerIcon.style.color = "#ec4899";
        } else {
            headerIcon.className = "fa-regular fa-heart";
            headerIcon.style.color = "inherit";
        }
    }
    
    const productHeart = document.getElementById("product-page-heart");
    if (productHeart && window.productId) {
        if (wishlist.includes(window.productId.toString())) {
            productHeart.className = "fa-solid fa-heart";
            productHeart.style.color = "#ec4899";
        } else {
            productHeart.className = "fa-regular fa-heart";
            productHeart.style.color = "inherit";
        }
    }
};