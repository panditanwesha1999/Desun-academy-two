/* Success stories & testimonials page motion. GSAP + ScrollTrigger (vendored). Fully usable without it. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var can = !!(gsap && ST) && !reduced;
  if (gsap && ST) gsap.registerPlugin(ST);
  if (!can) root.classList.remove('a-js'); else root.classList.add('a-live');

  /* ---------- filters (work without motion) ---------- */
  var wall = $('#sWall'), cards = $$('.s-card'), count = $('#sCount');
  function applyFilter(f) {
    var shown = 0;
    cards.forEach(function (c) { var on = f === 'all' || c.dataset.dept === f; if (on) shown++; c.hidden = false; c._on = on; });
    if (!can) { cards.forEach(function (c) { c.hidden = !c._on; }); }
    else {
      var off = cards.filter(function (c) { return !c._on; }), on = cards.filter(function (c) { return c._on; });
      gsap.to(off, { scale: 0.85, autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: function () {
        off.forEach(function (c) { c.hidden = true; });
        on.forEach(function (c) { c.hidden = false; });
        gsap.fromTo(on, { scale: 0.9, autoAlpha: 0, y: 30 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.6)', stagger: 0.05, clearProps: 'transform,opacity,visibility' });
        ST.refresh();
      } });
    }
    count.textContent = 'Showing ' + shown + ' ' + (shown === 1 ? 'story' : 'stories');
  }
  $$('.s-filters:not(.t-filters) .s-filter').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.s-filters:not(.t-filters) .s-filter').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      applyFilter(b.dataset.f);
    });
  });

  /* ---------- feedback deck (works without motion as plain list) ---------- */
  var stage = $('#sStage'), qs = $$('.s-q'), dots = $$('.s-dot'), cur = 0, playing = can, tl = null, ring = $('.s-play');
  var DUR = 7;
  function pose(i, k) { // k = distance behind front
    return { x: 0, y: k * 16, scale: 1 - k * 0.05, rotate: k === 0 ? 0 : (k % 2 ? 1.6 : -1.6) * k, autoAlpha: k > 3 ? 0 : 1 - k * 0.18, zIndex: 20 - k };
  }
  function layout(animate) {
    qs.forEach(function (q, i) {
      var k = (i - cur + qs.length) % qs.length;
      var p = pose(i, k);
      q.setAttribute('aria-hidden', k === 0 ? 'false' : 'true'); if (k === 0) q.removeAttribute('inert'); else q.setAttribute('inert', '');
      if (animate) gsap.to(q, Object.assign({ duration: 0.7, ease: 'expo.out', overwrite: true }, p)); else gsap.set(q, p);
    });
    dots.forEach(function (d, i) { if (i === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
  }
  function go(n, dir) {
    var prev = qs[cur]; cur = (n + qs.length) % qs.length;
    if (can && prev && dir !== 0) {
      var side = (dir || 1) > 0 ? 1 : -1;
      gsap.to(prev, { x: side * 140 + '%', rotate: side * 14, autoAlpha: 0, duration: 0.55, ease: 'power3.in', overwrite: true, onComplete: function () { layout(true); } });
      layout(true); gsap.set(prev, { zIndex: 40 });
      qs.forEach(function (q) { if (q !== prev) return; });
    } else layout(!!can);
    restart();
  }
  function restart() {
    if (tl) tl.kill();
    ring && ring.style.setProperty('--p', 0);
    if (!can || !playing) return;
    var o = { v: 0 };
    tl = gsap.to(o, { v: 100, duration: DUR, ease: 'none', onUpdate: function () { ring.style.setProperty('--p', o.v); }, onComplete: function () { go(cur + 1, 1); } });
  }
  if (qs.length) {
    if (can) { layout(false); }
    $('#sNext').addEventListener('click', function () { go(cur + 1, 1); });
    $('#sPrev').addEventListener('click', function () { go(cur - 1, -1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, i > cur ? 1 : -1); }); });
    $('#sPlay').addEventListener('click', function (e) {
      playing = !playing; e.currentTarget.setAttribute('aria-pressed', playing ? 'false' : 'true');
      e.currentTarget.setAttribute('aria-label', playing ? 'Pause auto-advance' : 'Resume auto-advance'); restart();
    });
    var deck = $('#sDeck');
    deck.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(cur + 1, 1); } else if (e.key === 'ArrowLeft') { go(cur - 1, -1); } });
    deck.addEventListener('pointerenter', function () { if (tl) tl.pause(); });
    deck.addEventListener('pointerleave', function () { if (tl && playing) tl.resume(); });
    deck.addEventListener('focusin', function () { if (tl) tl.pause(); });
    deck.addEventListener('focusout', function () { if (tl && playing) tl.resume(); });
    // swipe
    var sx = null; stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    window.addEventListener('pointerup', function (e) { if (sx === null) return; var d = e.clientX - sx; sx = null; if (Math.abs(d) > 60) go(cur + (d < 0 ? 1 : -1), d < 0 ? 1 : -1); });
    if (can) ST.create({ trigger: deck, start: 'top 80%', end: 'bottom 10%', onToggle: function (s) { if (!tl) return; if (s.isActive && playing) tl.resume(); else tl.pause(); } });
    if (can) restart();
  }
  if (!can) return;

  /* ---------- helpers ---------- */
  function splitWords(el) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w'; var i = document.createElement('i'); i.textContent = t; w.appendChild(i); out.push(i); f.appendChild(w);
          });
          n.parentNode.replaceChild(f, n);
        } else if (n.nodeType === 1 && !n.hasAttribute('data-count')) walk(n);
      });
    })(el);
    return out;
  }
  function onceIn(el, fn, start) { ST.create({ trigger: el, start: start || 'top 85%', once: true, onEnter: fn }); }

  /* progress + rail */
  var prog = $('.a-progress'); if (prog) gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
  var rail = $('#cRail');
  if (rail) $$('[data-rail][id]').forEach(function (s) {
    var a = document.createElement('a'); a.href = '#' + s.id; a.setAttribute('aria-label', s.getAttribute('data-rail')); a.innerHTML = '<span>' + s.getAttribute('data-rail') + '</span>'; rail.appendChild(a);
    ST.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: function (self) { a.classList.toggle('is-on', self.isActive); } });
  });

  /* headings: word masks */
  $$('.page-success .h2, .page-success .s-title, .a-contact__h').forEach(function (h) {
    var ws = splitWords(h); gsap.set(ws, { yPercent: 115, rotate: 4 });
    var go1 = function () { gsap.to(ws, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }); };
    if (h.classList.contains('s-title')) gsap.delayedCall(0.15, go1); else onceIn(h, go1, 'top 90%');
  });

  /* ---------- hero ---------- */
  gsap.set('.s-mark', { '--m': 0 });
  gsap.to('.s-mark', { '--m': 1, duration: 0.9, ease: 'power3.inOut', delay: 0.9 });
  gsap.from('.s-kick__l', { scaleX: 0, duration: 0.8, ease: 'expo.out', delay: 0.1 });
  gsap.from(['.c-kicker', '.s-lead', '.s-hero__cta'], { y: 24, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12, delay: 0.3 });
  var items = $$('.s-b, .s-tag');
  gsap.from(items, { scale: 0, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, 0.6)', stagger: 0.07, delay: 0.4 });
  items.forEach(function (el, i) { // idle float
    gsap.to(el, { y: (i % 2 ? -1 : 1) * (8 + (i % 3) * 4), duration: 2.2 + (i % 4) * 0.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.15 });
  });
  var cloud = $('.s-cloud'), layers = items.map(function (el) { return { el: el, d: parseFloat(el.dataset.d) || 0.5 }; });
  // depth parallax on pointer (animates margin via x/y on a wrapper-free transform: use xPercent-safe quickTo on CSS vars)
  layers.forEach(function (L) { L.qx = gsap.quickTo(L.el, 'x', { duration: 0.9, ease: 'power3.out' }); });
  if (fine) $('.s-hero').addEventListener('pointermove', function (e) {
    var r = this.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5;
    layers.forEach(function (L) { L.qx(nx * 60 * L.d); });
  });
  // scroll parallax by depth
  layers.forEach(function (L) { gsap.to(L.el, { yPercent: -40 * L.d, ease: 'none', scrollTrigger: { trigger: '.s-hero', start: 'top top', end: 'bottom top', scrub: true } }); });

  /* ---------- featured: reveal + tilt ---------- */
  $$('.s-feat').forEach(function (f, i) {
    gsap.from(f, { y: 90, autoAlpha: 0, clipPath: 'inset(12% 0 0 0 round 24px)', duration: 1.1, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: '.s-feats__row', start: 'top 80%' }, clearProps: 'clipPath' });
    gsap.from($('.s-feat__ph img, .s-feat__logo-big img', f), { scale: 1.3, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 85%' } });
    gsap.fromTo($('.s-feat__n', f), { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (fine) {
      f.addEventListener('pointermove', function (e) { var r = f.getBoundingClientRect(); f.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2) + 'deg'); f.style.setProperty('--rx', ((-((e.clientY - r.top) / r.height - 0.5)) * 6).toFixed(2) + 'deg'); });
      f.addEventListener('pointerleave', function () { f.style.setProperty('--ry', '0deg'); f.style.setProperty('--rx', '0deg'); });
    }
  });

  /* ---------- wall: column parallax + card reveal ---------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', function () {
    var speeds = [-70, 40, -110];
    $$('.s-col').forEach(function (c, i) {
      gsap.fromTo(c, { y: -speeds[i] * 0.5 }, { y: speeds[i] * 0.5, ease: 'none', scrollTrigger: { trigger: wall, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });
  });
  cards.forEach(function (c, i) {
    gsap.from(c, { y: 70, rotate: (i % 2 ? 2 : -2), autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 94%' }, clearProps: 'transform,opacity,visibility' });
    gsap.from($('.s-card__top img', c), { scale: 0.4, rotate: -20, duration: 0.9, ease: 'back.out(2.4)', scrollTrigger: { trigger: c, start: 'top 90%' } });
  });
  gsap.from('.s-filters:not(.t-filters) .s-filter', { y: 20, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.s-filters', start: 'top 90%' } });

  /* ---------- numbers ---------- */
  $$('[data-count]').forEach(function (c) {
    var to = parseFloat(c.getAttribute('data-count')), o = { v: 0 }; c.textContent = '0';
    onceIn(c, function () { gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: function () { c.textContent = Math.round(o.v); } }); }, 'top 92%');
  });
  gsap.from('.s-nums__list li', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.s-nums', start: 'top 80%' } });

  /* ---------- feedback ---------- */
  gsap.from('.s-snip__row li', { y: 20, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: '.s-snip', start: 'top 90%' } });
  gsap.from('.s-deck', { y: 80, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.s-deck', start: 'top 88%' } });

  /* ---------- 3D podcast studio ---------- */
  var podRingEl = $('#podRing');
  if (podRingEl) {
    var pc = $$('.s-pod__card', podRingEl), N = pc.length, step = 360 / N;
    var tt = $('#podTitle'), cnt = $('#podCount'), bar = $('#podBar');
    var titles = pc.map(function (c) { return c.querySelector('button').dataset.title; });
    var setIdx = function (i) { tt.textContent = titles[i]; cnt.textContent = (i + 1) + ' / ' + N; bar.style.width = ((i + 1) / N * 100) + '%'; };
    var cf = window.coverflow ? window.coverflow(podRingEl, setIdx) : null;
    $('#podPrev').addEventListener('click', function () { go(-1); });
    $('#podNext').addEventListener('click', function () { go(1); });
    var cur = 0, stRef = null;
    function go(dir) {
      var n = Math.max(0, Math.min(N - 1, cur + dir));
      if (stRef) { window.scrollTo({ top: stRef.start + (stRef.end - stRef.start) * (n / (N - 1)), behavior: 'smooth' }); } else if (cf) cf.go(n);
    }
    gsap.matchMedia().add('(min-width: 1024px)', function () {
      var w = pc[0].offsetWidth, R = Math.round(w / 2 / Math.tan(Math.PI / N)) + 36, ptr = 0, base = 0;
      pc.forEach(function (c, i) { c.style.transform = ''; c.style.opacity = ''; gsap.set(c, { rotationY: i * step, transformOrigin: '50% 50% ' + (-R) + 'px' }); });
      gsap.set(podRingEl, { transformOrigin: '50% 50% ' + (-R) + 'px' });
      var proxy = { p: 0 };
      function apply() {
        var rot = -proxy.p * (N - 1) * step + ptr; gsap.set(podRingEl, { rotationY: rot });
        pc.forEach(function (c, i) {
          var a = (i * step + rot) * Math.PI / 180, f = Math.cos(a);
          c.style.opacity = (0.12 + 0.88 * Math.max(0, Math.min(1, (f + 0.25) / 1.25))).toFixed(2);
          c.style.pointerEvents = f > 0.8 ? 'auto' : 'none';
        });
        var idx = Math.round(proxy.p * (N - 1)); if (idx !== cur) { cur = idx; setIdx(idx); }
      }
      var tw = gsap.to(proxy, { p: 1, ease: 'none', onUpdate: apply, scrollTrigger: { trigger: '.s-pod', start: 'top top', end: '+=' + (N * 55) + '%', pin: true, scrub: 0.7, snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut' }, onRefresh: function (self) { stRef = self; }, id: 'pod' } });
      stRef = tw.scrollTrigger; apply();
      var onMove = function (e) { var x = (e.clientX / innerWidth - 0.5) * 2; ptr = x * 6; apply(); };
      if (fine) window.addEventListener('pointermove', onMove);
      gsap.from('.s-pod__head > *', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.s-pod', start: 'top 70%' } });
      return function () { stRef = null; if (fine) window.removeEventListener('pointermove', onMove); pc.forEach(function (c) { gsap.set(c, { clearProps: 'all' }); c.style.pointerEvents = ''; }); gsap.set(podRingEl, { clearProps: 'all' }); };
    });
  }

  /* ---------- 'your turn' heading highlight ---------- */
  var hl = $('.s-hl');
  if (hl) { gsap.set(hl, { '--hl': 0 }); gsap.to(hl, { '--hl': 1, duration: 1, ease: 'power3.inOut', delay: 0.3, scrollTrigger: { trigger: hl, start: 'top 85%' } }); }

  /* ---------- 'your turn' blank card ---------- */
  var you = $('.s-you__card');
  if (you) {
    gsap.from(you, { y: 120, rotate: 10, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: you, start: 'top 88%' }, clearProps: 'opacity,visibility' });
    gsap.fromTo(you, { '--ty': '30px' }, { '--ty': '-30px', ease: 'none', scrollTrigger: { trigger: '.s-you', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.s-you__copy > *', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.s-you__copy', start: 'top 80%' } });
  }

  /* ---------- CTA / contact ---------- */
  gsap.from('.s-cta > *:not(.h2)', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.s-cta', start: 'top 80%' } });
  $$('.a-call').forEach(function (c) { gsap.from(c, { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 92%' } }); });
  gsap.from('.a-contact__lede', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.a-contact__lede', start: 'top 90%' } });
  window.addEventListener('load', function () { ST.refresh(); });
})();
