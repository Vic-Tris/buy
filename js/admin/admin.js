const API_BASE_URL = "http://localhost:5000/api";

// Fetching Dynamic Product Entries (Read from custom API)
async function fetchActiveInventory() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const inventoryItems = await response.json();
        
        renderInventoryTable(inventoryItems);
    } catch (error) {
        showToast("Backend Server Communication failure", "error");
    }
}

// Sending a New Product to your Server (Create)
async function handleNewProductSubmission(event) {
    event.preventDefault();
    
    const payload = {
        title: document.getElementById("prod-title").value,
        price: parseFloat(document.getElementById("prod-price").value),
        category: document.getElementById("prod-category").value,
        imageUrl: document.getElementById("prod-img-url").value,
        stockQuantity: parseInt(document.getElementById("prod-stock").value, 10)
    };

    const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        showToast("Product saved through your custom server API!", "success");
        closeModal();
        fetchActiveInventory();
    } else {
        showToast("Failed to process transaction", "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. EXTRA SECURE GATEKEEPER LOCK
    // ==========================================
    const admin = JSON.parse(localStorage.getItem("BUYIT_ADMIN"));

    if (!admin || admin.role !== "admin") {
        window.location.href = "login.html";
        return;
    }

    console.log("Access Granted. Activating Admin Console Workspace...");

    const adminLogoutBtn = document.getElementById("admin-logout");
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", () => {
            localStorage.removeItem("BUYIT_CURRENT_USER");
            localStorage.removeItem("BUYIT_ADMIN");
            alert("Logged out successfully.");
            window.location.href = "login.html";
        });
    }

    // ==========================================
    // 2. DATA INITIALIZATION & BOOTSTRAPPER 
    // ==========================================
    let historicalOrders = JSON.parse(localStorage.getItem("BUYIT_ORDERS")) || [];
    let customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
    let baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
    
    // Fallback load if baseline data isn't in LocalStorage yet
    if (baseProducts.length === 0 && window.allProductsData) { 
        baseProducts = window.allProductsData;
        localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(baseProducts));
    }

    // System Dashboard Display Hooks Lookups
    const revDisplay = document.getElementById("adm-total-sales");
    const transDisplay = document.getElementById("adm-total-orders");
    const prodDisplay = document.getElementById("adm-total-products");
    const mainPane = document.getElementById("admin-main-pane");

    // Modal Control Pointers Nodes
    const pModal = document.getElementById("product-modal");
    const pForm = document.getElementById("product-modal-form");
    const mTitle = document.getElementById("modal-action-title");
    const closePModalBtn = document.getElementById("close-pmodal-btn");

    // Menu Tab Button Interceptors
    const btnAnalytics = document.getElementById("tab-analytics");
    const btnProducts = document.getElementById("tab-products");
    const btnOrders = document.getElementById("tab-orders");
    const btnSettings = document.getElementById("tab-settings");

    // ==========================================
    // 3. METRICS & COUNTERS AGGREGATION UTILITIES
    // ==========================================
    function calculateSystemMetrics() {
        const totalRevenue = historicalOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const unifiedProductsCount = baseProducts.length + customProducts.length; 

        if (revDisplay) revDisplay.textContent = "₦" + totalRevenue.toLocaleString();
        if (transDisplay) transDisplay.textContent = historicalOrders.length;
        if (prodDisplay) prodDisplay.textContent = unifiedProductsCount;
    }

    // Initialize metrics globally on boot
    calculateSystemMetrics();

    const activeSession = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    if (activeSession && document.getElementById("active-operator-label")) {
    document.getElementById("active-operator-label").textContent = activeSession.name || "Administrator";
}

    // ==========================================
    // 4. WORKSPACE TAB CONTROLLER ACTIONS
    // ==========================================
    function showAnalyticsTab() {
        setActiveTabButton(btnAnalytics);
        
        let subtotalVolume = historicalOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
        let shippingVolume = historicalOrders.reduce((sum, o) => sum + (o.shipping || 0), 0);

        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar"><h3>Financial Performance Reports</h3></div>
                <div style="background:white; border:1px solid var(--color-border); border-radius:12px; padding:30px; line-height:1.8;">
                    <p><i class="fa-solid fa-coins" style="color:var(--color-primary); width:25px;"></i> <strong>Product Net Sales Volume:</strong> ₦${subtotalVolume.toLocaleString()}</p>
                    <p><i class="fa-solid fa-truck-ramp-box" style="color:#3b82f6; width:25px;"></i> <strong>Collected Logistics Fees:</strong> ₦${shippingVolume.toLocaleString()}</p>
                    <p><i class="fa-solid fa-wallet" style="color:#ec4899; width:25px;"></i> <strong>Gross Settlement Value:</strong> ₦${(subtotalVolume + shippingVolume).toLocaleString()}</p>
                    <hr style="border:none; border-top:1px solid var(--color-border); margin:20px 0;">
                    <p style="color:gray; font-size:0.8rem;"><i class="fa-solid fa-circle-info"></i> All tracking aggregates are compiled live from current browser storage instances.</p>
                </div>
            `;
        }
    }

    function showProductsTab() {
        setActiveTabButton(btnProducts);
        
        // Reload fresh snapshots from storage
        baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || baseProducts;
        customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
        const totalInventory = [...baseProducts, ...customProducts];

        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar">
                    <div class="inventory-toolbar" style="width:100%;">
                        <h3>Global Catalog & Inventory Stock</h3>
                        <div class="inventory-actions" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:10px;">
                            <input type="text" id="inventory-search" class="inventory-search" placeholder="Search product, SKU or category..." style="padding:8px; border:1px solid #cbd5e1; border-radius:6px; min-width:220px;">
                            <select id="filter-category" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                                <option value="">All Categories</option>
                                <option value="fresh">Fresh Produce</option>
                                <option value="meat_seafood">Meat &amp; Seafood</option>
                                <option value="dairy_eggs">Dairy &amp; Eggs</option>
                                <option value="bakery">Bakery</option>
                                <option value="beverages">Beverages</option>
                                <option value="snacks">Snacks &amp; Confectionery</option>
                                <option value="frozen_foods">Frozen Foods</option>
                                <option value="canned_packaged">Canned &amp; Packaged Foods</option>
                                <option value="cereals_breakfast">Cereals &amp; Breakfast</option>
                                <option value="condiments_spices">Condiments &amp; Spices</option>
                                <option value="personal_care_hygiene">Personal Care &amp; Hygiene</option>
                                <option value="household_cleaning">Household &amp; Cleaning</option>
                                <option value="baby_products">Baby Products</option>
                                <option value="pet_supplies">Pet Supplies</option>
                                <option value="health_wellness">Health &amp; Wellness</option>
                                <option value="phones">Electronics &amp; Gadgets</option>
                                <option value="wears">Clothing &amp; Accessories</option>
                                <option value="home_ele">Home Appliances</option>
                                <option value="kitchen">Kitchen Utensils</option>
                                <option value="stationery_office">Stationery &amp; Office</option>
                                <option value="automobile">Automotive</option>
                                <option value="sports_outdoors">Sports &amp; Outdoors</option>
                                <option value="toys_games">Toys &amp; Games</option>
                            </select>
                            <select id="filter-price" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                                <option value="">All Prices</option>
                                <option value="low">Under ₦5,000</option>
                                <option value="mid">₦5,000 - ₦20,000</option>
                                <option value="high">Above ₦20,000</option>
                            </select>
                            <select id="filter-type" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                                <option value="">All Products</option>
                                <option value="base">Base Products</option>
                                <option value="custom">Custom Products</option>
                            </select>
                            <button class="action-trigger-btn" id="add-new-sku-trigger"><i class="fa-solid fa-plus"></i> Add Product</button>
                        </div>
                    </div>
                </div>
                
                <div class="table-scroll-wrapper" style="overflow-x: auto; width:100%; margin-top:15px;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Item Name</th>
                                <th>Category</th>
                                <th>Base Price</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-table-body">
                            </tbody>
                    </table>
                </div>
            `;

            // Isolated Local Table Body UI Builder
            const updateTableUI = (filteredItems) => {
                const tbody = document.getElementById("inventory-table-body");
                if (!tbody) return;

                if (filteredItems.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#64748b;">No products match selected search parameters.</td></tr>`;
                    return;
                }

                tbody.innerHTML = filteredItems.map(p => {
                    const isCustom = String(p.id).includes("CUSTOM");
                    return `
                        <tr>
                            <td><img src="${p.image}" class="thumb-inline" onerror="this.src='./images/default-placeholder.jpg'"></td>
                            <td>
                                <strong>${p.name}</strong>
                                <span style="font-size:.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; ${isCustom ? 'background:#dcfce7; color:#166534;' : 'background:#f1f5f9; color:#475569;'}">
                                    ${isCustom ? 'Custom' : 'Base'}
                                </span>
                                <br><span style="font-size:0.7rem; color:#94a3b8; font-family:monospace;">ID: ${p.id}</span>
                            </td>
                            <td><span style="background:#e2e8f0; padding:3px 8px; border-radius:6px; font-size:.75rem; text-transform: capitalize;">${p.category.replace('_', ' ')}</span></td>
                            <td>₦${Number(p.price).toLocaleString()}</td>
                            <td>
                                <button onclick="deleteProductSKU('${p.id}')" class="row-action-btn btn-del">
                                    <i class="fa-solid fa-trash-can"></i> Remove Stock
                                </button>
                            </td>
                        </tr>
                    `;
                }).join("");
            };

            // Master Composite Filtering Loop Function
            const runPipelineFiltering = () => {
                const keyword = document.getElementById("inventory-search")?.value.toLowerCase().trim() || "";
                const category = document.getElementById("filter-category")?.value || "";
                const price = document.getElementById("filter-price")?.value || "";
                const type = document.getElementById("filter-type")?.value || "";

                const subset = totalInventory.filter(product => {
                    const matchesSearch = !keyword || 
                        product.name.toLowerCase().includes(keyword) ||
                        product.category.toLowerCase().includes(keyword) ||
                        String(product.id).toLowerCase().includes(keyword);

                    const matchesCategory = !category || product.category === category;

                    let matchesPrice = true;
                    const numPrice = Number(product.price);
                    if (price === "low") matchesPrice = numPrice < 5000;
                    else if (price === "mid") matchesPrice = numPrice >= 5000 && numPrice <= 20000;
                    else if (price === "high") matchesPrice = numPrice > 20000;

                    let matchesType = true;
                    if (type === "base") matchesType = !String(product.id).includes("CUSTOM");
                    else if (type === "custom") matchesType = String(product.id).includes("CUSTOM");

                    return matchesSearch && matchesCategory && matchesPrice && matchesType;
                });

                updateTableUI(subset);
            };

            // Bind Event Listeners immediately to the structural layout controls
            ["inventory-search", "filter-category", "filter-price", "filter-type"].forEach(id => {
                document.getElementById(id)?.addEventListener("input", runPipelineFiltering);
                document.getElementById(id)?.addEventListener("change", runPipelineFiltering);
            });

            // Initial baseline draw execution
            updateTableUI(totalInventory);

            // Set up open action modal handler cleanly
            document.getElementById("add-new-sku-trigger").onclick = () => {
                pForm.reset();
                document.getElementById("edit-product-id").value = "";
                mTitle.textContent = "Inject New Product SKU";
                pModal.classList.add("open");
            };
        }
    }

    function showOrdersTab() {
        setActiveTabButton(btnOrders);

        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar table-scroll-wrapper"><h3>System Fulfillment Pipeline</h3></div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Client</th>
                            <th>Payment Mode</th>
                            <th>Total Settlement</th>
                            <th>Fulfillment Tracking</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${historicalOrders.map((o, idx) => `
                            <tr>
                                <td><strong>#${o.orderId}</strong></td>
                                <td>${o.customer}<br><span style="font-size:0.75rem; color:gray;">${o.userEmail}</span></td>
                                <td>${o.paymentMethod}</td>
                                <td style="font-weight:700; color:var(--color-primary);">₦${o.total.toLocaleString()}</td>
                                <td>
                                    <select onchange="updateOrderStatus(${idx}, this.value)" style="padding:5px; font-size:0.8rem; border-radius:6px;">
                                        <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                        <option value="Shipped Out" ${o.status === 'Shipped Out' ? 'selected' : ''}>Shipped Out</option>
                                        <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                        <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        `).join("")}
                        ${historicalOrders.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:gray; padding:30px;">Fulfillment pipe logs currently stand empty.</td></tr>` : ""}
                    </tbody>
                </table>
            `;
        }
    }

    function showSettingsTab() {
        setActiveTabButton(btnSettings);

        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar"><h3>System Settings & Multi-Admin Access</h3></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 10px;">
                    <div style="background: white; padding: 20px; border: 1px solid var(--color-border); border-radius: 12px;">
                        <h4 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
                            <i class="fa-solid fa-user-gear"></i> Profile Settings
                        </h4>
                        <form id="admin-profile-form">
                            <div class="form-group" style="margin-bottom: 12px;">
                                <label style="font-weight: 600; font-size: 0.85rem; display:block; margin-bottom:4px;">Display Name</label>
                                <input type="text" id="admin-display-name" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 15px;">
                                <label style="font-weight: 600; font-size: 0.85rem; display:block; margin-bottom:4px;">Update Password</label>
                                <input type="password" id="admin-new-password" placeholder="Enter new password token" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px;">
                            </div>
                            <button type="submit" style="background: #1e293b; color: #22c55e; border: 1px solid #22c55e; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%;">
                                Save Profile Changes
                            </button>
                        </form>
                    </div>
                    <div style="background: white; padding: 20px; border: 1px solid var(--color-border); border-radius: 12px;">
                        <h4 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
                            <i class="fa-solid fa-user-plus"></i> Provision New Admin Account
                        </h4>
                        <form id="create-admin-form">
                            <div class="form-group" style="margin-bottom: 12px;">
                                <label style="font-weight: 600; font-size: 0.85rem; display:block; margin-bottom:4px;">Full Name</label>
                                <input type="text" id="new-admin-name" placeholder="e.g., Jane Doe" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 12px;">
                                <label style="font-weight: 600; font-size: 0.85rem; display:block; margin-bottom:4px;">Email Address</label>
                                <input type="email" id="new-admin-email" placeholder="manager@fevicstore.com" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 15px;">
                                <label style="font-weight: 600; font-size: 0.85rem; display:block; margin-bottom:4px;">Assign Access Password</label>
                                <input type="password" id="new-admin-password" placeholder="Minimum 4 characters" required style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px;">
                            </div>
                            <button type="submit" style="background: #22c55e; color: #1e293b; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%;">
                                Create Admin Credentials
                            </button>
                        </form>
                    </div>
                </div>
            `;

            const currentSession = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
            if (currentSession && document.getElementById("admin-display-name")) {
                document.getElementById("admin-display-name").value = currentSession.name || "Administrator";
            }
            wireSettingsForms();
        }
    }

    function wireSettingsForms() {
        const profileForm = document.getElementById("admin-profile-form");
        const createForm = document.getElementById("create-admin-form");

        if (profileForm) {
            profileForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const updatedName = document.getElementById("admin-display-name").value.trim();
                const newPassword = document.getElementById("admin-new-password").value;
                const currentSession = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));

                let adminRegistry = JSON.parse(localStorage.getItem("BUYIT_ADMINS_REGISTRY")) || [
                    { email: "admin@fevicstore.com", name: "Administrator", password: "admin123" }
                ];

                const matchIndex = adminRegistry.findIndex(a => a.email.toLowerCase() === currentSession.email.toLowerCase());
                const updatedAccountObj = { email: currentSession.email, name: updatedName, password: newPassword, role: "admin" };

                if (matchIndex !== -1) adminRegistry[matchIndex] = updatedAccountObj;
                else adminRegistry.push(updatedAccountObj);

                localStorage.setItem("BUYIT_ADMINS_REGISTRY", JSON.stringify(adminRegistry));
                localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(updatedAccountObj));
                localStorage.setItem("BUYIT_ADMIN", JSON.stringify(updatedAccountObj));

                alert("Profile credentials updated successfully.");
                showSettingsTab();
            });
        }

        if (createForm) {
            createForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const newName = document.getElementById("new-admin-name").value.trim();
                const newEmail = document.getElementById("new-admin-email").value.trim().toLowerCase();
                const newPassword = document.getElementById("new-admin-password").value;

                let adminRegistry = JSON.parse(localStorage.getItem("BUYIT_ADMINS_REGISTRY")) || [
                    { email: "admin@fevicstore.com", name: "Administrator", password: "admin123" }
                ];

                if (adminRegistry.some(a => a.email.toLowerCase() === newEmail)) {
                    alert("An administrator account is already associated with this email.");
                    return;
                }

                adminRegistry.push({ email: newEmail, name: newName, password: newPassword, role: "admin" });
                localStorage.setItem("BUYIT_ADMINS_REGISTRY", JSON.stringify(adminRegistry));
                
                alert(`Account configured successfully for ${newName}!`);
                createForm.reset();
            });
        }
    }

    // ==========================================
    // 5. BUSINESS LOGIC STORAGE WRITERS
    // ==========================================
    if (pForm) {
        pForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const authInput = document.getElementById("prod-admin-auth").value;
            const currentSession = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
            
            let adminRegistry = JSON.parse(localStorage.getItem("BUYIT_ADMINS_REGISTRY")) || [
                { email: "admin@fevicstore.com", name: "Administrator", password: "admin123" }
            ];

            const activeAdminRecord = adminRegistry.find(a => a.email.toLowerCase() === currentSession.email.toLowerCase());
            const realPassword = activeAdminRecord ? activeAdminRecord.password : "admin123";

            if (authInput !== realPassword) {
                alert("Security Authorization Failed: Invalid admin confirmation password.");
                return;
            }

            const name = document.getElementById("prod-name").value.trim();
            const price = parseFloat(document.getElementById("prod-price").value);
            const category = document.getElementById("prod-category").value;
            const urlInput = document.getElementById("prod-img").value.trim();
            const fileInput = document.getElementById("prod-img-file");

            const saveProductSKU = (finalImageSource) => {
                const newSku = {
                    id: "CUSTOM-" + Math.floor(1000 + Math.random() * 9000),
                    name: name,
                    price: price,
                    image: finalImageSource || "./images/default-placeholder.jpg",
                    category: category
                };

                customProducts.push(newSku);
                localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(customProducts));
                
                if (pModal) pModal.classList.remove("open");
                pForm.reset();
                
                calculateSystemMetrics();
                showProductsTab();
            };

            if (fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    saveProductSKU(event.target.result);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                saveProductSKU(urlInput);
            }
        });
    }

    // Expose Deletion Function Globally to Window Node Scope
    window.deleteProductSKU = function(id) {
        if (!confirm("Are you sure you want to permanently strip this product SKU out of your active display shelves?")) return;

        let localCustom = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
        const initialCustomLength = localCustom.length;
        localCustom = localCustom.filter(p => p.id.toString() !== id.toString());
        
        if (localCustom.length !== initialCustomLength) {
            localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(localCustom));
            customProducts = localCustom;
        } else {
            let localBase = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
            localBase = localBase.filter(p => p.id.toString() !== id.toString());
            localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(localBase));
            baseProducts = localBase;
        }

        alert("Inventory Registry updated successfully.");
        calculateSystemMetrics();
        showProductsTab();
    };

    window.updateOrderStatus = function(orderIndex, newStatus) {
        historicalOrders[orderIndex].status = newStatus;
        localStorage.setItem("BUYIT_ORDERS", JSON.stringify(historicalOrders));
        alert(`Order status updated to "${newStatus}" successfully!`);
    };

    if (closePModalBtn) {
        closePModalBtn.onclick = () => {
            pModal.classList.remove("open");
        };
    }

    function setActiveTabButton(targetBtn) {
        [btnAnalytics, btnProducts, btnOrders, btnSettings].forEach(btn => btn?.classList.remove("active"));
        if (targetBtn) targetBtn.classList.add("active");
    }

    // ==========================================
    // 6. MENU ROUTING INITIALIZERS
    // ==========================================
    btnAnalytics?.addEventListener("click", showAnalyticsTab);
    btnProducts?.addEventListener("click", showProductsTab);
    btnOrders?.addEventListener("click", showOrdersTab);
    btnSettings?.addEventListener("click", showSettingsTab);

    // Initial default viewport tab trigger load
    showAnalyticsTab();
});