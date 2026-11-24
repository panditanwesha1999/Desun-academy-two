/* Interview (jobs board) + job detail pages. Data: js/jobs-data.js (window.DESUN_JOBS). GSAP optional. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var can = !!(gsap && ST) && !reduced;
  if (gsap && ST) gsap.registerPlugin(ST);
  if (can) root.classList.add('a-live');
  var JOBS = window.DESUN_JOBS || [];
  var COLORS = ['#0F7600', '#075985', '#9D174D', '#92400E', '#5B21B6', '#0E7490', '#B45309'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mono(name) {
    var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    var ini = name.replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    return '<span class="jb-mono" style="--c:' + COLORS[h % COLORS.length] + '" aria-hidden="true">' + esc(ini) + '</span>';
  }
  function ago(iso) { var d = Math.max(0, Math.round((Date.now() - new Date(iso + 'T00:00:00').getTime()) / 864e5)); return d === 0 ? 'Posted today' : d === 1 ? 'Posted 1 day ago' : 'Posted ' + d + ' days ago'; }
  function fmt(iso) { if (!iso) return 'Not disclosed'; return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function left(iso) { if (!iso) return ''; var d = Math.ceil((new Date(iso + 'T23:59:59').getTime() - Date.now()) / 864e5); return d < 0 ? 'Applications closed' : d === 0 ? 'Last day to apply' : d + (d === 1 ? ' day left' : ' days left'); }
  function icon(id, c) { return '<svg class="icon ' + (c || 'icon--20') + '" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }

  /* ===================== BOARD ===================== */
  var board = $('#jbBoard');
  if (board) {
    var rows = JOBS.map(function (j, i) {
      return '<a class="jb-row" href="job.html?id=' + encodeURIComponent(j.id) + '" data-dept="' + j.dept + '" data-q="' + esc((j.title + ' ' + j.company + ' ' + j.location + ' ' + j.deptLabel).toLowerCase()) + '">' +
        '<span class="jb-row__no" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' + mono(j.company) +
        '<span class="jb-row__main"><b>' + esc(j.title) + '</b><span>' + esc(j.company) + '</span></span>' +
        '<span class="jb-row__loc">' + icon('pin', 'icon--16') + '<span>' + esc(j.location) + '</span></span>' +
        '<span class="jb-row__ctc"><small>CTC</small>' + esc(j.ctc.replace(' per month', '/mo')) + '</span>' +
        '<span class="jb-row__when"><small>' + esc(j.deptLabel) + '</small>' + ago(j.posted) + '</span>' +
        '<span class="jb-row__go"><span>Apply now</span>' + icon('arrow-right') + '</span></a>';
    }).join('');
    board.innerHTML = rows + '<p class="jb-empty" id="jbEmpty" hidden>No openings match. Try another department or clear the search.</p>';
    var all = $$('.jb-row', board), q = $('#jbSearch'), count = $('#jbCount'), chips = $$('.jb-chip'), f = 'all';
    var depts = {}; JOBS.forEach(function (j) { depts[j.dept] = (depts[j.dept] || 0) + 1; });
    chips.forEach(function (c) { var k = c.dataset.f; var n = k === 'all' ? JOBS.length : (depts[k] || 0); var s = $('.jb-chip__n', c); if (s) s.textContent = n; if (k !== 'all' && !n) c.hidden = true; });
    var hero = $('#jbLive'); if (hero) hero.textContent = JOBS.length;
    function apply() {
      var term = (q.value || '').trim().toLowerCase(), shown = 0;
      all.forEach(function (r) { var on = (f === 'all' || r.dataset.dept === f) && (!term || r.dataset.q.indexOf(term) > -1); r.hidden = !on; if (on) shown++; });
      $('#jbEmpty').hidden = shown > 0; count.textContent = shown + (shown === 1 ? ' opening' : ' openings');
      if (can) { gsap.fromTo(all.filter(function (r) { return !r.hidden; }), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'expo.out', stagger: 0.04, clearProps: 'opacity,visibility,transform' }); }
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { f = c.dataset.f; chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); }); apply(); }); });
    q.addEventListener('input', apply); apply();
    if (can) {
      all.forEach(function (r) { gsap.set(r, { transformPerspective: 900 }); });
      ST.batch(all, { start: 'top 92%', once: true, onEnter: function (els) { gsap.fromTo(els, { rotationX: -70, autoAlpha: 0, y: 30, transformOrigin: '50% 0%' }, { rotationX: 0, autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, clearProps: 'transform,opacity,visibility' }); } });
      gsap.set(all, { autoAlpha: 0 });
    }
  }

  /* ===================== DETAIL ===================== */
  var host = $('#jdHost');
  if (host) {
    var id = new URLSearchParams(location.search).get('id'), job = JOBS.filter(function (j) { return j.id === id; })[0], note = '';
    if (!job) { job = JOBS[0]; note = id ? 'We could not find that opening, so here is the latest one.' : ''; }
    if (!job) { host.innerHTML = '<div class="container"><p class="jd-nf">No openings are listed right now. <a href="interview.html">Back to openings</a></p></div>'; return; }
    document.title = job.title + ' at ' + job.company + ' — Desun Academy';
    var steps = job.desc.map(function (d, i) { return '<li class="jd-step"><span class="jd-step__n" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span><p>' + esc(d) + '</p></li>'; }).join('');
    var facts = [['calendar', 'Start date', job.start ? fmt(job.start) : 'Not disclosed'], ['rupee', 'CTC', job.ctc], ['briefcase', 'Experience', job.exp], ['clock', 'Apply by', job.applyBy ? fmt(job.applyBy) : 'Not disclosed']];
    var det = [['Role', job.role], ['Industry type', job.industry], ['Department', job.department], ['Employment type', job.employment], ['Role category', job.category]];
    var similar = JOBS.filter(function (j) { return j.id !== job.id; }).sort(function (a, b) { return (b.dept === job.dept) - (a.dept === job.dept); });
    var enc = encodeURIComponent(location.href);
    host.innerHTML =
      '<div class="container jd-top"><a class="jd-back" href="interview.html">' + icon('arrow-left') + 'All openings</a>' + (note ? '<p class="jd-note" role="status">' + esc(note) + '</p>' : '') + '</div>' +
      '<div class="container jd-grid"><div class="jd-main">' +
        '<header class="jd-head"><p class="jd-chips"><span class="s-chip s-chip--' + (job.dept === 'design' ? 'academy' : job.dept) + '">' + esc(job.deptLabel) + '</span>' + (job.employment ? '<span class="jd-pill">' + esc(job.employment) + '</span>' : '') + (job.level ? '<span class="jd-pill">' + esc(job.level) + '</span>' : '') + '</p>' +
        '<h1 class="display jd-title">' + esc(job.title) + '</h1>' +
        '<p class="jd-co">' + mono(job.company) + '<span><b>' + esc(job.company) + '</b><span>' + icon('pin', 'icon--16') + esc(job.location) + '</span></span></p>' +
        '<p class="jd-meta"><span>' + ago(job.posted) + '</span>' + (job.openings ? '<span>Openings: <b>' + job.openings + '</b></span>' : '') + (job.applicants ? '<span>Applicants: <b>' + esc(job.applicants) + '</b></span>' : '') + '</p></header>' +
        '<section class="jd-sec" aria-labelledby="jdWhat"><h2 class="h2" id="jdWhat">What you will do</h2><ol class="jd-steps" id="jdSteps">' + steps + '</ol></section>' +
        '<section class="jd-sec" aria-labelledby="jdRole"><h2 class="h2" id="jdRole">About the role</h2><dl class="jd-dl">' + det.map(function (d) { return '<div><dt>' + d[0] + '</dt><dd>' + esc(d[1]) + '</dd></div>'; }).join('') + '</dl></section>' +
        '<section class="jd-sec" aria-labelledby="jdEdu"><h2 class="h2" id="jdEdu">Education and requirements</h2><ul class="jd-list">' + job.edu.map(function (e) { return '<li>' + icon('circle-check') + '<span>' + esc(e) + '</span></li>'; }).join('') + '</ul></section>' +
        '<section class="jd-sec" aria-labelledby="jdSkills"><h2 class="h2" id="jdSkills">Key skills</h2><ul class="jd-skills">' + job.skills.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></section>' +
        '<aside class="jd-hook" aria-labelledby="jdHook"><div class="jd-hook__t"><p class="c-kicker c-kicker--dark">Not getting shortlisted?</p><h2 class="h2" id="jdHook">Facing rejections because of a skill gap? Talk to our career counsellor.</h2><p>Tell us which of the skills above you are missing. We will map a short plan to close the gap, from portfolio to mock interviews.</p>' +
          '<div class="jd-hook__cta"><button class="btn btn--inverse" type="button" data-open-form="counselling">Talk to a counsellor ' + icon('phone') + '</button><a class="btn btn--outline-inverse" href="courses.html">See our courses</a></div></div>' +
          '<ul class="jd-hook__chips" aria-hidden="true">' + job.skills.slice(0, 5).map(function (s, i) { return '<li style="--i:' + i + '">' + esc(s) + '<i></i></li>'; }).join('') + '</ul></aside>' +
        '<section class="jd-sec" aria-labelledby="jdAbout"><h2 class="h2" id="jdAbout">About ' + esc(job.company) + '</h2><p class="jd-about">' + esc(job.about) + '</p></section>' +
        '<aside class="jd-warn" aria-labelledby="jdWarn"><span class="jd-warn__i">' + icon('shield', 'icon--24') + '</span><div><h2 class="jd-warn__h" id="jdWarn">Beware of imposters</h2><p>Desun Academy does not promise a job or an interview in exchange of money. Fraudsters may ask you to&hellip;</p>' +
          '<div class="jd-warn__more" id="jdMore" hidden><ul><li>pay a registration, training or &ldquo;security&rdquo; fee to get a job.</li><li>share OTPs, bank details or ID documents before an interview is confirmed.</li><li>move the conversation to unofficial chat apps or personal email addresses.</li></ul><p>If something looks wrong, report it to <a href="mailto:admin@desunacademy.in">admin@desunacademy.in</a>.</p></div>' +
          '<button class="jd-warn__b" type="button" id="jdRead" aria-expanded="false" aria-controls="jdMore">Read more</button></div></aside>' +
        '<div class="jd-share"><span>Share this opening</span><a class="icon-btn" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=' + enc + '" aria-label="Share on LinkedIn">' + icon('linkedin', 'icon--24') + '</a><a class="icon-btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(job.title + ' at ' + job.company + ' ') + enc + '" aria-label="Share on WhatsApp">' + icon('chat', 'icon--24') + '</a><button class="icon-btn" type="button" id="jdCopy" aria-label="Copy link">' + icon('copy', 'icon--24') + '</button><span class="sr-only" id="jdCopied" role="status"></span></div>' +
      '</div>' +
      '<aside class="jd-side"><div class="jd-pass" id="jdPass"><div class="jd-pass__top"><p class="jd-pass__co">' + mono(job.company) + '<span>' + esc(job.company) + '</span></p><span class="jd-pass__left">' + esc(left(job.applyBy) || ago(job.posted)) + '</span></div>' +
        '<h2 class="jd-pass__t">' + esc(job.title) + '</h2><dl class="jd-pass__dl">' + facts.map(function (f) { return '<div><dt>' + icon(f[0], 'icon--16') + f[1] + '</dt><dd>' + esc(f[2]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="jd-pass__cut" aria-hidden="true"></div><div class="jd-pass__bot"><button class="btn btn--block" type="button" id="jdApply">Apply now ' + icon('arrow-right') + '</button><p>' + esc(job.location) + '</p></div></div></aside></div>' +
      '<section class="jd-more" aria-labelledby="jdSim"><div class="container"><h2 class="h2" id="jdSim">Jobs you might be interested in</h2></div><ul class="jd-more__row" id="jdSimRow" tabindex="0" aria-label="More openings, scroll sideways">' +
        similar.map(function (j) { return '<li><a class="jd-card" href="job.html?id=' + encodeURIComponent(j.id) + '">' + mono(j.company) + '<b>' + esc(j.title) + '</b><span class="jd-card__co">' + esc(j.company) + '</span><span class="jd-card__loc">' + icon('pin', 'icon--16') + esc(j.location) + '</span><span class="jd-card__f"><small>' + ago(j.posted) + '</small><span>Apply now ' + icon('arrow-right', 'icon--16') + '</span></span></a></li>'; }).join('') + '</ul></section>';

    /* apply dialog */
    var dlg = document.createElement('dialog'); dlg.className = 'modal'; dlg.id = 'applyModal'; dlg.setAttribute('aria-labelledby', 'apTitle');
    dlg.innerHTML = '<div class="modal__inner"><div class="modal__head"><div><h2 class="modal__title" id="apTitle">Apply for ' + esc(job.title) + '</h2><p class="modal__desc">' + esc(job.company) + ' &middot; ' + esc(job.area) + '. Share your details and the Desun placement team will forward your profile.</p></div><button class="modal__close" type="button" data-ap-close aria-label="Close"><svg class="icon icon--24" aria-hidden="true"><use href="#i-x"/></svg></button></div>' +
      '<form class="modal__form" id="apForm" novalidate><div class="form-grid">' +
      '<div class="field"><label for="apName">Full name</label><input id="apName" type="text" autocomplete="name" required><p class="field__error"><svg class="icon icon--16" aria-hidden="true"><use href="#i-alert"/></svg><span>Enter your full name</span></p></div>' +
      '<div class="field"><label for="apPhone">Mobile number</label><input id="apPhone" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="10-digit mobile number" required><p class="field__error"><svg class="icon icon--16" aria-hidden="true"><use href="#i-alert"/></svg><span>Enter a 10-digit mobile number</span></p></div>' +
      '<div class="field"><label for="apMail">Email</label><input id="apMail" type="email" autocomplete="email" required><p class="field__error"><svg class="icon icon--16" aria-hidden="true"><use href="#i-alert"/></svg><span>Enter a valid email address</span></p></div>' +
      '<div class="field"><label for="apLink">Resume or portfolio link <span class="opt">(optional)</span></label><input id="apLink" type="url" placeholder="https://"></div></div>' +
      '<div class="modal__actions"><button class="btn btn--block" type="submit">Submit application</button><button class="btn btn--text btn--block" type="button" data-ap-close>Cancel</button></div></form>' +
      '<div class="modal__success" id="apOk" role="status" hidden style="display:none"><span class="icon-circle"><svg class="icon" aria-hidden="true"><use href="#i-circle-check"/></svg></span><h2 class="modal__title">Application received</h2><p class="modal__desc">Thank you. The placement team will contact you if your profile matches ' + esc(job.company) + '&rsquo;s requirements.</p><button class="btn btn--block" type="button" data-ap-close>Done</button></div></div>';
    document.body.appendChild(dlg);
    var form = $('#apForm', dlg), ok = $('#apOk', dlg);
    function openAp() { form.style.display = ''; ok.style.display = 'none'; if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    $('#jdApply').addEventListener('click', openAp);
    $$('[data-ap-close]', dlg).forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var bad = false;
      function chk(inp, test) { var fl = inp.closest('.field'); var good = test(inp.value.trim()); fl.classList.toggle('has-error', !good); if (!good) bad = true; }
      chk($('#apName', dlg), function (v) { return v.length > 1; }); chk($('#apPhone', dlg), function (v) { return /^\d{10}$/.test(v.replace(/\D/g, '').slice(-10)) && v.replace(/\D/g, '').length >= 10; }); chk($('#apMail', dlg), function (v) { return /^\S+@\S+\.\S+$/.test(v); });
      if (bad) return;
      var payload = { type: 'job-application', jobId: job.id, job: job.title, company: job.company, name: $('#apName', dlg).value, phone: $('#apPhone', dlg).value, email: $('#apMail', dlg).value, link: $('#apLink', dlg).value, page: location.href };
      var ep = window.DESUN_CONFIG && window.DESUN_CONFIG.FORM_ENDPOINT;
      if (ep) fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(function () {}); else console.info('[Desun] FORM_ENDPOINT is empty: demo mode, application not sent.', payload);
      form.style.display = 'none'; ok.hidden = false; ok.style.display = '';
    });
    $('#jdRead').addEventListener('click', function () { var m = $('#jdMore'), open = m.hidden; m.hidden = !open; this.setAttribute('aria-expanded', open); this.textContent = open ? 'Read less' : 'Read more'; if (ST) ST.refresh(); });
    $('#jdCopy').addEventListener('click', function () { var s = $('#jdCopied'); (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(function () { s.textContent = 'Link copied'; }, function () { s.textContent = 'Copy failed'; }); });
    $('#jdSimRow').addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') this.scrollBy({ left: 300, behavior: 'smooth' }); if (e.key === 'ArrowLeft') this.scrollBy({ left: -300, behavior: 'smooth' }); });

    if (can) {
      gsap.from(['.jd-back', '.jd-chips', '.jd-title', '.jd-co', '.jd-meta'], { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, delay: 0.1 });
      gsap.from('#jdPass', { x: 80, rotate: 4, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: 0.3, clearProps: 'transform,opacity,visibility' });
      /* steps: progress line + focus */
      var list = $('#jdSteps'), st = $$('.jd-step', list);
      gsap.fromTo(list, { '--fill': 0 }, { '--fill': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 } });
      st.forEach(function (s) { ST.create({ trigger: s, start: 'top 68%', end: function () { return ST.maxScroll(window) + 5; }, toggleClass: { targets: s, className: 'is-on' } }); gsap.from(s, { x: -30, autoAlpha: 0, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 90%' }, clearProps: 'transform,opacity,visibility' }); });
      gsap.from('.jd-skills li', { scale: 0.6, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.05, scrollTrigger: { trigger: '.jd-skills', start: 'top 88%' }, clearProps: 'transform,opacity,visibility' });
      gsap.from('.jd-dl > div', { y: 24, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.jd-dl', start: 'top 88%' }, clearProps: 'transform,opacity,visibility' });
      gsap.from('.jd-hook', { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.jd-hook', start: 'top 88%' }, clearProps: 'transform,opacity,visibility' });
      gsap.to('.jd-hook__chips li', { y: function (i) { return (i % 2 ? -1 : 1) * 10; }, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.2 });
      gsap.from('.jd-card', { y: 60, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.jd-more__row', start: 'top 90%' }, clearProps: 'transform,opacity,visibility' });
      if (fine) $$('.jd-card').forEach(function (c) {
        c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); gsap.to(c, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 14, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 12, transformPerspective: 800, duration: 0.4, ease: 'power2.out' }); });
        c.addEventListener('pointerleave', function () { gsap.to(c, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'expo.out' }); });
      });
    }
  }

  /* ===================== shared hero motion (board page) ===================== */
  if (can && $('.jb-hero')) {
    gsap.from(['.jb-hero .c-kicker', '.jb-hero__lead', '.jb-hero__cta'], { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.2 });
    var words = $$('.jb-hero__t .w i'); if (words.length) { gsap.set(words, { yPercent: 115, rotate: 4 }); gsap.to(words, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.07, delay: 0.1 }); }
    gsap.set('.jb-hl', { '--hl': 0 }); gsap.to('.jb-hl', { '--hl': 1, duration: 1, ease: 'power3.inOut', delay: 0.9 });
    gsap.from('.jb-tix > *', { y: 120, rotate: function (i) { return (i - 1) * 14; }, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.15, delay: 0.4 });
    gsap.to('.jb-tix > *', { y: function (i) { return (i % 2 ? -1 : 1) * 12; }, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3, delay: 1.6 });
    if (fine) window.addEventListener('pointermove', function (e) { var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5; gsap.to('.jb-tix', { rotationY: x * 16, rotationX: -y * 12, duration: 0.8, ease: 'power3.out', transformPerspective: 1000 }); });
    gsap.to('.jb-hero__tix-wrap', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.jb-hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.jb-band__track', { xPercent: -50, ease: 'none', scrollTrigger: { trigger: '.jb-band', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    gsap.from('.jb-board__bar', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.jb-board', start: 'top 80%' } });
    gsap.from('.jb-help__t > *', { y: 36, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.jb-help', start: 'top 75%' } });
    gsap.from('.jb-help__why li', { x: 60, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.jb-help__why', start: 'top 85%' } });
    gsap.from('.jb-warn', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.jb-warn', start: 'top 88%' } });
  }
  var warnB = $('#jbRead'); if (warnB) warnB.addEventListener('click', function () { var m = $('#jbMore'), open = m.hidden; m.hidden = !open; this.setAttribute('aria-expanded', open); this.textContent = open ? 'Read less' : 'Read more'; });
})();
