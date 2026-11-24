/* Testimonials page: filterable chat thread with typing indicators. Uses GSAP when available. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var can = !!(gsap && ST) && !reduced;
  var msgs = $$('.t-msg'), count = $('#tCount');

  /* reels strip (works without GSAP) */
  var reelRow = $('#reelRow');
  if (reelRow && window.coverflow) {
    var rcf = window.coverflow(reelRow);
    $('#rPrev').addEventListener('click', function () { rcf.go(rcf.index() - 1); });
    $('#rNext').addEventListener('click', function () { rcf.go(rcf.index() + 1); });
    reelRow.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); rcf.go(rcf.index() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); rcf.go(rcf.index() - 1); } });
  }

  $$('.t-filters .s-filter').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.t-filters .s-filter').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.dataset.f, on = msgs.filter(function (m) { return f === 'all' || m.dataset.aspect === f; }), off = msgs.filter(function (m) { return on.indexOf(m) < 0; });
      count.textContent = 'Showing ' + on.length + ' feedback messages';
      if (!can) { msgs.forEach(function (m) { m.hidden = on.indexOf(m) < 0; }); return; }
      gsap.to(off, { autoAlpha: 0, x: function (i, el) { return el.classList.contains('t-msg--r') ? 40 : -40; }, duration: 0.3, ease: 'power2.in', onComplete: function () {
        off.forEach(function (m) { m.hidden = true; }); on.forEach(function (m) { m.hidden = false; });
        gsap.fromTo(on, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06, clearProps: 'transform,opacity,visibility' });
        ST.refresh();
      } });
    });
  });
  if (!can) return;

  msgs.forEach(function (m) {
    var bubble = $('.t-msg__bubble', m), typing = $('.t-msg__typing', m), av = $('.t-msg__av', m), who = $('.t-msg__who', m), side = m.classList.contains('t-msg--r') ? 1 : -1;
    gsap.set([bubble, who], { autoAlpha: 0 }); gsap.set(av, { scale: 0, autoAlpha: 0 });
    ST.create({ trigger: m, start: 'top 88%', once: true, onEnter: function () {
      var tl = gsap.timeline();
      tl.to(av, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(2.5)' })
        .to(who, { autoAlpha: 1, duration: 0.4 }, '<0.1')
        .fromTo(typing, { autoAlpha: 0, scale: 0.6, transformOrigin: side > 0 ? '100% 100%' : '0% 100%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '<0.1')
        .to(typing, { autoAlpha: 0, duration: 0.2 }, '+=0.7')
        .fromTo(bubble, { autoAlpha: 0, scale: 0.7, x: side * -20, transformOrigin: side > 0 ? '100% 100%' : '0% 100%' }, { autoAlpha: 1, scale: 1, x: 0, duration: 0.6, ease: 'back.out(1.6)', clearProps: 'transform' }, '<');
    } });
  });
  if (reelRow) { gsap.from('.t-reels__head > *', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.t-reels', start: 'top 75%' } }); gsap.from('.t-reel', { y: 80, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.t-reels__row', start: 'top 88%' }, clearProps: 'transform,opacity,visibility' }); }
  var big = $('.s-nums__big');
  if (big) gsap.from(big.children, { y: 50, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: big, start: 'top 85%' } });
  gsap.from('.t-thread__head > *', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.t-thread', start: 'top 75%' } });
})();
