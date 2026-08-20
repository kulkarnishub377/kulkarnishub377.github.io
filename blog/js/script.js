// Blog Specific Functionality

document.addEventListener('DOMContentLoaded', () => {
    initBlogAnimations();
    initSearch();
    initShareButtons();
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
        card.style.transitionDelay = `${Math.min(index * 50, 400)}ms`;
        observer.observe(card);
    });
}

function initSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        const posts = document.querySelectorAll('.blog-post-item, .article-card, .blog-card');

        posts.forEach(post => {
            const titleEl = post.querySelector('.blog-title, .card-heading, .card-title, h3, h2');
            const categoryEl = post.querySelector('.blog-category, .category-tag, .badge');
            const excerptEl = post.querySelector('.card-excerpt, p');
            const title = titleEl ? titleEl.textContent.toLowerCase() : '';
            const category = categoryEl ? categoryEl.textContent.toLowerCase() : '';
            const excerpt = excerptEl ? excerptEl.textContent.toLowerCase() : '';
            
            if (!term || title.includes(term) || category.includes(term) || excerpt.includes(term)) {
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
                }, 250);
            }
        });
    });
}

function initShareButtons() {
    // Copy link buttons
    document.querySelectorAll('.copy-link-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Find article link if inside card, otherwise current page URL
            const card = btn.closest('.article-card, .blog-card');
            const linkEl = card ? card.querySelector('a.stretched-link, h3 a, h2 a') : null;
            const targetUrl = linkEl ? new URL(linkEl.getAttribute('href'), window.location.href).href : window.location.href;

            navigator.clipboard.writeText(targetUrl).then(() => {
                showToast('Link copied to clipboard! 📋');
            }).catch(() => {
                // Fallback
                const tempInput = document.createElement('input');
                tempInput.value = targetUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast('Link copied to clipboard! 📋');
            });
        });
    });

    // Social share buttons
    document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const platform = btn.dataset.platform;
            const card = btn.closest('.article-card, .blog-card');
            const linkEl = card ? card.querySelector('a.stretched-link, h3 a, h2 a') : null;
            const targetUrl = linkEl ? new URL(linkEl.getAttribute('href'), window.location.href).href : window.location.href;
            const titleEl = card ? card.querySelector('h3, h2, .card-heading') : document.querySelector('h1.hero-title, h1');
            const title = encodeURIComponent(titleEl ? titleEl.textContent.trim() : document.title);
            const encUrl = encodeURIComponent(targetUrl);

            let shareUrl = '';
            if (platform === 'linkedin') {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
            } else if (platform === 'twitter') {
                shareUrl = `https://twitter.com/intent/tweet?url=${encUrl}&text=${title}`;
            } else if (platform === 'whatsapp') {
                shareUrl = `https://api.whatsapp.com/send?text=${title}%20${encUrl}`;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
            }
        });
    });
}

function showToast(msg) {
    let toast = document.getElementById('blogToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'blogToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 28px;
            right: 28px;
            background: #14141e;
            color: #f2f2f8;
            padding: 12px 22px;
            border-radius: 10px;
            border: 1px solid rgba(108, 99, 255, 0.4);
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            font-family: var(--font-body, system-ui);
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 99999;
            opacity: 0;
            transform: translateY(16px);
            transition: all 0.3s ease;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
    }, 2800);
}
