// Blog Specific Functionality

document.addEventListener('DOMContentLoaded', () => {
    initBlogAnimations();
    initSearch();
});

function initBlogAnimations() {
    const cards = document.querySelectorAll('.blog-card, .article-card, .blog-post-item');
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        cards.forEach((card) => card.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${Math.min(index * 60, 420)}ms`;
        observer.observe(card);
    });
}

function initSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const posts = document.querySelectorAll('.blog-post-item, .article-card, .blog-card');

        posts.forEach(post => {
            const titleEl = post.querySelector('.blog-title, .card-heading, .card-title, h3, h2');
            const categoryEl = post.querySelector('.blog-category, .category-tag, .badge');
            const title = titleEl ? titleEl.textContent.toLowerCase() : '';
            const category = categoryEl ? categoryEl.textContent.toLowerCase() : '';
            
            if (title.includes(term) || category.includes(term)) {
                post.style.display = '';
                setTimeout(() => {
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0) scale(1)';
                }, 10);
            } else {
                post.style.opacity = '0';
                post.style.transform = 'translateY(10px) scale(0.98)';
                setTimeout(() => {
                    post.style.display = 'none';
                }, 300);
            }
        });
    });
}
