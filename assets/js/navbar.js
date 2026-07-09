// ==============================
// MOBILE MENU
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    const menuButtons = document.querySelectorAll(".menu-toggle, .menu-btn");
    const sidebar = document.querySelector(".mobile-sidebar");
    const closeBtn = document.querySelector(".close-btn");
    const overlay = document.querySelector(".overlay");

    if (!menuButtons.length || !sidebar || !overlay) {
        return;
    }

    function openMenu() {
        sidebar.classList.add("active");
        overlay.classList.add("active");

        if (document.body) {
            document.body.style.overflow = "hidden";
        }
    }

    function closeMenu() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");

        if (document.body) {
            document.body.style.overflow = "";
        }
    }

    menuButtons.forEach((button) => {
        if (button) {
            button.addEventListener("click", openMenu);
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeMenu);
    }

    overlay.addEventListener("click", closeMenu);

    document.querySelectorAll(".mobile-sidebar a").forEach((link) => {
        if (link) {
            link.addEventListener("click", closeMenu);
        }
    });
});
