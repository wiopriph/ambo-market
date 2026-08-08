<div align="center">

# Ambo Market

**Marketplace de classificados grátis em Angola** — cars, real estate, electronics, jobs and services.
Peer-to-peer buying and selling, commission-free.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.4-00DC82?logo=nuxt&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Node](https://img.shields.io/badge/Node-24-339933?logo=node.js&logoColor=white)](https://nodejs.org)

</div>

---

## About

**Ambo Market** is a classifieds web platform for Angola. Users post listings, search and
filter items, save favorites, and contact sellers directly (phone / WhatsApp). The project
is evolving toward a full marketplace (shops, payments, logistics).

The app is server-side rendered (SSR) with Nuxt 4; data and authentication are powered by
Supabase. The UI is entirely in Portuguese (Angola).

### Key features

- 🔍 **Smart search** — full-text search with Portuguese stemming and accent-insensitivity (`movel` matches `móvel`)
- 🧭 **Filters** — by category, city, price and attributes (year, fuel, area, etc.)
- ❤️ **Favorites** — save listings to your account
- 📱 **Seller contact** — phone call and WhatsApp with a pre-filled message
- 👤 **Profiles** — public seller storefront + private dashboard (`/my/*`)
- 📊 **Analytics** — events via Google Tag Manager
- 🗺️ **SEO** — SSR, sitemap, JSON-LD, city-specific copy, `lang="pt"`
- 💬 **Feedback** — a widget available from the footer, empty states and the error page
- 📝 **Blog** — articles powered by `@nuxt/content`

## Tech stack

| Layer | Stack |
|-------|-------|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3.5, SSR, Nitro) |
| UI | [@nuxt/ui 4](https://ui.nuxt.com) + Tailwind CSS v4 |
| Backend / DB | [Supabase](https://supabase.com) (Postgres, Auth, Storage) |
| Forms | vee-validate + yup |
| Content | [@nuxt/content](https://content.nuxt.com) (blog) |
| Images | sharp (server-side preview resizing) |
| Deployment | Docker (Nitro node-server) |

## Requirements

- **Node.js 25** (see [`.nvmrc`](.nvmrc)) — important: native dependencies (`better-sqlite3`, `sharp`) are compiled against a specific major Node version
- **npm** (the project uses `package-lock.json`)
- A **[Supabase](https://supabase.com) project** with the app schema and authentication configured

## Getting started

```bash
# 1. Clone the repository
git clone <repo-url> ambo && cd ambo

# 2. Switch to the required Node version (if you use nvm)
nvm install   # picks the version from .nvmrc (25.0.0)
nvm use

# 3. Install dependencies
npm install

# 4. Create .env from the example and fill in the values
cp .env.example .env
#   → open .env and add your Supabase keys (see "Environment variables")

# 5. Start the dev server
npm run dev
```

The app will be available at **http://localhost:3000**.

## Environment variables

All variables live in [`.env.example`](.env.example). Copy it to `.env` and fill in the values.

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NUXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NUXT_PUBLIC_SUPABASE_KEY` | ✅ | Public `anon` key |
| `NUXT_SUPABASE_SERVICE_KEY` | ✅ | Secret `service_role` key (server only) |
| `NUXT_PUBLIC_APP_BASE_URL` | ✅ | Public base URL (SEO meta, sitemap, share links) |
| `NUXT_PUBLIC_GTM_ID` | — | Google Tag Manager container ID |
| `NUXT_PUBLIC_GTM_ENABLED` | — | `true` enables loading GTM |
| `NUXT_GOOGLE_ADSENSE_ID` | — | Google AdSense ID |

> Supabase keys: **Dashboard → Project Settings → API**.
> The `service_role` key is secret — never commit it; use it on the server only.

## Project structure

```
├── assets/            styles and build-time assets
├── components/        Vue components (App, Product, Filter, Seo, UI)
├── composables/       reusable logic (usePosts, useFavorites, useFeedback…)
├── constants/         reference data (categories, cities, attributes, analytics events)
├── content/           blog articles (@nuxt/content)
├── layouts/           layouts (default)
├── middleware/        route middleware (auth, filters, validation)
├── pages/             pages and routing
│   ├── [cityId]/…     listings: city → category → subcategory → brand
│   ├── my/            user dashboard (listings, favorites, settings)
│   ├── product/       product page and listing creation
│   └── user/          public seller profile
├── plugins/           Nuxt plugins (location, gtm)
├── public/            static assets served as-is (favicon, logo, robots)
├── server/
│   ├── api/           REST endpoints (posts, favorites, feedback, users…)
│   ├── plugins/       Nitro plugins (defer-css)
│   └── utils/         server utilities (images, rateLimit)
├── types/             TypeScript types
├── utils/             client utilities (formatting, routes)
├── Dockerfile         production image
├── docker-compose.yml local containerized run
└── nuxt.config.ts     Nuxt configuration
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR on `:3000` |
| `npm run build` | Production build (`.output/`) |
| `npm run preview` | Run the built app locally |
| `npm run generate` | Static generation |
| `npm run lint` | Run ESLint |
| `npm run lintfix` | Auto-fix with ESLint |

## Deployment

The project builds into a Docker image based on the Nitro node-server.

### Docker Compose (simplest)

```bash
# .env must sit alongside — compose passes it into the container
docker compose up --build
```

### Docker (manual)

```bash
docker build -t ambo-market .
docker run -p 3000:3000 --env-file .env ambo-market
```

### Production notes

- Static assets (`/icon-logo.svg`, `/favicon.ico`) are served with `Cache-Control: immutable`
  via `routeRules` in [`nuxt.config.ts`](nuxt.config.ts).
- CSS is made non-render-blocking through the Nitro plugin `server/plugins/defer-css.ts`.
- GTM is loaded lazily — on the first user interaction.
- If a reverse proxy / CDN sits in front of Nitro, make sure it doesn't override the
  cache-control headers.

## Development

- Code is linted with [`@wiopriph/nuxt4-eslint-config`](https://github.com/wiopriph/nuxt4-eslint-config); run `npm run lint` (or `npm run lintfix`) before pushing.
- UI strings are in Portuguese (Angola): "Registe-se", not "Cadastre-se"; "A nossa plataforma",
  not "Nosso site".

---

<div align="center">
<sub>Ambo Market · classificados grátis em Angola</sub>
</div>
