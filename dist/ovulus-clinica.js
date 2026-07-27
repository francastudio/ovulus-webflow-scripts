/**
 * OVULUS — clínica page interactions (Webflow)
 * team expand + swipers init 
 * Fonte: github.com/francastudio/ovulus-webflow-scripts
 * CDN:   https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1.3.1/dist/ovulus-clinica.js
 */

/* --- teamexpand --- */
document.addEventListener("DOMContentLoaded",function(){var g=document.querySelector(".team_grid");if(!g)return;var b=document.createElement("button");b.type="button";b.className="team_expand-btn";b.textContent="Ver mais da equipe";function sync(){var mobile=window.innerWidth<600;b.style.display=mobile?"flex":"none";if(!mobile){g.classList.remove("is-expanded");b.textContent="Ver mais da equipe"}}sync();g.parentNode.insertBefore(b,g.nextSibling);b.addEventListener("click",function(){g.classList.toggle("is-expanded");b.textContent=g.classList.contains("is-expanded")?"Ver menos da equipe":"Ver mais da equipe"});window.addEventListener("resize",sync)});

/* --- ovulusswipers --- */
(function(){var IDS={testimonials:{id:"testimonials-swiper",mobileOnly:false,autoplay:true},blog:{id:"blog-swiper",mobileOnly:true},media:{id:"media-swiper",mobileOnly:true}};var mq=window.matchMedia("(max-width:767px)");function conf(o){var c={slidesPerView:"auto",spaceBetween:20,grabCursor:true,simulateTouch:true,allowTouchMove:true,watchOverflow:true,speed:450,resistanceRatio:.65,pagination:{el:"#"+o.id+" .swiper-pagination",clickable:true},breakpoints:{0:{spaceBetween:14},768:{spaceBetween:18},1024:{spaceBetween:22}}};if(o.autoplay)c.autoplay={delay:5000,disableOnInteraction:false,pauseOnMouseEnter:true};return c}function mount(o){var el=document.getElementById(o.id);if(!el)return;if(el.swiper){el.swiper.destroy(true,true)}if(o.mobileOnly&&!mq.matches)return;try{new Swiper("#"+o.id,conf(o))}catch(e){}}function all(){Object.keys(IDS).forEach(function(k){mount(IDS[k])})}function wait(){var n=0;(function loop(){n++;if(typeof Swiper==="undefined"){if(n<40)return setTimeout(loop,120);return}all();if(mq.addEventListener)mq.addEventListener("change",all);else mq.addListener(all)})()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",wait);else wait()})();
