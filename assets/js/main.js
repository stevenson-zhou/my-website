/* 周纲 Stevenson | 站点交互脚本（无依赖、无后端） */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var toTop = document.querySelector('.to-top');

  /* 顶部导航：滚动阴影 */
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 620);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 移动端菜单 */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* 当前页高亮 */
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links > a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* 滚动入场动画 */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* 回到顶部 */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* 作品页分类筛选 */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var workCards = document.querySelectorAll('.work-card[data-cat]');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        workCards.forEach(function (card) {
          var match = cat === 'all' || card.getAttribute('data-cat') === cat;
          card.hidden = !match;
        });
      });
    });
  }

  /* 轻提示 */
  var toast = document.querySelector('.toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  /* 复制联系电话 */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy') || '';
      var done = function () { showToast('联系方式已复制'); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done).catch(function () { fallbackCopy(value, done); });
      } else {
        fallbackCopy(value, done);
      }
    });
  });
  function fallbackCopy(value, done) {
    var input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try { document.execCommand('copy'); done(); }
    catch (e) { showToast('复制失败，请手动选择号码'); }
    document.body.removeChild(input);
  }

  /* 页脚年份 */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
