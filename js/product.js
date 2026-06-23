const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("ID from URL:", productId);

fetch("./data/products.json")
  .then(response => response.json())
  .then(baseProducts => {
    
    // ===================================================
    // MERGE BASE PRODUCTS WITH ADMIN CUSTOM PRODUCTS
    // ===================================================
    const customProducts = JSON.parse(localStorage.getItem("BUYIT_CUSTOM_PRODUCTS")) || [];
    const allProducts = [...baseProducts, ...customProducts];

    // Find the product match from our unified pool
    const product = allProducts.find(p => p.id === productId);

    // 1. SAFETY FILTER: If product data is missing, handle the error gracefully
    if (!product) {
      const pageEl = document.querySelector(".product_page");
      if (pageEl) {
        pageEl.innerHTML = `<h1 style="text-align:center; padding: 50px 0;">Product Not Found</h1>`;
      }
      return;
    }

    console.log("Product found:", product);

    // 2. INJECT ALL CONTENT SECURELY INTO DOM NODES
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = typeof product.price === "number" ? "₦" + product.price.toLocaleString() : product.price;
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-image").alt = product.name;
    
    // Check if description exists (custom products might skip descriptions)
    const descEl = document.getElementById("product-description");
    if (descEl) {
      descEl.textContent = product.description || "No description provided for this marketplace SKU.";
    }

    // Expose the active query ID globally so the wishlist UI updater can find it
    window.productId = productId; 

    // Find your buy buttons wrapper element or append a dedicated button container node:
    const detailsContainer = document.querySelector(".product_details");
    if (detailsContainer && !document.getElementById("fav-btn-wrapper")) {
        const favWrapper = document.createElement("div");
        favWrapper.id = "fav-btn-wrapper";
        favWrapper.style.margin = "15px 0";
        favWrapper.innerHTML = `
            <button id="single-fav-toggle" style="background:none; border:1px solid var(--color-border); padding:10px 20px; border-radius:10px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:10px;">
                <i class="fa-regular fa-heart" id="product-page-heart" style="font-size:1.1rem; transition:.2s;"></i>
                <span>Save to Favourites</span>
            </button>
        `;
        detailsContainer.appendChild(favWrapper);
        
        document.getElementById("single-fav-toggle").onclick = () => {
            window.toggleWishlist(productId);
        };
        
        // Run an instantaneous view adjustment sync
        window.updateWishlistUI();
    }

    // 3. WIRE UP ACTIVE INTERACTIVE BUTTON ACTIONS
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");

    // Clear price strings to numbers if needed before cart injection
    const processedPrice = typeof product.price === "string" ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price;

    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            if (typeof window.addToCart === "function") {
                window.addToCart(product.id, product.name, processedPrice, product.image);
            }
        };
    }

    if (buyNowBtn) {
        buyNowBtn.onclick = () => {
            if (typeof window.addToCart === "function") {
                window.addToCart(product.id, product.name, processedPrice, product.image);
            }
            window.location.href = "cart.html";
        };
    }
  })
  .catch(error => {
    console.error("Error loading specific product template parameters:", error);
  });