// ═══════════════════════════════════════════════════════════════════════════
// BLOG SYSTEM JAVASCRIPT ENGINE (2026)
// Search, Multi-Filter, Sharing, Dynamic Counters & Reading Progress
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initBlogSearchAndFilter();
    initShareFeatures();
    initMermaidDark();
});

/* ─── 0. MERMAID DARK THEME INITIALIZER ─── */
function initMermaidDark() {
    if (window.mermaid) {
        try {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'dark',
                themeVariables: {
                    darkMode: true,
                    background: '#0c0d14',
                    primaryColor: '#1e293b',
                    primaryTextColor: '#f8fafc',
                    primaryBorderColor: '#6366f1',
                    lineColor: '#38bdf8',
                    secondaryColor: '#13141f',
                    tertiaryColor: '#1a1b2a'
                }
            });
        } catch (e) {
            // Already initialized
        }
    }
}

/* ─── 1. READING PROGRESS BAR ─── */
function initReadingProgress() {
    let progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        document.body.appendChild(progressBar);
    }

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }, { passive: true });
}

/* ─── 2. SEARCH & MULTI-CATEGORY FILTER ENGINE ─── */
function initBlogSearchAndFilter() {
    const searchInput = document.getElementById('blogSearch');
    const clearBtn = document.getElementById('clearSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const countDisplay = document.getElementById('visibleArticleCount');
    const totalDisplay = document.getElementById('totalArticleCount');
    const noResultsBox = document.getElementById('noResultsBox');
    const resetSearchBtn = document.getElementById('resetSearchBtn');

    if (!articleCards.length) return;

    const totalArticles = articleCards.length;
    if (totalDisplay) totalDisplay.textContent = totalArticles;

    let currentCategory = 'all';
    let currentSearchTerm = '';

    function applyFilters() {
        let visibleCount = 0;

        articleCards.forEach(card => {
            const cardCategory = (card.dataset.category || '').toLowerCase().trim();
            const titleEl = card.querySelector('.card-heading');
            const excerptEl = card.querySelector('.card-excerpt');
            const tagEl = card.querySelector('.category-tag');
            const keywords = (card.dataset.keywords || '').toLowerCase();

            const title = titleEl ? titleEl.textContent.toLowerCase() : '';
            const excerpt = excerptEl ? excerptEl.textContent.toLowerCase() : '';
            const tag = tagEl ? tagEl.textContent.toLowerCase() : '';

            // Match Category
            const matchesCategory = currentCategory === 'all' || 
                                    cardCategory === currentCategory || 
                                    tag.includes(currentCategory);

            // Match Search Term
            const matchesSearch = !currentSearchTerm || 
                                  title.includes(currentSearchTerm) || 
                                  excerpt.includes(currentSearchTerm) || 
                                  tag.includes(currentSearchTerm) ||
                                  keywords.includes(currentSearchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update count
        if (countDisplay) countDisplay.textContent = visibleCount;

        // Toggle empty state
        if (noResultsBox) {
            noResultsBox.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Toggle clear search button
        if (clearBtn) {
            clearBtn.style.display = currentSearchTerm ? 'block' : 'none';
        }
    }

    // Search Input Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    // Clear Search Button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                currentSearchTerm = '';
                searchInput.focus();
                applyFilters();
            }
        });
    }

    // Reset Search in Empty State
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            currentSearchTerm = '';
            currentCategory = 'all';
            filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
            applyFilters();
        });
    }

    // Category Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = (btn.dataset.filter || 'all').toLowerCase().trim();
            applyFilters();
        });
    });

    // Initial Filter
    applyFilters();
}

/* ─── 3. SHARING & TOAST NOTIFICATION ─── */
function initShareFeatures() {
    // Copy link buttons
    document.querySelectorAll('.copy-link-btn, .card-share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest('.article-card');
            const linkEl = card ? card.querySelector('.card-heading a') : null;
            const targetUrl = linkEl ? new URL(linkEl.getAttribute('href'), window.location.href).href : window.location.href;

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(targetUrl).then(() => {
                    showToast('Link copied to clipboard! 📋');
                }).catch(() => fallbackCopy(targetUrl));
            } else {
                fallbackCopy(targetUrl);
            }
        });
    });

    // Social share triggers
    document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const platform = btn.dataset.platform;
            const targetUrl = window.location.href;
            const titleEl = document.querySelector('h1.hero-title, h1');
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

function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        showToast('Link copied to clipboard! 📋');
    } catch (err) {
        showToast('Could not copy link.');
    }
    document.body.removeChild(tempInput);
}

function showToast(msg) {
    let toast = document.getElementById('blogToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'blogToast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle text-info me-2"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}
