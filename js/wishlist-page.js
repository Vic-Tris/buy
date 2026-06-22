document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("wishlist-grid-container");
    if (!gridContainer) return;

    fetch("./data/products.json")
        .then(res => res.json())
        .then(products => {
            const savedItemIds = JSON.parse(localStorage.getItem("BUYIT_WISHLIST")) || [];
            
            // Filter down our master JSON to only include saved items
            const favoriteProducts = products.filter(p => savedItemIds.includes(p.id));

            if (favoriteProducts.length === 0) {
                gridContainer.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 0;">
                        <i class="fa-regular fa-heart" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                        <p style="color: gray; font-size: 1.1rem;">You haven't saved any items yet.</p>
                        <a href="categories.html" class="continue-btn" style="display:inline-block; margin-top:20px; background:var(--color-primary); color:white; padding:12px 25px; border-radius:10px; text-decoration:none; font-weight:600;">Browse Showroom</a>
                    </div>
                `;
                return;
            }

            // Render matching item objects cleanly using your existing shop grid layout styles!
            gridContainer.innerHTML = favoriteProducts.map(product => `
                <div class="animal" id="wish-card-${product.id}">
                    <div style="position: relative;">
                        <img src="${product.image}" alt="${product.name}">
                        <button onclick="removeWishlistItem('${product.id}', event)" style="position: absolute; top: 10px; right: 10px; background: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); color: #ec4899; font-size: 1rem; display:flex; align-items:center; justify-content:center;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <h1>${product.name}</h1>
                    <p>${product.price}</p>
                    <a href="product.html?id=${product.id}">Quick view</a>
                </div>
            `).join("");
        });

    window.removeWishlistItem = function(id, e) {
        if(e) e.preventDefault();
        window.toggleWishlist(id); // Untoggles the item out of local storage
        document.getElementById(`wish-card-${id}`)?.remove();
        
        // Check if the entire list is now empty after deletion
        const savedItemIds = JSON.parse(localStorage.getItem("BUYIT_WISHLIST")) || [];
        if (savedItemIds.length === 0 && gridContainer) {
            window.location.reload();
        }
    };
});