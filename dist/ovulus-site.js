/**
 * OVULUS — site chrome (Webflow)
 * v1.3.0 — chrome only (navbar height, hide-on-scroll, mobile nav).
 * Motion (hero + scroll reveals) moved to Embed CSS (P2); no IX API via MCP.
 *
 * Fonte: github.com/francastudio/ovulus-webflow-scripts
 * CDN:   https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1.3.0/dist/ovulus-site.js
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

  onReady(function () {
    var navbar = document.getElementById("site-navbar");
    if (navbar) {
      initNavbarHeight(navbar);
      initNavbarScroll(navbar);
    }
    initMobileNav();
  });
})();
