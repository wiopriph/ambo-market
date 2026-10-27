import svgLoader from 'vite-svg-loader';


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  nitro: {
    preset: 'cloudflare_module',
    // сборка воркера с sourcemap не влезает в 2ГБ кучи на билдере Cloudflare
    sourceMap: false,
  },

  // статьи блога живут в D1 (binding DB в wrangler.jsonc): при первом
  // запросе после деплоя @nuxt/content сам заливает в неё SQL-дамп сборки
  content: {
    database: { type: 'd1', bindingName: 'DB' },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-AO',
      },
    },
  },

  alias: {
    cookie: 'cookie-es',
  },

  runtimeConfig: {
    supabase: {
      serviceKey: '',
    },

    telegram: {
      botToken: '',
      chatId: '',
      // секрет вебхука кнопок (X-Telegram-Bot-Api-Secret-Token из setWebhook)
      webhookSecret: '',
    },

    // публикация объявлений на страницу Facebook (опционально)
    facebook: {
      pageId: '',
      pageToken: '',
    },

    public: {
      gtmId: '',
      gtmEnabled: false,

      appBaseUrl: '',

      supabase: {
        url: '',
        key: '',
      },
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxtjs/supabase',
  ],

  site: {
    url: 'https://ambo.market',
    name: 'Ambo Market',
  },

  // иконки в серверный бандл: без этого прод ходит за каждой иконкой
  // в Iconify API по сети (warning "failed to load icon" в логах сборки)
  icon: {
    serverBundle: {
      collections: ['lucide', 'simple-icons'],
    },
  },

  sitemap: {
    xsl: false,
    excludeAppSources: true,
    cacheMaxAgeSeconds: 3600,
    sitemaps: {
      categories: { sources: ['/api/sitemap'] },
      posts: { sources: ['/api/sitemap-posts'] },
      blog: { sources: ['/api/sitemap-blog'] },
      static: { sources: ['/api/sitemap-static'] },
    },
  },

  css: [
    '~/assets/css/nuxt-ui.css',
  ],

  vite: {
    resolve: {
      alias: {
        cookie: 'cookie-es',
      },
    },

    plugins: [
      svgLoader({
        svgo: false,
      }),
    ],


    optimizeDeps: {
      exclude: ['@sqlite.org/sqlite-wasm'],
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'cookie-es',
      ],
    },

    ssr: {
      noExternal: ['@sqlite.org/sqlite-wasm'],
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('supabase-js') || id.includes('gotrue-js') || id.includes('realtime-js') || id.includes('storage-js') || id.includes('postgrest-js') || id.includes('functions-js')) {
              return 'supabase';
            }
          },
        },
      },
    },
  },

  routeRules: {
    '/auth': { ssr: false },
    '/auth/register': { ssr: false },
    '/auth/forgot-password': { ssr: false },
    '/product/create': { ssr: false },
    '/icon-logo.svg': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  plugins: [
    '~/plugins/location.server.ts',
  ],

  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },

  hooks: {
    // SQLite для @nuxt/content нужен только клиентским запросам в блоге,
    // но Vite прогревает его на каждой странице: modulepreload js-чанка (59KB gz)
    // + prefetch wasm-бинаря (383KB gz). Вырезаем из прогрева — при реальном
    // использовании динамический импорт подгрузит их сам.
    'build:manifest'(manifest) {
      for (const chunk of Object.values(manifest)) {
        if (chunk.file?.includes('sqlite')) {
          chunk.prefetch = false;
          chunk.preload = false;
        }

        if (chunk.assets?.length) {
          chunk.assets = chunk.assets.filter(asset => !asset.endsWith('.wasm'));
        }
      }
    },
  },

  supabase: {
    redirect: false,
  },

  ui: {
    colorMode: false,
    theme: {
      // secondary нигде не используется: без него меньше CSS-переменных
      // в инлайн-стиле и utility-классов в бандле
      colors: ['primary', 'success', 'info', 'warning', 'error'],
    },
    experimental: {
      // темы только для реально используемых компонентов (plus зависимости)
      componentDetection: true,
    },
  },
});
