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

    const adminLogoutBtn = document.getElementById("admin-logout-sidebar");
    const adminLogoutTopbarBtn = document.getElementById("admin-logout-topbar");
    const logoutAdmin = () => {
        const activeUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER") || "null");
        localStorage.removeItem("BUYIT_CURRENT_USER");
        localStorage.removeItem("BUYIT_ADMIN");
        recordActivity("Admin logout", activeUser ? `Signed out ${activeUser.name || activeUser.email}` : "Signed out", activeUser?.name || "Administrator");
        window.location.href = "login.html";
    };
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", logoutAdmin);
    }
    if (adminLogoutTopbarBtn) {
        adminLogoutTopbarBtn.addEventListener("click", logoutAdmin);
    }

    // ==========================================
    // 2. DATA INITIALIZATION & BOOTSTRAPPER 
    // ==========================================
    let historicalOrders = JSON.parse(localStorage.getItem("BUYIT_ORDERS")) || [];
    let customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
    let baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || [];
    let inventoryState = null;
    
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
    const btnActivity = document.getElementById("tab-activity");
    const btnSettings = document.getElementById("tab-settings");

    // ==========================================
    // 3. METRICS & COUNTERS AGGREGATION UTILITIES
    // ==========================================
    function parsePrice(value) {
        if (typeof value === "number") return value;
        if (typeof value === "string") {
            const cleaned = value.replace(/[^0-9.]/g, "");
            const parsed = Number(cleaned);
            return Number.isFinite(parsed) ? parsed : 0;
        }
        return 0;
    }

    function calculateSystemMetrics() {
        const totalRevenue = historicalOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
        const unifiedProductsCount = baseProducts.length + customProducts.length;
        const lowStock = [...baseProducts, ...customProducts].filter((product) => Number(product.stock || 0) <= 5).length;

        if (revDisplay) revDisplay.textContent = "₦" + totalRevenue.toLocaleString();
        if (transDisplay) transDisplay.textContent = historicalOrders.length;
        if (prodDisplay) prodDisplay.textContent = unifiedProductsCount;

        document.getElementById("adm-low-stock")?.remove();
        if (lowStock > 0) {
            const statStrip = document.querySelector(".admin-stats-strip");
            if (statStrip) {
                const badge = document.createElement("div");
                badge.className = "astat-card";
                badge.id = "adm-low-stock";
                badge.innerHTML = `<span class="astat-num">${lowStock}</span><span class="astat-label">Low / Out of Stock</span>`;
                statStrip.appendChild(badge);
            }
        }
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

        baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || baseProducts;
        customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
        const totalInventory = [...baseProducts, ...customProducts];
        if (!inventoryState) {
            inventoryState = {
                search: "",
                category: "",
                price: "",
                type: "",
                sort: "newest",
                page: 1,
                pageSize: 20,
                selectedIds: []
            };
        }

        const normalizeProduct = (product) => ({
            ...product,
            normalizedPrice: parsePrice(product.price),
            normalizedCategory: String(product.category || "").toLowerCase(),
            normalizedName: String(product.name || "").toLowerCase(),
            normalizedId: String(product.id || ""),
            stock: Number(product.stock || 0),
            featured: Boolean(product.featured),
            type: String(product.id || "").includes("CUSTOM") ? "custom" : "base",
            dateAdded: product.dateAdded || product.addedAt || ""
        });

        const normalizedInventory = totalInventory.map(normalizeProduct);

        const getFilteredInventory = () => {
            const keyword = inventoryState.search.toLowerCase().trim();
            const category = inventoryState.category;
            const price = inventoryState.price;
            const type = inventoryState.type;

            let subset = normalizedInventory.filter((product) => {
                const matchesSearch = !keyword || [product.name, product.category, product.id, product.description || "", product.sku || ""].some((field) => String(field).toLowerCase().includes(keyword));
                const matchesCategory = !category || product.normalizedCategory === category;
                let matchesPrice = true;
                if (price === "low") matchesPrice = product.normalizedPrice < 5000;
                else if (price === "mid") matchesPrice = product.normalizedPrice >= 5000 && product.normalizedPrice <= 20000;
                else if (price === "high") matchesPrice = product.normalizedPrice > 20000;
                let matchesType = true;
                if (type === "base") matchesType = product.type === "base";
                else if (type === "custom") matchesType = product.type === "custom";
                return matchesSearch && matchesCategory && matchesPrice && matchesType;
            });

            subset = subset.sort((a, b) => {
                if (inventoryState.sort === "name-asc") return a.name.localeCompare(b.name);
                if (inventoryState.sort === "name-desc") return b.name.localeCompare(a.name);
                if (inventoryState.sort === "price-asc") return a.normalizedPrice - b.normalizedPrice;
                if (inventoryState.sort === "price-desc") return b.normalizedPrice - a.normalizedPrice;
                if (inventoryState.sort === "oldest") return String(a.dateAdded || "").localeCompare(String(b.dateAdded || ""));
                return String(b.dateAdded || "").localeCompare(String(a.dateAdded || ""));
            });
            return subset;
        };

        const attachCheckboxListeners = () => {
            document.querySelectorAll(".inventory-select-checkbox").forEach((checkbox) => {
                checkbox.addEventListener("change", () => {
                    const id = checkbox.dataset.id;
                    if (checkbox.checked) {
                        if (!inventoryState.selectedIds.includes(id)) inventoryState.selectedIds.push(id);
                    } else {
                        inventoryState.selectedIds = inventoryState.selectedIds.filter((item) => item !== id);
                    }
                });
            });
        };

        const renderTable = () => {
            const filteredInventory = getFilteredInventory();
            const totalPages = Math.max(1, Math.ceil(filteredInventory.length / inventoryState.pageSize));
            if (inventoryState.page > totalPages) inventoryState.page = totalPages;
            const startIndex = (inventoryState.page - 1) * inventoryState.pageSize;
            const visibleItems = filteredInventory.slice(startIndex, startIndex + inventoryState.pageSize);
            const tbody = document.getElementById("inventory-table-body");
            const resultsLabel = document.getElementById("inventory-results-label");
            const pagination = document.getElementById("inventory-pagination");
            const selectAll = document.getElementById("inventory-select-all");
            if (tbody) {
                if (visibleItems.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" class="admin-empty-state">No products matched the current search and filters.</td></tr>`;
                } else {
                    tbody.innerHTML = visibleItems.map((product) => {
                        const isCustom = product.type === "custom";
                        const isSelected = inventoryState.selectedIds.includes(product.id);
                        return `
                            <tr>
                                <td><input type="checkbox" class="inventory-select-checkbox" data-id="${product.id}" ${isSelected ? "checked" : ""}></td>
                                <td><img src="${product.image || './images/default-placeholder.jpg'}" class="thumb-inline" onerror="this.src='./images/default-placeholder.jpg'"></td>
                                <td>
                                    <strong>${product.name}</strong>
                                    <div class="admin-pill ${isCustom ? "success" : ""}">${isCustom ? "Custom" : "Base"}</div>
                                    <br><span style="font-size:0.7rem; color:#94a3b8; font-family:monospace;">ID: ${product.id}</span>
                                </td>
                                <td><span style="background:#e2e8f0; padding:3px 8px; border-radius:6px; font-size:.75rem; text-transform: capitalize;">${(product.category || "unknown").replace(/_/g, " ")}</span></td>
                                <td>₦${parsePrice(product.price).toLocaleString()}</td>
                                <td>
                                    <div class="bulk-actions">
                                        <button onclick="editProductSKU('${product.id}')" class="row-action-btn btn-edit"><i class="fa-solid fa-pen"></i> Edit</button>
                                        <button onclick="deleteProductSKU('${product.id}')" class="row-action-btn btn-del"><i class="fa-solid fa-trash-can"></i> Delete</button>
                                    </div>
                                </td>
                            </tr>`;
                    }).join("");
                }
            }
            if (resultsLabel) resultsLabel.textContent = `Showing ${visibleItems.length} of ${filteredInventory.length} products`;
            if (pagination) pagination.innerHTML = `
                <button ${inventoryState.page <= 1 ? "disabled" : ""} onclick="changeInventoryPage(${inventoryState.page - 1})">Previous</button>
                <span class="page-pill">Page ${inventoryState.page} / ${totalPages}</span>
                <button ${inventoryState.page >= totalPages ? "disabled" : ""} onclick="changeInventoryPage(${inventoryState.page + 1})">Next</button>
            `;
            if (selectAll) selectAll.checked = visibleItems.length > 0 && visibleItems.every((product) => inventoryState.selectedIds.includes(product.id));
            attachCheckboxListeners();
        };

        const refreshInventory = () => {
            baseProducts = JSON.parse(localStorage.getItem("BUYIT_BASE_PRODUCTS")) || baseProducts;
            customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
            renderTable();
            calculateSystemMetrics();
        };

        const applyInventoryFilters = () => {
            inventoryState.page = 1;
            renderTable();
        };

        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar">
                    <div class="inventory-toolbar" style="width:100%;">
                        <div class="inventory-toolbar-head">
                            <h3>Global Catalog & Inventory Stock</h3>
                            <button class="action-trigger-btn" id="add-new-sku-trigger"><i class="fa-solid fa-plus"></i> Add Product</button>
                        </div>
                        <div class="inventory-filters">
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
                            <select id="filter-sort" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="price-asc">Price low to high</option>
                                <option value="price-desc">Price high to low</option>
                            </select>
                            <select id="filter-page-size" style="padding:8px; border:1px solid #cbd5e1; border-radius:6px;">
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>
                        <div class="inventory-results-bar">
                            <div id="inventory-results-label">Showing 0 of 0 products</div>
                            <div class="bulk-actions">
                                <label><input type="checkbox" id="inventory-select-all"> Select visible</label>
                                <button id="inventory-clear-selection">Clear</button>
                                <button id="inventory-bulk-delete" class="danger-btn">Bulk Delete</button>
                                <button id="inventory-clear-filters" class="inventory-clear-btn">Clear Filters</button>
                            </div>
                        </div>
                        <div id="inventory-pagination" class="inventory-pagination"></div>
                    </div>
                </div>
                <div class="table-scroll-wrapper" style="overflow-x: auto; width:100%; margin-top:15px;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" id="inventory-select-all-head" disabled></th>
                                <th>Image</th>
                                <th>Product Item Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-table-body"></tbody>
                    </table>
                </div>
            `;

            const setInputValues = () => {
                const searchInput = document.getElementById("inventory-search");
                const categoryInput = document.getElementById("filter-category");
                const priceInput = document.getElementById("filter-price");
                const typeInput = document.getElementById("filter-type");
                const sortInput = document.getElementById("filter-sort");
                const pageSizeInput = document.getElementById("filter-page-size");
                if (searchInput) searchInput.value = inventoryState.search;
                if (categoryInput) categoryInput.value = inventoryState.category;
                if (priceInput) priceInput.value = inventoryState.price;
                if (typeInput) typeInput.value = inventoryState.type;
                if (sortInput) sortInput.value = inventoryState.sort;
                if (pageSizeInput) pageSizeInput.value = inventoryState.pageSize;
            };

            const wireInventoryControls = () => {
                ["inventory-search", "filter-category", "filter-price", "filter-type", "filter-sort", "filter-page-size"].forEach((id) => {
                    document.getElementById(id)?.addEventListener("input", () => {
                        if (id === "filter-page-size") inventoryState.pageSize = Number(document.getElementById(id).value || 20);
                        if (id === "inventory-search") inventoryState.search = document.getElementById(id).value;
                        if (id === "filter-category") inventoryState.category = document.getElementById(id).value;
                        if (id === "filter-price") inventoryState.price = document.getElementById(id).value;
                        if (id === "filter-type") inventoryState.type = document.getElementById(id).value;
                        if (id === "filter-sort") inventoryState.sort = document.getElementById(id).value;
                        applyInventoryFilters();
                    });
                });
                document.getElementById("filter-category")?.addEventListener("change", () => applyInventoryFilters());
                document.getElementById("filter-price")?.addEventListener("change", () => applyInventoryFilters());
                document.getElementById("filter-type")?.addEventListener("change", () => applyInventoryFilters());
                document.getElementById("filter-sort")?.addEventListener("change", () => applyInventoryFilters());
                document.getElementById("filter-page-size")?.addEventListener("change", () => applyInventoryFilters());
                document.getElementById("inventory-clear-filters")?.addEventListener("click", () => {
                    inventoryState.search = "";
                    inventoryState.category = "";
                    inventoryState.price = "";
                    inventoryState.type = "";
                    inventoryState.sort = "newest";
                    inventoryState.page = 1;
                    inventoryState.pageSize = 20;
                    inventoryState.selectedIds = [];
                    setInputValues();
                    renderTable();
                });
                document.getElementById("inventory-clear-selection")?.addEventListener("click", () => {
                    inventoryState.selectedIds = [];
                    renderTable();
                });
                document.getElementById("inventory-bulk-delete")?.addEventListener("click", () => {
                    if (!inventoryState.selectedIds.length) {
                        Toast.warning("Select at least one product first.");
                        return;
                    }
                    const confirmed = confirm(`Delete ${inventoryState.selectedIds.length} selected product(s)?`);
                    if (!confirmed) return;
                    const idsToDelete = new Set(inventoryState.selectedIds);
                    const nextCustom = customProducts.filter((product) => !idsToDelete.has(String(product.id)));
                    const nextBase = baseProducts.filter((product) => !idsToDelete.has(String(product.id)));
                    customProducts = nextCustom;
                    baseProducts = nextBase;
                    localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(customProducts));
                    localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(baseProducts));
                    inventoryState.selectedIds = [];
                    recordActivity("Bulk product deletion", `Deleted ${idsToDelete.size} product(s)`, JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER") || "null")?.name || "Administrator");
                    Toast.success("Selected products deleted.");
                    refreshInventory();
                });
                document.getElementById("inventory-select-all")?.addEventListener("change", (event) => {
                    const checked = event.target.checked;
                    const visibleIds = getFilteredInventory().slice(0, inventoryState.pageSize).map((product) => product.id);
                    inventoryState.selectedIds = checked ? [...new Set([...inventoryState.selectedIds, ...visibleIds])] : inventoryState.selectedIds.filter((id) => !visibleIds.includes(id));
                    renderTable();
                });
            };

            setInputValues();
            wireInventoryControls();
            renderTable();

            document.getElementById("add-new-sku-trigger").onclick = () => {
                pForm.reset();
                document.getElementById("edit-product-id").value = "";
                document.getElementById("prod-sku").value = "";
                document.getElementById("prod-stock").value = "0";
                document.getElementById("prod-type").value = "custom";
                document.getElementById("prod-featured").checked = false;
                document.getElementById("prod-description").value = "";
                document.getElementById("prod-img-file").value = "";
                document.getElementById("prod-img").value = "";
                mTitle.textContent = "Inject New Product SKU";
                pModal.classList.add("open");
            };
        }
    }

    function showActivityTab() {
        setActiveTabButton(btnActivity);

        const activityEntries = JSON.parse(localStorage.getItem("BUYIT_ACTIVITY_LOG") || "[]");

        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar"><h3>Administrative Activity Log</h3></div>
                <div class="table-scroll-wrapper" style="overflow-x:auto; width:100%; margin-top:15px;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Action</th>
                                <th>Details</th>
                                <th>Operator</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${activityEntries.length === 0 ? `<tr><td colspan="4" class="admin-empty-state">No activity has been recorded yet.</td></tr>` : activityEntries.map((entry) => `
                                <tr>
                                    <td>${entry.date || "—"}</td>
                                    <td><strong>${entry.action || "Activity"}</strong></td>
                                    <td>${entry.details || "—"}</td>
                                    <td>${entry.admin || "Administrator"}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
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
    function getCurrentAdminName() {
        const currentSession = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER") || "null");
        return currentSession?.name || currentSession?.email || "Administrator";
    }

    const getProductId = (providedId) => {
        if (providedId && providedId.trim()) return providedId.trim();
        return `CUSTOM-${Date.now()}`;
    };

    const validateProductPayload = (productData) => {
        if (!productData.name || !productData.name.trim()) return "Product name is required.";
        if (Number(productData.price) < 0) return "Price cannot be negative.";
        if (!productData.category) return "Category is required.";
        if (Number(productData.stock) < 0) return "Stock cannot be negative.";
        if (!productData.image) return "Image source is required.";
        return "";
    };

    if (pForm) {
        pForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const authInput = document.getElementById("prod-admin-auth").value;
            const currentSession = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER") || "null");
            
            let adminRegistry = JSON.parse(localStorage.getItem("BUYIT_ADMINS_REGISTRY")) || [
                { email: "admin@fevicstore.com", name: "Administrator", password: "admin123" }
            ];

            const activeAdminRecord = adminRegistry.find(a => a.email.toLowerCase() === currentSession?.email?.toLowerCase());
            const realPassword = activeAdminRecord ? activeAdminRecord.password : "admin123";

            if (authInput !== realPassword) {
                Toast.error("Security Authorization Failed: Invalid admin confirmation password.");
                return;
            }

            const name = document.getElementById("prod-name").value.trim();
            const price = parseFloat(document.getElementById("prod-price").value);
            const category = document.getElementById("prod-category").value;
            const urlInput = document.getElementById("prod-img").value.trim();
            const fileInput = document.getElementById("prod-img-file");
            const stock = parseInt(document.getElementById("prod-stock").value || "0", 10);
            const sku = document.getElementById("prod-sku").value.trim();
            const description = document.getElementById("prod-description").value.trim();
            const featured = document.getElementById("prod-featured").checked;
            const productType = document.getElementById("prod-type").value || "custom";
            const editProductId = document.getElementById("edit-product-id").value;

            const validationMessage = validateProductPayload({ name, price, category, image: urlInput, stock });
            if (validationMessage) {
                Toast.error(validationMessage);
                return;
            }

            const saveProductSKU = (finalImageSource) => {
                const payload = {
                    id: editProductId || getProductId(sku),
                    sku: sku || (editProductId || `SKU-${Date.now()}`),
                    name,
                    price,
                    image: finalImageSource || "./images/default-placeholder.jpg",
                    category,
                    stock,
                    featured,
                    description,
                    type: productType,
                    dateAdded: new Date().toISOString(),
                    productType: productType
                };

                if (editProductId) {
                    const sourceList = String(editProductId).includes("CUSTOM") ? customProducts : baseProducts;
                    const itemIndex = sourceList.findIndex((item) => String(item.id) === String(editProductId));
                    if (itemIndex !== -1) {
                        sourceList.splice(itemIndex, 1);
                    }
                    const targetList = productType === "base" ? baseProducts : customProducts;
                    targetList.push(payload);
                    recordActivity("Product edited", `Updated ${payload.name}`, getCurrentAdminName());
                } else {
                    const list = productType === "base" ? baseProducts : customProducts;
                    list.push(payload);
                    recordActivity("Product added", `Added ${payload.name}`, getCurrentAdminName());
                }

                localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(baseProducts));
                localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(customProducts));
                if (pModal) pModal.classList.remove("open");
                pForm.reset();
                document.getElementById("edit-product-id").value = "";
                Toast.success(editProductId ? "Product updated." : "Product added.");
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

    window.editProductSKU = function(id) {
        const allProducts = [...baseProducts, ...customProducts];
        const product = allProducts.find((item) => String(item.id) === String(id));
        if (!product) return;
        document.getElementById("edit-product-id").value = product.id;
        document.getElementById("prod-name").value = product.name || "";
        document.getElementById("prod-price").value = product.price || "";
        document.getElementById("prod-category").value = product.category || "fresh";
        document.getElementById("prod-sku").value = product.sku || product.id || "";
        document.getElementById("prod-stock").value = product.stock || 0;
        document.getElementById("prod-description").value = product.description || "";
        document.getElementById("prod-featured").checked = Boolean(product.featured);
        document.getElementById("prod-type").value = String(product.id).includes("CUSTOM") ? "custom" : "base";
        document.getElementById("prod-img").value = product.image || "";
        document.getElementById("prod-img-file").value = "";
        mTitle.textContent = "Edit Product SKU";
        pModal.classList.add("open");
    };

    // Expose Deletion Function Globally to Window Node Scope
    window.deleteProductSKU = function(id) {
        const confirmed = confirm("Delete this product? This action cannot be undone.");
        if (!confirmed) return;

        const customIndex = customProducts.findIndex((p) => String(p.id) === String(id));
        if (customIndex !== -1) {
            const removed = customProducts.splice(customIndex, 1)[0];
            localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(customProducts));
            recordActivity("Product deleted", `Deleted ${removed.name}`, getCurrentAdminName());
            Toast.success("Product deleted.");
        } else {
            const baseIndex = baseProducts.findIndex((p) => String(p.id) === String(id));
            if (baseIndex !== -1) {
                const removed = baseProducts.splice(baseIndex, 1)[0];
                localStorage.setItem("BUYIT_BASE_PRODUCTS", JSON.stringify(baseProducts));
                recordActivity("Product deleted", `Deleted ${removed.name}`, getCurrentAdminName());
                Toast.success("Product deleted.");
            }
        }

        calculateSystemMetrics();
        showProductsTab();
    };

    window.changeInventoryPage = function(page) {
        if (!inventoryState) return;
        const targetPage = Number(page);
        if (!Number.isFinite(targetPage) || targetPage < 1) return;
        inventoryState.page = targetPage;
        showProductsTab();
    };

    window.updateOrderStatus = function(orderIndex, newStatus) {
        if (!historicalOrders[orderIndex]) return;
        historicalOrders[orderIndex].status = newStatus;
        localStorage.setItem("BUYIT_ORDERS", JSON.stringify(historicalOrders));
        recordActivity("Order status changed", `Order ${historicalOrders[orderIndex].orderId} -> ${newStatus}`, getCurrentAdminName());
        Toast.success(`Order status updated to "${newStatus}".`);
        showOrdersTab();
    };

    if (closePModalBtn) {
        closePModalBtn.onclick = () => {
            pModal.classList.remove("open");
        };
    }

    function setActiveTabButton(targetBtn) {
        [btnAnalytics, btnProducts, btnOrders, btnActivity, btnSettings].forEach(btn => btn?.classList.remove("active"));
        if (targetBtn) targetBtn.classList.add("active");
    }

    // ==========================================
    // 6. MENU ROUTING INITIALIZERS
    // ==========================================
    btnAnalytics?.addEventListener("click", showAnalyticsTab);
    btnProducts?.addEventListener("click", showProductsTab);
    btnOrders?.addEventListener("click", showOrdersTab);
    btnActivity?.addEventListener("click", showActivityTab);
    btnSettings?.addEventListener("click", showSettingsTab);

    // Initial default viewport tab trigger load
    showAnalyticsTab();
});