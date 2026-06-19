document.addEventListener("DOMContentLoaded", async () => {

    // 1. FETCH & INJECT GLOBAL LAYOUT COMPONENTS FIRST
    await includeComponent("global-header", "./components/header.html");
    await includeComponent("global-footer", "./components/footer.html");

    // 2. RUN FUNCTION TO INITIALIZE RESPONSIVE INTERFACES
    initResponsiveComponents();
});

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
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // ================= MOBILE NAVIGATION DRAWER TOGGLES =================
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open"); // Toggles menu panel slider container

            if (navOverlay) {
                navOverlay.classList.toggle("visible");
            }
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener("click", () => {
            if (menuToggle) menuToggle.classList.remove("active");
            if (mainNav) mainNav.classList.remove("open");
            navOverlay.classList.remove("visible");
        });
    }

    // ================= RESPONSIVE SEARCH AND SUGGESTIONS =================
    if (searchForm && searchInput) {
        let products = [];

        // Load your data async wrapper
        (async () => {
            try {
                const response = await fetch("./data/products.json");
                products = await response.json();
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
                .map(product => `
                    <a class="search-item" href="product.html?id=${product.id}">
                        <img src="${product.image}">
                        <div>
                            <strong>${product.name}</strong>
                            <span>${product.price}</span>
                        </div>
                    </a>
                `).join("");

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
}