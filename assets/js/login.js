document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const rememberCheckbox = document.getElementById("rememberMe");
    const loginButton = document.getElementById("loginButton");
    const loginToast = document.getElementById("loginToast");

    const OWNER_EMAIL = "shahidbhati8233@gmail.com";
    const OWNER_PASSWORD = "@s7h7a7h7i7d";
    const DEFAULT_USERNAME = "admin";
    const DEFAULT_PASSWORD = "1234";

    if (!loginForm || !loginUsername || !loginPassword || !loginButton || !loginToast) {
        return;
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleLogin();
    });

    function handleLogin() {
        const usernameValue = loginUsername.value.trim();
        const passwordValue = loginPassword.value;
        const remember = rememberCheckbox.checked;

        if (!usernameValue || !passwordValue) {
            showToast(loginToast, "Please enter username and password.", "error");
            return;
        }

        const storedUsers = getStoredUsers();
        const matchedUser = storedUsers.find((user) => user.email === usernameValue.toLowerCase());
        const isOwner = usernameValue.toLowerCase() === OWNER_EMAIL && passwordValue === OWNER_PASSWORD;
        const isDefaultAdmin = usernameValue === DEFAULT_USERNAME && passwordValue === DEFAULT_PASSWORD;
        const isStoredUser = matchedUser && matchedUser.password === passwordValue;

        if (isDefaultAdmin || isOwner || isStoredUser) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";

            setTimeout(() => {
                const session = {
                    loggedIn: true,
                    user: isOwner ? OWNER_EMAIL : (isDefaultAdmin ? DEFAULT_USERNAME : matchedUser.email),
                    time: Date.now()
                };

                localStorage.setItem("rr_school_login", JSON.stringify(session));

                if (remember) {
                    localStorage.setItem("rr_school_login_remember", "true");
                } else {
                    localStorage.removeItem("rr_school_login_remember");
                }

                showToast(loginToast, "Login successful! Redirecting...", "success");
                window.location.href = "index.html";
            }, 700);

            return;
        }

        showToast(loginToast, "Invalid credentials. Please try again.", "error");
    }

    function getStoredUsers() {
        try {
            const saved = localStorage.getItem("rr_school_users");
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load stored users:", error);
            return [];
        }
    }

    function showToast(container, message, type) {
        container.textContent = message;
        container.className = `toast ${type}`;
        container.style.display = "block";

        clearTimeout(window.loginToastTimeout);
        window.loginToastTimeout = setTimeout(() => {
            container.style.display = "none";
        }, 3000);
    }
});
