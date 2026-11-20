// Decorative scroll progress + current-section marker in the nav.
// Neither carries content; the page works fully without this file.
(function () {
  var bar = document.getElementById('progress');
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var ticking = false;

  function update() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

    var current = -1;
    sections.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top <= 140) current = i;
    });
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
