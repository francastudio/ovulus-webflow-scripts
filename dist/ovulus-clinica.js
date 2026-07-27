/**
 * OVULUS — clínica page interactions (Webflow)
 * team expand + swipers init 
 * Fonte: github.com/francastudio/ovulus-webflow-scripts
 * CDN:   https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1.3.2/dist/ovulus-clinica.js
 */

/* --- teamexpand --- */
document.addEventListener("DOMContentLoaded",function(){var g=document.querySelector(".team_grid");if(!g)return;var b=document.createElement("button");b.type="button";b.className="team_expand-btn";b.textContent="Ver mais da equipe";function sync(){var mobile=window.innerWidth<600;b.style.display=mobile?"flex":"none";if(!mobile){g.classList.remove("is-expanded");b.textContent="Ver mais da equipe"}}sync();g.parentNode.insertBefore(b,g.nextSibling);b.addEventListener("click",function(){g.classList.toggle("is-expanded");b.textContent=g.classList.contains("is-expanded")?"Ver menos da equipe":"Ver mais da equipe"});window.addEventListener("resize",sync)});

/* --- ovulusswipers --- */
(function () {
  var IDS = {
    testimonials: { id: "testimonials-swiper", mobileOnly: false, autoplay: true },
    blog: { id: "blog-swiper", mobileOnly: true },
    media: { id: "media-swiper", mobileOnly: true },
  };
  var mq = window.matchMedia("(max-width:767px)");

  function conf(o) {
    var pagEl = document.querySelector("#" + o.id + " .swiper-pagination");
    var c = {
      slidesPerView: "auto",
      spaceBetween: 20,
      grabCursor: true,
      simulateTouch: true,
      allowTouchMove: true,
      watchOverflow: true,
      speed: 450,
      resistanceRatio: 0.65,
      threshold: 5,
      touchReleaseOnEdges: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      breakpoints: {
        0: { spaceBetween: 14 },
        768: { spaceBetween: 18 },
        1024: { spaceBetween: 22 },
      },
    };
    if (pagEl) {
      c.pagination = { el: pagEl, clickable: true };
    }
    if (o.autoplay) {
      c.autoplay = {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      };
    }
    return c;
  }

  function resolveHost(root) {
    var wrap = root.querySelector(".swiper-wrapper");
    if (!wrap || !wrap.parentElement) return null;
    var host = wrap.parentElement;
    if (!host.classList.contains("swiper")) host.classList.add("swiper");
    return host;
  }

  function destroyHost(host) {
    if (host && host.swiper) {
      try {
        host.swiper.destroy(true, true);
      } catch (e) {}
    }
  }

  function ensureSwiperAssets(done) {
    if (typeof window.Swiper !== "undefined") {
      done();
      return;
    }
    if (!document.querySelector('link[data-ovulus-swiper-css]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
      link.setAttribute("data-ovulus-swiper-css", "1");
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-ovulus-swiper-js]')) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
      s.async = true;
      s.setAttribute("data-ovulus-swiper-js", "1");
      s.onload = done;
      document.head.appendChild(s);
      return;
    }
    var n = 0;
    (function poll() {
      n++;
      if (typeof window.Swiper !== "undefined") return done();
      if (n < 50) setTimeout(poll, 100);
    })();
  }

  function mount(o) {
    var root = document.getElementById(o.id);
    if (!root) return;
    var host = resolveHost(root);
    if (!host) return;

    destroyHost(host);
    if (root !== host) destroyHost(root);

    if (o.mobileOnly && !mq.matches) {
      root.classList.remove("is-swiper-active");
      return;
    }

    root.classList.add("is-swiper-active");
    try {
      new Swiper(host, conf(o));
    } catch (e) {
      root.classList.remove("is-swiper-active");
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[OVULUS] Swiper mount failed:", o.id, e);
      }
    }
  }

  function all() {
    Object.keys(IDS).forEach(function (k) {
      mount(IDS[k]);
    });
  }

  function start() {
    ensureSwiperAssets(function () {
      all();
      if (mq.addEventListener) mq.addEventListener("change", all);
      else mq.addListener(all);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
