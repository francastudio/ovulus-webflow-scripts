# OVULUS — Webflow scripts

Scripts custom do site [OVULUS](https://ovulus-staging.webflow.io/) (Webflow), versionados no GitHub e servidos via jsDelivr.

## Por quê

Antes havia **6 requests** sitewide no footer do Webflow (`NavbarScroll`, `NavbarHeight`, `MobileNav`, `ScrollReveal`, `TextMotionCSS`, `TextMotion`). Isso vira **1 arquivo**.

| Antes | Depois |
|-------|--------|
| 6 `<script src=…>` | 1 `<script src=…>` |
| CDN Webflow (cópias manuais) | GitHub + jsDelivr |

## Uso no Webflow

**Site settings → Custom code → Footer** (sitewide):

```html
<script src="https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1.0.0/dist/ovulus-site.js" defer></script>
```

Para pegar sempre o último patch da linha `v1` (sem pin de patch):

```html
<script src="https://cdn.jsdelivr.net/gh/francastudio/ovulus-webflow-scripts@v1/dist/ovulus-site.js" defer></script>
```

Scripts de página (home / clínica) continuam separados: treatments, team, swipers.

## O que o bundle faz

1. **`--navbar-height`** — sync da altura da `#site-navbar`
2. **Hide-on-scroll** — some ao rolar para baixo; volta ao subir (requisito da cliente)
3. **Mobile nav** — drawer `#mobile-nav` + backdrop + Escape
4. **Card reveal** — IntersectionObserver em cards/FAQ
5. **Text motion** — hero stagger + títulos de seção (respeita `prefers-reduced-motion`)

## Desenvolvimento

Editar `dist/ovulus-site.js`, commit, tag e push:

```bash
git tag v1.0.1
git push origin main --tags
```

jsDelivr pode levar ~1–2 min para atualizar; force com `?v=timestamp` se precisar.

## Não remover

- Comportamento hide-on-scroll da navbar (pedido da cliente)
- IDs: `#site-navbar`, `#mobile-nav`, `#menu-toggle`
