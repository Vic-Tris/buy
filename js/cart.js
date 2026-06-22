document.addEventListener("DOMContentLoaded", () => {
    // Short check loop ensuring components loaded safely
    setTimeout(() => {
        initDedicatedCartPage();
    }, 100);
});

function initDedicatedCartPage() {
    const activeWrapper = document.getElementById("cart-active-wrapper");
    const emptyContainer = document.getElementById("cart-empty");
    const applyPromoBtn = document.getElementById("cart-page-promo-btn");
    const promoInput = document.getElementById("cart-page-promo-input");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener("click", () => {
            const code = promoInput.value.trim().toUpperCase();
            const msgEl = document.getElementById("cart-page-promo-msg");
            
            if (code === "SAVE10") {
                window.activeDiscount = 0.10;
                if (msgEl) { msgEl.textContent = "10% coupon applied!"; msgEl.style.color = "green"; }
            } else if (code === "SUPERBUY") {
                window.activeDiscount = 0.20;
                if (msgEl) { msgEl.textContent = "20% mega code applied!"; msgEl.style.color = "green"; }
            } else {
                window.activeDiscount = 0;
                if (msgEl) { msgEl.textContent = "Invalid coupon code."; msgEl.style.color = "#dc2626"; }
            }
            renderCartPageDOM();
            if (typeof window.updateCartDOM === "function") window.updateCartDOM();
        });
    }
if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        let cart =
            JSON.parse(localStorage.getItem("BUYIT_CART")) || [];

        if(cart.length === 0){

            alert("Your cart is empty.");
            return;

        }

        window.location.href = "checkout.html";

    });

}

    renderCartPageDOM();
}

function renderCartPageDOM() {
    const itemsContainer = document.getElementById("cart-items");
    const activeWrapper = document.getElementById("cart-active-wrapper");
    const emptyContainer = document.getElementById("cart-empty");
    
    let localCart = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];
    let currentDiscountPercentage = window.activeDiscount || 0;

    if (!itemsContainer || !activeWrapper || !emptyContainer) return;

    if (localCart.length === 0) {
        activeWrapper.style.display = "none";
        emptyContainer.style.display = "block";
        return;
    }

    emptyContainer.style.display = "none";
    activeWrapper.style.display = "grid";

    // Rebuilt matching your exact CSS selectors structure!
    itemsContainer.innerHTML = localCart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-details">
                <h3>${item.name}</h3>
                <span class="cart-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-box">
                    <button onclick="handlePageQtyChange('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="handlePageQtyChange('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="handlePageRemove('${item.id}')">
                <i class="fa-solid fa-trash"></i> Remove
            </button>
        </div>
    `).join("");

    const countLabel = document.getElementById("cart-count");
    const subtotalLabel = document.getElementById("cart-page-subtotal");
    const discountRow = document.getElementById("cart-page-discount-row");
    const discountLabel = document.getElementById("cart-page-discount");
    const totalLabel = document.getElementById("cart-total");

    const totalItems = localCart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = localCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = subtotal * currentDiscountPercentage;
    const finalGrandTotal = subtotal - discountAmount;

    if (countLabel) countLabel.textContent = totalItems;
    if (subtotalLabel) subtotalLabel.textContent = `$${subtotal.toFixed(2)}`;
    
    if (currentDiscountPercentage > 0 && discountRow && discountLabel) {
        discountRow.style.display = "flex";
        discountLabel.textContent = `-$${discountAmount.toFixed(2)}`;
    } else if (discountRow) {
        discountRow.style.display = "none";
    }

    if (totalLabel) totalLabel.textContent = `$${finalGrandTotal.toFixed(2)}`;
}

window.handlePageQtyChange = function(id, delta) {
    if (typeof window.changeQuantity === "function") {
        window.changeQuantity(id, delta);
    } else {
        let localCart = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];
        const item = localCart.find(p => p.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) localCart = localCart.filter(p => p.id !== id);
            localStorage.setItem("BUYIT_CART", JSON.stringify(localCart));
        }
    }
    renderCartPageDOM();
    if (typeof window.updateCartDOM === "function") window.updateCartDOM();
};

window.handlePageRemove = function(id) {
    if (typeof window.removeProductFromCart === "function") {
        window.removeProductFromCart(id);
    } else {
        let localCart = JSON.parse(localStorage.getItem("BUYIT_CART")) || [];
        localCart = localCart.filter(p => p.id !== id);
        localStorage.setItem("BUYIT_CART", JSON.stringify(localCart));
    }
    renderCartPageDOM();
    if (typeof window.updateCartDOM === "function") window.updateCartDOM();
};