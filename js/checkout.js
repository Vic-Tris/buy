document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. AUTHENTICATION & AUTO-FILL REGISTRATION GUARD
    // ==========================================
    const currentUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));

    // If no user session exists, push them immediately to security registration screen
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Capture DOM input form handles
    const nameInput = document.getElementById("customer-name");
    const emailInput = document.getElementById("customer-email");
    const phoneInput = document.getElementById("customer-phone");
    const stateInput = document.getElementById("customer-state");
    const cityInput = document.getElementById("customer-city");
    const addressInput = document.getElementById("customer-address");

    // Auto-fill customer demographic keys
    if (nameInput) nameInput.value = currentUser.name || "";
    if (emailInput) emailInput.value = currentUser.email || "";
    if (phoneInput) phoneInput.value = currentUser.phone || "";

    // Auto-fill delivery context fields if user profile has an address entry card saved
    if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddress = currentUser.addresses[0];
        if (stateInput) stateInput.value = defaultAddress.state;
        if (cityInput) cityInput.value = defaultAddress.city;
        if (addressInput) addressInput.value = defaultAddress.street;
        console.log("Delivery fields auto-populated from your Profile Address Book.");
    }

    // ==========================================
    // 2. CART SUMMARY ENGINE CONFIGURATION
    // ==========================================
    let cart = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];

    const shippingTable = {
        Lagos: 2000,
        Oyo: 3000,
        Abuja: 4000,
        Rivers: 3500,
        Kano: 3500,
        Enugu: 3500,
        Others: 5000
    };

    let discount = 0;

    const checkoutItems = document.getElementById("checkout-items");
    const subtotalLabel = document.getElementById("subtotal");
    const shippingLabel = document.getElementById("shipping-fee");
    const discountLabel = document.getElementById("discount-amount");
    const totalLabel = document.getElementById("grand-total");

    function money(amount) {
        return "₦" + amount.toLocaleString();
    }

    // Global scoping calculator variable to bypass extraction dependency bugs
    let operationalGrandTotal = 0;

    function renderSummary() {
        if (!checkoutItems) return;
        checkoutItems.innerHTML = "";

        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;

            checkoutItems.innerHTML += `
            <div class="checkout-item">
                <img src="${item.image}">
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.quantity} × ${money(item.price)}</p>
                </div>
            </div>
            `;
        });

        const state = stateInput ? stateInput.value : "Others";
        const shipping = shippingTable[state] || shippingTable.Others;
        const discountAmount = subtotal * discount;
        
        operationalGrandTotal = subtotal + shipping - discountAmount;

        if (subtotalLabel) subtotalLabel.textContent = money(subtotal);
        if (shippingLabel) shippingLabel.textContent = money(shipping);
        if (discountLabel) discountLabel.textContent = "-" + money(discountAmount);
        if (totalLabel) totalLabel.textContent = money(operationalGrandTotal);
    }

    // Initial load call
    renderSummary();

    // Re-render when destination updates
    if (stateInput) {
        stateInput.addEventListener("change", renderSummary);
    }

    // ==========================================
    // 3. COUPON VERIFICATION MODULE
    // ==========================================
    const applyCouponBtn = document.getElementById("apply-coupon");
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener("click", () => {
            const code = document.getElementById("coupon-code").value.trim().toUpperCase();

            if (code === "SAVE10") {
                discount = 0.10;
                alert("10% discount applied");
            } else if (code === "SUPERBUY") {
                discount = 0.20;
                alert("20% discount applied");
            } else {
                discount = 0;
                alert("Invalid coupon");
            }

            renderSummary();
        });
    }

    // ==========================================
    // 4. TRANSACTION INJECTION PAYLOAD (PLACE ORDER)
    // ==========================================
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", () => {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const state = stateInput.value;
            const city = cityInput.value.trim();
            const address = addressInput.value.trim();

            if (!name || !email || !phone || !city || !address) {
                alert("Please complete all fields");
                return;
            }

            // Generate structured unique transaction tracking code
            const orderId = "BUYIT-" + Math.floor(100000 + Math.random() * 900000);

            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            const shipping = shippingTable[state] || shippingTable.Others;
            const total = subtotal + shipping - (subtotal * discount);
            
            const checkedPayment = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = checkedPayment ? checkedPayment.value : "Cash on Delivery";

            // User-Specific Payload Mapping Framework (Perfect for Dashboard Sync!)
            const order = {
                orderId: orderId,
                userEmail: currentUser.email, // Linked account anchor key
                customer: name,
                email: email,
                phone: phone,
                state: state,
                city: city,
                address: address,
                paymentMethod: paymentMethod,
                items: cart,
                subtotal: subtotal,
                shipping: shipping,
                discount: discount,
                total: total,
                date: new Date().toLocaleDateString(),
                status: "Processing"
            };

            // Write transaction to the historic data store ledger matrix
            let orders = JSON.parse(localStorage.getItem("BUYIT_ORDERS")) || [];
            orders.push(order);
            localStorage.setItem("BUYIT_ORDERS", JSON.stringify(orders));

            // Set verification state markers for success page receipt rendering engine
            localStorage.setItem("BUYIT_LAST_ORDER", JSON.stringify(order));
            localStorage.setItem("BUYIT_FINAL_TOTAL", total);

            // Clean cart footprint states to prevent transactional duplication crashes
            localStorage.removeItem("BUYIT_CART");

            window.location.href = "success.html";
        });
    }
});