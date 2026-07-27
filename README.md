# OVULUS — Webflow scripts

Scripts custom do site [OVULUS](https://ovulus-staging.webflow.io/) (Webflow), versionados no GitHub e servidos via jsDelivr.

## Por quê

Antes havia **6 requests** sitewide no footer do Webflow (`NavbarScroll`, `NavbarHeight`, `MobileNav`, `ScrollReveal`, `TextMotionCSS`, `TextMotion`). Isso vira **1 arquivo**. Scripts de página (treatments / team / swipers) também saíram do CDN órfão `%2F689e5ba6…` e viraram **1 request por página**.

| Escopo | Antes | Depois |
|--------|-------|--------|
| Sitewide | 6 `<script src=…>` | 1× `ovulus-site.js` |
| Home | 4 scripts Webflow CDN | 1× `ovulus-home.js` |
| Clínica | 3 scripts Webflow CDN | 1× `ovulus-clinica.js` |
| Blog / artigo | — | sem page scripts |

## Uso no Webflow

**Site settings → Custom code → Footer** (sitewide):

```html
<script src="https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1.2.1/dist/ovulus-site.js" defer></script>
```

**Home → Page settings → Custom code → Footer:**

```html
<script src="https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1.2.1/dist/ovulus-home.js" defer></script>
```

**Nossa clínica → Page settings → Custom code → Footer:**

```html
<script src="https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1.2.1/dist/ovulus-clinica.js" defer></script>
```

Linha `v1` (último patch sem pin):

```html
<script src="https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1/dist/ovulus-site.js" defer></script>
```

## O que cada arquivo faz

### `ovulus-site.js` (sitewide)
1. **`--navbar-height`** — sync da altura da `#site-navbar`
2. **Hide-on-scroll** — some ao rolar para baixo; volta ao subir (requisito da cliente)
3. **Mobile nav** — drawer `#mobile-nav` + backdrop + Escape
4. **Card reveal** — IntersectionObserver em cards/FAQ
5. **Text motion** — hero stagger + títulos de seção (respeita `prefers-reduced-motion`)

### `ovulus-home.js`
- Treatments tabs + deep links `#tratamento-*` + pause iframes
- Team expand (mobile) + team details toggle
- Swiper init (testimonials / blog / mídia) — espera `window.Swiper`

### `ovulus-clinica.js`
- Team expand + team details + Swiper init (sem treatments) — autoplay + pagination

## Desenvolvimento

Editar `dist/*.js`, commit, tag e push:

```bash
git tag v1.1.1
git push origin main --tags
```

jsDelivr pode levar ~1–2 min para atualizar; force com `?v=timestamp` se precisar.

## Não remover

- Comportamento hide-on-scroll da navbar (pedido da cliente)
- IDs: `#site-navbar`, `#mobile-nav`, `#menu-toggle`
