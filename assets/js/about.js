/* ==========================================
        ABOUT PAGE JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Animated Counter
    // ==========================

    const counters = document.querySelectorAll(".achievement-box h2");

    const runCounter = (counter) => {

        const target = parseInt(counter.innerText.replace(/\D/g, ""));

        if (isNaN(target)) return;

        let count = 0;

        const speed = Math.max(20, Math.floor(target / 100));

        const update = () => {

            count += speed;

            if (count >= target) {

                counter.innerText = counter.innerText.includes("%")
                    ? target + "%"
                    : target + "+";

                return;
            }

            counter.innerText = counter.innerText.includes("%")
                ? count + "%"
                : count + "+";

            requestAnimationFrame(update);

        };

        update();

    };

    const observer = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                runCounter(entry.target);

                obs.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.5

    });

    counters.forEach(counter => observer.observe(counter));

});
/* ==========================================
        SCROLL REVEAL ANIMATION
========================================== */

const revealElements = document.querySelectorAll(`
    .about-grid,
    .vision-card,
    .value-card,
    .principal-grid,
    .why-card,
    .achievement-box,
    .campus-grid,
    .timeline-item,
    .cta-box
`);

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.15

});

revealElements.forEach(el => {

    el.classList.add("hidden");

    revealObserver.observe(el);

});


/* ==========================================
        SMOOTH SCROLL
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e){

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth",

                block:"start"

            });

        }

    });

});


/* ==========================================
        ACTIVE NAVIGATION
========================================== */

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link=>{

    const href = link.getAttribute("href");

    if(href===currentPage){

        link.classList.add("active");

    }

});


/* ==========================================
        PARALLAX HERO
========================================== */

const hero = document.querySelector(".about-hero");

window.addEventListener("scroll",()=>{

    if(hero){

        hero.style.backgroundPositionY =

        window.pageYOffset * 0.35 + "px";

    }

});


/* ==========================================
        IMAGE HOVER EFFECT
========================================== */

document.querySelectorAll(".about-image img,.campus-image img,.principal-image img")

.forEach(img=>{

    img.addEventListener("mouseenter",()=>{

        img.style.transform="scale(1.08)";

    });

    img.addEventListener("mouseleave",()=>{

        img.style.transform="scale(1)";

    });

});


/* ==========================================
        PAGE LOADED
========================================== */

window.addEventListener("load",()=>{

    document.body.classList.add("page-loaded");

});
