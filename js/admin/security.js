/* ===========================================
   BUYIT SECURITY ENGINE
=========================================== */

const Security = {

    // =========================================
    // USER HELPERS
    // =========================================

    currentUser() {

        return Storage.getCurrentUser();

    },

    currentAdmin() {

        return Storage.getAdmin();

    },

    isLoggedIn() {

        return this.currentUser() !== null;

    },

    isAdmin() {

        const admin = this.currentAdmin();

        return admin &&
               admin.role === "admin";

    },

    // =========================================
    // PAGE PROTECTION
    // =========================================

    protectAdminPage() {

        if (!this.isAdmin()) {

            alert("Access denied.");

            window.location.replace("login.html");

        }

    },

    protectLoggedInPages() {

        if (!this.isLoggedIn()) {

            window.location.replace("login.html");

        }

    },

    protectGuestPages() {

        if (this.isLoggedIn()) {

            window.location.replace("index.html");

        }

    },

    // =========================================
    // LOGIN
    // =========================================

    login(user) {

        Storage.saveCurrentUser(user);

        if (user.role === "admin") {

            Storage.saveAdmin(user);

        }

    },

    // =========================================
    // LOGOUT
    // =========================================

    logout() {

        Storage.remove("BUYIT_CURRENT_USER");

        Storage.remove("BUYIT_ADMIN");

        window.location.href = "login.html";

    },

    // =========================================
    // ROLES
    // =========================================

    hasRole(role) {

        const user = this.currentUser();

        if (!user) return false;

        return user.role === role;

    },

    // =========================================
    // SESSION VALIDATION
    // =========================================

    validateSession() {

        const user = this.currentUser();

        if (!user) return false;

        if (!user.email) {

            this.logout();

            return false;

        }

        return true;

    },

    // =========================================
    // AUTO INITIALIZATION
    // =========================================

    init() {

        const page = window.location.pathname;

        if (page.includes("admin.html")) {

            this.protectAdminPage();

        }

        this.validateSession();

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Security.init();

});

window.Security = Security;