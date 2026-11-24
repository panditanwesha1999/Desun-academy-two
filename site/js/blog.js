/* Blog list: category + search filter, rotating intro line, tilt/glare cards, reveals. Filtering works without GSAP. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }

  /* filter */
  var cards = $$('#blGrid .bl-c'), chips = $$('.bl-chip'), q = $('#blQ'), count = $('#blCount'), empty = $('#blEmpty'), cat = 'all';
  var feat = $('#blFeat');
  function apply() {
    var t = (q.value || '').toLowerCase().trim(), n = 0, show = [];
    cards.forEach(function (c) {
      var ok = (cat === 'all' || c.getAttribute('data-cat') === cat) && (!t || c.getAttribute('data-text').indexOf(t) > -1);
      if (ok && c.hidden) show.push(c); c.hidden = !ok; if (ok) n++;
    });
    var fok = (cat === 'all' || feat.getAttribute('data-cat') === cat) && (!t || feat.getAttribute('data-text').indexOf(t) > -1); feat.hidden = !fok; if (fok) n++;
    count.textContent = n ? 'Showing ' + n + (n === 1 ? ' article' : ' articles') : 'No articles found';
    empty.hidden = n > 0;
    if (can && show.length) gsap.fromTo(show, { y: 24, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity,visibility' });
    if (can) ST.refresh();
  }
  chips.forEach(function (b) { b.addEventListener('click', function () { cat = b.getAttribute('data-f'); chips.forEach(function (o) { var on = o === b; o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', on); }); apply(); }); });
  var tm; q.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(apply, 120); });
  $('#blClear').addEventListener('click', function () { q.value = ''; cat = 'all'; chips.forEach(function (o, i) { o.classList.toggle('is-on', i === 0); o.setAttribute('aria-pressed', i === 0); }); apply(); q.focus(); });

  if (!can) return;

  /* hero */
  var w = $$('.bl-hero__t .w i'); gsap.set(w, { yPercent: 115, rotate: 6 }); gsap.to(w, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.1 });
  gsap.from(['.bl-hero__k', '.bl-rot', '.bl-hero__r li'], { y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.35 });
  gsap.from('.bl-tk', { scale: 0, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.12, delay: 0.7 });
  var lines = $$('.bl-rot__i'), at = 0;
  setInterval(function () { var cur = lines[at]; at = (at + 1) % lines.length; var nx = lines[at]; cur.classList.add('is-out'); cur.classList.remove('is-on'); nx.classList.remove('is-out'); nx.classList.add('is-on'); setTimeout(function () { cur.classList.remove('is-out'); }, 700); }, 3200);
  if (fine) { var hero = $('.bl-hero'), tks = $$('.bl-tk'); hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; tks.forEach(function (t, i) { gsap.to(t, { x: x * (-24 - i * 10), y: y * (-18 - i * 6), duration: 0.9, ease: 'power3.out', overwrite: 'auto' }); }); }); }
  gsap.to('.bl-hero__t', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.bl-hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* featured + cards */
  gsap.from('.bl-fc', { y: 80, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: 0.5, clearProps: 'transform,opacity,visibility' });
  ST.batch('#blGrid .bl-c', { start: 'top 90%', once: true, onEnter: function (b) { gsap.from(b, { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, clearProps: 'transform,opacity,visibility' }); } });
  gsap.from('.bl-cta__in > *', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.bl-cta', start: 'top 80%', once: true } });

  /* tilt + glare */
  if (fine) $$('.bl-c__a, .bl-fc').forEach(function (a) {
    var g = $('.bl-c__glare', a);
    a.addEventListener('pointermove', function (e) { var r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; if (a.classList.contains('bl-c__a')) gsap.to(a, { rotateY: (x - 0.5) * 6, rotateX: (0.5 - y) * 6, transformPerspective: 900, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }); if (g) { g.style.setProperty('--mx', x * 100 + '%'); g.style.setProperty('--my', y * 100 + '%'); g.style.opacity = 1; } });
    a.addEventListener('pointerleave', function () { if (a.classList.contains('bl-c__a')) gsap.to(a, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'expo.out', overwrite: 'auto' }); if (g) g.style.opacity = 0; });
  });
  window.addEventListener('load', function () { ST.refresh(); });
})();
