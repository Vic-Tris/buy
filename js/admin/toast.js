/* ===========================================
   BUYIT TOAST NOTIFICATION ENGINE
=========================================== */

const Toast = {

    container: null,

    init() {

        if (document.getElementById("toast-container")) {

            this.container = document.getElementById("toast-container");

            return;

        }

        this.container = document.createElement("div");

        this.container.id = "toast-container";

        document.body.appendChild(this.container);

    },

    show(message, type = "success", duration = 3500) {

        if (!this.container) {

            this.init();

        }

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        const icons = {

            success: "fa-circle-check",

            error: "fa-circle-xmark",

            warning: "fa-triangle-exclamation",

            info: "fa-circle-info"

        };

        toast.innerHTML = `

            <div class="toast-icon">

                <i class="fa-solid ${icons[type] || icons.success}"></i>

            </div>

            <div class="toast-message">

                ${message}

            </div>

            <button class="toast-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

            <div class="toast-progress"></div>

        `;

        this.container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        const progress = toast.querySelector(".toast-progress");

        progress.style.animationDuration = `${duration}ms`;

        const timer = setTimeout(() => {

            this.remove(toast);

        }, duration);

        toast.querySelector(".toast-close").onclick = () => {

            clearTimeout(timer);

            this.remove(toast);

        };

    },

    remove(toast) {

        toast.classList.remove("show");

        toast.classList.add("hide");

        setTimeout(() => {

            toast.remove();

        }, 300);

    },

    success(msg) {

        this.show(msg, "success");

    },

    error(msg) {

        this.show(msg, "error");

    },

    warning(msg) {

        this.show(msg, "warning");

    },

    info(msg) {

        this.show(msg, "info");

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Toast.init();

});

window.Toast = Toast;