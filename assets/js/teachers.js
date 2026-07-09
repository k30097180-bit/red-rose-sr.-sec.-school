document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.stat-value');
    const faqButtons = document.querySelectorAll('.faq-question');

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        counters.forEach((counter) => counterObserver.observe(counter));
    } else {
        counters.forEach((counter) => animateCounter(counter));
    }

    faqButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const answerId = button.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            const isOpen = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', String(!isOpen));
            button.querySelector('i').classList.toggle('fa-plus', isOpen);
            button.querySelector('i').classList.toggle('fa-minus', !isOpen);

            if (answer) {
                answer.hidden = isOpen;
                answer.classList.toggle('open', !isOpen);
            }
        });
    });

    function animateCounter(element) {
        const target = parseInt(element.dataset.target, 10) || 0;
        const duration = 1400;
        const start = 0;
        const stepTime = Math.max(Math.floor(duration / target), 20);
        let current = start;

        const timer = setInterval(() => {
            current += 1;
            element.textContent = target >= 100 ? current + (current === target ? '+' : '') : current;
            if (current >= target) {
                clearInterval(timer);
                if (target >= 100 && target < 1000) {
                    element.textContent = target + '+';
                } else if (target >= 1000) {
                    element.textContent = target + '+';
                }
            }
        }, stepTime);
    }
});
