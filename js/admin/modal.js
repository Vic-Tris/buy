/* ===========================================
   BUYIT MODAL ENGINE
=========================================== */

const Modal = {

    activeModal: null,

    open(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.add("open");

        document.body.classList.add("modal-open");

        this.activeModal = modal;

    },

    close(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.remove("open");

        document.body.classList.remove("modal-open");

        this.activeModal = null;

    },

    closeCurrent() {

        if (this.activeModal) {

            this.activeModal.classList.remove("open");

            document.body.classList.remove("modal-open");

            this.activeModal = null;

        }

    },

    toggle(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        if (modal.classList.contains("open")) {

            this.close(id);

        } else {

            this.open(id);

        }

    },

    init() {

        // Close when clicking backdrop
        document.addEventListener("click", (e) => {

            if (e.target.classList.contains("admin-modal")) {

                e.target.classList.remove("open");

                document.body.classList.remove("modal-open");

                this.activeModal = null;

            }

        });

        // Close buttons
        document.addEventListener("click", (e) => {

            if (

                e.target.matches("[data-close-modal]") ||

                e.target.closest("[data-close-modal]")

            ) {

                this.closeCurrent();

            }

        });

        // ESC key closes modal
        document.addEventListener("keydown", (e) => {

            if (

                e.key === "Escape" &&

                this.activeModal

            ) {

                this.closeCurrent();

            }

        });

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Modal.init();

});

window.Modal = Modal;