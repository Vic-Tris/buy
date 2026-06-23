document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LOGIN FORM HANDLER
    // ==========================================
    const loginForm = document.getElementById("login-form");
    const loginErrorMsg = document.getElementById("login-error-msg");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Kill the 405 native postback loop!

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email && password.length >= 4) {
                // UNIFIED STORAGE KEY: Upgraded to BUYIT_CURRENT_USER for dashboard sync
                const userData = { 
                    email: email, 
                    name: email.split("@")[0],
                    addresses: [] 
                };
                localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(userData));

                alert(`Welcome back, ${userData.name}!`);
                
                // Immediately synchronize navigation layout modules before redirecting
                if (typeof window.syncHeaderAuthUI === "function") {
                    window.syncHeaderAuthUI();
                }

                window.location.href = "index.html"; 
            } else {
                if (loginErrorMsg) {
                    loginErrorMsg.textContent = "Invalid email or short password (min 4 characters).";
                    loginErrorMsg.style.display = "block";
                }
            }
        });
    }

    // ==========================================
    // 2. REGISTRATION FORM HANDLER
    // ==========================================
    const registerForm = document.getElementById("register-form");
    
    // Create a dynamic container error alert message box if it doesn't exist in markup
    let registerErrorMsg = document.getElementById("register-error-msg");
    if (registerForm && !registerErrorMsg) {
        registerErrorMsg = document.createElement("p");
        registerErrorMsg.id = "register-error-msg";
        registerErrorMsg.style.cssText = "color: #dc2626; font-size: 0.9rem; margin-top: 15px; text-align: center;";
        registerForm.appendChild(registerErrorMsg);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Defuse the 405 static engine crash!

            const fullName = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            // Step A: Validate passwords match exactly
            if (password !== confirmPassword) {
                registerErrorMsg.textContent = "Passwords do not match. Please try again.";
                registerErrorMsg.style.display = "block";
                return;
            }

            // Step B: Enforce a secure baseline length
            if (password.length < 6) {
                registerErrorMsg.textContent = "Password must be at least 6 characters long.";
                registerErrorMsg.style.display = "block";
                return;
            }

            // Step C: If validations clear, save profile session details
            const newUser = {
                name: fullName,
                email: email,
                addresses: []
            };

            // UNIFIED STORAGE KEY: Upgraded to BUYIT_CURRENT_USER for dashboard sync
            localStorage.setItem("BUYIT_CURRENT_USER", JSON.stringify(newUser));

            alert(`Account created successfully! Welcome to BuyIt, ${fullName}!`);
            
            // Immediately synchronize navigation layout modules before redirecting
            if (typeof window.syncHeaderAuthUI === "function") {
                window.syncHeaderAuthUI();
            }

            window.location.href = "index.html";
        });
    }
});

// ===================================================
// 3. GLOBAL HEADER AUTH SYNC & ADMIN INJECTOR MODULE
// ===================================================
window.syncHeaderAuthUI = function() {
    const currentUser = JSON.parse(localStorage.getItem("BUYIT_CURRENT_USER"));
    const authLinkContainer = document.getElementById("auth-link-container"); 
    const mainNavList = document.querySelector(".main-nav ul"); 
    
    // Clear out pre-existing custom nodes to avoid duplicate renderings
    document.getElementById("admin-nav-link")?.remove();
    document.getElementById("admin-floating-badge")?.remove();

    // 🔏 Master Admin Credentials Match Filter
    const MASTER_ADMIN_EMAIL = "admin@fevicstore.com";

    if (currentUser) {
        if (authLinkContainer) {
            authLinkContainer.innerHTML = `
                <a href="profile.html" class="nav-user-link"><i class="fa-solid fa-user"></i> Hi, ${currentUser.name || 'Account'}</a>
            `;
        }

        // Check for Admin Rights
        if (currentUser.email === MASTER_ADMIN_EMAIL) {
            console.log("Admin account online. Injecting navigation nodes...");

            // SUGGESTION 1: Inline Navigation Link Node Addition
            if (mainNavList) {
                const adminLi = document.createElement("li");
                adminLi.id = "admin-nav-link";
                adminLi.innerHTML = `
                    <a href="admin.html" style="color: #ef4444; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-unlock-keyhole"></i> Admin Panel
                    </a>
                `;
                mainNavList.appendChild(adminLi);
            }

            // SUGGESTION 2: Floating Sticky Shortcut Action Widget Control Badge
            const floatingBadge = document.createElement("a");
            floatingBadge.id = "admin-floating-badge";
            floatingBadge.href = "admin.html";
            floatingBadge.title = "Open Admin Control Center";
            
            Object.assign(floatingBadge.style, {
                position: "fixed",
                bottom: "30px",
                right: "30px",
                width: "60px",
                height: "60px",
                backgroundColor: "#1e293b", 
                color: "#22c55e", 
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                zIndex: "99999",
                cursor: "pointer",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                border: "2px solid #22c55e"
            });

            floatingBadge.innerHTML = `<i class="fa-solid fa-sliders"></i>`;

            floatingBadge.onmouseenter = () => { 
                floatingBadge.style.transform = "scale(1.1)"; 
                floatingBadge.style.backgroundColor = "#0f172a"; 
            };
            floatingBadge.onmouseleave = () => { 
                floatingBadge.style.transform = "scale(1)"; 
                floatingBadge.style.backgroundColor = "#1e293b"; 
            };

            document.body.appendChild(floatingBadge);
        }
    } else {
        if (authLinkContainer) {
            authLinkContainer.innerHTML = `<a href="login.html"><i class="fa-solid fa-user"></i> Login / Register</a>`;
        }
    }
};