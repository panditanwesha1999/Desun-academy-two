/* Blog post: renders from js/blog-data.js using ?id=, builds TOC + scrollspy, reading progress, FAQ accordion, share, related posts. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }
  var posts = window.DESUN_POSTS || [], bodies = window.DESUN_BODY || {};
  var id = parseInt(new URLSearchParams(location.search).get('id'), 10) || 1;
  var post = posts.filter(function (p) { return p.id === id; })[0] || posts[0];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fd(s) { var d = s.split('-'); return MON[+d[1] - 1] + ' ' + (+d[2]) + ', ' + d[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ICON = function (n, c) { return '<svg class="icon ' + (c || 'icon--24') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };

  document.title = post.title + ' | Desun Academy Blog';
  $('#bpCat').innerHTML = '<span class="bl-c__cat" style="--hue:' + post.hue + '">' + esc(post.cat) + '</span>';
  $('#bpT').textContent = post.title;
  $('#bpM').innerHTML = '<span>' + ICON('calendar', 'icon--16') + '<time datetime="' + post.date + '">' + fd(post.date) + '</time></span><span>' + ICON('clock', 'icon--16') + post.read + ' min read</span><span>By Desun Academy</span>';
  var img = $('#bpImg'); img.src = 'assets/img/blog/' + post.cover; img.alt = '';

  var art = $('#bpArt'), b = bodies[post.id];
  if (b) {
    art.innerHTML = b.html + '<div id="bpFaq"></div>' + '<ul class="bp-art__tags" aria-label="Tags">' + b.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    var fq = $('#bpFaq');
    fq.innerHTML = b.faqs.map(function (f, i) { return '<div class="pt-q"><h3><button class="pt-q__b" type="button" aria-expanded="false" aria-controls="bpA' + i + '" id="bpQ' + i + '"><span>' + esc(f[0]) + '</span>' + ICON('plus') + '</button></h3><div class="pt-q__a" id="bpA' + i + '" role="region" aria-labelledby="bpQ' + i + '" hidden><p>' + esc(f[1]) + '</p></div></div>'; }).join('');
    $$('.pt-q__b', fq).forEach(function (btn) {
      btn.addEventListener('click', function () { var open = btn.getAttribute('aria-expanded') === 'true', a = $('#' + btn.getAttribute('aria-controls')); btn.setAttribute('aria-expanded', !open); btn.closest('.pt-q').classList.toggle('is-open', !open); if (open) a.hidden = true; else { a.hidden = false; if (can) gsap.from(a, { height: 0, duration: 0.4, ease: 'power2.out', clearProps: 'height' }); } });
    });
  } else {
    art.innerHTML = '<p>' + esc(post.excerpt) + '</p><div class="bp-plain"><b>The full article is being prepared.</b> Until it is published, talk to a counsellor about <i>' + esc(post.topic.toLowerCase()) + '</i> and we will answer your questions directly.<br><br><a class="btn btn--outline" href="blog.html"><span>Read the available article</span></a></div>';
  }

  /* TOC */
  var heads = $$('h2[id], h3[id]', art), toc = $('#bpToc');
  heads = heads.filter(function (h) { return h.tagName === 'H2'; });
  toc.innerHTML = heads.map(function (h) { return '<li><a href="#' + h.id + '">' + esc(h.textContent) + '</a></li>'; }).join('');
  if (!heads.length) $('.bp-toc').style.visibility = 'hidden';
  var links = $$('a', toc), cur = null;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { cur = e.target.id; links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + cur); }); } }); }, { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* progress */
  var prog = $('#bpProg');
  function onScroll() { var r = art.getBoundingClientRect(), total = r.height - window.innerHeight * 0.5, p = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.3) / Math.max(1, total))); prog.style.setProperty('--p', p); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* share */
  var url = location.href.split('#')[0], text = post.title;
  $('[data-s=wa]').href = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url);
  $('[data-s=li]').href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
  $('[data-s=copy]').addEventListener('click', function () {
    var ok = $('#bpCopied'), done = function () { ok.textContent = 'Link copied'; setTimeout(function () { ok.textContent = ''; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { ok.textContent = 'Copy failed'; }); else { ok.textContent = 'Copy not supported'; }
  });

  /* recent + related */
  var others = posts.filter(function (p) { return p.id !== post.id; });
  $('#bpRecent').innerHTML = others.slice(0, 5).map(function (p) { return '<li><a href="blog-post.html?id=' + p.id + '">' + esc(p.title) + '<small>' + fd(p.date) + ' &middot; ' + p.read + ' min read</small></a></li>'; }).join('');
  var rel = others.filter(function (p) { return p.cat === post.cat; }).concat(others.filter(function (p) { return p.cat !== post.cat; })).slice(0, 3);
  $('#bpRel').innerHTML = rel.map(function (p, i) { return '<article class="bl-c" style="--hue:' + p.hue + '"><a class="bl-c__a" href="blog-post.html?id=' + p.id + '"><span class="bl-c__img"><img src="assets/img/blog/' + p.img + '.jpg" alt="" loading="lazy"></span><span class="bl-c__b"><span class="bl-c__cat">' + esc(p.cat) + '</span><h3>' + esc(p.title) + '</h3><span class="bl-c__m"><time datetime="' + p.date + '">' + fd(p.date) + '</time><i></i>' + p.read + ' min read</span><span class="bl-c__go">Read article ' + ICON('arrow-right', 'icon--16') + '</span></span></a></article>'; }).join('');

  if (!can) return;
  gsap.from(['.bp-back', '.bp-cat', '.bp-t', '.bp-m'], { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.1 });
  gsap.from('.bp-cover', { y: 60, autoAlpha: 0, scale: 0.96, duration: 1.1, ease: 'expo.out', delay: 0.4, clearProps: 'transform,opacity,visibility' });
  gsap.to('.bp-cover img', { yPercent: 6, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.bp-cover', start: 'top 60%', end: 'bottom top', scrub: true } });
  $$('.bp-art h2, .bp-art figure, .bp-art table').forEach(function (el) { gsap.from(el, { y: 32, autoAlpha: 0, duration: 0.8, ease: 'expo.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); });
  ST.batch('.bp-rel .bl-c', { start: 'top 90%', once: true, onEnter: function (e) { gsap.from(e, { y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, clearProps: 'transform,opacity,visibility' }); } });
  window.addEventListener('load', function () { ST.refresh(); });
})();
