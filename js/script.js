/* ═══════════════════════════════════════════════
   SHUBHAM KULKARNI — PORTFOLIO v3.0
   3D Canvas · GSAP · Interactions · Performance
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ══════ 3D PARTICLE NETWORK BACKGROUND ══════
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h, mouseX = -9999, mouseY = -9999;
  const PARTICLE_COUNT = Math.min(65, Math.floor(window.innerWidth / 22));
  const CONNECT_DIST = 130;
  const MOUSE_DIST = 180;
  const accentR = 108, accentG = 99, accentB = 255;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.z = Math.random() * 2 + 0.5;  // depth
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.baseSize = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.35 + 0.08;
    }
    update() {
      this.x += this.vx * this.z;
      this.y += this.vy * this.z;
      // Mouse repulsion
      const dx = mouseX - this.x, dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.015;
        this.x -= dx * force;
        this.y -= dy * force;
      }
      // Boundaries wrap
      if (this.x < -20) this.x = w + 20;
      if (this.x > w + 20) this.x = -20;
      if (this.y < -20) this.y = h + 20;
      if (this.y > h + 20) this.y = -20;
    }
    draw() {
      const size = this.baseSize * this.z;
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR},${accentG},${accentB},${this.alpha * this.z})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.06 * Math.min(particles[i].z, particles[j].z);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${accentR},${accentG},${accentB},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    // Mouse connections
    for (let i = 0; i < particles.length; i++) {
      const dx = mouseX - particles[i].x;
      const dy = mouseY - particles[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const alpha = (1 - dist / MOUSE_DIST) * 0.12;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${accentR},${accentG},${accentB},${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }
  }

  function animateBG() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateBG);
  }
  animateBG();

  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  document.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  // ══════ LOADER ══════
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('done');
      initHeroAnim();
    }, 2200);
  });

  // ══════ GSAP ══════
  gsap.registerPlugin(ScrollTrigger);

  function initHeroAnim() {
    gsap.utils.toArray('.hero-left .rv').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.95, delay: 0.15 + i * 0.12, ease: 'power3.out' });
    });
    const card = document.querySelector('.hero-card');
    if (card) gsap.fromTo(card, { opacity: 0, x: 60, rotateY: -6 }, { opacity: 1, x: 0, rotateY: 0, duration: 1.1, delay: 0.4, ease: 'power3.out' });
  }

  // Scroll reveals
  [
    { sel: '.rv:not(.hero .rv)', from: { opacity: 0, y: 50 } },
    { sel: '.rv-l:not(.hero .rv-l)', from: { opacity: 0, x: -50 } },
    { sel: '.rv-r:not(.hero .rv-r)', from: { opacity: 0, x: 50 } },
  ].forEach(({ sel, from }) => {
    gsap.utils.toArray(sel).forEach(el => {
      const to = {};
      Object.keys(from).forEach(k => to[k] = k === 'opacity' ? 1 : 0);
      gsap.fromTo(el, from, { ...to, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
      });
    });
  });

  // Stagger pills
  gsap.utils.toArray('.sk-card').forEach(card => {
    const pills = card.querySelectorAll('.sk-pills span');
    ScrollTrigger.create({ trigger: card, start: 'top 88%',
      onEnter: () => gsap.fromTo(pills, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' })
    });
  });

  // Stagger chips
  const chips = document.querySelectorAll('.chip');
  if (chips.length) {
    ScrollTrigger.create({ trigger: '.chips', start: 'top 88%',
      onEnter: () => gsap.fromTo(chips, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.04, ease: 'back.out(1.5)' })
    });
  }

  // Timeline dots
  gsap.utils.toArray('.exp-dot').forEach(dot => {
    ScrollTrigger.create({ trigger: dot, start: 'top 88%',
      onEnter: () => gsap.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' })
    });
  });

  // Parallax orbs
  gsap.to('.hero-orb.o1', { y: -100, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
  gsap.to('.hero-orb.o2', { y: 80, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });

  // ══════ 3D CARD TILT ══════
  const heroCard = document.getElementById('heroCard');
  if (heroCard && window.innerWidth > 1024) {
    heroCard.addEventListener('mousemove', e => {
      const r = heroCard.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(heroCard, { rotateY: x * 12, rotateX: -y * 10, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
    });
    heroCard.addEventListener('mouseleave', () => {
      gsap.to(heroCard, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
    });
  }

  // ══════ NAV ══════
  const nav = document.getElementById('nav');
  const btt = document.getElementById('btt');
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    nav.classList.toggle('scrolled', s > 60);
    btt.classList.toggle('show', s > 600);

    // Active link
    document.querySelectorAll('section[id], .sec[id]').forEach(sec => {
      const top = sec.offsetTop - 160, h = sec.offsetHeight, id = sec.id;
      const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
      if (link) {
        if (s >= top && s < top + h) { document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active')); link.classList.add('active'); }
      }
    });

    // Scroll progress
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scrollProgress').style.width = (s / docH * 100) + '%';
  }, { passive: true });

  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Social sidebar
  const sidebar = document.getElementById('socialSidebar');
  if (sidebar) {
    window.addEventListener('scroll', () => {
      sidebar.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    navMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
  });

  // ══════ TYPEWRITER ══════
  const roles = ['AI Engineer @ Arya Omnitalk', 'Computer Vision Specialist', 'Generative AI Developer', 'Edge AI & MLOps Engineer', 'RAG Pipeline Architect', 'SIH 2023 National Champion 🏆'];
  let ri = 0, ci = 0, del = false;
  const tw = document.getElementById('typewriter');

  function type() {
    const r = roles[ri];
    if (!del) { tw.textContent = r.substring(0, ++ci); if (ci === r.length) { del = true; setTimeout(type, 2400); return; } }
    else { tw.textContent = r.substring(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 350); return; } }
    setTimeout(type, del ? 22 : 48);
  }
  type();

  // ══════ COUNTERS ══════
  const counted = new Set();
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.counter').forEach(c => {
        if (counted.has(c)) return; counted.add(c);
        const target = +c.dataset.target, suffix = c.dataset.suffix || '', dur = 2000, start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1), ease = 1 - Math.pow(1 - p, 4);
          const val = Math.floor(ease * target);
          c.textContent = (target >= 1000 ? val.toLocaleString() : val) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else c.textContent = (target >= 1000 ? target.toLocaleString() : target) + suffix;
        })(start);
      });
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.hero-metrics, .stats-grid').forEach(el => cObs.observe(el));

  // ══════ CONTACT FORM ══════
  const form = document.getElementById('contactForm');
  const fBtn = document.getElementById('formBtn');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const orig = fBtn.innerHTML;
    fBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
    
    const subject = document.getElementById('fsub') ? document.getElementById('fsub').value.toLowerCase() : '';
    
    // Simulate API request processing
    setTimeout(() => {
      // System overload simulation -> trigger 500.html
      if (subject.includes('error') || subject.includes('500') || subject.includes('fail')) {
        window.location.href = '/sk/500.html';
        return;
      }
      
      fBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      fBtn.classList.add('sent');
      burstParticles(fBtn);
      setTimeout(() => { fBtn.innerHTML = orig; fBtn.classList.remove('sent'); form.reset(); }, 3500);
    }, 1200);
  });

  function burstParticles(el) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      const colors = ['#6c63ff', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#38bdf8'];
      p.style.cssText = `position:fixed;width:5px;height:5px;border-radius:50%;pointer-events:none;z-index:99999;background:${colors[~~(Math.random()*6)]};left:${r.left+r.width/2}px;top:${r.top+r.height/2}px;`;
      document.body.appendChild(p);
      gsap.to(p, { x: (Math.random()-.5)*200, y: (Math.random()-.5)*140-50, opacity: 0, scale: Math.random()*2+.5, duration: .7+Math.random()*.4, ease: 'power2.out', onComplete: () => p.remove() });
    }
  }

  // ══════ MAGNETIC BUTTONS (desktop) ══════
  if (window.innerWidth > 768) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.1, y: (e.clientY - r.top - r.height / 2) * 0.1, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1,.5)' }));
    });
  }

  // ══════ TAB TITLE ══════
  const origTitle = document.title;
  document.addEventListener('visibilitychange', () => { document.title = document.hidden ? '👀 Come back! — Shubham' : origTitle; });

  // ══════ REDUCED MOTION ══════
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    gsap.globalTimeline.timeScale(100);
    // Stop canvas animation
    canvas.style.display = 'none';
  }

  // ══════ ERROR ROUTING (404 / 500) ══════
  // Handles invalid anchor links dynamically
  function checkHashRoute() {
    const hash = window.location.hash;
    if (hash && hash !== '#' && !document.querySelector(hash)) {
      // The section doesn't exist on this page -> Render 404
      window.location.href = '/sk/404.html';
    }
  }
  window.addEventListener('hashchange', checkHashRoute);
  window.addEventListener('load', checkHashRoute);

  // Catch critical frontend failures and redirect to 500
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Critical System Error:', event.reason);
    // Uncomment for production:
    // window.location.href = '/sk/500.html';
  });

})();
