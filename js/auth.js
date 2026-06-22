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
                const userData = { email: email, name: email.split("@")[0] };
                localStorage.setItem("BUYIT_USER", JSON.stringify(userData));

                alert(`Welcome back, ${userData.name}!`);
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
    // 2. REGISTRATION FORM HANDLER (NEW FIX)
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

            // Step C: If validations clear, save mock registration profile
            const newUser = {
                name: fullName,
                email: email
            };

            // Log user session into browser memory database state instantly
            localStorage.setItem("BUYIT_USER", JSON.stringify(newUser));

            alert(`Account created successfully! Welcome to BuyIt, ${fullName}!`);
            window.location.href = "index.html";
        });
    }
});