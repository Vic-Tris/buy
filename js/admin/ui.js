/* ===========================================
   BUYIT ADMIN UI ENGINE
=========================================== */

const UI = {

    // =====================================
    // LOADER
    // =====================================

    loader(show = true) {

        const loader =
            document.getElementById("admin-loader");

        if (!loader) return;

        loader.style.display =
            show ? "flex" : "none";

    },

    // =====================================
    // EMPTY STATE
    // =====================================

    empty(message = "Nothing to display.") {

        return `
            <div class="admin-empty-state">
                <i class="fa-solid fa-box-open"></i>
                <p>${message}</p>
            </div>
        `;

    },

    // =====================================
    // BADGES
    // =====================================

    badge(text, color = "gray") {

        return `
            <span class="admin-badge ${color}">
                ${Utils.escapeHTML(text)}
            </span>
        `;

    },

    // =====================================
    // STATUS TAGS
    // =====================================

    status(status) {

        const colors = {

            Processing: "warning",

            Delivered: "success",

            Cancelled: "danger",

            "Shipped Out": "info",

            Pending: "warning"

        };

        return `
            <span class="status-tag ${colors[status] || "gray"}">
                ${status}
            </span>
        `;

    },

    // =====================================
    // BUTTON
    // =====================================

    button(text, icon, classes = "") {

        return `
            <button class="${classes}">
                <i class="fa-solid ${icon}"></i>
                ${text}
            </button>
        `;

    },

    // =====================================
    // CONFIRM DELETE
    // =====================================

    confirmDelete(name) {

        return confirm(

            `Delete "${name}"?\n\nThis action cannot be undone.`

        );

    },

    // =====================================
    // SEARCH BOX
    // =====================================

    searchBox(id, placeholder) {

        return `

            <div class="admin-search">

                <i class="fa-solid fa-magnifying-glass"></i>

                <input

                    type="search"

                    id="${id}"

                    placeholder="${placeholder}"

                >

            </div>

        `;

    },

    // =====================================
    // NO SEARCH RESULTS
    // =====================================

    noSearchResults() {

        return `

            <tr>

                <td colspan="100%">

                    <div class="admin-empty-state">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <p>No matching products found.</p>

                    </div>

                </td>

            </tr>

        `;

    },

    // =====================================
    // UPDATE ADMIN STATS
    // =====================================

    updateStats({

        revenue = 0,

        orders = 0,

        products = 0

    }) {

        const sales =
            document.getElementById("adm-total-sales");

        const totalOrders =
            document.getElementById("adm-total-orders");

        const totalProducts =
            document.getElementById("adm-total-products");

        if (sales)
            sales.textContent =
                Utils.currency(revenue);

        if (totalOrders)
            totalOrders.textContent =
                orders;

        if (totalProducts)
            totalProducts.textContent =
                products;

    }

};

window.UI = UI;