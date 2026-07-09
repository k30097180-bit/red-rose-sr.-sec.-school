/* ==========================================
        STICKY HEADER
========================================== */

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");

    if (header) {
        header.classList.toggle("sticky", window.scrollY > 50);
    }
});

/* ==========================================
        FADE-IN ANIMATION ON SCROLL
========================================== */

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.15
    });

    document.querySelectorAll("section").forEach((section) => {
        if (section) {
            observer.observe(section);
        }
    });
} else {
    document.querySelectorAll("section").forEach((section) => {
        if (section) {
            section.classList.add("show");
        }
    });
}

/* ==========================================
        BACK TO TOP
========================================== */

const backToTop = document.getElementById("backToTop");

if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ==========================================
        PAGE LOADER
========================================== */

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (!loader) {
        return;
    }

    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
});

/* ==========================================
        BUTTON RIPPLE EFFECT
========================================== */

document.querySelectorAll(".btn").forEach((button) => {
    if (!button) {
        return;
    }

    button.addEventListener("click", function (e) {
        const circle = document.createElement("span");

        circle.classList.add("ripple");
        this.appendChild(circle);

        const x = e.clientX - this.offsetLeft;
        const y = e.clientY - this.offsetTop;

        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;

        setTimeout(() => {
            circle.remove();
        }, 600);
    });
});

/* ==========================================
        SCROLL PROGRESS BAR
========================================== */

const progressBar = document.getElementById("progressBar");

if (progressBar) {
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;

        progressBar.style.width = `${progress}%`;
    });
}

/* ==========================================
        ANIMATED COUNTERS
========================================== */

const counters = document.querySelectorAll(".counter");

if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || !entry.target) {
                return;
            }

            const counter = entry.target;
            const target = Number(counter.dataset.target) || 0;
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 100));

            const updateCounter = () => {
                current += increment;

                if (current >= target) {
                    counter.innerText = target;
                } else {
                    counter.innerText = current;
                    requestAnimationFrame(updateCounter);
                }
            };

            updateCounter();
            counterObserver.unobserve(counter);
        });
    }, {
        threshold: 0.5
    });

    counters.forEach((counter) => {
        if (counter) {
            counterObserver.observe(counter);
        }
    });
} else {
    counters.forEach((counter) => {
        if (counter) {
            counter.innerText = Number(counter.dataset.target) || 0;
        }
    });
}

/* ==========================================
        HERO TEXT TYPING EFFECT
========================================== */

const heroTitle = document.querySelector(".hero-content h1");

if (heroTitle) {
    const originalText = heroTitle.textContent || "";

    heroTitle.textContent = "";

    let i = 0;

    function typing() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typing, 40);
        }
    }

    window.addEventListener("load", () => {
        setTimeout(typing, 500);
    });
}
