/* ==========================================================================
   DESUN ACADEMY — HOME PAGE SCRIPT (vanilla JS, no dependencies)
   Sections: config · utils · header · hero · marquees · video · stories ·
             spread galleries · programs · modal/form · carousel · faq · reveal
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIG — edit these three things before launch
     ------------------------------------------------------------------------ */
  const CONFIG = window.DESUN_CONFIG = {
    // Where the counselling form POSTs JSON ({name, phone, email, program, source, page}).
    // Leave empty to run in demo mode (nothing is sent; a message is logged to the console).
    // Works with a Formspree URL, an n8n/Make webhook, Google Apps Script web app, etc.
    FORM_ENDPOINT: '',

    // Contact tiles + footer icons. Leave '' to fall back to opening the counselling form.
    CONTACT: {
      whatsapp: '918759872761', // country code + number, no "+" or spaces
      phone: '+919429691814',
      email: 'admin@desunacademy.in'
    },

    // The syllabus "unlocked" flag lives in localStorage under this key.
    // To re-lock while testing: localStorage.removeItem('desun_syllabus_unlocked')
    STORAGE_KEY: 'desun_syllabus_unlocked'
  };

  /* ------------------------------------------------------------------------
     PROGRAM DATA — PLACEHOLDER CONTENT except the UI/UX course, which comes
     from the PDF. Replace titles, durations, modules and tools with your real
     syllabus. Set duration/rating to null to hide that block.
     ------------------------------------------------------------------------ */
  const COMMON_POINTS = [
    'Course certificate + internship certificate',
    'Placement: 100% assistance + money-back guarantee'
  ];
  const PROGRAMS = {
    designer: {
      label: 'Designer',
      roles: [
        {
          name: 'UI/UX designer',
          title: 'UI/UX + Graphic Design Course (AI enabled)',
          rating: { value: '4.5+', note: '4k+ ratings' }, duration: { value: '6', note: 'Months' },
          learn: [
            ['Design foundations & visual thinking', 'UI/UX fundamentals and design principles, colour theory, typography and grid layouts, branding and visual hierarchy for web and mobile.'],
            ['Research & UX strategy', 'User research, personas, journey maps, information architecture and usability testing on real briefs.'],
            ['Interface design with Figma', 'Wireframes, components, design systems, auto layout and interactive prototypes.'],
            ['AI-assisted design workflow', 'Using generative AI tools for ideas, moodboards, copy and assets, with human review at every step.'],
            ['Portfolio & placement prep', 'Case studies from live client projects, resume, LinkedIn and mock interviews.']
          ],
          tools: 'Figma, Canva, ChatGPT, Photoshop, Illustrator'
        },
        {
          name: 'Product designer',
          title: 'Product Design Course',
          rating: null, duration: null,
          learn: [
            ['Product thinking & discovery', 'Frame problems, define users and prioritise what to build before opening a design tool.'],
            ['UX research & strategy', 'Interviews, surveys, competitor analysis and turning insight into product decisions.'],
            ['Interaction & visual design', 'Flows, components and visual systems for consistent, scalable products.'],
            ['Prototyping & testing', 'Interactive prototypes, usability tests and iteration with feedback.'],
            ['Case studies & portfolio', 'Present end-to-end product case studies that hiring managers can scan quickly.']
          ],
          tools: 'Figma, FigJam, Notion, Maze'
        }
      ]
    },
    developer: {
      label: 'Developer',
      roles: [
        {
          name: 'MERN stack developer',
          title: 'MERN Stack Development Course',
          rating: null, duration: null,
          learn: [
            ['Web foundations', 'HTML, CSS and modern JavaScript, plus Git and the command line.'],
            ['Front-end with React', 'Components, state, routing, forms and API calls.'],
            ['Back-end with Node & Express', 'REST APIs, authentication and validation.'],
            ['Databases with MongoDB', 'Data modelling, queries and relationships.'],
            ['Deployment & real projects', 'Ship full stack apps to the web and build a portfolio of client-style projects.']
          ],
          tools: 'VS Code, Git, React, Node.js, MongoDB, Postman'
        },
        {
          name: 'Web designer',
          title: 'Web Design Course',
          rating: null, duration: null,
          learn: [
            ['Web design foundations', 'Layout, typography, colour and visual hierarchy for websites.'],
            ['Responsive design', 'Layouts that work on phones, tablets and desktops.'],
            ['Design to code', 'Turn designs into HTML and CSS pages.'],
            ['Website builders & CMS', 'Build and maintain sites with popular no-code tools.'],
            ['Client projects', 'Plan, build and hand over websites for real clients.']
          ],
          tools: 'Figma, HTML, CSS, WordPress, Framer'
        }
      ]
    },
    hr: {
      label: 'HR',
      roles: [
        {
          name: 'HR generalist',
          title: 'HR Training Program',
          rating: null, duration: null,
          learn: [
            ['HR fundamentals', 'Roles, policies and employment basics every HR professional needs.'],
            ['Recruitment & talent acquisition', 'Job descriptions, sourcing, screening and interviewing.'],
            ['Onboarding & engagement', 'Welcome new hires and keep teams motivated.'],
            ['HR operations', 'Records, attendance, leave and payroll basics.'],
            ['HR tools & analytics', 'Use HR software and simple dashboards to support decisions.']
          ],
          tools: 'Excel, Google Sheets, LinkedIn Recruiter basics, HRMS tools'
        }
      ]
    },
    marketing: {
      label: 'Marketing',
      roles: [
        {
          name: 'Digital marketer',
          title: 'AI-Powered Digital Marketing Course',
          rating: null, duration: null,
          learn: [
            ['Marketing foundations', 'Audience, positioning, funnels and the full-stack marketing mix.'],
            ['SEO & content', 'Keyword research, on-page SEO and content that ranks.'],
            ['Social media & paid ads', 'Organic social plus Meta and Google ads that you can measure.'],
            ['Email, automation & analytics', 'Nurture flows, workflow automation and reporting.'],
            ['AI tools for marketing', 'Speed up research, copy and creative with AI while keeping quality high.']
          ],
          tools: 'Google Analytics, Search Console, Meta Ads, Canva, ChatGPT'
        }
      ]
    }
  };

  /* ------------------------------------------------------------------------
     UTILS
     ------------------------------------------------------------------------ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (x, a, b) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const reduceMotionMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMQ = matchMedia('(min-width: 1024px)');
  const tabletUpMQ = matchMedia('(min-width: 600px)');
  const reduced = () => reduceMotionMQ.matches;
  const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  let ticking = false;
  const scrollTasks = [];
  const onScrollFrame = fn => { scrollTasks.push(fn); };
  const runScrollTasks = () => { ticking = false; scrollTasks.forEach(fn => fn()); };
  const requestScrollFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(runScrollTasks); } };
  addEventListener('scroll', requestScrollFrame, { passive: true });
  addEventListener('resize', requestScrollFrame);

  /* ------------------------------------------------------------------------
     HEADER — shadow on scroll, mobile menu, scroll-spy
     ------------------------------------------------------------------------ */
  function initHeader() {
    const header = $('.site-header');
    const menuBtn = $('#menuBtn');
    const mobileNav = $('#mobileNav');
    const toggleShadow = () => header.classList.toggle('is-scrolled', scrollY > 8);
    onScrollFrame(toggleShadow); toggleShadow();

    const closeMenu = () => {
      mobileNav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.querySelector('use').setAttribute('href', '#i-menu');
    };
    menuBtn.addEventListener('click', () => {
      const open = !mobileNav.classList.contains('is-open');
      mobileNav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
    });
    mobileNav.addEventListener('click', e => { if (e.target.closest('a, button')) closeMenu(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    desktopMQ.addEventListener('change', closeMenu);

    // scroll-spy
    const links = $$('.nav__link');
    const map = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.remove('is-active'));
          const l = map.get(en.target.id); if (l) l.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------------------------
     HERO — typed rotator, counters, muted autoplay reels
     ------------------------------------------------------------------------ */
  function initHero() {
    // typed rotator
    const el = $('#rotator');
    if (el && !reduced()) {
      let words; try { words = JSON.parse(el.dataset.words); } catch (e) { words = []; }
      if (words.length > 1) {
        let w = 0, c = words[0].length, dir = -1;
        const tick = () => {
          const word = words[w];
          c += dir;
          el.textContent = word.slice(0, c);
          let delay = dir > 0 ? 70 : 38;
          if (dir > 0 && c === word.length) { dir = -1; delay = 1800; }
          else if (dir < 0 && c === 0) { dir = 1; w = (w + 1) % words.length; delay = 280; }
          setTimeout(tick, delay);
        };
        setTimeout(tick, 2200);
      }
    }

    // counters (final value is in the HTML, so no-JS and reduced-motion show the real number)
    const stats = $('.stats');
    if (stats && !reduced()) {
      const nums = $$('[data-count]', stats);
      const targets = nums.map(n => +n.dataset.count);
      nums.forEach(n => { n.textContent = '0'; });
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return; io.disconnect();
        const t0 = performance.now(), dur = 1400;
        const step = now => {
          const p = clamp((now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
          nums.forEach((n, i) => { n.textContent = Math.round(targets[i] * e); });
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, { threshold: 0.4 });
      io.observe(stats);
    }

    // reels — autoplay, muted, loop. Falls back to poster + Instagram link if the mp4 is missing.
    $$('[data-reel]').forEach(box => {
      const v = $('video', box); if (!v) return;
      const src = $('source', v);
      v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.playsInline = true;
      const fail = () => box.classList.add('is-failed');
      if (src) src.addEventListener('error', fail);
      v.addEventListener('error', fail);
      v.addEventListener('loadeddata', () => box.classList.remove('is-failed'));
      const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => { /* autoplay blocked: poster stays */ }); };
      if (reduced()) { v.removeAttribute('autoplay'); v.pause(); return; }
      if (box.classList.contains('reel--right') && !tabletUpMQ.matches) return;
      if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
      play();
      const io = new IntersectionObserver(([en]) => { en.isIntersecting ? play() : v.pause(); }, { threshold: 0.15 });
      io.observe(box);
    });
    tabletUpMQ.addEventListener('change', () => {
      const r = $('.reel--right video'); if (r && tabletUpMQ.matches && !reduced()) { r.preload = 'auto'; r.load(); r.play().catch(() => {}); }
    });
  }

  /* ------------------------------------------------------------------------
     MARQUEES — clone children for a seamless loop (CSS does the movement)
     ------------------------------------------------------------------------ */
  function initMarquees() {
    if (reduced()) return;
    $$('[data-marquee]').forEach(m => {
      const track = $('.marquee__track', m); if (!track) return;
      const originals = Array.from(track.children);
      originals.forEach(n => {
        const c = n.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.setAttribute('inert', '');
        $$('a, button', c).forEach(a => a.setAttribute('tabindex', '-1'));
        track.appendChild(c);
      });
    });
  }

  /* ------------------------------------------------------------------------
     INTRO VIDEO (YouTube) — autoplay muted when visible, with labelled controls
     ------------------------------------------------------------------------ */
  function initYouTube() {
    const frame = $('#introVideo'); if (!frame) return;
    const id = frame.dataset.yt;
    const fallback = $('#videoFallback');
    const showFallback = () => { if (fallback) fallback.hidden = false; const ctl = $('.video-frame__controls', frame); if (ctl) ctl.hidden = true; const st = $('#videoStart'); if (st) st.hidden = true; };
    // YouTube refuses to play embeds opened from a local file (error 153): show a clear fallback instead.
    if (location.protocol === 'file:') { showFallback(); return; }
    const muteBtn = $('#ytMute'), pauseBtn = $('#ytPause'), startBtn = $('#videoStart');
    let iframe = null, muted = true, userPaused = false, ready = false;

    const post = (func, args = []) => {
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
    };
    const mount = () => {
      if (iframe) return;
      const origin = /^https?:/.test(location.protocol) ? `&origin=${encodeURIComponent(location.origin)}` : '';
      iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1${origin}`;
      iframe.title = 'Desun Academy placement video';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.addEventListener('load', () => {
        ready = true;
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*');
      });
      window.addEventListener('message', ev => {
        if (!iframe || ev.source !== iframe.contentWindow) return;
        let d; try { d = JSON.parse(ev.data); } catch (e) { return; }
        if (d && d.event === 'onError') showFallback();
      });
      frame.prepend(iframe);
      frame.classList.remove('needs-click');
    };
    const setMuteUI = () => {
      muteBtn.setAttribute('aria-pressed', String(muted));
      $('span', muteBtn).textContent = muted ? 'Unmute' : 'Mute';
      $('use', muteBtn).setAttribute('href', muted ? '#i-vol-x' : '#i-vol-2');
    };
    const setPauseUI = () => {
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      $('span', pauseBtn).textContent = userPaused ? 'Play' : 'Pause';
      $('use', pauseBtn).setAttribute('href', userPaused ? '#i-play' : '#i-pause');
    };
    muteBtn.addEventListener('click', () => { muted = !muted; post(muted ? 'mute' : 'unMute'); setMuteUI(); });
    pauseBtn.addEventListener('click', () => { userPaused = !userPaused; post(userPaused ? 'pauseVideo' : 'playVideo'); setPauseUI(); });
    startBtn.addEventListener('click', () => { mount(); });

    if (reduced()) { frame.classList.add('needs-click'); return; }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { mount(); if (ready && !userPaused) post('playVideo'); }
      else if (iframe && ready) post('pauseVideo');
    }, { threshold: 0.35 });
    io.observe(frame);
  }

  /* ------------------------------------------------------------------------
     SUCCESS STORIES — pinned stage. The centre image stays put and wipes to the
     next story; left and right columns travel at different speeds (parallax).
     After story 3 the pin releases and the page scrolls on.
     ------------------------------------------------------------------------ */
  function initStories() {
    const scroll = $('#storiesScroll'); if (!scroll) return;
    const stage = $('.stories__stage', scroll);
    const parts = $$('.part', scroll);
    const layers = $$('.story-media__layer', scroll);
    const imgs = layers.map(l => $('img', l));
    const N = layers.length;
    const SPEED = { L: 0.9, R: 1.3 };  // parallax: right column travels further per story than left
    layers.forEach((l, i) => { l.style.zIndex = i; });

    function update() {
      const stageH = stage.clientHeight;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const total = Math.max(1, scroll.offsetHeight - stageH);
      const p = clamp((top - scroll.getBoundingClientRect().top) / total);
      const t = clamp((p - 0.06) / 0.88) * (N - 1);   // small dwell at both ends
      const desk = desktopMQ.matches, still = reduced();

      parts.forEach(part => {
        const i = +part.dataset.i;
        const side = part.closest('.track--left') ? 'L' : 'R';
        const o = 1 - smooth(Math.abs(t - i), 0.3, 0.62);
        part.style.opacity = o.toFixed(3);
        part.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
        if (desk) {
          const y = still ? 0 : (i - t) * SPEED[side] * stageH;
          part.style.transform = `translate3d(0, calc(-50% + ${y.toFixed(1)}px), 0)`;
        } else {
          part.style.transform = 'none';
        }
      });

      layers.forEach((layer, k) => {
        if (k === 0) { if (!still) imgs[0].style.transform = `scale(${(1 + 0.05 * smooth(t, 0.3, 0.7)).toFixed(4)})`; return; }
        const g = smooth(t - (k - 1), 0.3, 0.7);
        if (still) { layer.style.opacity = g.toFixed(3); layer.style.clipPath = 'none'; return; }
        layer.style.clipPath = `inset(${((1 - g) * 100).toFixed(2)}% 0 0 0)`;
        imgs[k].style.transform = `scale(${(1.1 - 0.1 * g).toFixed(4)})`;
        // previous image drifts slightly while it is covered
        const next = smooth(t - k, 0.3, 0.7);
        if (k < N - 1) imgs[k].style.transform += ` scale(${(1 + 0.05 * next).toFixed(4)})`;
      });
    }
    onScrollFrame(update);
    desktopMQ.addEventListener('change', update);
    reduceMotionMQ.addEventListener('change', update);
    addEventListener('load', update);
    update();
  }

  /* ------------------------------------------------------------------------
     SPREAD GALLERIES — items start collapsed at the centre of the block and fan
     out to their real grid positions as it scrolls into view (scrubbed + eased).
     Optional: a text block hidden behind the stack fades in as it spreads.
     ------------------------------------------------------------------------ */
  function initSpread(el) {
    const items = $$('.spread-item', el);
    const target = el.dataset.spreadTarget ? $(el.dataset.spreadTarget) : el;
    const text = el.dataset.spreadText ? $(el.dataset.spreadText) : null;
    const startAt = parseFloat(el.dataset.spreadStart || '0.9');
    const endAt = parseFloat(el.dataset.spreadEnd || '0.3');
    const S0 = 0.38;                                   // collapsed scale
    let geo = [], cur = 0, goal = 0, raf = 0;

    const measure = () => {
      items.forEach(it => { it.style.transform = 'none'; });
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
      geo = items.map(it => {
        const r = it.getBoundingClientRect();
        return { dx: cx - (r.left + r.width / 2), dy: cy - (r.top + r.height / 2), rot: parseFloat(it.dataset.rot || '0') };
      });
      render(cur);
    };
    const render = e => {
      items.forEach((it, i) => {
        const g = geo[i]; if (!g) return;
        const k = 1 - e;
        it.style.transform = `translate3d(${(g.dx * k).toFixed(1)}px, ${(g.dy * k).toFixed(1)}px, 0) rotate(${(g.rot * k).toFixed(2)}deg) scale(${(S0 + (1 - S0) * e).toFixed(4)})`;
        it.style.zIndex = String(10 + i);
      });
      if (text) {
        const a = smooth(e, 0.55, 0.95);
        text.style.opacity = a.toFixed(3);
        const base = desktopMQ.matches ? 'translate(-50%, -50%) ' : '';
        text.style.transform = `${base}translateY(${((1 - a) * 16).toFixed(1)}px)`;
        text.style.visibility = a < 0.01 ? 'hidden' : 'visible';
      }
    };
    const loop = () => {
      cur = lerp(cur, goal, 0.14);
      if (Math.abs(goal - cur) < 0.0015) cur = goal;
      render(cur);
      raf = cur === goal ? 0 : requestAnimationFrame(loop);
    };
    const update = () => {
      const vh = innerHeight, r = target.getBoundingClientRect();
      const p = clamp((vh * startAt - r.top) / (vh * (startAt - endAt)));
      goal = p * p * (3 - 2 * p);
      if (!raf) raf = requestAnimationFrame(loop);
    };

    if (reduced()) { items.forEach(it => { it.style.transform = 'none'; }); if (text) { text.style.opacity = 1; text.style.visibility = 'visible'; } return; }
    measure(); update();
    onScrollFrame(update);
    new ResizeObserver(() => { measure(); update(); }).observe(el);
    addEventListener('load', () => { measure(); update(); });
    desktopMQ.addEventListener('change', () => { measure(); update(); });
  }

  /* ------------------------------------------------------------------------
     PROGRAMS — tracks, programs, gated syllabus
     ------------------------------------------------------------------------ */
  const programState = { cat: 'designer', role: 0 };
  const isUnlocked = () => store.get(CONFIG.STORAGE_KEY) === '1';

  function rovingTabs(container, selector, vertical) {
    container.addEventListener('keydown', e => {
      const keys = vertical ? ['ArrowDown', 'ArrowUp'] : ['ArrowRight', 'ArrowLeft'];
      const tabs = $$(selector, container);
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let n = -1;
      if (e.key === keys[0] || (!vertical && e.key === 'ArrowDown')) n = (i + 1) % tabs.length;
      else if (e.key === keys[1] || (!vertical && e.key === 'ArrowUp')) n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
      if (n >= 0) { e.preventDefault(); tabs[n].focus(); tabs[n].click(); }
    });
  }

  function initPrograms() {
    const catTabs = $('#catTabs'), roleList = $('#roleList'), panel = $('#programPanel');
    if (!catTabs) return;
    const el = {
      title: $('#pTitle'), meta: $('#pMeta'), points: $('#pPoints'), learn: $('#pLearn'),
      tools: $('#pTools'), wrap: $('#gatedWrap'), explore: $('#pExplore')
    };

    // category tabs
    catTabs.innerHTML = Object.entries(PROGRAMS).map(([k, v]) =>
      `<button type="button" role="tab" id="tab-${k}" data-cat="${k}" aria-selected="false" tabindex="-1">${v.label}</button>`).join('');
    catTabs.addEventListener('click', e => {
      const b = e.target.closest('[data-cat]'); if (!b) return;
      programState.cat = b.dataset.cat; programState.role = 0; renderAll();
    });
    rovingTabs(catTabs, '[role="tab"]', false);
    rovingTabs(roleList, '[role="tab"]', true);
    roleList.addEventListener('click', e => {
      const b = e.target.closest('[data-role]'); if (!b) return;
      programState.role = +b.dataset.role; renderAll(false);
    });

    function renderAll(rebuildList = true) {
      const cat = PROGRAMS[programState.cat];
      $$('[data-cat]', catTabs).forEach(b => {
        const on = b.dataset.cat === programState.cat;
        b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      });
      if (rebuildList) {
        roleList.innerHTML = cat.roles.map((r, i) =>
          `<button type="button" role="tab" data-role="${i}" aria-selected="false" tabindex="-1">${r.name}</button>`).join('');
      }
      $$('[data-role]', roleList).forEach(b => {
        const on = +b.dataset.role === programState.role;
        b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      });
      renderProgram(cat.roles[programState.role]);
    }

    function renderProgram(p) {
      el.title.textContent = p.title;
      const meta = [];
      if (p.rating) meta.push(`<div class="program-meta__item"><span class="program-meta__value">${p.rating.value}</span><span class="program-meta__label">(${p.rating.note})</span></div>`);
      if (p.duration) meta.push(`<div class="program-meta__item"><span class="program-meta__value">${p.duration.value}</span><span class="program-meta__label">${p.duration.note}</span></div>`);
      el.meta.innerHTML = meta.join('');
      el.meta.style.display = meta.length ? '' : 'none';
      el.points.innerHTML = COMMON_POINTS.map(t => `<li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span>${t}</span></li>`).join('');
      el.learn.innerHTML = p.learn.map(([t, d], i) =>
        `<li class="learn-item${i > 0 ? ' is-gated' : ''}"><span class="learn-item__t">${t}</span><span class="learn-item__d">${d}</span></li>`).join('');
      el.tools.innerHTML = `<strong>Tools:</strong> ${p.tools}`;
      applyLock();
      requestAnimationFrame(positionGate);
    }
    function positionGate() {
      const first = el.learn.firstElementChild; if (!first) return;
      const top = first.getBoundingClientRect().bottom - el.wrap.getBoundingClientRect().top;
      el.wrap.style.setProperty('--gate-top', Math.round(top) + 'px');
    }
    function applyLock() {
      const locked = !isUnlocked();
      panel.classList.toggle('is-locked', locked);
      $$('.is-gated', panel).forEach(n => { locked ? n.setAttribute('aria-hidden', 'true') : n.removeAttribute('aria-hidden'); });
    }
    addEventListener('resize', positionGate);

    // exposed for the form
    initPrograms.unlock = () => { store.set(CONFIG.STORAGE_KEY, '1'); applyLock(); requestAnimationFrame(positionGate); };
    initPrograms.current = () => PROGRAMS[programState.cat].roles[programState.role];
    renderAll();
  }

  /* ------------------------------------------------------------------------
     MODAL + COUNSELLING FORM
     ------------------------------------------------------------------------ */
  function initForm() {
    const dlg = $('#formModal'), form = $('#counsellingForm');
    if (!dlg) return;
    const f = { name: $('#fName'), phone: $('#fPhone'), email: $('#fEmail'), program: $('#fProgram') };
    const title = $('#formTitle'), desc = $('#formDesc'), submit = $('#formSubmit'), label = $('.btn__label', submit);
    const okTitle = $('#successTitleModal'), okDesc = $('#successDesc');
    let mode = 'counselling', source = 'hero';

    // program <select>
    const options = [];
    Object.values(PROGRAMS).forEach(c => c.roles.forEach(r => options.push(r.title)));
    f.program.innerHTML = '<option value="">Select a program</option>' + options.map(o => `<option>${o}</option>`).join('');

    const COPY = {
      counselling: { t: 'Book a free counselling session', d: 'Share your details and a counsellor will call you to plan your career path.', b: 'Book free session' },
      unlock: { t: 'Unlock the full syllabus', d: 'Tell us how to reach you. Every module opens right away, and a counsellor can help you choose.', b: 'Unlock syllabus' },
      enroll: { t: 'Enroll in this program', d: 'Share your details and an admission counsellor will guide you through enrollment.', b: 'Request enrollment' }
    };

    const open = (m, opts = {}) => {
      mode = COPY[m] ? m : 'counselling';
      source = opts.source || m;
      const c = COPY[mode];
      title.textContent = c.t; desc.textContent = c.d; label.textContent = c.b;
      dlg.classList.remove('is-done');
      clearErrors();
      const cur = initPrograms.current && initPrograms.current();
      f.program.value = (mode === 'unlock' || mode === 'enroll') && cur ? cur.title : (opts.program || '');
      document.documentElement.style.overflow = 'hidden';
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      f.name.focus();
    };
    const close = () => { if (dlg.open) dlg.close(); };
    dlg.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      form.reset(); clearErrors(); setLoading(false);
      const e = $('#formError'); if (e) e.remove();
    });
    dlg.addEventListener('click', e => {
      const r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    });
    $$('[data-close-form]', dlg).forEach(b => b.addEventListener('click', close));

    // openers (any element with data-open-form)
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-open-form]'); if (!t) return;
      if (t.tagName === 'A' && t.getAttribute('href') && t.getAttribute('href') !== '#') return; // real link configured
      e.preventDefault();
      open(t.dataset.openForm, { source: t.dataset.channel || t.dataset.openForm });
    });

    // validation (on blur, not on every keystroke)
    const normPhone = v => v.replace(/[\s\-()]/g, '').replace(/^(\+?91|0)/, '');
    const rules = {
      name: v => v.trim().length >= 2,
      phone: v => /^[6-9]\d{9}$/.test(normPhone(v)),
      email: v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      program: v => v !== ''
    };
    const setErr = (key, bad) => {
      const field = f[key].closest('.field');
      field.classList.toggle('has-error', bad);
      f[key].setAttribute('aria-invalid', String(bad));
    };
    const check = key => { const ok = rules[key](f[key].value); setErr(key, !ok); return ok; };
    function clearErrors() { Object.keys(f).forEach(k => setErr(k, false)); }
    Object.keys(f).forEach(k => {
      f[k].addEventListener('blur', () => { if (f[k].value !== '' || k === 'phone' || k === 'name') check(k); });
      f[k].addEventListener('input', () => { if (f[k].closest('.field').classList.contains('has-error')) check(k); });
    });

    function setLoading(on) {
      submit.disabled = on; submit.classList.toggle('is-loading', on);
      label.innerHTML = on ? '<span class="spinner" aria-hidden="true"></span><span class="sr-only">Sending</span>' : COPY[mode].b;
    }

    async function send(payload) {
      if (!CONFIG.FORM_ENDPOINT) { console.info('[Desun] FORM_ENDPOINT is empty: demo mode, lead not sent.', payload); await sleep(600); return; }
      const res = await fetch(CONFIG.FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const results = Object.keys(f).map(k => [k, check(k)]);
      const firstBad = results.find(([, ok]) => !ok);
      if (firstBad) { f[firstBad[0]].focus(); return; }
      const payload = {
        name: f.name.value.trim(), phone: normPhone(f.phone.value), email: f.email.value.trim(),
        program: f.program.value, source, page: location.href, submittedAt: new Date().toISOString()
      };
      setLoading(true);
      const old = $('#formError'); if (old) old.remove();
      try {
        await send(payload);
        if (mode === 'unlock' && initPrograms.unlock) initPrograms.unlock();
        okTitle.textContent = `Thank you, ${payload.name.split(' ')[0]}`;
        okDesc.textContent = mode === 'unlock'
          ? `The full syllabus is now unlocked. A counsellor will also call ${payload.phone} soon.`
          : `A counsellor will call ${payload.phone} soon to plan your next step.`;
        dlg.classList.add('is-done');
        $('#successClose').focus();
      } catch (err) {
        const p = document.createElement('p');
        p.id = 'formError'; p.className = 'field__error'; p.style.display = 'flex'; p.setAttribute('role', 'alert');
        p.innerHTML = '<svg class="icon icon--16" aria-hidden="true"><use href="#i-alert"/></svg><span>We couldn’t send your details. Check your connection and try again.</span>';
        $('.modal__actions', form).prepend(p);
      } finally { setLoading(false); }
    });

    // contact tiles + footer icons: use real links when configured
    const C = CONFIG.CONTACT;
    const wire = (id, href) => { const a = document.getElementById(id); if (!a || !href) return; a.setAttribute('href', href); a.removeAttribute('data-open-form'); if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } };
    wire('ctChat', C.whatsapp && `https://wa.me/${C.whatsapp}`);
    wire('ctCall', C.phone && `tel:${C.phone}`);
    wire('ctMail', C.email && `mailto:${C.email}`);
    wire('soWhatsapp', C.whatsapp && `https://wa.me/${C.whatsapp}`);
    wire('soMail', C.email && `mailto:${C.email}`);
  }

  /* ------------------------------------------------------------------------
     TESTIMONIAL CAROUSEL
     ------------------------------------------------------------------------ */
  function initCarousel() {
    const vp = $('#testiCarousel .carousel__viewport'); if (!vp) return;
    const prev = $('#testiPrev'), next = $('#testiNext');
    const step = () => Math.max(240, vp.clientWidth * 0.8);
    const sync = () => {
      prev.disabled = vp.scrollLeft < 8;
      next.disabled = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 8;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -step(), behavior: reduced() ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: step(), behavior: reduced() ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    vp.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });
    addEventListener('resize', sync); sync();
  }

  /* ------------------------------------------------------------------------
     FAQ ACCORDION (one open at a time)
     ------------------------------------------------------------------------ */
  function initFaq() {
    const list = $('#faqList'); if (!list) return;
    list.addEventListener('click', e => {
      const q = e.target.closest('.faq__q'); if (!q) return;
      const open = q.getAttribute('aria-expanded') === 'true';
      $$('.faq__q', list).forEach(b => b.setAttribute('aria-expanded', 'false'));
      q.setAttribute('aria-expanded', String(!open));
    });
  }

  /* ------------------------------------------------------------------------
     REVEAL ON SCROLL
     ------------------------------------------------------------------------ */
  function initReveal() {
    const els = $$('.reveal');
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  }

  /* ------------------------------------------------------------------------
     HERO GRID — the background grid lights up around the pointer
     ------------------------------------------------------------------------ */
  function initHeroFx() {
    const hero = $('.hero'), fx = $('.hero__fx');
    if (!hero || !fx || reduced() || !finePointer()) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, first = true;
    const loop = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      fx.style.setProperty('--mx', cx.toFixed(1) + 'px');
      fx.style.setProperty('--my', cy.toFixed(1) + 'px');
      raf = (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) ? requestAnimationFrame(loop) : 0;
    };
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (first) { cx = tx; cy = ty; first = false; }
      hero.classList.add('is-hover');
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('pointerleave', () => hero.classList.remove('is-hover'));
  }

  /* ------------------------------------------------------------------------
     INTERACTIONS — press ripple, magnetic buttons, tilt cards
     ------------------------------------------------------------------------ */
  function initInteractions() {
    if (reduced()) return;
    const RIPPLE = '.btn, .pill-btn, .faq__q, .segmented button, .programs-list button, .carousel__nav button, .socials a, .nav__link, .mobile-nav__link, .contact-tile';
    document.addEventListener('pointerdown', e => {
      const t = e.target.closest(RIPPLE);
      if (!t || t.disabled || t.getAttribute('aria-disabled') === 'true') return;
      const r = t.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      if (getComputedStyle(t).position === 'static') t.style.position = 'relative';
      t.classList.add('has-ripple');
      const s = document.createElement('span');
      s.className = 'ripple';
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px`;
      t.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }, { passive: true });

    if (!finePointer()) return;

    // magnetic primary buttons
    $$('.hero .btn, .cta-band .btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const dx = clamp((e.clientX - (r.left + r.width / 2)) / r.width, -0.5, 0.5) * 14;
        const dy = clamp((e.clientY - (r.top + r.height / 2)) / r.height, -0.5, 0.5) * 10;
        b.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });

    // tilt cards with a sheen that follows the pointer
    $$('.stat, .join-card, .life-photo').forEach(card => {
      card.classList.add('tilt');
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ------------------------------------------------------------------------
     SCROLL REVEAL — headings rise word by word, text and cards fade up.
     Elements are tagged here so the HTML stays clean; with reduced motion or
     without IntersectionObserver nothing is hidden.
     ------------------------------------------------------------------------ */
  function initAutoReveal() {
    if (document.body.dataset.motion === 'custom') return;
    if (reduced() || !('IntersectionObserver' in window)) return;
    const SKIP = '.stories__stage, .marquee, [data-spread], .program-panel, #roleList, #catTabs, .carousel__viewport, dialog, .site-header, .mobile-nav, .faq__a, [hidden], .reveal, .rv';
    const ok = el => !el.closest(SKIP);
    const targets = [];

    // headings: split into masked words
    $$('main h1, main h2, main h3, footer h3').filter(ok).forEach(h => {
      let n = 0;
      const walk = node => {
        Array.from(node.childNodes).forEach(ch => {
          if (ch.nodeType === 3) {
            const frag = document.createDocumentFragment();
            ch.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              const o = document.createElement('span'); o.className = 'rw';
              const i = document.createElement('span'); i.className = 'rw__i'; i.style.setProperty('--i', n++); i.textContent = part;
              o.appendChild(i); frag.appendChild(o);
            });
            ch.replaceWith(frag);
          } else if (ch.nodeType === 1) walk(ch);
        });
      };
      walk(h);
      h.classList.add('rv-words'); targets.push(h);
    });

    // paragraphs and list items: staggered rise within their parent
    const seen = new Map();
    $$('main p, main address, main .label, footer p, footer li, footer address').filter(ok).forEach(el => {
      if (el.closest('.rv-words')) return;
      const k = el.parentElement, idx = seen.get(k) || 0; seen.set(k, idx + 1);
      el.style.setProperty('--d', Math.min(idx, 5) * 70 + 'ms');
      el.classList.add('rv'); targets.push(el);
    });

    // blocks: pop in
    $$('.stat, .join-card, .life-photo, .video-frame, .contact-tile, .reel, .cta-band, .faq__item, .recognised, .contact-card, .footer-logo, .socials a, .footer-wordmark').filter(ok).forEach((el, i) => {
      if (el.matches('.socials a')) el.style.setProperty('--d', (i % 6) * 60 + 'ms');
      el.classList.add('rv', 'rv--pop'); targets.push(el);
    });

    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; el.classList.add('is-in'); io.unobserve(el);
      if (el.classList.contains('stat')) setTimeout(() => el.classList.add('is-floating'), 900);
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(el => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------------ */
  function boot() {
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
    initHeader();
    initHero();
    initHeroFx();
    initMarquees();
    initYouTube();
    initStories();
    $$('[data-spread]').forEach(initSpread);
    initPrograms();
    initForm();
    initCarousel();
    initFaq();
    initReveal();
    initAutoReveal();
    initInteractions();
    requestScrollFrame();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
