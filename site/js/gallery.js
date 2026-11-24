/* Gallery: polaroid deal, sticky chapter nav, depth wall, film strip, collage, lightbox. GSAP optional. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }

  /* ---- chapter nav + pill (works without GSAP) ---- */
  var links = $$('.gl-nav__a'), pill = $('.gl-nav__pill'), box = $('.gl-nav__in');
  function setPill(a) {
    links.forEach(function (l) { l.classList.toggle('is-on', l === a); if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
    if (!a) { pill.style.width = '0'; return; }
    pill.style.width = a.offsetWidth + 'px'; pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    var l = a.offsetLeft - 16, r = a.offsetLeft + a.offsetWidth + 16;
    if (l < box.scrollLeft) box.scrollTo({ left: l, behavior: 'smooth' }); else if (r > box.scrollLeft + box.clientWidth) box.scrollTo({ left: r - box.clientWidth, behavior: 'smooth' });
  }
  var chs = $$('.gl-ch');
  if ('IntersectionObserver' in window) {
    var vis = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
      var best = null, bv = 0; chs.forEach(function (c) { if ((vis[c.id] || 0) > bv) { bv = vis[c.id]; best = c.id; } });
      setPill(best ? links.filter(function (l) { return l.getAttribute('data-t') === best; })[0] : null);
    }, { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.01, 0.1, 0.3, 0.6, 1] });
    chs.forEach(function (c) { io.observe(c); });
  }
  window.addEventListener('resize', function () { var a = links.filter(function (l) { return l.classList.contains('is-on'); })[0]; if (a) setPill(a); });

  /* ---- lightbox (works without GSAP) ---- */
  var lb = $('#glLb'), img = $('#glImg'), cap = $('#glCap'), cnt = $('#glCnt'), set = [], idx = 0, lastBtn = null;
  function show(i) {
    idx = (i + set.length) % set.length; var t = set[idx], im = $('img', t);
    img.src = im.currentSrc || im.src; img.alt = im.alt; cap.textContent = im.alt; cnt.textContent = (idx + 1) + ' of ' + set.length;
    if (can) gsap.fromTo(img, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'expo.out' });
  }
  function open(t) {
    lastBtn = t; set = $$('.gl-t[data-ch="' + t.getAttribute('data-ch') + '"]'); idx = set.indexOf(t); show(idx);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  }
  function close() { if (lb.open) lb.close(); if (lastBtn) try { lastBtn.focus(); } catch (e) {} }
  $$('.gl-t').forEach(function (t) { t.addEventListener('click', function () { open(t); }); });
  $('.gl-lb__x').addEventListener('click', close);
  $('.gl-lb__a--p').addEventListener('click', function () { show(idx - 1); });
  $('.gl-lb__a--n').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('gl-lb__in')) close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1); });
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });

  if (!can) return;

  /* ---- hero: polaroids are dealt onto the table ---- */
  var w = $$('.gl-hero__t .w i'); gsap.set(w, { yPercent: 115, rotate: 5 });
  gsap.to(w, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
  gsap.from(['.gl-hero .c-kicker', '.gl-hero__p'], { y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.4 });
  var table = $('.gl-hero__table'), ps = $$('.gl-p');
  ps.forEach(function (p, i) {
    var tr = table.getBoundingClientRect(), r = p.getBoundingClientRect();
    gsap.from(p, { x: tr.width / 2 - (r.left - tr.left + r.width / 2), y: tr.height / 2 - (r.top - tr.top + r.height / 2), scale: 0.3, rotate: (Math.random() - 0.5) * 120, autoAlpha: 0, duration: 1.4, ease: 'expo.out', delay: 0.25 + i * 0.12 });
  });
  if (fine) {
    var hero = $('.gl-hero'), lx = 0, ly = 0, tx = 0, ty = 0, run = false;
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; if (!run) { run = true; requestAnimationFrame(loop); } });
    function loop() { lx += (tx - lx) * 0.08; ly += (ty - ly) * 0.08; ps.forEach(function (p, i) { var d = (i % 3 + 1) * 14; p.style.translate = (lx * d) + 'px ' + (ly * d) + 'px'; }); if (Math.abs(tx - lx) > 0.002 || Math.abs(ty - ly) > 0.002) requestAnimationFrame(loop); else run = false; }
  }
  gsap.to(table, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.gl-hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---- chapter headers ---- */
  chs.forEach(function (c) { gsap.from($$('.gl-ch__h > *', c), { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: c, start: 'top 75%' } }); });

  /* ---- awards: tiles tip up from depth; pointer parallax moves them by depth ---- */
  var wall = $('.gl-ch--awards .gl-ch__b'), wt = $$('.gl-t', wall);
  gsap.from(wt, { rotateX: 35, y: 90, z: -150, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: { each: 0.05, from: 'start' }, scrollTrigger: { trigger: wall, start: 'top 85%' }, clearProps: 'transform,opacity,visibility' });
  if (fine) {
    var sec = $('.gl-ch--awards'), wx = 0, wy = 0, ux = 0, uy = 0, wr = false;
    sec.addEventListener('pointermove', function (e) { var r = sec.getBoundingClientRect(); ux = (e.clientX - r.left) / r.width - 0.5; uy = (e.clientY - r.top) / r.height - 0.5; if (!wr) { wr = true; requestAnimationFrame(wl); } });
    sec.addEventListener('pointerleave', function () { ux = 0; uy = 0; if (!wr) { wr = true; requestAnimationFrame(wl); } });
    function wl() { wx += (ux - wx) * 0.08; wy += (uy - wy) * 0.08; wt.forEach(function (t, i) { var d = 10 + (i * 7 % 5) * 9; t.style.translate = (-wx * d) + 'px ' + (-wy * d) + 'px'; }); if (Math.abs(ux - wx) > 0.002 || Math.abs(uy - wy) > 0.002) requestAnimationFrame(wl); else wr = false; }
  }

  /* ---- film strip scrubs sideways with the page (desktop) ---- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', function () {
    var strip = $('.gl-ch--contest .gl-ch__b');
    ST.create({ trigger: strip, start: 'top 90%', end: 'bottom 10%', scrub: 0.6, onUpdate: function (s) { strip.scrollLeft = s.progress * (strip.scrollWidth - strip.clientWidth); } });
  });
  gsap.from('.gl-ch--contest .gl-t', { y: 60, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.gl-ch--contest .gl-ch__b', start: 'top 85%' }, clearProps: 'transform,opacity,visibility' });

  /* ---- fairs collage: each tile is uncovered by a clip, images drift ---- */
  $$('.gl-ch--fairs .gl-t').forEach(function (t) {
    gsap.fromTo(t, { clipPath: 'inset(0 0 100% 0 round 12px)' }, { clipPath: 'inset(0 0 0% 0 round 12px)', duration: 1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 92%' }, clearProps: 'clipPath' });
    gsap.fromTo($('img', t), { yPercent: -7, scale: 1.18 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---- campus: polaroids drop onto the table ---- */
  $$('.gl-ch--campus .gl-t').forEach(function (t, i) {
    gsap.from(t, { y: -200, rotate: (i % 2 ? 1 : -1) * 28, autoAlpha: 0, duration: 1.1, ease: 'bounce.out', delay: (i % 4) * 0.1, scrollTrigger: { trigger: t, start: 'top 92%' }, clearProps: 'opacity,visibility' });
  });
  gsap.from('.gl-end__in > *', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.gl-end', start: 'top 80%' } });
})();
