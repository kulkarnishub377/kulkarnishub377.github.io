/* Shubham Kulkarni — Portfolio v4 */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // ── Theme ──
  const themeBtn = $('#themeToggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
  });

  // ── Nav: mobile menu, scroll state, active section ──
  const nav = $('#nav');
  const burger = $('#burger');
  const links = $('#navLinks');
  const setMenu = open => {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const progress = $('#progress');
  const btt = $('#btt');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 8);
    btt.classList.toggle('show', y > 900);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const navMap = new Map($$('a', links).map(a => [a.getAttribute('href').slice(1), a]));
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      $$('a', links).forEach(a => a.classList.remove('active'));
      const a = navMap.get(en.target.id);
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => secObs.observe(s));

  // ── Reveal on scroll ──
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('.rv').forEach(el => revObs.observe(el));

  // ── Counters ──
  const runCounter = el => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dec = (el.dataset.target.split('.')[1] || '').length;
    const fmt = n => target >= 1000 ? Math.round(n).toLocaleString('en-IN') : n.toFixed(dec);
    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = fmt((1 - Math.pow(1 - p, 4)) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      $$('.counter', en.target).forEach(runCounter);
      cntObs.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  $$('.metrics').forEach(el => cntObs.observe(el));

  // ── Typewriter ──
  const tw = $('#typewriter');
  const roles = [
    'AI Engineer @ Arya Omnitalk',
    'Computer vision for live highways',
    'Multi-object tracking · ByteTrack',
    'RAG & Document AI systems',
    'Edge AI on NVIDIA Jetson',
    'SIH 2023 National Champion'
  ];
  if (tw && !reduceMotion) {
    let ri = 0, ci = roles[0].length, deleting = true;
    const step = () => {
      const r = roles[ri];
      ci += deleting ? -1 : 1;
      tw.textContent = r.slice(0, ci);
      if (!deleting && ci === r.length) { deleting = true; return setTimeout(step, 2200); }
      if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(step, 300); }
      setTimeout(step, deleting ? 24 : 52);
    };
    setTimeout(step, 2600);
  }

  // ── Project filters ──
  const filters = $$('.filter');
  const projects = $$('#projGrid .proj');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    $('#projGrid').dataset.f = f;
    filters.forEach(b => { const on = b === btn; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    projects.forEach(p => {
      const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
      p.hidden = !show;
      if (show) p.classList.add('in');
    });
  }));

  // ── Contact form → FormSubmit (validated first) ──
  const form = $('#contactForm');
  const note = $('#formNote');
  form.addEventListener('submit', e => {
    const fields = ['fname', 'femail', 'fsub', 'fmsg'].map(id => $('#' + id));
    let firstBad = null;
    fields.forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.closest('.field').classList.toggle('invalid', bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      e.preventDefault();
      note.textContent = 'Please fill in every field with a valid email.';
      note.classList.add('err');
      firstBad.focus();
      return;
    }
    form.querySelector('input[name="_subject"]').value = `Portfolio: ${fields[2].value.trim()}`;
    note.classList.remove('err');
    note.textContent = 'Sending…';
    $('#formBtn').disabled = true;
  });
  if (new URLSearchParams(location.search).get('sent') === '1') {
    note.textContent = 'Thanks — your message is on its way. I usually reply within 24 hours.';
    history.replaceState(null, '', location.pathname + location.hash);
  }
  form.addEventListener('input', e => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
  });

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // ── Highway camera simulation ──
  initFeed();

  function initFeed() {
    const cv = $('#feedCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const logEl = $('#feedLog');
    const tracksEl = $('#hudTracks');
    const latEl = $('#hudLat');
    const clockEl = $('#hudClock');

    // World units: x across the road (1 unit ≈ one lane), z = distance from the camera. India drives on the left.
    const CAM_X = -0.35, Z_NEAR = 6.5, Z_FAR = 62, Z_DETECT = 36;
    const AWAY = [-1.65, -0.65], TOWARD = [0.65, 1.65], SHOULDER_L = -2.45, SHOULDER_R = 2.5;
    const GATE_IN = 10, GATE_OUT = 16, KMH = 16, LIMIT = 100;
    const TYPES = {
      car: { w: 0.72, h: 0.56, p: 0.52 },
      truck: { w: 0.94, h: 1.2, p: 0.15 },
      bus: { w: 0.96, h: 1.08, p: 0.08 },
      auto_rickshaw: { w: 0.56, h: 0.66, p: 0.11 },
      motorcycle: { w: 0.26, h: 0.66, p: 0.14 }
    };
    const PAINT = ['#9AA3AE', '#5E6672', '#C9CED4', '#6E83A0', '#9C6B5E', '#7F8C6B', '#B7A98A', '#4C5A6E', '#A33A36', '#E2E4E6'];
    const CARGO = ['#C9B48A', '#7C8FA3', '#B5553C', '#D8D2C4', '#5B7B5A'];
    const BUS = ['#C8452F', '#2E6FA8', '#D9A441', '#DCDCD6'];
    const SHIRT = ['#3B5B8C', '#8C3B3B', '#D9D2C0', '#4A6B45', '#2A2A2E'];
    const C = { box: '#34D3A0', cand: '#FFC247', stop: '#FF5A1F', wrong: '#FF5B7A', speed: '#FF4D6A', helmet: '#FF9F43' };
    const MONO = '"Geist Mono", ui-monospace, monospace';
    const LABEL = { car: 'car', truck: 'truck', bus: 'bus', auto_rickshaw: 'auto', motorcycle: 'bike', person: 'person' };

    let W = 0, H = 0, hy = 0, cx = 0, f = 0, CAM_H = 3;
    let objs = [], nextId = 1, t = 0, lastAnpr = -10;
    const timers = { spawn: 0, stop: 5, ped: 12, wrong: 26, speed: 8, helmet: 16 };
    let running = false, raf = 0, last = 0, latency = 41;

    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const clock = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
    const hex = n => Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    const plate = () => {
      const L = 'ABCDEFGHJKLMNPRSTUVWXYZ', d = n => String(Math.floor(Math.random() * 10 ** n)).padStart(n, '0');
      return `MH${d(2)} ${pick(L)}${pick(L)} ${d(4)}`;
    };
    const shade = (c, a) => {
      const n = parseInt(c.slice(1), 16), k = v => Math.max(0, Math.min(255, Math.round(v + 255 * a)));
      return `rgb(${k(n >> 16)},${k((n >> 8) & 255)},${k(n & 255)})`;
    };
    const pickType = () => {
      let r = Math.random();
      for (const k in TYPES) { r -= TYPES[k].p; if (r <= 0) return k; }
      return 'car';
    };

    function resize() {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hy = H * 0.24; cx = W * 0.5;
      f = (W * 0.47 / (2.75 - CAM_X)) * Z_NEAR;
      CAM_H = (H - hy) * Z_NEAR / f;
    }

    const proj = (x, z) => { const s = f / z; return [cx + (x - CAM_X) * s, hy + CAM_H * s, s]; };

    function spawn(o) {
      const type = o.type || pickType();
      const d = TYPES[type] || { w: 0.22, h: 0.8 };
      const obj = Object.assign({
        type, w: d.w, h: d.h, id: 0, conf: rnd(0.84, 0.97), spd: 0, dir: 1,
        color: type === 'bus' ? pick(BUS) : pick(PAINT), cargo: pick(CARGO), shirt: pick(SHIRT),
        helmet: true, state: 'drive', dwell: 0, incident: null, seen: 0, alpha: 1, brake: false
      }, o);
      obj.cruise = obj.spd;
      objs.push(obj);
      return obj;
    }

    const laneBusy = (x, z0, z1) => objs.some(p => Math.abs(p.x - x) < 0.4 && p.z > z0 && p.z < z1);

    function spawnTraffic() {
      const away = Math.random() < 0.55;
      const wrongActive = objs.some(o => o.role === 'wrong');
      const type = pickType();
      const heavy = type === 'truck' || type === 'bus';
      let x = away ? pick(AWAY) : pick(TOWARD);
      if (heavy) x = away ? AWAY[0] : TOWARD[1];
      if (away && wrongActive && x === AWAY[0]) return;
      const z = away ? Z_NEAR - 1.2 : Z_FAR;
      if (laneBusy(x, z - 4, z + 4)) return;
      const slow = x === AWAY[0] || x === TOWARD[1];
      const spd = heavy ? rnd(3.3, 4.2) : slow ? rnd(3.7, 4.8) : rnd(4.8, 6.1);
      let helmet = true;
      if (type === 'motorcycle' && timers.helmet <= 0) { helmet = false; timers.helmet = rnd(20, 28); }
      spawn({ type, x, z, spd, dir: away ? 1 : -1, helmet });
    }

    function spawnSpecials() {
      const has = r => objs.some(o => o.role === r);
      const entry = Z_NEAR - 1.2;
      if (timers.stop <= 0 && !has('stopper') && !has('wrong') && !laneBusy(AWAY[0], entry - 4, entry + 5)) {
        spawn({ type: 'car', x: AWAY[0], z: entry, spd: 4.4, role: 'stopper', stopAt: rnd(10.5, 12) });
        timers.stop = rnd(18, 24);
      }
      if (timers.ped <= 0 && !has('ped')) {
        spawn({ type: 'person', x: SHOULDER_R + 0.25, z: rnd(10.5, 12.5), dir: 0, role: 'ped', phase: 'in', conf: rnd(0.8, 0.9) });
        timers.ped = rnd(24, 32);
      }
      if (timers.wrong <= 0 && !has('wrong') && !has('stopper') && !laneBusy(AWAY[0], Z_NEAR - 2, 48)) {
        spawn({ type: 'motorcycle', x: AWAY[0], z: 46, spd: 3.3, dir: -1, role: 'wrong' });
        timers.wrong = rnd(32, 42);
      }
      if (timers.speed <= 0 && !has('speed') && !laneBusy(AWAY[1], entry - 4, 26)) {
        spawn({ type: 'car', x: AWAY[1], z: entry, spd: 7.6, role: 'speed', color: '#D8DCE0' });
        timers.speed = rnd(22, 30);
      }
    }

    function log(kind, cls, text) {
      const li = document.createElement('li');
      li.innerHTML = `<time>${clock()}</time><b class="${cls}">${kind}</b><span></span>`;
      li.lastChild.textContent = text;
      logEl.prepend(li);
      while (logEl.children.length > 5) logEl.lastChild.remove();
    }

    function stepPed(o, dt) {
      if (o.phase === 'in') {
        o.x -= 0.5 * dt;
        if (o.x <= 0.42) { o.phase = 'wait'; o.wait = 1.4; }
      } else if (o.phase === 'wait') {
        o.wait -= dt;
        if (o.wait <= 0) o.phase = 'out';
      } else {
        o.x += 0.55 * dt;
        if (o.x > SHOULDER_R + 0.2) o.alpha -= dt * 1.2;
      }
      if (o.phase !== 'wait') o.walk = (o.walk || 0) + dt * 7;
      if (!o.id) o.id = nextId++;
      o.seen += dt;
      if (o.seen > 1.5 && !o.incident && o.x < SHOULDER_R - 0.3) {
        o.incident = 'PEDESTRIAN';
        log('PEDESTRIAN', 'ev-ped', `ID ${o.id} · carriageway · conf ${o.conf.toFixed(2)} · 8/8 frames`);
      }
    }

    function onGate(o) {
      if (o.kmh < 20) { o.kmh = null; return; }
      if (o.kmh > LIMIT) {
        o.incident = 'OVERSPEED';
        log('OVERSPEEDING', 'ev-speed', `ID ${o.id} · ${o.kmh} km/h · limit ${LIMIT} · ${plate()}`);
      } else if (t - lastAnpr > 3.2 && Math.random() < 0.6) {
        lastAnpr = t;
        log('ANPR', 'ev-ok', `ID ${o.id} · ${LABEL[o.type]} · ${plate()} · ${o.kmh} km/h`);
      }
    }

    function update(dt) {
      t += dt;
      for (const k in timers) timers[k] -= dt;
      if (timers.spawn <= 0) { spawnTraffic(); timers.spawn = rnd(0.6, 1.3); }
      spawnSpecials();

      const ped = objs.find(o => o.role === 'ped' && o.x < SHOULDER_R - 0.1);
      const wrongActive = objs.some(o => o.role === 'wrong');

      for (const o of objs) {
        if (o.role === 'ped') { stepPed(o, dt); continue; }
        let target = o.cruise;

        if (o.role === 'stopper') {
          if (o.state === 'drive' && o.z > o.stopAt - 4) o.state = 'pull';
          if (o.state === 'pull') {
            o.x += (SHOULDER_L - o.x) * Math.min(1, dt * 1.4);
            target = Math.max(0, (o.stopAt - o.z) * 0.9);
            if (o.stopAt - o.z < 0.08) { o.state = 'stopped'; o.spd = 0; }
          } else if (o.state === 'stopped') {
            target = 0;
            o.dwell += dt;
            if (o.dwell > 3 && !o.incident) {
              o.incident = 'STOPPED';
              log('STOPPED_VEHICLE', 'ev-stop', `ID ${o.id} · left shoulder · conf ${o.conf.toFixed(2)} · sha256 ${hex(8)}…`);
            }
            if (o.dwell > 11) o.state = 'leave';
          } else if (o.state === 'leave') {
            target = 4.2;
            if (o.z > o.stopAt + 4 && !wrongActive) o.x += (AWAY[0] - o.x) * Math.min(1, dt * 0.8);
          }
        }

        if (o.state !== 'stopped' && o.role !== 'wrong') {
          let gap = Infinity, lead = null;
          for (const p of objs) {
            if (p === o || p.role === 'ped' || p.role === 'wrong' || Math.abs(p.x - o.x) > 0.4) continue;
            const g = (p.z - o.z) * o.dir;
            if (g > 0 && g < gap) { gap = g; lead = p; }
          }
          if (lead) {
            const lspd = lead.dir === o.dir ? lead.spd : 0;
            if (gap < 1.5) target = Math.min(target, lspd * 0.8);
            else if (gap < 4.5) target = Math.min(target, lspd + (gap - 1.5) * 0.9);
          }
          if (ped && o.dir < 0 && Math.abs(ped.x - o.x) < 0.7) {
            const g = o.z - ped.z;
            if (g > 0 && g < 8) target = Math.min(target, Math.max(0, (g - 1.8) * 0.9));
          }
        }

        const acc = target < o.spd ? 5 : 2.2;
        o.spd += Math.max(-acc * dt, Math.min(acc * dt, target - o.spd));
        o.brake = o.spd - target > 0.1 || o.spd < 0.25;
        o.z += o.dir * o.spd * dt;

        if (o.z < Z_DETECT && o.z > Z_NEAR - 0.6) {
          if (!o.id) o.id = nextId++;
          o.seen += dt;
          if (o.role === 'wrong' && o.seen > 1.4 && !o.incident) {
            o.incident = 'WRONG_WAY';
            log('WRONG_WAY', 'ev-wrong', `ID ${o.id} · lane 1 · against lane vector 5/5 frames`);
          }
          if (o.type === 'motorcycle' && !o.helmet && o.role !== 'wrong' && o.seen > 1.2 && !o.incident) {
            o.incident = 'HELMET';
            log('HELMET_MISSING', 'ev-helmet', `ID ${o.id} · rider 1 · no-helmet ratio 0.82 · 5 s window`);
          }
        }

        if (o.dir > 0 && o.id) {
          if (o.tIn == null && o.z >= GATE_IN) o.tIn = t;
          if (o.tIn != null && o.kmh === undefined && o.z >= GATE_OUT) {
            o.kmh = Math.round((GATE_OUT - GATE_IN) / Math.max(0.01, t - o.tIn) * KMH);
            onGate(o);
          }
        }
        if (Math.random() < dt * 4) o.conf = Math.min(0.99, Math.max(0.62, o.conf + rnd(-0.02, 0.02)));
      }

      objs = objs.filter(o => o.alpha > 0 && (o.role === 'ped' || (o.z > Z_NEAR - 1.6 && o.z < Z_FAR + 1)));
      latency = Math.max(37, Math.min(44, latency + rnd(-0.6, 0.6)));
    }

    // ── Drawing ──
    function roadPoly(x0, x1, z0, z1, fill) {
      const a = proj(x0, z1), b = proj(x1, z1), c = proj(x1, z0), d = proj(x0, z0);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]);
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    }

    function line(x, z0, z1, color, wScale) {
      const a = proj(x, z0), b = proj(x, z1);
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(0.5, wScale * (a[2] + b[2]) / 2);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }

    function glow(x, y, r, rgb, a) {
      if (r < 0.5) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    function rrect(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); else ctx.rect(x, y, w, h);
    }

    function drawScene() {
      const sky = ctx.createLinearGradient(0, 0, 0, hy);
      sky.addColorStop(0, '#06080B'); sky.addColorStop(1, '#1A2029');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hy + 1);
      ctx.fillStyle = '#0F1318';
      for (let i = 0; i < 24; i++) {
        const x = (i / 23) * W, h = 3 + ((i * 53) % 17);
        ctx.fillRect(x - W / 46, hy - h, W / 23 + 1, h);
      }
      const hz = ctx.createLinearGradient(0, hy - 16, 0, hy + 4);
      hz.addColorStop(0, 'rgba(255,150,90,0)'); hz.addColorStop(1, 'rgba(255,150,90,.1)');
      ctx.fillStyle = hz; ctx.fillRect(0, hy - 16, W, 20);
      ctx.fillStyle = '#0A0D10'; ctx.fillRect(0, hy, W, H - hy);

      const zn = Z_NEAR - 1.6;
      roadPoly(-2.75, 2.75, zn, Z_FAR, '#181C22');
      roadPoly(-2.75, -2.2, zn, Z_FAR, '#13161B');
      roadPoly(2.2, 2.75, zn, Z_FAR, '#13161B');
      roadPoly(-0.16, 0.16, zn, Z_FAR, '#262B32');

      for (let z = 8; z < Z_FAR; z += 12) {
        const [sx, sy, s] = proj(0, z);
        ctx.save(); ctx.translate(sx, sy); ctx.scale(1, 0.32);
        glow(0, 0, s * 2.4, '255,190,120', 0.07);
        ctx.restore();
      }

      line(2.2, zn, Z_FAR, 'rgba(230,232,235,.55)', 0.05);
      line(-2.2, zn, Z_FAR, 'rgba(230,232,235,.55)', 0.05);
      line(0.16, zn, Z_FAR, 'rgba(255,196,71,.45)', 0.04);
      line(-0.16, zn, Z_FAR, 'rgba(255,196,71,.45)', 0.04);
      for (let z = zn; z < Z_FAR; z += 3.5) {
        line(1.15, z, z + 1.5, 'rgba(230,232,235,.38)', 0.045);
        line(-1.15, z, z + 1.5, 'rgba(230,232,235,.38)', 0.045);
      }

      const small = W < 420;
      ctx.font = `500 ${small ? 7 : 8}px ${MONO}`;
      ctx.setLineDash([3, 3]);
      [[GATE_IN, 'T-ENTRY'], [GATE_OUT, 'T-EXIT']].forEach(([z, label]) => {
        const a = proj(-2.2, z), b = proj(-0.16, z);
        ctx.strokeStyle = 'rgba(127,168,255,.55)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        ctx.fillStyle = 'rgba(127,168,255,.75)';
        ctx.fillText(label, a[0] - ctx.measureText(label).width - 4, a[1] + 3);
      });

      const r0 = proj(-2.75, 28), r1 = proj(-0.16, 28), r2 = proj(-0.16, Z_NEAR + 1.5), r3 = proj(-2.75, Z_NEAR + 1.5);
      ctx.strokeStyle = 'rgba(52,211,160,.32)';
      ctx.beginPath(); ctx.moveTo(r0[0], r0[1]); ctx.lineTo(r1[0], r1[1]); ctx.lineTo(r2[0], r2[1]); ctx.lineTo(r3[0], r3[1]);
      ctx.closePath(); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(52,211,160,.6)';
      ctx.fillText('ROI · LANES 1–2', r0[0] - ctx.measureText('ROI · LANES 1–2').width - 4, r0[1] + 3);

      for (let z = 8; z < Z_FAR; z += 12) {
        const [sx, sy, s] = proj(0, z);
        const top = sy - 2.8 * s, arm = 0.9 * s;
        ctx.strokeStyle = '#2A2F37'; ctx.lineWidth = Math.max(0.6, s * 0.05);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, top); ctx.moveTo(sx - arm, top + s * 0.08); ctx.lineTo(sx + arm, top + s * 0.08); ctx.stroke();
        ctx.fillStyle = '#FFE2B0';
        const lw = Math.max(1, s * 0.22), lh = Math.max(0.6, s * 0.06);
        ctx.fillRect(sx - arm, top + s * 0.08, lw, lh);
        ctx.fillRect(sx + arm - lw, top + s * 0.08, lw, lh);
        glow(sx - arm + lw / 2, top + s * 0.1, s * 0.5, '255,214,150', 0.18);
        glow(sx + arm - lw / 2, top + s * 0.1, s * 0.5, '255,214,150', 0.18);
      }
    }

    function lights(o, x, y, w, h, ly) {
      const lw = Math.max(1.2, w * 0.13), lh = Math.max(1, h * 0.07);
      const hazard = o.state === 'stopped' || o.state === 'pull';
      const blink = hazard && Math.floor(t * 2.6) % 2 === 0;
      if (o.dir > 0) {
        const col = blink ? '#FFB020' : o.brake ? '#FF3B30' : '#A8231C';
        ctx.fillStyle = col;
        ctx.fillRect(x + w * 0.05, ly, lw, lh); ctx.fillRect(x + w * 0.95 - lw, ly, lw, lh);
        if (o.brake || blink) {
          const rgb = blink ? '255,176,32' : '255,59,48';
          glow(x + w * 0.05 + lw / 2, ly + lh / 2, w * 0.3, rgb, 0.45);
          glow(x + w * 0.95 - lw / 2, ly + lh / 2, w * 0.3, rgb, 0.45);
        }
      } else {
        ctx.fillStyle = '#FFF4D6';
        ctx.fillRect(x + w * 0.06, ly, lw, lh); ctx.fillRect(x + w * 0.94 - lw, ly, lw, lh);
        glow(x + w * 0.06 + lw / 2, ly + lh / 2, w * 0.32, '255,240,200', 0.45);
        glow(x + w * 0.94 - lw / 2, ly + lh / 2, w * 0.32, '255,240,200', 0.45);
      }
    }

    function drawRider(o, sx, y, w, h) {
      ctx.fillStyle = o.shirt;
      rrect(sx - w * 0.42, y + h * 0.2, w * 0.84, h * 0.36, w * 0.25); ctx.fill();
      ctx.beginPath(); ctx.arc(sx, y + h * 0.11, w * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = o.helmet ? '#16191E' : '#B98C66'; ctx.fill();
      if (o.helmet) {
        ctx.fillStyle = 'rgba(160,190,220,.35)';
        ctx.fillRect(sx - w * 0.2, y + h * 0.1, w * 0.4, Math.max(0.8, h * 0.04));
      } else {
        ctx.fillStyle = '#1C1410';
        ctx.beginPath(); ctx.arc(sx, y + h * 0.09, w * 0.3, Math.PI, 0); ctx.fill();
      }
    }

    function drawObj(o) {
      const [sx, sy, s] = proj(o.x, o.z);
      if (sy < hy - 1) return null;
      const w = o.w * s, h = o.h * s, x = sx - w / 2, y = sy - h;
      ctx.globalAlpha = o.alpha * Math.max(0.3, Math.min(1, 1 - (o.z - 30) / 34));

      if (o.type === 'person') {
        const sw = Math.sin(o.walk || 0) * w * 0.28;
        ctx.strokeStyle = '#2B3340'; ctx.lineWidth = Math.max(1, w * 0.22); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx, y + h * 0.58); ctx.lineTo(sx - sw, sy); ctx.moveTo(sx, y + h * 0.58); ctx.lineTo(sx + sw, sy); ctx.stroke();
        ctx.fillStyle = '#D9B24A';
        rrect(sx - w * 0.36, y + h * 0.2, w * 0.72, h * 0.42, w * 0.2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx, y + h * 0.1, w * 0.24, 0, Math.PI * 2); ctx.fillStyle = '#B98C66'; ctx.fill();
        ctx.globalAlpha = 1;
        return { x, y, w, h };
      }

      ctx.fillStyle = 'rgba(0,0,0,.45)';
      ctx.beginPath(); ctx.ellipse(sx, sy, w * 0.62, Math.max(1.2, w * 0.09), 0, 0, Math.PI * 2); ctx.fill();
      if (o.dir < 0 && s > 6) {
        ctx.save(); ctx.translate(sx, sy + h * 0.1); ctx.scale(1, 0.3);
        glow(0, 0, w * 1.3, '255,236,190', 0.14);
        ctx.restore();
      }

      if (o.type !== 'motorcycle') {
        ctx.fillStyle = '#07080A';
        const ww = w * 0.15, wh = Math.max(1.2, h * 0.11);
        ctx.fillRect(x + w * 0.07, sy - wh, ww, wh); ctx.fillRect(x + w * 0.93 - ww, sy - wh, ww, wh);
      }
      const r = Math.min(5, w * 0.1);

      if (o.type === 'car') {
        ctx.fillStyle = shade(o.color, -0.08);
        ctx.beginPath();
        ctx.moveTo(x + w * 0.12, y + h * 0.46); ctx.lineTo(x + w * 0.22, y); ctx.lineTo(x + w * 0.78, y); ctx.lineTo(x + w * 0.88, y + h * 0.46);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#121820';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.19, y + h * 0.4); ctx.lineTo(x + w * 0.26, y + h * 0.07); ctx.lineTo(x + w * 0.74, y + h * 0.07); ctx.lineTo(x + w * 0.81, y + h * 0.4);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = o.color; rrect(x, y + h * 0.4, w, h * 0.5, r); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(x, y + h * 0.74, w, h * 0.16);
        lights(o, x, y, w, h, y + h * 0.5);
      } else if (o.type === 'truck') {
        if (o.dir > 0) {
          ctx.fillStyle = o.cargo; rrect(x, y, w, h * 0.84, Math.min(3, r)); ctx.fill();
          ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(sx - Math.max(0.5, w * 0.01), y + h * 0.06, Math.max(1, w * 0.02), h * 0.74);
          ctx.fillStyle = '#E8E1D0'; ctx.fillRect(x + w * 0.04, y + h * 0.76, w * 0.92, Math.max(1, h * 0.03));
          ctx.fillStyle = '#1B1E23'; ctx.fillRect(x + w * 0.02, y + h * 0.84, w * 0.96, h * 0.06);
          lights(o, x, y, w, h, y + h * 0.8);
        } else {
          ctx.fillStyle = o.cargo; rrect(x + w * 0.04, y, w * 0.92, h * 0.46, Math.min(3, r)); ctx.fill();
          ctx.fillStyle = o.color; rrect(x, y + h * 0.4, w, h * 0.5, r); ctx.fill();
          ctx.fillStyle = '#121820'; rrect(x + w * 0.1, y + h * 0.45, w * 0.8, h * 0.2, r * 0.6); ctx.fill();
          lights(o, x, y, w, h, y + h * 0.74);
        }
      } else if (o.type === 'bus') {
        ctx.fillStyle = o.color; rrect(x, y, w, h * 0.9, r); ctx.fill();
        ctx.fillStyle = '#10161D';
        if (o.dir > 0) rrect(x + w * 0.14, y + h * 0.1, w * 0.72, h * 0.26, r * 0.5);
        else rrect(x + w * 0.06, y + h * 0.12, w * 0.88, h * 0.34, r * 0.5);
        ctx.fill();
        if (o.dir < 0) { ctx.fillStyle = '#FFB547'; ctx.fillRect(x + w * 0.2, y + h * 0.03, w * 0.6, Math.max(1, h * 0.05)); }
        ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(x, y + h * 0.72, w, h * 0.18);
        lights(o, x, y, w, h, y + h * 0.66);
      } else if (o.type === 'auto_rickshaw') {
        ctx.fillStyle = '#E5C33A'; rrect(x + w * 0.06, y, w * 0.88, h * 0.52, w * 0.22); ctx.fill();
        ctx.fillStyle = '#12161B'; rrect(x + w * 0.2, y + h * 0.12, w * 0.6, h * 0.34, w * 0.1); ctx.fill();
        ctx.fillStyle = '#2D6B3A'; rrect(x, y + h * 0.46, w, h * 0.44, r); ctx.fill();
        lights(o, x, y, w, h, y + h * 0.58);
      } else if (o.type === 'motorcycle') {
        ctx.fillStyle = '#0A0B0D'; ctx.fillRect(sx - w * 0.14, y + h * 0.6, w * 0.28, h * 0.4);
        ctx.fillStyle = o.color; rrect(sx - w * 0.36, y + h * 0.5, w * 0.72, h * 0.2, w * 0.1); ctx.fill();
        drawRider(o, sx, y, w, h);
        const lw = Math.max(1.2, w * 0.28), lh = Math.max(1, h * 0.05), ly = y + h * 0.62;
        if (o.dir > 0) { ctx.fillStyle = o.brake ? '#FF3B30' : '#A8231C'; ctx.fillRect(sx - lw / 2, ly, lw, lh); }
        else { ctx.fillStyle = '#FFF4D6'; ctx.fillRect(sx - lw / 2, ly, lw, lh); glow(sx, ly, w * 0.9, '255,240,200', 0.5); }
      }
      ctx.globalAlpha = 1;
      return { x, y, w, h };
    }

    function style(o) {
      const id = `#${o.id}`;
      switch (o.incident) {
        case 'STOPPED': return [C.stop, `STOPPED · ${id} · ${o.dwell.toFixed(1)}s`, true];
        case 'PEDESTRIAN': return [C.cand, `PEDESTRIAN · ${id}`, true];
        case 'WRONG_WAY': return [C.wrong, `WRONG-WAY · ${id}`, true];
        case 'HELMET': return [C.helmet, `NO HELMET · ${id}`, true];
        case 'OVERSPEED': return [C.speed, `OVERSPEED · ${o.kmh} km/h`, true];
      }
      if (o.state === 'pull' || o.state === 'stopped') return [C.cand, `candidate · ${id} · ${o.dwell.toFixed(1)}s`, false];
      if (o.type === 'person') return [C.cand, `person ${o.conf.toFixed(2)} ${id}`, false];
      return [C.box, `${LABEL[o.type]} ${o.conf.toFixed(2)} ${id}${o.kmh ? ` · ${o.kmh} km/h` : ''}`, false];
    }

    const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    function drawOverlays(items) {
      const small = W < 420;
      const placed = [{ x: 0, y: 0, w: W, h: 30 }, { x: 0, y: H - 30, w: W, h: 30 }];
      const labels = [];
      items.sort((a, b) => (a.o.incident ? 0 : 1000) + a.o.z - ((b.o.incident ? 0 : 1000) + b.o.z));
      for (const { o, b } of items) {
        if (!o.id || o.z >= Z_DETECT || o.alpha < 0.3) continue;
        if (b.w < 8 && !o.incident) continue;
        const [color, text, full] = style(o);
        const pad = Math.max(1.5, b.w * 0.05);
        const x = b.x - pad, y = b.y - pad, w = b.w + pad * 2, h = b.h + pad * 2;
        ctx.strokeStyle = color; ctx.lineWidth = full ? 1.6 : 1.1;
        if (full) ctx.strokeRect(x, y, w, h);
        else {
          const c = Math.max(3, Math.min(w, h) * 0.28);
          ctx.beginPath();
          ctx.moveTo(x, y + c); ctx.lineTo(x, y); ctx.lineTo(x + c, y);
          ctx.moveTo(x + w - c, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + c);
          ctx.moveTo(x + w, y + h - c); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - c, y + h);
          ctx.moveTo(x + c, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - c);
          ctx.stroke();
        }
        if (!full && b.w < 24) continue;
        labels.push({ color, text, full, x, y, h });
      }
      for (const { color, text, full, x, y, h } of labels) {
        const fs = full ? (small ? 9 : 10) : (small ? 8 : 9);
        ctx.font = `500 ${fs}px ${MONO}`;
        const tw = ctx.measureText(text).width + 8, th = fs + 5;
        const lx = Math.max(2, Math.min(x - 0.5, W - tw - 2));
        const spots = [{ x: lx, y: y - th, w: tw, h: th }, { x: lx, y: y + h, w: tw, h: th }];
        let spot = spots.find(r => !placed.some(p => hit(r, p)));
        if (!spot) { if (!full) continue; spot = spots[0]; }
        placed.push(spot);
        ctx.fillStyle = color; ctx.fillRect(spot.x, spot.y, spot.w, spot.h);
        ctx.fillStyle = '#0A0B0D'; ctx.fillText(text, spot.x + 4, spot.y + th - 4);
      }
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      drawScene();
      const items = [];
      objs.slice().sort((a, b) => b.z - a.z).forEach(o => { const b = drawObj(o); if (b) items.push({ o, b }); });
      drawOverlays(items);
      tracksEl.textContent = objs.filter(o => o.id && o.z < Z_DETECT && o.alpha > 0.3).length;
      latEl.textContent = Math.round(latency);
      clockEl.textContent = clock();
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      update(dt);
      render();
      if (running) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true; last = performance.now(); raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    logEl.firstElementChild.querySelector('time').textContent = clock();
    for (let i = 0; i < 600; i++) update(1 / 30);
    render();

    let visible = false;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible && !document.hidden ? start() : stop(); }).observe(cv);
    document.addEventListener('visibilitychange', () => { document.hidden ? stop() : visible && start(); });
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); render(); }, 120); });
  }
})();
