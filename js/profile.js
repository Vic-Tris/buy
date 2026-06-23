const currentUser =
JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));

if (!currentUser) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. SECURITY CHECK: Forward unauthenticated sessions instantly to login view page
    let currentUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // 2. DOM INTERFACE ELEMENTS LOOKUP REFERENCE NODES
    const dispName = document.getElementById("profile-display-name");
    const dispEmail = document.getElementById("profile-display-email");
    const dispPhone = document.getElementById("profile-display-phone");
    const avatar = document.getElementById("profile-avatar");
    
    const statOrders = document.getElementById("stat-orders");
    const statWishlist = document.getElementById("stat-wishlist");
    const statCart = document.getElementById("stat-cart");
    
    const displayPane = document.getElementById("content-display-pane");
    const logoutBtn = document.getElementById("profile-logout-btn");
    
    const tabOrders = document.getElementById("tab-orders");
    const tabAddresses = document.getElementById("tab-addresses");
    
    const addressModal = document.getElementById("address-modal");
    const modalForm = document.getElementById("address-modal-form");

    // Initialize user demographic cards framework view elements
    dispName.textContent = currentUser.name || "Valued Customer";
    dispEmail.textContent = currentUser.email;
    dispPhone.textContent = currentUser.phone || "08012345678"; // Enforced default placeholder string format fallback
    if(currentUser.name) avatar.textContent = currentUser.name.charAt(0).toUpperCase();

    // 3. STATISTICAL CALCULATOR CALIBRATION MATRIX LOOPS
    const historicalOrders = JSON.parse(localStorage.getItem("BUYIT_ORDERS")) || [];
    const userSpecificOrders = historicalOrders.filter(order => order.userEmail === currentUser.email);
    const wishlistItems = JSON.parse(localStorage.getItem("BUYIT_WISHLIST")) || [];
    const activeCartItems = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];

    statOrders.textContent = userSpecificOrders.length;
    statWishlist.textContent = wishlistItems.length;
    statCart.textContent = activeCartItems.reduce((acc, item) => acc + item.quantity, 0);

    // 4. ROUTER CONTROLLERS RENDER PANE INJECTIONS FUNCTIONS
    function renderOrdersTable() {
        tabAddresses.classList.remove("active");
        tabOrders.classList.add("active");

        if (userSpecificOrders.length === 0) {
            displayPane.innerHTML = `
                <div class="dashboard-block-title"><h3>My Order History</h3></div>
                <p style="color:gray; padding:20px 0;">You haven't generated any dynamic checkout logs yet.</p>
            `;
            return;
        }

        displayPane.innerHTML = `
            <div class="dashboard-block-title"><h3>My Order History</h3></div>
            <div style="overflow-x: auto;">
                <table class="profile-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Payment</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userSpecificOrders.map(order => `
                            <tr>
                                <td><strong>#${order.orderId}</strong></td>
                                <td>${order.date || "Recent"}</td>
                                <td>${order.paymentMethod}</td>
                                <td style="color:var(--color-primary); font-weight:700;">₦${order.total.toLocaleString()}</td>
                                <td><span style="background:#fef3c7; color:#d97706; padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:bold;">${order.status || "Processing"}</span></td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderAddressBook() {
        tabOrders.classList.remove("active");
        tabAddresses.classList.add("active");

        const addresses = currentUser.addresses || [];

        displayPane.innerHTML = `
            <div class="dashboard-block-title">
                <h3>My Shipping Addresses</h3>
                <button class="add-address-btn" id="open-modal-btn"><i class="fa-solid fa-plus"></i> Add New</button>
            </div>
            <div class="address-grid">
                ${addresses.map((addr, idx) => `
                    <div class="address-card">
                        <h4>Address Variant Card #${idx + 1}</h4>
                        <p><strong>Street:</strong> ${addr.street}</p>
                        <p><strong>City/LGA:</strong> ${addr.city}</p>
                        <p><strong>State Area:</strong> ${addr.state}</p>
                        <button onclick="deleteAddressCard(${idx})" style="background:none; border:none; color:#dc2626; font-size:0.8rem; font-weight:bold; cursor:pointer; margin-top:10px; padding:0;">Delete</button>
                    </div>
                `).join("")}
                ${addresses.length === 0 ? `<p style="color:gray; grid-column:1/-1;">No delivery addresses stored yet. Click add new above to auto-fill checkout fields later!</p>` : ""}
            </div>
        `;

        // Attach event triggers onto new dynamic address button
        document.getElementById("open-modal-btn")?.addEventListener("click", () => {
            addressModal.classList.add("open");
        });
    }

    // 5. GLOBAL ADDRESS MODIFICATION PROCESS CODES
    modalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!currentUser.addresses) currentUser.addresses = [];

        const newAddress = {
            state: document.getElementById("modal-state").value.trim(),
            city: document.getElementById("modal-city").value.trim(),
            street: document.getElementById("modal-street").value.trim()
        };

        currentUser.addresses.push(newAddress);
        localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(currentUser));
        
        modalForm.reset();
        addressModal.classList.remove("open");
        renderAddressBook();
    });

    document.getElementById("close-modal-btn")?.addEventListener("click", () => {
        addressModal.classList.remove("open");
    });

    window.deleteAddressCard = function(index) {
        currentUser.addresses.splice(index, 1);
        localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(currentUser));
        renderAddressBook();
    };

    // 6. EVENT INTERACTION ROUTING SUBMISSIONS HANDLERS
    tabOrders.addEventListener("click", (e) => { e.preventDefault(); renderOrdersTable(); });
    tabAddresses.addEventListener("click", (e) => { e.preventDefault(); renderAddressBook(); });
    
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("BUYIT_CURRENT_USER");
        alert("Logged out successfully.");
        window.location.href = "index.html";
    });

    // Default initialization rendering logic view context trigger
    renderOrdersTable();
});