const Utils = {

    currency(amount) {

        return "₦" + Number(amount || 0).toLocaleString();

    },

    id(prefix = "SKU") {

        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;

    },

    today() {

        return new Date().toLocaleDateString();

    },

    dateTime() {

        return new Date().toLocaleString();

    },

    escapeHTML(text = "") {

        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;

    },

    capitalize(text = "") {

        return text.charAt(0).toUpperCase() + text.slice(1);

    },

    debounce(callback, delay = 300) {

        let timer;

        return (...args) => {

            clearTimeout(timer);

            timer = setTimeout(() => {

                callback(...args);

            }, delay);

        };

    },

    randomColor() {

        const colors = [
            "#2563eb",
            "#16a34a",
            "#ea580c",
            "#7c3aed",
            "#dc2626",
            "#0891b2"
        ];

        return colors[
            Math.floor(Math.random() * colors.length)
        ];

    }

};

window.Utils = Utils;