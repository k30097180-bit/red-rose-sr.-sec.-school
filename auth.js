function isLoggedIn() {
    try {
        const session = JSON.parse(localStorage.getItem("rr_school_login") || "null");
        return session && session.loggedIn === true;
    } catch (error) {
        console.error("Auth parse error:", error);
        return false;
    }
}

function redirectToLogin() {
    if (window.location.pathname.endsWith("login.html")) {
        return;
    }

    window.location.href = "login.html";
}

function redirectToHome() {
    window.location.href = "index.html";
}

function checkAuth() {
    const loggedIn = isLoggedIn();

    if (!loggedIn) {
        redirectToLogin();
        return;
    }

    const logoutButton = document.getElementById("logoutBtn");
    const loginButton = document.getElementById("loginPortalBtn");

    if (logoutButton) {
        logoutButton.style.display = "inline-flex";
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            logout();
        });
    }

    if (loginButton) {
        loginButton.style.display = "none";
    }
}

// isAdmin helper removed — dashboard cancelled

function logout() {
    localStorage.removeItem("rr_school_login");
    redirectToLogin();
}

function guardLoginPage() {
    if (isLoggedIn()) {
        redirectToHome();
    }
}

if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const currentPage = window.location.pathname.split("/").pop();

        if (currentPage === "login.html" || currentPage === "create-account.html") {
            guardLoginPage();
            return;
        }

        checkAuth();
    });
}
