/* Courses page motion. GSAP + ScrollTrigger (vendored). Content is complete without this file. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var canAnimate = !!(gsap && ST) && !reduced;
  if (gsap && ST) gsap.registerPlugin(ST);
  if (!canAnimate) root.classList.remove('a-js');

  /* ---------- tabs (work with or without motion) ---------- */
  function tabs(list, tabSel, panelOf, onChange) {
    var ts = $$(tabSel, list);
    function select(i, focus) {
      ts.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
      ts.forEach(function (t, k) { var p = panelOf(t); if (!p) return; var on = k === i; p.hidden = !on; p.classList.toggle('is-on', on); });
      if (focus) ts[i].focus();
      onChange && onChange(i, ts);
    }
    ts.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var n = ts.length, k = ts.indexOf(document.activeElement); if (k < 0) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select((k + 1) % n, true); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select((k - 1 + n) % n, true); }
        else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        else if (e.key === 'End') { e.preventDefault(); select(n - 1, true); }
      });
    });
    return select;
  }
  var byId = function (t) { return document.getElementById(t.getAttribute('aria-controls')); };

  var seg = $('.c-seg');
  if (seg) {
    var segSel = tabs(seg, '.c-seg__b', byId, function (i) {
      seg.style.setProperty('--k', i);
      var p = $('.c-prog__panel.is-on');
      if (canAnimate && p) {
        gsap.fromTo(p, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power3.out', clearProps: 'clipPath' });
        gsap.from($$('.c-prog__list li', p), { x: -16, autoAlpha: 0, duration: 0.45, ease: 'power2.out', stagger: 0.04, delay: 0.1, clearProps: 'all' });
      }
    });
  }

  var stTabs = $('.c-story__tabs');
  if (stTabs) {
    var hl = $('.c-story__hl', stTabs);
    var place = function (i, ts) { var t = ts[i]; if (!t || !hl) return; stTabs.style.setProperty('--y', t.offsetTop + 'px'); stTabs.style.setProperty('--h', t.offsetHeight + 'px'); };
    var curTs = $$('.c-story__tab', stTabs), curI = 0;
    tabs(stTabs, '.c-story__tab', byId, function (i, ts) {
      curI = i; place(i, ts);
      var p = $('.c-story__panel.is-on');
      if (canAnimate && p) {
        gsap.fromTo(p, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power3.inOut', clearProps: 'clipPath' });
        gsap.from($$('.c-story__txt > *, .c-story__photo, .c-story__logo', p), { y: 24, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06, delay: 0.25, clearProps: 'all' });
      }
    });
    window.addEventListener('resize', function () { place(curI, curTs); });
    window.addEventListener('load', function () { place(curI, curTs); });
  }
  var modeOK = true;
  /* ---------- count-up numbers & static end states ---------- */
  var counters = $$('[data-count]');
  if (!canAnimate) { return; }
  root.classList.add('a-live');

  /* ---------- helpers ---------- */
  function splitWords(el) {
    var out = [];
    (function walk(node) {
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
        } else if (n.nodeType === 1 && !n.hasAttribute('data-count') && !n.classList.contains('c-green')) walk(n);
      });
    })(el);
    return out;
  }
  function onceIn(el, fn, start) { ST.create({ trigger: el, start: start || 'top 85%', once: true, onEnter: fn }); }

  /* ---------- progress bar ---------- */
  var prog = $('.a-progress');
  if (prog) gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

  /* ---------- side rail ---------- */
  var rail = $('#cRail');
  if (rail) {
    var secs = $$('[data-rail][id]');
    secs.forEach(function (s) {
      var a = document.createElement('a'); a.href = '#' + s.id; a.setAttribute('aria-label', s.getAttribute('data-rail'));
      a.innerHTML = '<span>' + s.getAttribute('data-rail') + '</span>'; rail.appendChild(a);
      ST.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: function (self) { a.classList.toggle('is-on', self.isActive); } });
    });
  }

  /* ---------- HERO ---------- */
  var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
  gsap.set(['.c-eyebrow', '.c-meta', '.c-sub', '.c-hero__cta', '.c-recog'], { autoAlpha: 0, y: 24 });
  gsap.set('.c-title__l', { yPercent: 100 });
  gsap.set('.c-title', { overflow: 'hidden', paddingBottom: 4 });
  gsap.set('.c-sel__t', { autoAlpha: 0, y: 30 });
  gsap.set('.c-sel__box', { clipPath: 'inset(0 100% 0 0)' });
  gsap.set('.c-sel__box i', { scale: 0 });
  gsap.set('.c-sel__tag', { autoAlpha: 0, x: -20, y: -20 });
  tl.to(['.c-eyebrow', '.c-meta'], { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 })
    .to('.c-title__l', { yPercent: 0, duration: 1 }, '<0.1')
    .to('.c-sel__t', { autoAlpha: 1, y: 0, duration: 0.9 }, '<0.2')
    .set('.c-title', { overflow: 'visible' })
    .to('.c-sel__box', { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power3.inOut' }, '-=0.3')
    .to('.c-sel__box i', { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.08 }, '-=0.3')
    .to('.c-sel__tag', { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.2')
    .to(['.c-sub', '.c-hero__cta', '.c-recog'], { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.6');
  gsap.from('.c-wall', { autoAlpha: 0, scale: 0.9, duration: 1.4, ease: 'expo.out', delay: 0.2 });
  if (fine) {
    var wall = $('.c-wall'), hero = $('.c-hero');
    var wx = gsap.quickTo(wall, 'x', { duration: 0.8, ease: 'power3.out' }), wy = gsap.quickTo(wall, 'y', { duration: 0.8, ease: 'power3.out' });
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); wx(((e.clientX - r.left) / r.width - 0.5) * -30); wy(((e.clientY - r.top) / r.height - 0.5) * -24); });
  }

  /* ---------- headings: word mask ---------- */
  $$('.page-courses .h2, .a-contact__h').forEach(function (h) {
    var ws = splitWords(h);
    gsap.set(ws, { yPercent: 110 });
    onceIn(h, function () { gsap.to(ws, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 }); }, 'top 90%');
  });

  /* ---------- counters ---------- */
  counters.forEach(function (c) {
    var to = parseFloat(c.getAttribute('data-count')), o = { v: 0 };
    c.textContent = '0';
    onceIn(c, function () { gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () { c.textContent = Math.round(o.v); } }); }, 'top 92%');
  });

  /* ---------- about: stacked deck ---------- */
  var cards = $$('.c-card'), cur = $('#stackCur');
  var mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', function () {
    cards.forEach(function (c, i) {
      var next = cards[i + 1];
      if (next) gsap.fromTo(c, { scale: 1, filter: 'brightness(1)' }, { scale: 0.93, filter: 'brightness(0.94)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 75%', end: 'top 25%', scrub: true } });
      ST.create({ trigger: c, start: 'top 55%', end: 'bottom 55%', onToggle: function (s) { if (s.isActive && cur) cur.textContent = ('0' + (i + 1)).slice(-2); } });
    });
  });
  cards.forEach(function (c) { gsap.from(c, { y: 60, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 92%' } }); });

  /* ---------- ticker + partners + generic reveals ---------- */
  gsap.from($$('.c-partners .marquee'), { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.c-partners', start: 'top 75%' } });

  /* ---------- impact: rings + salary range ---------- */
  $$('.c-badge').forEach(function (b, i) {
    var fg = $('.fg', b);
    gsap.set(fg, { strokeDashoffset: 100 });
    gsap.set(b, { y: 40, autoAlpha: 0 });
    onceIn(b, function () {
      gsap.to(b, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', delay: i * 0.12 });
      gsap.to(fg, { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut', delay: i * 0.12 });
    });
  });
  var rf = $('.c-range__fill'), rd = $('.c-range__dot');
  if (rf) {
    gsap.set(rf, { scaleX: 0 }); gsap.set(rd, { left: '0%' });
    onceIn($('.c-salary'), function () {
      gsap.to(rf, { scaleX: 1, duration: 1.8, ease: 'power3.inOut', delay: 0.2 });
      gsap.to(rd, { left: '100%', duration: 1.8, ease: 'power3.inOut', delay: 0.2 });
    }, 'top 80%');
  }

  /* ---------- programmes: first panel features ---------- */
  var firstList = $$('.c-prog__panel.is-on .c-prog__list li');
  gsap.set(firstList, { x: -16, autoAlpha: 0 });
  onceIn($('.c-prog__stage'), function () { gsap.to(firstList, { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }); }, 'top 75%');
  gsap.from('.c-seg', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.c-seg', start: 'top 90%' } });

  /* ---------- tools: dock magnification (fine pointer) / stagger (touch) ---------- */
  var dock = $('#cDock'), items = $$('.c-dock__i');
  gsap.from(items, { y: 50, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.07, scrollTrigger: { trigger: dock, start: 'top 90%' } });
  if (fine && dock) {
    var setters = items.map(function (el) { return gsap.quickTo(el, 'scale', { duration: 0.25, ease: 'power3.out' }); });
    dock.addEventListener('pointermove', function (e) {
      items.forEach(function (el, i) {
        var r = el.getBoundingClientRect(), c = r.left + r.width / 2, d = Math.abs(e.clientX - c);
        setters[i](1 + 0.7 * Math.max(0, 1 - d / 150) * Math.max(0, 1 - Math.abs(e.clientY - (r.top + r.height / 2)) / 220));
      });
    });
    dock.addEventListener('pointerleave', function () { setters.forEach(function (s) { s(1); }); });
  }

  /* ---------- mentor ---------- */
  var bg = $('.c-mentor__bgtxt span');
  if (bg) gsap.fromTo(bg, { x: 0 }, { x: '-45%', ease: 'none', scrollTrigger: { trigger: '.c-mentor', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.c-mentor__photo', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: '.c-mentor__fig', start: 'top 80%' } });
  gsap.from('.c-mentor__photo img', { scale: 1.3, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.c-mentor__fig', start: 'top 80%' } });
  gsap.from('.c-mentor__chip', { x: -40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: 0.5, scrollTrigger: { trigger: '.c-mentor__fig', start: 'top 70%' } });
  gsap.from(['.c-mentor__name', '.c-mentor__role'], { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.c-mentor__name', start: 'top 88%' } });

  /* ---------- stories / banner / outcomes ---------- */
  gsap.from('.c-story > *', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.c-story', start: 'top 85%' } });
  gsap.from('.c-banner', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.c-banner', start: 'top 92%' } });
  gsap.from('.c-out__card', { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.c-out__card', start: 'top 85%' } });
  $$('.c-out__list li').forEach(function (li, i) {
    gsap.fromTo(li, { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: '.c-out__list', start: 'top 85%' } });
  });

  /* ---------- certificate: pointer tilt + sheen ---------- */
  var fig = $('#certFig'), img = $('.c-cert__img');
  $$('.c-cert__list li').forEach(function (li, i) { gsap.from(li, { x: -50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: li, start: 'top 90%' } }); });
  gsap.from(img, { y: 60, rotateX: 18, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: img, start: 'top 88%' }, clearProps: 'transform' });
  if (fine && fig) {
    fig.addEventListener('pointermove', function (e) {
      var r = img.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      img.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg'); img.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
      img.style.setProperty('--sx', (x * 140).toFixed(0) + '%');
    });
    fig.addEventListener('pointerleave', function () { img.style.setProperty('--ry', '0deg'); img.style.setProperty('--rx', '0deg'); img.style.setProperty('--sx', '-120%'); });
  }

  /* ---------- compare table ---------- */
  var rows = $$('.c-cmp__t tbody tr');
  rows.forEach(function (r, i) {
    var bs = $$('.c-cmp__b', r);
    gsap.set(r, { autoAlpha: 0, x: -30 }); gsap.set(bs, { scale: 0, rotate: -90 });
    onceIn(r, function () {
      gsap.to(r, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out' });
      gsap.to(bs, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.1, delay: 0.15 });
    }, 'top 92%');
  });

  /* ---------- CTA ---------- */
  gsap.to('.c-cta__ring--1', { scale: 1.12, autoAlpha: 0.2, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.to('.c-cta__ring--2', { scale: 1.06, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.5 });
  gsap.from('.c-cta__photo', { scale: 0.7, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.c-cta__fig', start: 'top 80%' } });
  gsap.from('.c-cta__copy > :not(.h2)', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.c-cta__copy', start: 'top 75%' } });

  /* ---------- contact ---------- */
  $$('.a-call').forEach(function (c) { gsap.from(c, { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 92%' } }); });
  gsap.from('.a-contact__lede', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.a-contact__lede', start: 'top 90%' } });

  window.addEventListener('load', function () { ST.refresh(); });
})();
