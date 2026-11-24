/* Contact page: 3-step form, hero/channel motion. GSAP optional. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }
  var form = $('#ctForm'); if (!form) return;
  var steps = $$('.ct-step', form), i = 0, labels = ['About you', 'Your goal', 'Almost there'];
  var back = $('#ctBack'), next = $('#ctNext'), submit = $('#ctSubmit'), bar = $('#ctBar'), lab = $('#ctStepLabel');
  function show(n, dir) {
    i = n; steps.forEach(function (s, k) { s.hidden = k !== n; });
    back.hidden = n === 0; next.hidden = n === steps.length - 1; submit.hidden = n !== steps.length - 1;
    bar.style.width = ((n + 1) / steps.length * 100) + '%'; lab.textContent = 'Step ' + (n + 1) + ' of ' + steps.length + ' · ' + labels[n];
    if (can && dir) gsap.fromTo(steps[n].children, { x: dir * 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', stagger: 0.07, clearProps: 'transform,opacity,visibility' });
    var f = steps[n].querySelector('input, select'); if (f && dir) f.focus({ preventScroll: true });
  }
  next.addEventListener('click', function () { if (window.p2Valid(steps[i])) show(i + 1, 1); });
  back.addEventListener('click', function () { show(i - 1, -1); });
  form.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && i < steps.length - 1) { e.preventDefault(); next.click(); } });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); if (!window.p2Valid(steps[i])) return;
    submit.disabled = true; submit.textContent = 'Sending…';
    window.p2Send(form, 'contact-consultation').then(function () { form.hidden = true; $('.ct-card__head').hidden = true; var ok = $('#ctOk'); ok.hidden = false; if (can) gsap.from(ok.children, { y: 24, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1 }); });
  });
  show(0, 0);
  if (!can) return;
  var w = $$('.ct-hero__t .w i'); gsap.set(w, { yPercent: 115, rotate: 4 }); gsap.to(w, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.1 });
  gsap.from(['.ct-hero .c-kicker', '.ct-hero__lead', '.ct-hero__cta'], { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.25 });
  gsap.from('.ct-ch', { y: 80, rotate: 3, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.12, delay: 0.35, clearProps: 'opacity,visibility,rotate' });
  gsap.from('.ct-book__copy > *', { y: 36, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.ct-book', start: 'top 75%' } });
  gsap.from('.ct-next li', { x: -40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.ct-next', start: 'top 85%' } });
  gsap.from('.ct-card', { y: 80, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.ct-card', start: 'top 88%' }, clearProps: 'transform,opacity,visibility' });
  gsap.from('.ct-map__frame', { clipPath: 'inset(0 0 100% 0 round 24px)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ct-map__wrap', start: 'top 80%' } });
  gsap.from('.ct-map__card', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', delay: 0.3, scrollTrigger: { trigger: '.ct-map__wrap', start: 'top 75%' } });
  gsap.to('.ct-hero', { backgroundPositionY: '30%', ease: 'none', scrollTrigger: { trigger: '.ct-hero', start: 'top top', end: 'bottom top', scrub: true } });
})();
