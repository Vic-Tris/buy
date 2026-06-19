document.addEventListener("DOMContentLoaded", async () => {

    // ================= MENU =================

    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const navOverlay = document.getElementById("nav-overlay");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            mainNav.classList.toggle("active");

            if (navOverlay) {
                navOverlay.classList.toggle("visible");
            }

        });

    }

    if (navOverlay) {

        navOverlay.addEventListener("click", () => {
            menuToggle.classList.remove("active");

            mainNav.classList.remove("open");

            navOverlay.classList.remove("visible");

        });

    }


    // ================= SEARCH =================

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search");

    if (searchForm && searchInput) {

        let products = [];

        try {

            const response = await fetch("./data/products.json");

            products = await response.json();

        } catch (error) {

            console.error("Failed to load products:", error);

        }

        const searchIcon = document.querySelector(".search-icon");

        if (searchIcon) {

            searchIcon.addEventListener("click", () => {

                searchInput.focus();

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
                    <a class="search-item"
                       href="product.html?id=${product.id}">
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
                !searchBox.contains(e.target)
            ) {

                searchBox.style.display = "none";

            }

        });

    }

});