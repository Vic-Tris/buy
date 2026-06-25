function initAuthForms() {
    if (window.buyItAuthFormsInitialized) return;
    window.buyItAuthFormsInitialized = true;

    // ===================================================
    // LOGIN FORM
    // ===================================================
    const loginForm = document.getElementById("login-form");
    const loginErrorMsg = document.getElementById("login-error-msg");

    if (loginForm) {

        loginForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            const MASTER_ADMIN_EMAIL = "admin@fevicstore.com";
            const MASTER_ADMIN_PASSWORD = "admin123";

            // ADMIN LOGIN
            if (
                email === MASTER_ADMIN_EMAIL &&
                password === MASTER_ADMIN_PASSWORD
            ) {

                const adminData = {
                    email,
                    name: "Administrator",
                    role: "admin"
                };

                localStorage.setItem(
                    "BUYIT_ADMIN",
                    JSON.stringify(adminData)
                );

                localStorage.setItem(
                    "BUYIT_CURRENT_USER",
                    JSON.stringify(adminData)
                );

                alert("Admin Login Successful");

                window.location.href = "admin.html";

                return;
            }

            // NORMAL USER LOGIN
            if (email && password.length >= 4) {

                const userData = {
                    email,
                    name: email.split("@")[0],
                    role: "user",
                    addresses: []
                };

                localStorage.setItem(
                    "BUYIT_CURRENT_USER",
                    JSON.stringify(userData)
                );

                alert(`Welcome back, ${userData.name}!`);

                window.location.href = "index.html";

            } else {

                if (loginErrorMsg) {

                    loginErrorMsg.textContent =
                        "Invalid email or password.";

                    loginErrorMsg.style.display = "block";
                }
            }

        });

    }

    // ===================================================
    // REGISTER FORM
    // ===================================================
    const registerForm = document.getElementById("register-form");

    let registerErrorMsg =
        document.getElementById("register-error-msg");

    if (registerForm && !registerErrorMsg) {

        registerErrorMsg =
            document.createElement("p");

        registerErrorMsg.id =
            "register-error-msg";

        registerErrorMsg.style.cssText =
            "color:#dc2626;font-size:.9rem;margin-top:15px;text-align:center;";

        registerForm.appendChild(registerErrorMsg);
    }

    if (registerForm) {

        registerForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const fullName =
                document.getElementById("fullname").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {

                registerErrorMsg.textContent =
                    "Passwords do not match.";

                registerErrorMsg.style.display = "block";

                return;
            }

            if (password.length < 6) {

                registerErrorMsg.textContent =
                    "Password must be at least 6 characters.";

                registerErrorMsg.style.display = "block";

                return;
            }

            const newUser = {
                name: fullName,
                email,
                role: "user",
                addresses: []
            };

            localStorage.setItem(
                "BUYIT_CURRENT_USER",
                JSON.stringify(newUser)
            );

            alert(`Welcome to BuyIt, ${fullName}!`);

            window.location.href = "index.html";

        });

    }

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuthForms);
} else {
    initAuthForms();
}

// ===================================================
// HEADER AUTH UI SYNC (NATURAL NAVIGATION VERSION)
// ===================================================
window.syncHeaderAuthUI = function () {
    const currentUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    const admin = JSON.parse(localStorage.getItem("BUYIT_ADMIN"));
    const loggedInUser = currentUser || admin;
    const adminLinkContainer = document.getElementById("admin-link-container");
    const authLinkContainer = document.getElementById("auth-link-container");
    const isAdmin = Boolean(
        admin &&
        admin.email === "admin@fevicstore.com" &&
        admin.role === "admin"
    );

    if (adminLinkContainer) {
        if (isAdmin) {
            adminLinkContainer.style.display = "block";
            adminLinkContainer.innerHTML = `
                <a href="admin.html" style="font-weight: bold; color: #22c55e;">
                    <i class="fa-solid fa-unlock-keyhole"></i> Admin Panel
                </a>
            `;
        } else {
            adminLinkContainer.style.display = "none";
            adminLinkContainer.innerHTML = "";
        }
    }

    if (authLinkContainer) {
        if (loggedInUser) {
            authLinkContainer.innerHTML = `
                <a href="#" id="logout-btn" class="logout-link" style="color: #ef4444; font-weight: bold;">
                    <i class="fa-solid fa-right-from-bracket"></i> Log Out
                </a>
            `;
            const logoutBtn = document.getElementById("logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("BUYIT_CURRENT_USER");
                    localStorage.removeItem("BUYIT_ADMIN");
                    alert("Logged out successfully.");
                    window.location.href = "login.html";
                });
            }
        } else {
            authLinkContainer.innerHTML = `
                <a href="login.html">
                    <i class="fa-solid fa-user"></i> Log In
                </a>
            `;
        }
    }
};
