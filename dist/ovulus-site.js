/**
 * OVULUS — site chrome + motion (Webflow)
 * Substitui 6 scripts sitewide:
 *   NavbarScrollV2 + NavbarHeightV2 + MobileNavV3
 *   + ScrollReveal + TextMotionCSSv2 + TextMotionV2
 *
 * Fonte: github.com/francastudio/ovulus-webflow-scripts
 * CDN:   https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1/dist/ovulus-site.js
 *
 * Requisitos da cliente: hide-on-scroll da #site-navbar — não remover.
 */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ── Text motion CSS (antes do paint quando possível) ── */
  (function injectTextMotionCss() {
    if (document.getElementById("ovulus-site-motion-css")) return;
    var s = document.createElement("style");
    s.id = "ovulus-site-motion-css";
    s.textContent =
      ".hero_title,.section_title,.intro_title,.cta_title,.treatment_panel-title{text-wrap:balance}" +
      "@keyframes ovulus-text-rise{from{transform:translateY(.7rem);opacity:.15}to{transform:none;opacity:1}}" +
      "@media(prefers-reduced-motion:no-preference){" +
      "html.ovulus-text-js .ovulus-text-hero>*{animation:ovulus-text-rise .7s cubic-bezier(.25,1,.5,1) both;animation-delay:calc(var(--text-i,0)*75ms + 50ms)}" +
      "html.ovulus-text-js .ovulus-text-reveal:not(.is-visible){opacity:.25;transform:translateY(.4rem)}" +
      "html.ovulus-text-js .ovulus-text-reveal{transition:opacity .55s cubic-bezier(.25,1,.5,1),transform .55s cubic-bezier(.25,1,.5,1)}" +
      "html.ovulus-text-js .ovulus-text-reveal.is-visible{opacity:1;transform:none}" +
      "html.ovulus-text-js .ovulus-text-reveal.is-immediate{transition:none;opacity:1;transform:none}" +
      "}" +
      "@media(prefers-reduced-motion:reduce){" +
      ".ovulus-text-hero>*,.ovulus-text-reveal{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}" +
      "}";
    document.head.appendChild(s);
  })();

  /* ── Navbar height → --navbar-height ── */
  function initNavbarHeight(navbar) {
    function sync() {
      var h = Math.round(navbar.getBoundingClientRect().height) || navbar.offsetHeight;
      if (h > 0) {
        document.documentElement.style.setProperty("--navbar-height", h + "px");
      }
    }
    sync();
    requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
    window.addEventListener("load", sync);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(sync).catch(function () {});
    }
    setTimeout(sync, 50);
    setTimeout(sync, 250);
    setTimeout(sync, 800);
  }

  /* ── Navbar hide-on-scroll (requisito cliente) ── */
  function initNavbarScroll(navbar) {
    if (reduced) return;

    var last = 0;
    var tick = false;

    function mobileOpen() {
      var m = document.getElementById("mobile-nav");
      return m && m.classList.contains("is-open");
    }

    window.addEventListener(
      "scroll",
      function () {
        if (tick) return;
        tick = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || 0;
          if (y <= 80 || mobileOpen()) {
            navbar.classList.remove("is-hidden");
          } else if (y > last) {
            navbar.classList.add("is-hidden");
          } else {
            navbar.classList.remove("is-hidden");
          }
          last = y;
          tick = false;
        });
      },
      { passive: true }
    );
  }

  /* ── Mobile drawer ── */
  function initMobileNav() {
    var nav = document.getElementById("mobile-nav");
    var btn = document.getElementById("menu-toggle");
    var closeBtn = document.getElementById("mobile-nav-close");
    if (!nav || !btn) return;

    var root = document.documentElement;
    var backdrop = document.getElementById("mobile-nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("button");
      backdrop.id = "mobile-nav-backdrop";
      backdrop.type = "button";
      backdrop.className = "mobile-nav_backdrop";
      backdrop.setAttribute("aria-label", "Fechar menu");
      backdrop.hidden = true;
      document.body.appendChild(backdrop);
    }

    function scrollbarW() {
      return Math.max(0, window.innerWidth - root.clientWidth);
    }

    function set(on) {
      nav.classList.toggle("is-open", on);
      nav.setAttribute("aria-hidden", on ? "false" : "true");
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Fechar menu" : "Abrir menu");
      backdrop.classList.toggle("is-open", on);
      backdrop.hidden = !on;
      if (on) {
        root.style.setProperty("--scrollbar-compensation", scrollbarW() + "px");
        root.classList.add("has-mobile-nav-open");
        var bar = document.getElementById("site-navbar");
        if (bar) bar.classList.remove("is-hidden");
      } else {
        root.classList.remove("has-mobile-nav-open");
        root.style.removeProperty("--scrollbar-compensation");
      }
    }

    btn.addEventListener("click", function () {
      set(btn.getAttribute("aria-expanded") !== "true");
    });
    if (closeBtn) closeBtn.addEventListener("click", function () { set(false); });
    backdrop.addEventListener("click", function () { set(false); });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { set(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") set(false);
    });
    set(false);
  }

  /* ── Card scroll-reveal (legado .reveal) ── */
  function initCardReveal() {
    if (reduced) return;
    var sels = ".testimonial_card,.team_card,.blog_card,.media_card,.faq_item,.article_card";
    var els = document.querySelectorAll(sels);
    if (!els.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 0.1 + "s";
      io.observe(el);
    });
  }

  /* ── Text motion (hero + títulos de seção) ── */
  function initTextMotion() {
    if (reduced) return;
    document.documentElement.classList.add("ovulus-text-js");

    document.querySelectorAll(".hero_content").forEach(function (hero) {
      if (hero.classList.contains("ovulus-text-hero")) return;
      hero.classList.add("ovulus-text-hero");
      for (var i = 0, k = hero.children; i < k.length; i++) {
        k[i].style.setProperty("--text-i", String(i));
      }
    });

    var REVEAL = [
      ".section_title",
      ".section_subtitle",
      ".intro_title",
      ".intro_closing",
      ".cta_title",
      "#section-cta-title",
      ".section_head-center > p",
    ];
    var nodes = [];
    var seen = typeof WeakSet !== "undefined" ? new WeakSet() : null;

    REVEAL.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (seen) {
          if (seen.has(el)) return;
          seen.add(el);
        } else if (el.classList.contains("ovulus-text-reveal")) {
          return;
        }
        if (el.closest(".ovulus-text-hero")) return;
        el.classList.add("ovulus-text-reveal");
        nodes.push(el);
      });
    });

    if (!nodes.length) return;

    function mark(el) {
      el.classList.add("is-visible");
    }

    function inView(el) {
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    }

    nodes.forEach(function (el) {
      if (inView(el)) {
        el.classList.add("is-immediate");
        mark(el);
      }
    });

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(mark);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            mark(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach(function (el) {
      if (!el.classList.contains("is-visible")) io.observe(el);
    });
  }

  onReady(function () {
    var navbar = document.getElementById("site-navbar");
    if (navbar) {
      initNavbarHeight(navbar);
      initNavbarScroll(navbar);
    }
    initMobileNav();
    initCardReveal();
    initTextMotion();
  });
})();
