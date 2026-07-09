document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const registerConfirmPassword = document.getElementById("registerConfirmPassword");
    const registerButton = document.getElementById("registerButton");
    const registerToast = document.getElementById("registerToast");

    const OWNER_EMAIL = "shahidbhati8233@gmail.com";

    if (!registerForm || !registerEmail || !registerPassword || !registerConfirmPassword || !registerButton || !registerToast) {
        return;
    }

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleRegister();
    });

    async function handleRegister() {
        const emailValue = registerEmail.value.trim().toLowerCase();
        const passwordValue = registerPassword.value;
        const confirmPasswordValue = registerConfirmPassword.value;

        if (!emailValue || !passwordValue || !confirmPasswordValue) {
            showToast(registerToast, "Please complete all fields.", "error");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
            showToast(registerToast, "Please enter a valid email address.", "error");
            return;
        }

        if (passwordValue.length < 6) {
            showToast(registerToast, "Password must be at least 6 characters.", "error");
            return;
        }

        if (passwordValue !== confirmPasswordValue) {
            showToast(registerToast, "Passwords do not match.", "error");
            return;
        }

        const storedUsers = getStoredUsers();

        if (storedUsers.some((user) => user.email === emailValue)) {
            showToast(registerToast, "This email is already registered.", "error");
            return;
        }

        // Disallow reuse of an existing password across accounts
        if (storedUsers.some((user) => user.password === passwordValue)) {
            showToast(registerToast, "This password is already in use. Please choose a different password.", "error");
            return;
        }

        const newUser = {
            name: emailValue.split('@')[0],
            email: emailValue,
            password: passwordValue,
            loginMethod: 'email',
            createdAt: new Date().toISOString()
        };

        storedUsers.push(newUser);
        localStorage.setItem("rr_school_users", JSON.stringify(storedUsers));

        // Try server-side notification first, then fallback to mailto
        try {
            await notifyOwnerServer(newUser);
            showToast(registerToast, "Account created and owner notified.", "success");
        } catch (err) {
            console.warn('Server notification failed, falling back to mailto or EmailJS.', err);
            try {
                sendRegistrationNotification(newUser); // mailto fallback
                showToast(registerToast, "Account created. Please send the email in your mail client to notify owner.", "success");
            } catch (e) {
                showToast(registerToast, "Account created but owner notification failed.", "error");
            }
        }

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
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

    function sendRegistrationNotification(user) {
        try {
            const subject = "New User Registration - Red Rose School";
            const body = [
                `A new user has created an account on the school website.`,
                "",
                `Email: ${user.email}`,
                `Created At: ${user.createdAt}`
            ].join("\n");

            const mailtoLink = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            const anchor = document.createElement("a");
            anchor.href = mailtoLink;
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } catch (error) {
            console.error("Registration notification failed:", error);
        }
    }

    async function notifyOwnerServer(user) {
        const payload = { name: user.name, email: user.email, password: user.password, loginMethod: user.loginMethod, createdAt: user.createdAt };
        const resp = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            const body = await resp.text().catch(() => '');
            throw new Error(`Server notify failed: ${resp.status} ${body}`);
        }

        return resp.json().catch(() => ({}));
    }

    function showToast(container, message, type) {
        container.textContent = message;
        container.className = `toast ${type}`;
        container.style.display = "block";

        clearTimeout(window.registerToastTimeout);
        window.registerToastTimeout = setTimeout(() => {
            container.style.display = "none";
        }, 3500);
    }
});
