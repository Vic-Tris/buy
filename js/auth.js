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

            // ===================================================
            // DYNAMIC MULTI-ADMIN ENGINE LOOKUP (UPDATED)
            // ===================================================
            let adminRegistry = JSON.parse(localStorage.getItem("BUYIT_ADMINS_REGISTRY")) || [
                { email: "admin@fevicstore.com", name: "Administrator", password: "admin123" }
            ];

            const adminRecord = adminRegistry.find(a => 
                a.email.toLowerCase() === email.toLowerCase() && 
                a.password === password
            );

            if (adminRecord) {
                const adminData = {
                    email: adminRecord.email,
                    name: adminRecord.name,
                    role: "admin"
                };

                localStorage.setItem("BUYIT_ADMIN", JSON.stringify(adminData));
                localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(adminData));

                alert(`Admin Login Successful. Welcome back, ${adminRecord.name}!`);
                window.location.href = "admin.html";
                return;
            }

            // NORMAL USER LOGIN
            const localUsers = JSON.parse(localStorage.getItem("BUYIT_REGISTERED_USERS_DB")) || [];
            const userRecord = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (userRecord) {
                if (userRecord.password === password) {
                    localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(userRecord));
                    alert(`Welcome back, ${userRecord.name}!`);
                    window.location.href = "index.html";
                    return;
                } else {
                    if (loginErrorMsg) {
                        loginErrorMsg.textContent = "Invalid email or password.";
                        loginErrorMsg.style.display = "block";
                    }
                    return;
                }
            }

            // Legacy Fallback (If db registry arrays aren't instantiated yet and not an admin attempt)
            const isTryingAdminEmail = adminRegistry.some(a => a.email.toLowerCase() === email.toLowerCase());
            if (email && password.length >= 4 && !isTryingAdminEmail) {
                const userData = {
                    email,
                    name: email.split("@")[0],
                    role: "user",
                    addresses: []
                };

                localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(userData));
                alert(`Welcome back, ${userData.name}!`);
                window.location.href = "index.html";
            } else {
                if (loginErrorMsg) {
                    loginErrorMsg.textContent = "Invalid email or password.";
                    loginErrorMsg.style.display = "block";
                }
            }
        });
    }

    // ===================================================
    // FORGOT PASSWORD INTERFACE ROUTINES
    // ===================================================
    const forgotPwTrigger = document.getElementById("forgot-pw-trigger");
    const forgotPwModal = document.getElementById("forgot-pw-modal");
    const closeResetModal = document.getElementById("close-reset-modal");
    const forgotPwForm = document.getElementById("forgot-pw-form");

    if (forgotPwTrigger && forgotPwModal) {
        forgotPwTrigger.addEventListener("click", (e) => {
            e.preventDefault();
            forgotPwModal.style.display = "flex";
        });
    }

    if (closeResetModal && forgotPwModal) {
        closeResetModal.addEventListener("click", () => {
            forgotPwModal.style.display = "none";
            if (forgotPwForm) forgotPwForm.reset();
        });
    }

    if (forgotPwForm) {
        forgotPwForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const resetEmail = document.getElementById("reset-email").value.trim().toLowerCase();
            const newPassword = document.getElementById("reset-new-password").value;

            // Block password recovery for all registered administration staff
            let adminRegistry = JSON.parse(localStorage.getItem("BUYIT_ADMINS_REGISTRY")) || [
                { email: "admin@fevicstore.com", name: "Administrator", password: "admin123" }
            ];
            const isAdminEmail = adminRegistry.some(a => a.email.toLowerCase() === resetEmail);

            if (isAdminEmail) {
                alert("Security Action Restrained: Administrator password configurations must be modified exclusively via the internal dashboard options portal.");
                return;
            }

            if (newPassword.length < 4) {
                alert("Password security threshold error: Passphrase must match or exceed 4 characters.");
                return;
            }

            let registeredDb = JSON.parse(localStorage.getItem("BUYIT_REGISTERED_USERS_DB")) || [];
            const userIndex = registeredDb.findIndex(u => u.email.toLowerCase() === resetEmail);

            if (userIndex !== -1) {
                registeredDb[userIndex].password = newPassword;
                localStorage.setItem("BUYIT_REGISTERED_USERS_DB", JSON.stringify(registeredDb));
                alert("Password modified successfully. Use your new credentials to log in.");
            } else {
                const sampleUser = {
                    name: resetEmail.split("@")[0],
                    email: resetEmail,
                    password: newPassword,
                    role: "user",
                    addresses: []
                };
                registeredDb.push(sampleUser);
                localStorage.setItem("BUYIT_REGISTERED_USERS_DB", JSON.stringify(registeredDb));
                alert("Account verified and entry recovered. Password successfully reassigned.");
            }

            forgotPwModal.style.display = "none";
            forgotPwForm.reset();
        });
    }

    // ===================================================
    // REGISTER FORM
    // ===================================================
    const registerForm = document.getElementById("register-form");
    let registerErrorMsg = document.getElementById("register-error-msg");

    if (registerForm && !registerErrorMsg) {
        registerErrorMsg = document.createElement("p");
        registerErrorMsg.id = "register-error-msg";
        registerErrorMsg.style.cssText = "color:#dc2626;font-size:.9rem;margin-top:15px;text-align:center;";
        registerForm.appendChild(registerErrorMsg);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                registerErrorMsg.textContent = "Passwords do not match.";
                registerErrorMsg.style.display = "block";
                return;
            }

            if (password.length < 6) {
                registerErrorMsg.textContent = "Password must be at least 6 characters.";
                registerErrorMsg.style.display = "block";
                return;
            }

            const newUser = {
                name: fullName,
                email,
                role: "user",
                addresses: []
            };

            localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(newUser));
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
// HEADER AUTH UI SYNC (DYNAMIC ADMIN COMPATIBLE)
// ===================================================
window.syncHeaderAuthUI = function () {
    const currentUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    const admin = JSON.parse(localStorage.getItem("BUYIT_ADMIN"));
    const loggedInUser = currentUser || admin;
    
    const adminLinkContainer = document.getElementById("admin-link-container");
    const authLinkContainer = document.getElementById("auth-link-container");

    // Dynamic verification: Check if the logged-in session has a valid administrator role flag
    const isAdmin = Boolean(loggedInUser && loggedInUser.role === "admin");

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