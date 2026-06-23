document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. EXTRA SECURE GATEKEEPER LOCK
    // ==========================================
    const gatekeeperUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    
    // 🔏 MUST MATCH YOUR SPECIFIED SIGNATURE EXACTLY:
    const MASTER_ADMIN_EMAIL = "admin@fevicstore.com"; 

    if (!gatekeeperUser || gatekeeperUser.email !== MASTER_ADMIN_EMAIL) {
        // Silent boot if unauthorized or missing session
        window.location.href = "index.html"; 
        return;
    }

    console.log("Access Granted. Activating Admin Console Workspace...");

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
        
        if (mainPane) {
            mainPane.innerHTML = `
                <div class="panel-action-bar">
                    <h3>Custom Inventory SKUs</h3>
                    <button class="action-trigger-btn" id="add-new-sku-trigger"><i class="fa-solid fa-plus"></i> Inject SKU</button>
                </div>
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
                        ${customProducts.map(p => `
                            <tr>
                                <td><img src="${p.image}" class="thumb-inline"></td>
                                <td><strong>${p.name}</strong></td>
                                <td><span style="background:#e2e8f0; padding:3px 8px; border-radius:6px; font-size:0.75rem;">${p.category}</span></td>
                                <td>₦${parseFloat(p.price).toLocaleString()}</td>
                                <td>
                                    <button onclick="deleteProductSKU('${p.id}')" class="row-action-btn btn-del">Delete</button>
                                </td>
                            </tr>
                        `).join("")}
                        ${customProducts.length === 0 ? `<tr><td colspan="5" style="text-align:center; color:gray; padding:30px;">No custom dynamic products added to memory layers yet.</td></tr>` : ""}
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

    // ==========================================
    // 5. BUSINESS LOGIC STORAGE WRITERS
    // ==========================================
    if (pForm) {
        pForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const newSku = {
                id: "CUSTOM-" + Math.floor(1000 + Math.random() * 9000),
                name: document.getElementById("prod-name").value.trim(),
                price: parseFloat(document.getElementById("prod-price").value),
                image: document.getElementById("prod-img").value.trim(),
                category: document.getElementById("prod-category").value
            };

            customProducts.push(newSku);
            localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(customProducts));
            
            if (pModal) pModal.classList.remove("open");
            pForm.reset();
            
            calculateSystemMetrics();
            showProductsTab();
        });
    }

    window.deleteProductSKU = function(id) {
        customProducts = customProducts.filter(p => p.id !== id);
        localStorage.setItem("BUYIT_CUSTOM_PRODUCTS", JSON.stringify(customProducts));
        calculateSystemMetrics();
        showProductsTab();
    };

    window.updateOrderStatus = function(orderIndex, newStatus) {
        historicalOrders[orderIndex].status = newStatus;
        localStorage.setItem("BUYIT_ORDERS", JSON.stringify(historicalOrders));
        alert(`Order status updated to "${newStatus}" successfully!`);
    };

    function setActiveTabButton(targetBtn) {
        [btnAnalytics, btnProducts, btnOrders].forEach(btn => btn?.classList.remove("active"));
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

    // Initialization routine runs
    calculateSystemMetrics();
    showAnalyticsTab();
});