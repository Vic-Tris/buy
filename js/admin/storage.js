/* ===========================================
   BUYIT STORAGE ENGINE
   Central Data Manager
=========================================== */

const Storage = {

    // ==========================
    // Generic Methods
    // ==========================

    get(key, fallback = null) {

        try {

            const value = localStorage.getItem(key);

            return value ? JSON.parse(value) : fallback;

        } catch (err) {

            console.warn("Storage Read Error:", key);

            return fallback;

        }

    },

    set(key, value) {

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },

    remove(key) {

        localStorage.removeItem(key);

    },

    clear() {

        localStorage.clear();

    },

    exists(key) {

        return localStorage.getItem(key) !== null;

    },

    // ==========================
    // PRODUCTS
    // ==========================

    getProducts() {

        return this.get("BUYIT_PRODUCTS", []);

    },

    saveProducts(products) {

        this.set("BUYIT_PRODUCTS", products);

    },

    // ==========================
    // CUSTOM PRODUCTS
    // ==========================

    getCustomProducts() {

        return this.get("BUYIT_CUSTOM_PRODUCTS", []);

    },

    saveCustomProducts(products) {

        this.set("BUYIT_CUSTOM_PRODUCTS", products);

    },

    // ==========================
    // CART
    // ==========================

    getCart() {

        return this.get("BUYIT_CART", []);

    },

    saveCart(cart) {

        this.set("BUYIT_CART", cart);

    },

    // ==========================
    // WISHLIST
    // ==========================

    getWishlist() {

        return this.get("BUYIT_WISHLIST", []);

    },

    saveWishlist(list) {

        this.set("BUYIT_WISHLIST", list);

    },

    // ==========================
    // ORDERS
    // ==========================

    getOrders() {

        return this.get("BUYIT_ORDERS", []);

    },

    saveOrders(orders) {

        this.set("BUYIT_ORDERS", orders);

    },

    addOrder(order) {

        const orders = this.getOrders();

        orders.unshift(order);

        this.saveOrders(orders);

    },

    // ==========================
    // CUSTOMERS
    // ==========================

    getCustomers() {

        return this.get("BUYIT_CUSTOMERS", []);

    },

    saveCustomers(customers) {

        this.set("BUYIT_CUSTOMERS", customers);

    },

    // ==========================
    // COUPONS
    // ==========================

    getCoupons() {

        return this.get("BUYIT_COUPONS", []);

    },

    saveCoupons(coupons) {

        this.set("BUYIT_COUPONS", coupons);

    },

    // ==========================
    // CURRENT USER
    // ==========================

    getCurrentUser() {

        return this.get("BUYIT_CURRENT_USER", null);

    },

    saveCurrentUser(user) {

        this.set("BUYIT_CURRENT_USER", user);

    },

    // ==========================
    // ADMIN
    // ==========================

    getAdmin() {

        return this.get("BUYIT_ADMIN", null);

    },

    saveAdmin(admin) {

        this.set("BUYIT_ADMIN", admin);

    },

    // ==========================
    // ANALYTICS
    // ==========================

    getAnalytics() {

        return {

            orders: this.getOrders().length,

            products:

                this.getProducts().length +

                this.getCustomProducts().length,

            customers:

                this.getCustomers().length,

            revenue:

                this.getOrders()

                    .reduce((sum, order) =>

                        sum + Number(order.total || 0), 0)

        };

    },

    // ==========================
    // EXPORT
    // ==========================

    exportAll() {

        return {

            products: this.getProducts(),

            customProducts: this.getCustomProducts(),

            orders: this.getOrders(),

            customers: this.getCustomers(),

            coupons: this.getCoupons(),

            wishlist: this.getWishlist(),

            cart: this.getCart()

        };

    },

    // ==========================
    // IMPORT
    // ==========================

    importAll(data) {

        if (data.products)

            this.saveProducts(data.products);

        if (data.customProducts)

            this.saveCustomProducts(data.customProducts);

        if (data.orders)

            this.saveOrders(data.orders);

        if (data.customers)

            this.saveCustomers(data.customers);

        if (data.coupons)

            this.saveCoupons(data.coupons);

        if (data.cart)

            this.saveCart(data.cart);

        if (data.wishlist)

            this.saveWishlist(data.wishlist);

    }

};

window.Storage = Storage;