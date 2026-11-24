/* About page motion. GSAP + ScrollTrigger (vendored). Content is fully visible without this file. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var root = document.documentElement;
  if (!gsap || !ST) { root.classList.remove('a-js'); return; }
  gsap.registerPlugin(ST);

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- progress bar ---------- */
  var prog = $('.a-progress');
  if (prog) gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

  /* ---------- static / reduced-motion path: only the cheap, non-moving things ---------- */
  buildChips();            // grid must exist either way
  odoBuild();
  if (reduced) {
    $$('.a-odo__r').forEach(function (r) { if (r.children.length > 1) r.style.transform = 'translateY(-' + (100 * (r.children.length - 1) / r.children.length) + '%)'; });
    $$('.a-chip', $('#candGrid')).forEach(function (c, i) { if (i < 1) c.classList.add('is-ok'); else c.style.setProperty('--r', 1); });
    $$('.a-row').forEach(function (r) { r.classList.remove('is-on'); });
    return;
  }
  root.classList.add('a-live');

  /* ---------- helpers ---------- */
  function splitWords(el) {
    if (el.__split) return el.__split;
    var out = [];
    (function walk(node, wrapFn) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var i = document.createElement('i'); i.textContent = t; w.appendChild(i);
            out.push(i); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    el.__split = out; return out;
  }

  /* ---------- HERO ---------- */
  var rows = $$('[data-letters]');
  var chars = [];
  rows.forEach(function (row) {
    var txt = row.textContent; row.textContent = '';
    txt.split('').forEach(function (ch) {
      var s = document.createElement('span'); s.className = 'a-ch'; s.textContent = ch; row.appendChild(s); chars.push(s);
    });
  });
  gsap.set(chars, { yPercent: 115, rotate: 6 });
  gsap.set('.a-kicker__line', { scaleX: 0 });
  gsap.set(['.a-kicker__t', '.a-sub', '.a-lead', '.a-recog'], { autoAlpha: 0, y: 24 });
  gsap.set('.a-film', { clipPath: 'inset(0 100% 0 0)' });
  var intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
  intro.to('.a-kicker__line', { scaleX: 1, duration: 0.8 })
    .to('.a-kicker__t', { autoAlpha: 1, y: 0, duration: 0.6 }, '<0.2')
    .to(chars, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.045 }, '<0.1')
    .to(['.a-sub', '.a-lead', '.a-recog'], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, '-=0.6')
    .to('.a-film', { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power4.inOut' }, '-=0.8');

  // variable-font weight proximity (cursor)
  if (fine) {
    var title = $('.a-title'), R = 220, cache = [];
    var measure = function () { cache = chars.map(function (c) { var b = c.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); };
    var sets = chars.map(function (c) { return gsap.quickSetter(c, '--w'); });
    var mx = -999, my = -999, raf = 0;
    var tick = function () {
      raf = 0;
      chars.forEach(function (c, i) {
        var p = cache[i]; if (!p) return;
        var d = Math.hypot(mx - p.x, my - p.y), t = Math.max(0, 1 - d / R);
        c.style.setProperty('--w', Math.round(700 + (900 - 700) * t * t) - (t === 0 ? 0 : 0));
      });
    };
    // base 700; lean light far away for contrast
    var hero = $('.a-hero');
    hero.addEventListener('pointermove', function (e) { if (!cache.length) measure(); mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(tick); });
    hero.addEventListener('pointerleave', function () { mx = my = -999; if (!raf) raf = requestAnimationFrame(tick); });
    window.addEventListener('scroll', function () { cache = []; }, { passive: true });
    window.addEventListener('resize', function () { cache = []; });
    intro.eventCallback('onComplete', function () { cache = []; });
  }

  // film strip: continuous drift + velocity skew
  var film = $('#filmTrack');
  if (film) {
    film.insertAdjacentHTML('beforeend', film.innerHTML);
    var half = 0, x = 0, vel = 0, skew = gsap.quickSetter(film, '--sk', 'deg'), lastY = window.scrollY;
    var setX = gsap.quickSetter(film, 'x', 'px');
    var measureFilm = function () { half = film.scrollWidth / 2; };
    measureFilm(); window.addEventListener('resize', measureFilm); window.addEventListener('load', measureFilm);
    gsap.ticker.add(function (t, dt) {
      var y = window.scrollY, v = (y - lastY); lastY = y;
      vel += (v - vel) * 0.12;
      x -= (0.06 * dt) + vel * 0.9;
      if (half) { x = ((x % half) - half) % half; }
      setX(x);
      skew(gsap.utils.clamp(-14, 14, -vel * 0.5));
    });
  }

  /* ---------- PLACEMENT PARTNERS: odometer ---------- */
  var odo = $('[data-odo]');
  if (odo) {
    var reels = $$('.a-odo__r', odo).filter(function (r) { return r.children.length > 1; });
    gsap.set(reels, { yPercent: 0 });
    ST.create({ trigger: odo, start: 'top 85%', once: true, onEnter: function () {
      reels.forEach(function (r, i) {
        var n = r.children.length - 1;
        gsap.fromTo(r, { yPercent: 0 }, { yPercent: -100 * n / (n + 1), duration: 1.6 + i * 0.35, ease: 'power4.out' });
      });
    } });
  }
  $$('.a-partners__rows .marquee').forEach(function (m, i) {
    gsap.from(m, { autoAlpha: 0, x: i ? 80 : -80, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: m, start: 'top 92%' } });
  });

  /* ---------- word-mask reveal for headings ---------- */
  $$('[data-split]').forEach(function (h) {
    var ws = splitWords(h);
    gsap.set(ws, { yPercent: 110 });
    gsap.to(ws, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });

  /* ---------- STORY ---------- */
  var drift = $('[data-drift]');
  if (drift) gsap.fromTo(drift, { xPercent: 6 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '#story', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.a-story__bg', { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#story', start: 'top bottom', end: 'bottom top', scrub: true } });

  // scroll-scrubbed word fill
  $$('[data-scrub]').forEach(function (p) {
    var ws = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.textContent = t; s.style.display = 'inline-block'; ws.push(s); f.appendChild(s);
          });
          n.parentNode.replaceChild(f, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(p);
    gsap.set(ws, { opacity: 0.16 });
    gsap.to(ws, { opacity: 1, ease: 'none', stagger: 0.5, scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 52%', scrub: 0.4 } });
  });
  var qr = $('.a-quote__rule');
  if (qr) gsap.from(qr, { scaleY: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: qr, start: 'top 85%' } });
  var fr = $('.a-founder__frame');
  if (fr) {
    gsap.from(fr, { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: fr, start: 'top 85%' } });
    gsap.from('.a-founder__frame img', { scale: 1.3, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: fr, start: 'top 85%' } });
    gsap.from('.a-founder__card', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: 0.5, scrollTrigger: { trigger: fr, start: 'top 75%' } });
  }

  /* ---------- WELCOME ---------- */
  var wf = $('.a-welcome__frame');
  if (wf) {
    gsap.from(wf, { clipPath: 'inset(0 0 0 100%)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: wf, start: 'top 85%' } });
    gsap.fromTo('.a-welcome__frame img', { scale: 1.25, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: wf, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  $$('.a-prose p').forEach(function (p) {
    gsap.from(p, { y: 36, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%' } });
  });
  $$('.hl').forEach(function (h) {
    gsap.fromTo(h, { '--hl': '0%' }, { '--hl': '100%', duration: 0.9, ease: 'power3.inOut', scrollTrigger: { trigger: h, start: 'top 80%' } });
  });

  /* ---------- VELOCITY BAND ---------- */
  var band = $('#bandTrack');
  if (band) {
    band.insertAdjacentHTML('beforeend', band.innerHTML + band.innerHTML);
    var bx = 0, bhalf = 0, bv = 0, bl = window.scrollY, setB = gsap.quickSetter(band, 'x', 'px'), dir = 1;
    var mb = function () { bhalf = band.scrollWidth / 3; }; mb(); window.addEventListener('resize', mb); window.addEventListener('load', mb);
    gsap.ticker.add(function (t, dt) {
      var y = window.scrollY, v = y - bl; bl = y; bv += (v - bv) * 0.1;
      if (v) dir = v > 0 ? 1 : -1;
      bx -= dir * (0.07 * dt) + bv * 1.2;
      if (bhalf) bx = ((bx % bhalf) - bhalf) % bhalf;
      setB(bx);
    });
  }

  /* ---------- WHY: 100 chips ---------- */
  var chips = $$('.a-chip', $('#candGrid'));
  var okIdx = 0;
  var num = $('#rejNum');
  var steps = $$('.a-step');
  var bridge = $('#bridgePath');
  var plen = bridge ? bridge.getTotalLength() : 0;
  if (bridge) { bridge.style.strokeDasharray = plen; bridge.style.strokeDashoffset = plen; }
  var ends = $$('#bridgeSvg line');
  gsap.set(ends, { autoAlpha: 0 });
  var state = { r: 0 };
  var paint = function () {
    var n = Math.round(state.r * 99);
    chips.forEach(function (c, i) {
      var rank = (i * 37) % 100;           // scattered order, not a left-to-right sweep
      var rej = rank >= 1 && rank < 1 + n;
      c.style.setProperty('--r', rej ? 1 : 0);
    });
    num.textContent = n;
  };
  chips.forEach(function (c, i) { if ((i * 37) % 100 === 0) { c.classList.add('is-ok'); okIdx = i; } });
  gsap.set($('.a-viz__ends'), { autoAlpha: 0.35 });
  var okAll = function (v) { chips.forEach(function (c) { if (c.dataset.hold) return; }); };
  gsap.to(state, { r: 1, ease: 'none', onUpdate: paint, scrollTrigger: { trigger: '.a-why__text', start: 'top 65%', end: 'center 55%', scrub: 0.6 } });
  // phase 2: rejected chips turn job-ready, bridge draws
  var p2 = { v: 0 };
  gsap.to(p2, { v: 1, ease: 'none', onUpdate: function () {
    var k = Math.round(p2.v * 100);
    chips.forEach(function (c, i) { var rank = (i * 53) % 100; c.classList.toggle('is-ok', rank < k || i === okIdx); });
    if (p2.v > 0) num.textContent = Math.round(99 * (1 - p2.v) + 1 * 0) || 1;
    if (bridge) bridge.style.strokeDashoffset = plen * (1 - Math.min(1, p2.v * 1.4));
    gsap.set(ends, { autoAlpha: p2.v > 0.6 ? 1 : 0 });
    gsap.set($('.a-viz__ends'), { autoAlpha: 0.35 + 0.65 * p2.v });
  }, scrollTrigger: { trigger: '.a-why__text', start: 'center 55%', end: 'bottom 70%', scrub: 0.6 } });
  // dim/undim steps
  steps.forEach(function (s) {
    ST.create({ trigger: s, start: 'top 62%', end: 'bottom 38%', onToggle: function (self) { s.classList.toggle('is-current', self.isActive); } });
  });
  if (steps[0]) steps[0].classList.add('is-current');

  /* ---------- DIFFERENT: scroll-focus rows ---------- */
  var drows = $$('.a-row');
  drows.forEach(function (r) {
    gsap.from(r, { y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 92%' } });
    var bar = document.createElement('span'); bar.className = 'a-row__bar'; bar.setAttribute('aria-hidden', 'true'); r.appendChild(bar);
  });
  var coarse = !fine;
  if (coarse) drows.forEach(function (r) {
    ST.create({ trigger: r, start: 'top 58%', end: 'bottom 42%', onToggle: function (s) { r.classList.toggle('is-on', s.isActive); } });
  });

  /* ---------- AWARDS: pinned horizontal scroll (desktop) / stacked reveal (mobile) ---------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', function () {
    var track = $('#recoTrack'), pin = $('#recoPin'), bar = $('#recoBar');
    if (!track || !pin) return;
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tween = gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '#recognition', start: 'top top+=' + (parseInt(getComputedStyle(root).getPropertyValue('--header-h')) || 72), end: function () { return '+=' + dist(); }, pin: pin, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) { gsap.set(bar, { scaleX: s.progress }); } } });
    $$('.a-panel__img').forEach(function (img) {
      gsap.from(img, { clipPath: 'inset(0 100% 0 0)', ease: 'power2.out', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left 95%', end: 'left 55%', scrub: true } });
    });
  });
  mm.add('(max-width: 1023px)', function () {
    $$('.a-panel').forEach(function (p) {
      gsap.from(p, { y: 60, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%' } });
    });
  });

  /* ---------- TEAM: photos start as a pile and fly into the grid ---------- */
  var tiles = $$('.a-t'), bento = $('#teamBento');
  mm.add('(min-width: 1024px)', function () {
    var rots = [-7, 8, -5, 6];
    tiles.forEach(function (t, i) { t.style.zIndex = 4 - i; });
    gsap.fromTo(tiles, {
      x: function (i, el) { var g = bento.getBoundingClientRect(), r = el.getBoundingClientRect(); return (g.left + g.width / 2) - (r.left + r.width / 2) + (i - 1.5) * 24; },
      y: function (i, el) { var g = bento.getBoundingClientRect(), r = el.getBoundingClientRect(); return (g.top + g.height / 2) - (r.top + r.height / 2) + (i - 1.5) * 10; },
      scale: 0.55, rotate: function (i) { return rots[i]; }
    }, { x: 0, y: 0, scale: 1, rotate: 0, ease: 'power3.out', stagger: 0.06, immediateRender: true,
      scrollTrigger: { trigger: bento, start: 'top 85%', end: 'top 15%', scrub: 0.8, invalidateOnRefresh: true } });
    return function () { tiles.forEach(function (t) { t.style.zIndex = ''; }); };
  });
  mm.add('(max-width: 1023px)', function () {
    tiles.forEach(function (t, i) { gsap.from(t, { y: 60, rotate: i % 2 ? 3 : -3, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 90%' } }); });
  });

  /* ---------- FAQ + CONTACT ---------- */
  $$('#faqList .faq__item').forEach(function (it, i) {
    gsap.from(it, { y: 30, autoAlpha: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: it, start: 'top 94%' } });
  });
  $$('.a-call').forEach(function (c) {
    gsap.from(c, { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 92%' } });
  });
  $$('.a-contact__lede').forEach(function (c) { gsap.from(c, { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%' } }); });

  window.addEventListener('load', function () { ST.refresh(); });

  /* ---------- builders ---------- */
  function buildChips() {
    var g = $('#candGrid'); if (!g || g.children.length) return;
    var f = document.createDocumentFragment();
    for (var i = 0; i < 100; i++) { var c = document.createElement('i'); c.className = 'a-chip'; f.appendChild(c); }
    g.appendChild(f);
  }
  function odoBuild() {
    var o = $('[data-odo]'); if (!o) return;
    var target = o.getAttribute('data-odo'), digits = target.split('');
    var label = o.getAttribute('aria-label'); o.textContent = '';
    digits.forEach(function (d, i) {
      var wrap = document.createElement('span'); wrap.className = 'a-odo__d'; wrap.setAttribute('aria-hidden', 'true');
      var reel = document.createElement('span'); reel.className = 'a-odo__r';
      var n = parseInt(d, 10), seq = [], k = 10 + n + i * 10;
      for (var j = 0; j <= k; j++) seq.push(j % 10);
      seq.forEach(function (v) { var s = document.createElement('span'); s.textContent = v; reel.appendChild(s); });
      // static fallback: show final digit
      wrap.appendChild(reel); o.appendChild(wrap);
    });
    var plus = document.createElement('span'); plus.className = 'a-odo__d'; plus.setAttribute('aria-hidden', 'true'); plus.innerHTML = '<span class="a-odo__r"><span>+</span></span>';
    o.appendChild(plus); o.setAttribute('aria-label', label || target + '+');
  }
})();
