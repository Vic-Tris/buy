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

    // System Dashboard Display Hooks Lookups
    const revDisplay = document.getElementById("adm-total-sales");
    const transDisplay = document.getElementById("adm-total-orders");
    const prodDisplay = document.getElementById("adm-total-products");
    const mainPane = document.getElementById("admin-main-pane");

    // Modal Control Pointers Nodes
    const pModal = document.getElementById("product-modal");
    const pForm = document.getElementById("product-modal-form");
    const mTitle = document.getElementById("modal-action-title");

    // Menu Tab Button Interceptors
    const btnAnalytics = document.getElementById("tab-analytics");
    const btnProducts = document.getElementById("tab-products");
    const btnOrders = document.getElementById("tab-orders");
    const btnSettings = document.getElementById("tab-settings"); // Added for settings navigation

    // ==========================================
    // 3. METRICS & COUNTERS AGGREGATION UTILITIES
    // ==========================================
    function calculateSystemMetrics() {
        const totalRevenue = historicalOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const baseProductsCount = 23 + customProducts.length; 

        if (revDisplay) revDisplay.textContent = "₦" + totalRevenue.toLocaleString();
        if (transDisplay) transDisplay.textContent = historicalOrders.length;
        if (prodDisplay) prodDisplay.textContent = baseProductsCount;
    }

    // ==========================================
    // 4. WORKSPACE TAB CONTROLLER ACTIONS RENDERERS
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
        
        // 📦 UNIFY ALL INVENTORY LAYERS (Base Items + Custom Dynamic SKUs)
        // Fetch base products from global memory if you already stored them, else let's reference them dynamically
        let baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
        
        // Fallback initialization if your base products array hasn't been cached into local storage yet
        if (baseProducts.length === 0 && window.allProductsData) { 
            baseProducts = window.allProductsData;
            localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(baseProducts));
        }

        // Combine both sources into a unified registry pipeline
        const totalInventory = [...baseProducts, ...customProducts];
        
        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar">
                    <h3>Global Catalog & Inventory Stock</h3>
                    <button class="action-trigger-btn" id="add-new-sku-trigger"><i class="fa-solid fa-plus"></i> Inject SKU</button>
                </div>
                 <div class="header-actions">
      <div class="srch">
         <form id="search-form">
          <input type="search" id="search" placeholder="Search products..." autocomplete="off">
          <button type="submit">Search</button>
        </form>
      </div>
      
      <i class="fa-solid fa-magnifying-glass search-trigger" id="mobile-search-trigger" style="cursor: pointer; font-size: 1.2rem;"></i>

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
                    <tbody>
                        ${totalInventory.map(p => `
                            <tr>
                                <td><img src="${p.image}" class="thumb-inline" onerror="this.src='./images/default-placeholder.jpg'"></td>
                                <td><strong>${p.name}</strong> ${p.id.toString().includes('CUSTOM') ? '<span style="font-size:0.7rem; background:#dcfce7; color:#166534; padding:2px 4px; border-radius:4px; margin-left:5px;">Custom</span>' : '<span style="font-size:0.7rem; background:#f1f5f9; color:#475569; padding:2px 4px; border-radius:4px; margin-left:5px;">Base</span>'}</td>
                                <td><span style="background:#e2e8f0; padding:3px 8px; border-radius:6px; font-size:0.75rem;">${p.category}</span></td>
                                <td>₦${parseFloat(p.price).toLocaleString()}</td>
                                <td>
                                    <button onclick="deleteProductSKU('${p.id}')" class="row-action-btn btn-del"><i class="fa-solid fa-trash-can"></i> Remove Stock</button>
                                </td>
                            </tr>
                        `).join("")}
                        ${totalInventory.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:gray; padding:30px;">Stock registries empty.</td></tr>` : ""}
                    </tbody>
                </table>
            `;

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
                <div class="panel-action-bar"><h3>System Fulfillment Pipeline</h3></div>
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

    // NEW: SETTINGS VIEW INTERFACE CONTROLLER
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

            // Prefill with active logged-in operator details
            const currentSession = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
            if (currentSession && document.getElementById("admin-display-name")) {
                document.getElementById("admin-display-name").value = currentSession.name || "Administrator";
            }

            // Wire up the dynamic settings form event handlers
            wireSettingsForms();
        }
    }

    // Helper to handle settings form submissions dynamically
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

                if (matchIndex !== -1) {
                    adminRegistry[matchIndex] = updatedAccountObj;
                } else {
                    adminRegistry.push(updatedAccountObj);
                }

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

            // 🔐 CRITICAL GATEWAY: Check authentication passkey challenge input field
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

   window.deleteProductSKU = function(id) {
        if (!confirm("Are you sure you want to permanently strip this product SKU out of your active display shelves?")) return;

        // 1. Check inside Custom Inventory layer
        let customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
        const initialCustomLength = customProducts.length;
        customProducts = customProducts.filter(p => p.id.toString() !== id.toString());
        
        if (customProducts.length !== initialCustomLength) {
            localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(customProducts));
        } else {
            // 2. If not found in custom list, target Base Products cache database layer
            let baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
            if (baseProducts.length === 0 && window.allProductsData) {
                baseProducts = window.allProductsData;
            }
            baseProducts = baseProducts.filter(p => p.id.toString() !== id.toString());
            localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(baseProducts));
        }

        alert("Inventory Registry updated successfully.");
        
        // Recalculate metrics counter definitions
        let baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
        const prodDisplay = document.getElementById("adm-total-products");
        if (prodDisplay) prodDisplay.textContent = baseProducts.length + customProducts.length;

        // Refresh panel display state natively
        showProductsTab();
    };
    window.updateOrderStatus = function(orderIndex, newStatus) {
        historicalOrders[orderIndex].status = newStatus;
        localStorage.setItem("BUYIT_ORDERS", JSON.stringify(historicalOrders));
        alert(`Order status updated to "${newStatus}" successfully!`);
    };

    function setActiveTabButton(targetBtn) {
        [btnAnalytics, btnProducts, btnOrders, btnSettings].forEach(btn => btn?.classList.remove("active"));
        if (targetBtn) targetBtn.classList.add("active");
    }

    const closeBtn = document.getElementById("close-pmodal-btn");
    if (closeBtn && pModal) {
        closeBtn.onclick = () => pModal.classList.remove("open");
    }

    // Assign click actions onto tabs navigation strip
    if (btnAnalytics) btnAnalytics.onclick = showAnalyticsTab;
    if (btnProducts) btnProducts.onclick = showProductsTab;
    if (btnOrders) btnOrders.onclick = showOrdersTab;
    if (btnSettings) btnSettings.onclick = showSettingsTab; // Connect settings layout

    // Initialization routine runs
    calculateSystemMetrics();
    showAnalyticsTab();
});