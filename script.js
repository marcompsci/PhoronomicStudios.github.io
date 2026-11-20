// Phoronomic Studios — small interactions.
// The page works fully without this file; everything here is enhancement.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Toast ---------- */
  var toast = $('#toast'), toastTimer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('on'); toast.textContent = ''; }, 2600);
  }

  /* ---------- Scroll progress, current nav item, floating quote button ---------- */
  var bar = $('#progress');
  var links = $$('.site-nav a[href^="#"]');
  var sections = links.map(function (a) { return $(a.getAttribute('href')); });
  var floatCta = $('#floatCta');
  var hero = $('#top'), contact = $('#contact');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

    var current = -1;
    sections.forEach(function (sec, i) { if (sec && sec.getBoundingClientRect().top <= 140) current = i; });
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });

    if (floatCta && hero && contact) {
      var pastHero = hero.getBoundingClientRect().bottom < 0;
      var atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.8;
      floatCta.classList.toggle('on', pastHero && !atContact);
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Ticker pause ---------- */
  var marquee = $('.marquee'), mToggle = $('#marqueeToggle');
  if (marquee && mToggle) {
    mToggle.addEventListener('click', function () {
      var paused = marquee.classList.toggle('paused');
      mToggle.setAttribute('aria-pressed', String(paused));
      mToggle.firstChild.nodeValue = paused ? 'Play' : 'Pause';
    });
  }

  /* ---------- Contact form topic presets ---------- */
  var topicSelect = $('#f-topic');
  function setTopic(topic) {
    if (!topicSelect || !topic) return;
    $$('option', topicSelect).forEach(function (o) { if (o.textContent === topic) topicSelect.value = o.value; });
  }
  $$('[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () { setTopic(a.getAttribute('data-topic')); });
  });

  /* ---------- "What do you need?" picker ---------- */
  var answers = {
    web:     { target: '#svc-web',     topic: 'A website or app',  text: 'Websites start at $1,000, and I can run it for you after launch.' },
    ai:      { target: '#svc-ai',      topic: 'An AI workshop',    text: 'AI workshops start at $250 per educator, with full team days on site.' },
    tech:    { target: '#svc-tech',    topic: 'In-home tech help', text: 'I come to you, 8am to 8pm. TV mounting starts at $100.' },
    coach:   { target: '#ladder',      topic: 'Coaching',          text: 'Coaching runs on a four-step ladder, starting at $225 a month.' },
    content: { target: '#svc-content', topic: 'Content creation',  text: 'Content is quoted per project. Send the deliverable and get a number the same day.' },
    call:    { target: '#calls',       topic: 'A strategy call',   text: 'A single 60-minute call is $200, with a written summary the same day.' }
  };
  var chips = $$('.chip'), answerEl = $('#pickerAnswer');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.getAttribute('data-pick'), a = answers[key];
      var wasOn = chip.getAttribute('aria-pressed') === 'true';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      $$('.svc').forEach(function (s) { s.classList.remove('is-picked'); });
      if (wasOn || !a) { answerEl.textContent = 'Pick one and I’ll point you to the right place.'; return; }

      chip.setAttribute('aria-pressed', 'true');
      var card = $('.svc[data-svc="' + key + '"]');
      if (card) card.classList.add('is-picked');
      setTopic(a.topic);
      answerEl.innerHTML = '';
      answerEl.appendChild(document.createTextNode(a.text + ' '));
      var go = document.createElement('a');
      go.href = a.target;
      go.textContent = key === 'coach' ? 'See the ladder' : key === 'call' ? 'See the call tiers' : 'Jump to it';
      answerEl.appendChild(go);
      answerEl.appendChild(document.createTextNode(' · '));
      var ask = document.createElement('a');
      ask.href = '#contact';
      ask.textContent = 'Ask me';
      ask.addEventListener('click', function () { setTopic(a.topic); });
      answerEl.appendChild(ask);
    });
  });

  /* ---------- Contact form → email ---------- */
  var form = $('#brief');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) return;
      e.preventDefault();
      var v = function (id) { var el = $(id); return el ? el.value.trim() : ''; };
      var subject = v('#f-topic') + ' — from ' + v('#f-name');
      var body = v('#f-msg') + '\n\n' + v('#f-name') + (v('#f-where') ? '\n' + v('#f-where') : '');
      window.location.href = 'mailto:hello@phoronomicstudios.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say('Opening your email app');
    });
  }

  /* ---------- Copy email ---------- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { say('Email copied'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { say(text); });
      } else { say(text); }
    });
  });

  if (reduce) return; // everything below is motion

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = $$('.section-heading, .picker, .svc, .ladder, .tiers > li, .project, .capability-grid article, .timeline li, .faq-list, .creed blockquote, .stats li, .rail');
  revealTargets.forEach(function (el) {
    el.classList.add('rv');
    var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--d', Math.min(sibs, 5) * 70 + 'ms');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });

    /* stat count-up */
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countIO.unobserve(en.target);
        var el = en.target, end = parseInt(el.textContent, 10), pad = el.textContent.length, t0 = null;
        if (isNaN(end)) return;
        function tick(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 900), n = Math.round(end * (1 - Math.pow(1 - p, 3)));
          el.textContent = String(n).padStart(pad, '0');
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    $$('.stats b').forEach(function (b) { countIO.observe(b); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero toy: the plate leans toward the pointer ---------- */
  var toy = $('#toy'), plate = toy && $('.plate', toy);
  if (toy && plate && window.matchMedia('(pointer: fine)').matches) {
    toy.addEventListener('pointermove', function (e) {
      var r = toy.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      plate.style.setProperty('--rx', (x * 12).toFixed(2) + 'deg');
      plate.style.setProperty('--ry', (-y * 12).toFixed(2) + 'deg');
    });
    toy.addEventListener('pointerleave', function () {
      plate.style.setProperty('--rx', '0deg');
      plate.style.setProperty('--ry', '0deg');
    });
  }
})();
